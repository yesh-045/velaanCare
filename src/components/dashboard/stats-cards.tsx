'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plant } from '@/types';
import { Leaf, Activity, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatsCardsProps {
  plants: Plant[];
}

export function StatsCards({ plants }: StatsCardsProps) {
  const healthyCount = plants.filter((p) => p.healthStatus === 'healthy').length;
  const attentionCount = plants.filter((p) => p.healthStatus === 'needs-attention').length;
  const criticalCount = plants.filter((p) => p.healthStatus === 'critical').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-primary/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Plants</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Leaf className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{plants.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all gardens
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
          <div className="relative p-2 bg-green-500/10 rounded-full">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{healthyCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Thriving plants
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-yellow-500/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{attentionCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Minor issues detected
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-red-500/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          <div className="p-2 bg-red-500/10 rounded-full">
            <AlertOctagon className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Immediate action required
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
