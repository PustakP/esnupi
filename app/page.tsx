import { Header } from '@/components/header';
import { KpiCards } from '@/components/kpi-cards';
import { IssuesMap } from '@/components/issues-map';
import { calculateMetrics } from '@/lib/report-utils';
import { getSupabaseClient } from '@/lib/supabase';
import { Report } from '@/lib/definitions';

export default async function Dashboard() {
  // fetch reports from db (srv)
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  const reports: Report[] = (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    location: { lat: r.lat, lng: r.lng },
    address: r.address,
    imageUrl: r.image_url,
    status: r.status,
    createdAt: r.created_at,
    resolvedAt: r.resolved_at ?? undefined,
    upvotes: r.upvotes,
    priority: r.priority,
    assignedTo: r.assigned_to ?? undefined,
  }));

  // calc kpi metrics from live data
  const metrics = calculateMetrics(reports);

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Overview of civic complaints across Noida"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* kpi cards */}
          <KpiCards metrics={metrics} />

          {/* map and recent activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <IssuesMap reports={reports} />
            
            {/* recent activity sidebar */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {reports
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((report) => (
                    <div key={report.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {report.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.address}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(report.createdAt).toLocaleDateString()} • {report.category}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
