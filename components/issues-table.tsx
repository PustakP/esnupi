'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GroupedReport } from '@/lib/definitions';
import { ExternalLink, Users, TrendingUp } from 'lucide-react';
// date formatting utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

interface IssuesTableProps {
  reports: GroupedReport[];
}

// status color mapping
const statusColors = {
  'New': 'destructive',
  'Acknowledged': 'secondary', 
  'In Progress': 'default',
  'Resolved': 'default',
  'Rejected': 'secondary',
} as const;

// priority color mapping
const priorityColors = {
  1: 'text-gray-500',
  2: 'text-blue-500',
  3: 'text-yellow-500',
  4: 'text-orange-500',
  5: 'text-red-500',
};

export function IssuesTable({ reports }: IssuesTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <p className="text-gray-500">No issues found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* desktop table view */}
      <div className="hidden md:block bg-white border rounded-lg">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Upvotes</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-mono text-sm">
                {report.id}
              </TableCell>
              
              <TableCell>
                <div>
                  <p className="font-medium">{report.title}</p>
                  {report.groupedReports && report.groupedReports.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        +{report.groupedReports.length} similar reports
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {report.category}
                </Badge>
              </TableCell>
              
              <TableCell>
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {report.address}
                </p>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant={statusColors[report.status]}
                  className="text-xs"
                >
                  {report.status}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${priorityColors[report.priority as keyof typeof priorityColors]}`} />
                  <span className={`font-medium ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                    {report.priority}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="font-medium">
                  {report.totalUpvotes}
                </span>
                {report.groupedReports && report.groupedReports.length > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    (grouped)
                  </span>
                )}
              </TableCell>
              
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatDate(report.createdAt)}
                </span>
              </TableCell>
              
              <TableCell>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
        {/* table footer with summary */}
        <div className="border-t px-4 py-3 text-sm text-gray-600">
          Showing {reports.length} issues
          {reports.some(r => r.groupedReports) && (
            <span className="ml-2">
              • Grouped similar reports within 25m
            </span>
          )}
        </div>
      </div>

      {/* mobile card view */}
      <div className="md:hidden space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-500">{report.id}</span>
                  <Badge 
                    variant={statusColors[report.status]}
                    className="text-xs"
                  >
                    {report.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900">{report.title}</h3>
                {report.groupedReports && report.groupedReports.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      +{report.groupedReports.length} similar reports
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <TrendingUp className={`h-4 w-4 ${priorityColors[report.priority as keyof typeof priorityColors]}`} />
                <span className={`font-medium text-sm ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                  {report.priority}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Badge variant="outline" className="text-xs">
                  {report.category}
                </Badge>
                <span className="font-medium">
                  👍 {report.totalUpvotes}
                  {report.groupedReports && report.groupedReports.length > 0 && (
                    <span className="text-gray-500 ml-1">(grouped)</span>
                  )}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">{report.address}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(report.createdAt)}</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* mobile footer */}
        <div className="text-center text-sm text-gray-600 py-4">
          Showing {reports.length} issues
          {reports.some(r => r.groupedReports) && (
            <div className="mt-1">
              Grouped similar reports within 25m
            </div>
          )}
        </div>
      </div>
    </>
  );
}
