'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '@/lib/definitions';

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const cards = [
    {
      title: 'Total Open Issues',
      value: metrics.totalOpenIssues,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'New Reports Today',
      value: metrics.newReportsToday,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Resolved This Week',
      value: metrics.resolvedThisWeek,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'High Priority Alerts',
      value: metrics.highPriorityAlerts,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground leading-tight">
              {card.title === 'Total Open Issues' && 'Awaiting resolution'}
              {card.title === 'New Reports Today' && 'Since midnight'}
              {card.title === 'Resolved This Week' && 'Last 7 days'}
              {card.title === 'High Priority Alerts' && 'Priority 4-5 issues'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
