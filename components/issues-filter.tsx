'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { ReportCategory, ReportStatus } from '@/lib/definitions';
import { FilterCriteria } from '@/lib/report-utils';

interface IssuesFilterProps {
  onFilterChange: (criteria: FilterCriteria) => void;
  onShowHotspots: () => void;
  activeFilters: FilterCriteria;
}

const categories: ReportCategory[] = [
  'Pothole',
  'Streetlight Out', 
  'Waste Management',
  'Water Logging',
  'Broken Signage',
  'Electrical Hazard',
];

const statuses: ReportStatus[] = [
  'New',
  'Acknowledged',
  'In Progress', 
  'Resolved',
  'Rejected',
];

export function IssuesFilter({ onFilterChange, onShowHotspots, activeFilters }: IssuesFilterProps) {
  const [searchTerm, setSearchTerm] = useState(activeFilters.search || '');

  const handleFilterChange = (key: keyof FilterCriteria, value: string | number | undefined) => {
    const newFilters = { ...activeFilters };
    if (value === undefined || value === '' || value === 'all') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Filter Issues</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount} active</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowHotspots}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Show Hotspots
          </Button>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* search bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by ID, title, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </form>

        {/* category filter */}
        <Select
          value={activeFilters.category || 'all'}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* status filter */}
        <Select
          value={activeFilters.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* priority filter */}
        <Select
          value={activeFilters.priority?.toString() || 'all'}
          onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="5">Priority 5 (Critical)</SelectItem>
            <SelectItem value="4">Priority 4+ (High)</SelectItem>
            <SelectItem value="3">Priority 3+ (Medium)</SelectItem>
            <SelectItem value="2">Priority 2+ (Low)</SelectItem>
            <SelectItem value="1">Priority 1+ (All)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {activeFilters.category && (
            <Badge variant="outline" className="flex items-center gap-1">
              Category: {activeFilters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('category', undefined)}
              />
            </Badge>
          )}
          {activeFilters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {activeFilters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('status', undefined)}
              />
            </Badge>
          )}
          {activeFilters.priority && (
            <Badge variant="outline" className="flex items-center gap-1">
              Priority: {activeFilters.priority}+
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('priority', undefined)}
              />
            </Badge>
          )}
          {activeFilters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: &quot;{activeFilters.search}&quot;
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearchTerm('');
                  handleFilterChange('search', undefined);
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
