// utils for report processing and clustering
import { Report, GroupedReport, Location, DashboardMetrics } from './definitions';

// calc distance between two points in meters using haversine formula
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371000; // earth radius in meters
  const lat1Rad = (point1.lat * Math.PI) / 180;
  const lat2Rad = (point2.lat * Math.PI) / 180;
  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

// group reports that are close to each other and same category
export function groupReports(reports: Report[], maxDistance: number = 25): GroupedReport[] {
  const processed = new Set<string>();
  const groupedReports: GroupedReport[] = [];

  for (const report of reports) {
    if (processed.has(report.id)) continue;
    
    // find all reports within distance and same category
    const group: Report[] = [report];
    const relatedReports: Report[] = [];
    
    for (const otherReport of reports) {
      if (
        otherReport.id !== report.id &&
        !processed.has(otherReport.id) &&
        otherReport.category === report.category &&
        otherReport.status !== 'Resolved' &&
        otherReport.status !== 'Rejected' &&
        calculateDistance(report.location, otherReport.location) <= maxDistance
      ) {
        relatedReports.push(otherReport);
        processed.add(otherReport.id);
      }
    }

    processed.add(report.id);

    // create grouped report
    const totalUpvotes = report.upvotes + relatedReports.reduce((sum, r) => sum + r.upvotes, 0);
    const maxPriority = Math.max(report.priority, ...relatedReports.map(r => r.priority));
    
    const groupedReport: GroupedReport = {
      ...report,
      priority: maxPriority,
      groupedReports: relatedReports.length > 0 ? relatedReports : undefined,
      totalUpvotes,
    };

    groupedReports.push(groupedReport);
  }

  return groupedReports;
}

// calc dashboard metrics from reports
export function calculateMetrics(reports: Report[]): DashboardMetrics {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalOpenIssues = reports.filter(r => 
    r.status !== 'Resolved' && r.status !== 'Rejected'
  ).length;

  const newReportsToday = reports.filter(r => {
    const reportDate = new Date(r.createdAt);
    return reportDate >= today;
  }).length;

  const resolvedThisWeek = reports.filter(r => {
    if (!r.resolvedAt) return false;
    const resolvedDate = new Date(r.resolvedAt);
    return resolvedDate >= weekAgo;
  }).length;

  const highPriorityAlerts = reports.filter(r => 
    r.priority >= 4 && r.status !== 'Resolved' && r.status !== 'Rejected'
  ).length;

  return {
    totalOpenIssues,
    newReportsToday,
    resolvedThisWeek,
    highPriorityAlerts,
  };
}

// find hotspots for specific categories
export function findHotspots(reports: Report[], category?: string): Location[] {
  const filteredReports = category 
    ? reports.filter(r => r.category === category && r.status !== 'Resolved')
    : reports.filter(r => r.status !== 'Resolved');

  const grouped = groupReports(filteredReports, 50); // larger radius for hotspots
  
  return grouped
    .filter(g => (g.groupedReports?.length || 0) >= 2) // at least 3 reports total
    .map(g => g.location)
    .sort((a, b) => {
      // sort by density - more reports = higher priority
      const aGroup = grouped.find(g => g.location.lat === a.lat && g.location.lng === a.lng);
      const bGroup = grouped.find(g => g.location.lat === b.lat && g.location.lng === b.lng);
      return (bGroup?.totalUpvotes || 0) - (aGroup?.totalUpvotes || 0);
    });
}

// filter reports based on criteria
export interface FilterCriteria {
  category?: string;
  status?: string;
  priority?: number;
  search?: string;
}

export function filterReports(reports: Report[], criteria: FilterCriteria): Report[] {
  return reports.filter(report => {
    if (criteria.category && report.category !== criteria.category) return false;
    if (criteria.status && report.status !== criteria.status) return false;
    if (criteria.priority && report.priority < criteria.priority) return false;
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      return (
        report.id.toLowerCase().includes(searchLower) ||
        report.title.toLowerCase().includes(searchLower) ||
        report.address.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
}
