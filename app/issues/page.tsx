'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { IssuesFilter } from '@/components/issues-filter';
import { IssuesTable } from '@/components/issues-table';
import { IssuesMap } from '@/components/issues-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dummyReports } from '@/lib/dummy-data';
import { filterReports, groupReports, findHotspots, FilterCriteria } from '@/lib/report-utils';
import { MapPin, List, Target } from 'lucide-react';

export default function IssuesPage() {
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [showHotspots, setShowHotspots] = useState(false);

  // apply filters and grouping
  const filteredReports = useMemo(() => {
    const filtered = filterReports(dummyReports, filters);
    return groupReports(filtered);
  }, [filters]);

  // calc hotspots for current filters
  const hotspots = useMemo(() => {
    if (!showHotspots) return [];
    const filtered = filterReports(dummyReports, filters);
    return findHotspots(filtered, filters.category);
  }, [filters, showHotspots]);

  const handleShowHotspots = () => {
    setShowHotspots(true);
    setViewMode('map');
  };

  return (
    <>
      <Header 
        title="All Issues" 
        subtitle={`Managing ${filteredReports.length} civic complaints`}
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* filters */}
          <IssuesFilter 
            onFilterChange={setFilters}
            onShowHotspots={handleShowHotspots}
            activeFilters={filters}
          />

          {/* view toggle and hotspot info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Map View
              </Button>
            </div>

            {showHotspots && hotspots.length > 0 && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''} found
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowHotspots(false)}
                      className="text-orange-600 hover:text-orange-800 p-1 h-auto"
                    >
                      ✕
                    </Button>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    Best locations to deploy teams for maximum impact
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* main content */}
          {viewMode === 'table' ? (
            <IssuesTable reports={filteredReports} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <IssuesMap reports={dummyReports} />
              </div>
              
              {/* hotspots sidebar */}
              <div className="space-y-4">
                {showHotspots && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        Priority Hotspots
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {hotspots.length > 0 ? (
                        <div className="space-y-3">
                          {hotspots.slice(0, 5).map((hotspot, index) => (
                            <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-medium">
                                  Hotspot {index + 1}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Lat: {hotspot.lat.toFixed(4)}, Lng: {hotspot.lng.toFixed(4)}
                              </p>
                              <p className="text-xs text-orange-700 mt-1">
                                High concentration of {filters.category || 'issues'} in this area
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No hotspots found for current filters
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* quick stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Issues</span>
                        <span className="font-medium">{filteredReports.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Grouped Reports</span>
                        <span className="font-medium">
                          {filteredReports.filter(r => r.groupedReports?.length).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">High Priority</span>
                        <span className="font-medium text-red-600">
                          {filteredReports.filter(r => r.priority >= 4).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Upvotes</span>
                        <span className="font-medium">
                          {filteredReports.reduce((sum, r) => sum + r.totalUpvotes, 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
