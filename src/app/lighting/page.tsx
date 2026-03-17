'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Sun, Moon, Clock, Zap, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LightSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  intensity: number;
  enabled: boolean;
}

const mockLightSchedules: LightSchedule[] = [
  { id: '1', name: 'Morning Boost', startTime: '06:00', endTime: '09:00', intensity: 80, enabled: true },
  { id: '2', name: 'Midday Full', startTime: '10:00', endTime: '16:00', intensity: 100, enabled: true },
  { id: '3', name: 'Evening Wind-down', startTime: '17:00', endTime: '20:00', intensity: 50, enabled: true },
];

export default function LightingPage() {
  const [mode, setMode] = useState<'automated' | 'manual'>('automated');
  const [currentIntensity, setCurrentIntensity] = useState(75);
  const [schedules, setSchedules] = useState(mockLightSchedules);

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const calculateTimelinePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    // 06:00 (360m) to 22:00 (1320m) = 960m range
    // Start from 6am (0%) to 10pm (100%)
    const startMinutes = 6 * 60;
    const range = 16 * 60;
    return Math.max(0, Math.min(100, ((totalMinutes - startMinutes) / range) * 100));
  };

  return (
    <DashboardLayout variant="irrigation">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Lighting</h1>
            <p className="text-muted-foreground mt-1">
              Automated grow light management and scheduling.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border shadow-sm">
            <Button 
              variant={mode === 'automated' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('automated')}
              className={cn("gap-2 transition-all", mode === 'automated' && "shadow-sm")}
            >
              <Clock className="h-4 w-4" />
              Auto
            </Button>
            <Button 
              variant={mode === 'manual' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setMode('manual')}
              className={cn("gap-2 transition-all", mode === 'manual' && "shadow-sm")}
            >
              <Zap className="h-4 w-4" />
              Manual
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-muted/60 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Light Intensity</CardTitle>
                    <CardDescription>Real-time brightness control</CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Current output level sent to grow lights
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {mode === 'automated' ? (
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-medium">Automated Mode Active</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      Lighting is currently controlled by your schedule. Switch to manual mode to override.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-8 py-4">
                    <div className="flex items-center justify-between px-2">
                      <Sun className={cn("h-8 w-8 transition-colors duration-500", currentIntensity > 0 ? "text-yellow-500 dark:text-yellow-400" : "text-muted-foreground")} />
                      <span className="text-5xl font-bold tracking-tighter tabular-nums">{currentIntensity}%</span>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[currentIntensity]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={([val]) => setCurrentIntensity(val)}
                        className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-primary/50"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                        <span>Off</span>
                        <span>50%</span>
                        <span>Full Sun</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-muted/60 shadow-sm">
              <CardHeader>
                <CardTitle>Daily Schedule</CardTitle>
                <CardDescription>24-hour cycle overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-28 bg-muted/20 dark:bg-muted/10 rounded-xl overflow-hidden mb-8 border shadow-inner">
                  {/* Time Markers */}
                  <div className="absolute bottom-0 w-full flex justify-between px-4 text-[10px] text-muted-foreground font-medium pb-2 select-none">
                    <span>6 AM</span>
                    <span>10 AM</span>
                    <span>2 PM</span>
                    <span>6 PM</span>
                    <span>10 PM</span>
                  </div>
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex justify-between px-4 opacity-10 pointer-events-none">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-px h-full bg-foreground" />)}
                  </div>
                  
                  {/* Schedule Blocks */}
                  {schedules.filter(s => s.enabled).map(schedule => {
                    const start = calculateTimelinePosition(schedule.startTime);
                    const end = calculateTimelinePosition(schedule.endTime);
                    const width = end - start;
                    
                    return (
                      <div
                        key={schedule.id}
                        className="absolute top-3 bottom-8 bg-yellow-400/20 dark:bg-yellow-500/10 border-l-2 border-r-2 border-yellow-500/50 dark:border-yellow-400/40 flex items-center justify-center group cursor-help transition-all hover:bg-yellow-400/30 dark:hover:bg-yellow-500/20 rounded-sm"
                        style={{ left: `${start}%`, width: `${width}%` }}
                      >
                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-2 py-1 rounded shadow-sm">
                          {schedule.intensity}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-all hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2.5 rounded-full shadow-sm",
                          schedule.enabled 
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          <Sun className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{schedule.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
                              {schedule.startTime} - {schedule.endTime}
                            </Badge>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="font-medium text-primary">{schedule.intensity}% Brightness</span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => toggleSchedule(schedule.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Sidebar */}
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 fill-current" />
                  Energy Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1 tracking-tight">
                  {Math.round(currentIntensity * 0.45)}<span className="text-xl font-medium opacity-80">W</span>
                </div>
                <p className="text-primary-foreground/80 text-sm mb-6">Current consumption</p>
                <div className="pt-4 border-t border-primary-foreground/20 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Daily Avg</p>
                    <p className="font-semibold text-lg">3.2 <span className="text-xs">kWh</span></p>
                  </div>
                  <div>
                    <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Est. Cost</p>
                    <p className="font-semibold text-lg">$0.45</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                      <Sun className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-medium">Light Level</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">Good</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">Daily Cycle</span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">14h / 10h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
