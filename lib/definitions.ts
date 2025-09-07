// type defs for civic complaint system
export type ReportStatus = 'New' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Rejected';
export type ReportCategory = 'Pothole' | 'Streetlight Out' | 'Waste Management' | 'Water Logging' | 'Broken Signage' | 'Electrical Hazard';
export type Department = 'Public Works' | 'Electrical' | 'Sanitation' | 'Traffic' | 'Water Board';

export interface Location {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  location: Location;
  address: string; // e.g., "Near Gate No. 2, Sector 62, Noida"
  imageUrl: string; // placeholder imgs for now
  status: ReportStatus;
  createdAt: string; // iso 8601 fmt
  resolvedAt?: string; // for analytics
  upvotes: number; // num of other users reporting same issue
  priority: number; // calc field (1-5)
  assignedTo?: Department; // dept id
}

// grouped report interface for clustering logic
export interface GroupedReport extends Report {
  groupedReports?: Report[]; // additional reports in same cluster
  totalUpvotes: number; // sum of all upvotes in group
}

// kpi metrics interface
export interface DashboardMetrics {
  totalOpenIssues: number;
  newReportsToday: number;
  resolvedThisWeek: number;
  highPriorityAlerts: number;
}

// analytics data types
export interface CategoryStats {
  category: ReportCategory;
  count: number;
  resolved: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface DepartmentWorkload {
  department: Department;
  openIssues: number;
  avgResolutionTime: number; // in days
}
