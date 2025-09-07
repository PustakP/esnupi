import { Header } from '@/components/header';
import { KpiCards } from '@/components/kpi-cards';
import { IssuesMap } from '@/components/issues-map';
import { dummyReports } from '@/lib/dummy-data';
import { calculateMetrics } from '@/lib/report-utils';

export default function Dashboard() {
  // calc kpi metrics from dummy data
  const metrics = calculateMetrics(dummyReports);

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
            <IssuesMap reports={dummyReports} />
            
            {/* recent activity sidebar */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {dummyReports
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
