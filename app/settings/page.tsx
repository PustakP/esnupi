'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, User, Bell, Database, MapPin } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Header 
        title="Settings" 
        subtitle="Configure your admin dashboard preferences"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* user profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Municipal Admin" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="admin@noida.gov.in" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Municipal Administration</SelectItem>
                      <SelectItem value="public-works">Public Works</SelectItem>
                      <SelectItem value="electrical">Electrical Department</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input defaultValue="Senior Administrator" className="mt-1" disabled />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* notification preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New High Priority Issues</p>
                    <p className="text-sm text-gray-600">Get notified when priority 4+ issues are reported</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Summary Reports</p>
                    <p className="text-sm text-gray-600">Receive daily email with key metrics</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Issue Status Updates</p>
                    <p className="text-sm text-gray-600">Notifications when issues change status</p>
                  </div>
                  <Button variant="ghost" size="sm">Disabled</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Analytics</p>
                    <p className="text-sm text-gray-600">Weekly performance and trends report</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* system configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Default Map Center</label>
                  <Select defaultValue="noida">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noida">Noida City Center</SelectItem>
                      <SelectItem value="sector62">Sector 62</SelectItem>
                      <SelectItem value="greater-noida">Greater Noida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Clustering Distance (meters)</label>
                  <Input defaultValue="25" className="mt-1" type="number" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Auto-refresh Interval</label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Items per Page</label>
                  <Select defaultValue="50">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button>Apply Settings</Button>
              </div>
            </CardContent>
          </Card>

          {/* data management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Database Status</p>
                    <p className="text-sm text-gray-600">Currently using dummy data</p>
                  </div>
                  <Badge variant="secondary">Phase 1</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Supabase Integration</p>
                    <p className="text-sm text-gray-600">Ready for Phase 2 deployment</p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-600">Download reports as CSV/JSON</p>
                  </div>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* system info */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0 - Phase 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build</span>
                  <span className="font-medium">2025.01.15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment</span>
                  <span className="font-medium">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reports</span>
                  <span className="font-medium">17 (Dummy Data)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage Area</span>
                  <span className="font-medium">Noida & Greater Noida</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
