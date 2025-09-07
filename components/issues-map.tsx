'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Report } from '@/lib/definitions';
import { MapPin, Zap, Construction, Trash2, Droplets, SignpostBig } from 'lucide-react';

interface IssuesMapProps {
  reports: Report[];
}

// category icon mapping
const categoryIcons = {
  'Pothole': Construction,
  'Streetlight Out': Zap,
  'Waste Management': Trash2,
  'Water Logging': Droplets,
  'Broken Signage': SignpostBig,
  'Electrical Hazard': Zap,
};

// category colors for markers
const categoryColors = {
  'Pothole': 'bg-amber-500',
  'Streetlight Out': 'bg-yellow-500',
  'Waste Management': 'bg-green-500',
  'Water Logging': 'bg-blue-500',
  'Broken Signage': 'bg-orange-500',
  'Electrical Hazard': 'bg-red-500',
};

export function IssuesMap({ reports }: IssuesMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // filter to only unresolved issues
  const activeReports = reports.filter(r => 
    r.status !== 'Resolved' && r.status !== 'Rejected'
  );

  // simple clustering - group nearby reports
  const clusters = new Map<string, Report[]>();
  
  activeReports.forEach(report => {
    // simple grid-based clustering
    const gridLat = Math.floor(report.location.lat * 1000) / 1000;
    const gridLng = Math.floor(report.location.lng * 1000) / 1000;
    const key = `${gridLat},${gridLng}`;
    
    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key)!.push(report);
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Issues Map - Noida Region
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
          {/* placeholder map bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100">
            {/* map grid lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-gray-300" style={{ top: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="absolute h-full w-px bg-gray-300" style={{ left: `${i * 10}%` }} />
              ))}
            </div>
          </div>

          {/* noida label */}
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-sm text-sm font-medium">
            📍 Noida, UP
          </div>

          {/* issue markers */}
          {Array.from(clusters.entries()).map(([key, clusterReports]) => {
            const [lat, lng] = key.split(',').map(Number);
            // convert lat/lng to screen coordinates (simplified)
            const x = ((lng - 77.2) / 0.4) * 100; // rough conversion for noida area
            const y = 100 - ((lat - 28.4) / 0.3) * 100;
            
            if (x < 0 || x > 100 || y < 0 || y > 100) return null;

            const primaryReport = clusterReports[0];
            const clusterSize = clusterReports.length;
            const IconComponent = categoryIcons[primaryReport.category];

            return (
              <div
                key={key}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedReport(primaryReport)}
              >
                {clusterSize > 1 ? (
                  // cluster marker
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
                      {clusterSize}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500"></div>
                  </div>
                ) : (
                  // single issue marker
                  <div className="relative">
                    <div className={`w-6 h-6 ${categoryColors[primaryReport.category]} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-current ${categoryColors[primaryReport.category]}`}></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* selected report popup */}
          {selectedReport && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedReport.category}</Badge>
                  <Badge 
                    variant={selectedReport.status === 'New' ? 'destructive' : 'secondary'}
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <h4 className="font-medium mb-1">{selectedReport.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedReport.address}</p>
              <p className="text-sm text-gray-500">{selectedReport.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1">
                  👍 {selectedReport.upvotes} upvotes
                </span>
                <span className="flex items-center gap-1">
                  🚨 Priority {selectedReport.priority}
                </span>
              </div>
            </div>
          )}

          {/* legend */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-sm">
            <h5 className="text-sm font-medium mb-2">Issue Types</h5>
            <div className="space-y-1">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* map stats */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {activeReports.length} active issues</span>
          <span>{clusters.size} locations</span>
        </div>
      </CardContent>
    </Card>
  );
}
