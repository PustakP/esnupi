'use client';

import { Header } from '@/components/header';
import { KpiCards } from '@/components/kpi-cards';
import { AnalyticsCharts } from '@/components/analytics-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyReports, categoryStats, trendData, departmentWorkload } from '@/lib/dummy-data';
import { calculateMetrics } from '@/lib/report-utils';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = calculateMetrics(dummyReports);

  // calc additional insights
  const totalReports = dummyReports.length;
  const resolvedReports = dummyReports.filter(r => r.status === 'Resolved').length;
  const resolutionRate = ((resolvedReports / totalReports) * 100).toFixed(1);
  
  const avgResolutionTime = departmentWorkload.reduce((sum, dept) => 
    sum + dept.avgResolutionTime, 0) / departmentWorkload.length;

  const topCategory = categoryStats.reduce((prev, current) => 
    prev.count > current.count ? prev : current);

  const criticalIssues = dummyReports.filter(r => 
    r.priority === 5 && r.status !== 'Resolved').length;

  return (
    <>
      <Header 
        title="Analytics" 
        subtitle="Data insights and performance metrics"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* overview kpis */}
          <KpiCards metrics={metrics} />

          {/* key insights cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolutionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {resolvedReports} of {totalReports} total reports
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} days</div>
                <p className="text-xs text-muted-foreground">
                  Across all departments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Issue Category</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{topCategory.category}</div>
                <p className="text-xs text-muted-foreground">
                  {topCategory.count} open issues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
                <p className="text-xs text-muted-foreground">
                  Priority 5 unresolved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* charts */}
          <AnalyticsCharts 
            categoryStats={categoryStats}
            trendData={trendData}
            departmentWorkload={departmentWorkload}
          />

          {/* detailed insights */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* department performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentWorkload
                    .sort((a, b) => a.avgResolutionTime - b.avgResolutionTime)
                    .map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{dept.department}</p>
                          <p className="text-sm text-gray-600">{dept.openIssues} open issues</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{dept.avgResolutionTime} days</p>
                          <Badge 
                            variant={dept.avgResolutionTime <= 3 ? "default" : dept.avgResolutionTime <= 5 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {dept.avgResolutionTime <= 3 ? "Fast" : dept.avgResolutionTime <= 5 ? "Average" : "Slow"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* category breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats
                    .sort((a, b) => b.count - a.count)
                    .map((category) => {
                      const resolutionRate = category.count > 0 
                        ? ((category.resolved / (category.count + category.resolved)) * 100).toFixed(0)
                        : '0';
                      
                      return (
                        <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{category.category}</p>
                            <p className="text-sm text-gray-600">
                              {category.count} open • {category.resolved} resolved
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{resolutionRate}%</p>
                            <p className="text-xs text-gray-500">resolved</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Focus Area</h4>
                  <p className="text-sm text-blue-800">
                    Prioritize {topCategory.category} issues - highest volume category with {topCategory.count} open reports.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">⚡ Efficiency</h4>
                  <p className="text-sm text-orange-800">
                    {departmentWorkload.find(d => d.avgResolutionTime > 5)?.department || 'Water Board'} department 
                    needs process optimization - slowest resolution times.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">🚨 Urgent</h4>
                  <p className="text-sm text-red-800">
                    {criticalIssues} critical priority issues require immediate attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
