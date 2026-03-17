'use client';

import { DashboardLayout } from '@/components/layout';
import { useIrrigation, useTriggerIrrigation, useUpdateIrrigationSettings } from '@/hooks/api/use-irrigation';
import { Droplets, Clock, Zap, Settings2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function IrrigationPage() {
  const { data, isLoading, error } = useIrrigation();
  const triggerIrrigation = useTriggerIrrigation();
  const updateSettings = useUpdateIrrigationSettings();

  const handleModeChange = (mode: 'automated' | 'manual') => {
    updateSettings.mutate({ mode });
    toast.success(`Switched to ${mode} mode`);
  };

  const handleAmountChange = (val: number[]) => {
    updateSettings.mutate({ irrigationAmount: val[0] });
  };

  const handleThresholdChange = (val: number[]) => {
    updateSettings.mutate({ soilMoistureThreshold: val[0] });
  };

  const handleIrrigateNow = () => {
    if (!data?.settings) return;
    
    triggerIrrigation.mutate(
      { amount: data.settings.irrigationAmount, mode: 'manual' },
      {
        onSuccess: (res) => toast.success(res.message),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout variant="irrigation">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout variant="irrigation">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load irrigation system status.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const { status, history, settings } = data;

  return (
    <DashboardLayout variant="irrigation">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DripDrop Irrigation</h1>
          <p className="text-muted-foreground mt-1">
            Precision water management for optimal plant hydration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Status Card */}
          <Card className="md:col-span-2 overflow-hidden relative border-muted/60 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none dark:from-blue-900/10" />
            <CardHeader className="relative">
              <CardTitle>System Status</CardTitle>
              <CardDescription>Real-time moisture monitoring</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center relative bg-background shadow-inner">
                    <div className="text-center z-10">
                      <span className="text-5xl font-bold text-foreground">{status.currentMoisture}%</span>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Moisture</p>
                    </div>
                    {/* SVG Water Fill Animation */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-500/20 dark:bg-blue-500/40 transition-all duration-1000 ease-in-out"
                        style={{ height: `${status.currentMoisture}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500/30 dark:bg-blue-400/50 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge variant={status.status === 'moist' ? 'default' : status.status === 'dry' ? 'destructive' : 'secondary'} className="capitalize">
                        {status.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-lg">{status.statusMessage}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Next Check</p>
                      <p className="font-semibold text-lg mt-1">{status.nextCheckIn}m</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Mode</p>
                      <p className="font-semibold text-lg mt-1 capitalize">{settings.mode}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 text-base shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20" 
                    size="lg"
                    onClick={handleIrrigateNow}
                    disabled={triggerIrrigation.isPending || settings.mode === 'automated'}
                  >
                    <Droplets className={cn("mr-2 h-5 w-5", triggerIrrigation.isPending && "animate-bounce")} />
                    {triggerIrrigation.isPending ? 'Irrigating...' : 'Irrigate Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <Card className="h-full flex flex-col border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Automated Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      AI managed schedule
                    </p>
                  </div>
                  <Switch
                    checked={settings.mode === 'automated'}
                    onCheckedChange={(checked) => handleModeChange(checked ? 'automated' : 'manual')}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Water Amount</Label>
                  <Badge variant="outline" className="font-mono">{settings.irrigationAmount}ml</Badge>
                </div>
                <Slider
                  defaultValue={[settings.irrigationAmount]}
                  min={100}
                  max={1000}
                  step={50}
                  onValueCommit={handleAmountChange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Moisture Threshold</Label>
                  <Badge variant="outline" className="font-mono">{settings.soilMoistureThreshold}%</Badge>
                </div>
                <Slider
                  defaultValue={[settings.soilMoistureThreshold]}
                  min={10}
                  max={80}
                  step={5}
                  onValueCommit={handleThresholdChange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                  System triggers when moisture drops below this level.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card className="border-muted/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              History Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2.5 rounded-full shadow-sm",
                        entry.mode === 'automated' 
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      )}>
                        {entry.mode === 'automated' ? <Zap className="h-4 w-4" /> : <Droplets className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Irrigation Cycle</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{entry.amount}ml</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 mt-1 capitalize border-muted-foreground/30 text-muted-foreground">
                        {entry.mode}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
