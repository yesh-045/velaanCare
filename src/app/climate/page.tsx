'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Thermometer, Droplets, Wind, Gauge, ArrowUp, ArrowDown, Fan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ClimateData {
  temperature: number;
  humidity: number;
  airQuality: number;
  ventilation: 'on' | 'off' | 'auto';
  co2: number;
}

export default function ClimatePage() {
  const [climate, setClimate] = useState<ClimateData>({
    temperature: 24.5,
    humidity: 65,
    airQuality: 92,
    ventilation: 'auto',
    co2: 450,
  });

  const [targetTemp, setTargetTemp] = useState(24);
  const [targetHumidity, setTargetHumidity] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setClimate(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        airQuality: Math.max(80, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 3)),
        co2: Math.max(400, Math.min(800, prev.co2 + (Math.random() - 0.5) * 10)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTempStatus = () => {
    const diff = Math.abs(climate.temperature - targetTemp);
    if (diff <= 1) return { label: 'Optimal', color: 'bg-green-500 text-white border-none' };
    if (diff <= 3) return { label: 'Acceptable', color: 'bg-yellow-500 text-white border-none' };
    return { label: 'Warning', color: 'bg-red-500 text-white border-none' };
  };

  const getHumidityStatus = () => {
    const diff = Math.abs(climate.humidity - targetHumidity);
    if (diff <= 5) return { label: 'Optimal', color: 'bg-green-500 text-white border-none' };
    if (diff <= 15) return { label: 'Acceptable', color: 'bg-yellow-500 text-white border-none' };
    return { label: 'Warning', color: 'bg-red-500 text-white border-none' };
  };

  return (
    <DashboardLayout variant="irrigation">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Climate Control</h1>
            <p className="text-muted-foreground mt-1">
              Atmospheric monitoring and environment regulation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2 py-1.5 px-3 bg-card border-muted-foreground/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Systems Online</span>
            </Badge>
          </div>
        </div>

        {/* Main Gauges */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="relative overflow-hidden border-muted/60 shadow-sm group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Thermometer className="h-24 w-24 text-orange-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold tracking-tight">{climate.temperature.toFixed(1)}°C</div>
                <Badge variant="secondary" className={cn("ml-2", getTempStatus().color)}>
                  {getTempStatus().label}
                </Badge>
              </div>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000"
                  style={{ width: `${(climate.temperature / 40) * 100}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-muted/60 shadow-sm group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Droplets className="h-24 w-24 text-blue-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold tracking-tight">{climate.humidity.toFixed(0)}%</div>
                <Badge variant="secondary" className={cn("ml-2", getHumidityStatus().color)}>
                  {getHumidityStatus().label}
                </Badge>
              </div>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                  style={{ width: `${climate.humidity}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-muted/60 shadow-sm group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Gauge className="h-24 w-24 text-green-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Air Quality (AQI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold tracking-tight">{climate.airQuality.toFixed(0)}</div>
                <Badge variant="secondary" className="bg-green-500 text-white ml-2 border-none">Excellent</Badge>
              </div>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${climate.airQuality}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-muted/60 shadow-sm group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
              <Wind className="h-24 w-24 text-purple-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CO2 Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold tracking-tight">{climate.co2.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">ppm</span></div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                  style={{ width: `${(climate.co2 / 1000) * 100}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2 border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle>Environment Settings</CardTitle>
              <CardDescription>Adjust target conditions for automated systems</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="temp" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1">
                  <TabsTrigger value="temp" className="gap-2 data-[state=active]:bg-background"><Thermometer className="h-4 w-4" /> Temperature</TabsTrigger>
                  <TabsTrigger value="humidity" className="gap-2 data-[state=active]:bg-background"><Droplets className="h-4 w-4" /> Humidity</TabsTrigger>
                  <TabsTrigger value="ventilation" className="gap-2 data-[state=active]:bg-background"><Wind className="h-4 w-4" /> Ventilation</TabsTrigger>
                </TabsList>

                <TabsContent value="temp" className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-5xl font-bold text-orange-500 tracking-tighter">{targetTemp}°C</div>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Target Setpoint</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setTargetTemp(prev => prev - 1)}>
                        <ArrowDown className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setTargetTemp(prev => prev + 1)}>
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[targetTemp]}
                      min={16}
                      max={32}
                      step={1}
                      onValueChange={([val]) => setTargetTemp(val)}
                      className="py-4 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-orange-500/50"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider px-1">
                      <span>Cool (16°C)</span>
                      <span>Warm (32°C)</span>
                    </div>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-lg flex gap-3 items-start">
                    <Thermometer className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Optimal range for current vegetation is <strong className="text-foreground">22°C - 26°C</strong>. Adjusting target temperature will trigger HVAC systems automatically.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="humidity" className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-5xl font-bold text-blue-500 tracking-tighter">{targetHumidity}%</div>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Target Humidity</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setTargetHumidity(prev => prev - 5)}>
                        <ArrowDown className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setTargetHumidity(prev => prev + 5)}>
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[targetHumidity]}
                      min={30}
                      max={90}
                      step={5}
                      onValueChange={([val]) => setTargetHumidity(val)}
                      className="py-4 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-blue-500/50"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider px-1">
                      <span>Dry (30%)</span>
                      <span>Humid (90%)</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg flex gap-3 items-start">
                    <Droplets className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Higher humidity levels (60%+) are recommended for tropical species. Ensure proper airflow to prevent mold growth.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="ventilation" className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="grid grid-cols-3 gap-4">
                    {(['off', 'auto', 'on'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={climate.ventilation === mode ? 'default' : 'outline'}
                        className={cn(
                          "h-32 flex-col gap-3 capitalize text-lg transition-all border-muted hover:border-primary",
                          climate.ventilation === mode && "shadow-md ring-2 ring-primary/20 border-primary"
                        )}
                        onClick={() => setClimate({ ...climate, ventilation: mode })}
                      >
                        <Fan className={cn("h-10 w-10", climate.ventilation === mode && mode !== 'off' ? "animate-spin duration-[3000ms]" : "")} />
                        <span className="font-semibold">{mode}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-lg flex gap-3 items-start">
                    <Wind className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong>Auto Mode:</strong> Fans will activate when temperature exceeds target by 2°C or humidity exceeds target by 10%.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
