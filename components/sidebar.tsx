'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  MapPin
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'All Issues',
    href: '/issues',
    icon: AlertTriangle,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* logo/header */}
      <div className="flex items-center gap-2 p-6 border-b border-gray-700">
        <MapPin className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-xl font-bold">esnupi</h1>
          <p className="text-sm text-gray-400">complaint agent</p>
        </div>
      </div>

      {/* nav items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer info */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Noida Municipal Admin
        </p>
        <p className="text-xs text-gray-500">
          v1.0.0 - Phase 1
        </p>
      </div>
    </div>
  );
}
