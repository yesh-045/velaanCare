'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout';
import {
  getPlantById,
  getSensorData,
  getGrowthData,
  getCareInstructions,
  mockCareSchedule,
} from '@/data/mock-data';
import { Plant, SensorData, GrowthData, CareInstruction, CareSchedule } from '@/types';
import { Thermometer, Droplets, Sun, Calendar, ArrowUpRight, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.id as string;
  
  const [plant, setPlant] = useState<Plant | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [careInstructions, setCareInstructions] = useState<CareInstruction[]>([]);
  const [careSchedule, setCareSchedule] = useState<CareSchedule[]>([]);

  useEffect(() => {
    const p = getPlantById(plantId);
    if (p) {
      setPlant(p);
      setSensorData(getSensorData(plantId) || null);
      setGrowthData(getGrowthData(plantId));
      setCareInstructions(getCareInstructions(plantId));
      setCareSchedule(mockCareSchedule.filter((s) => s.plantId === plantId));
    }
  }, [plantId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sensorData) {
        setSensorData({
          ...sensorData,
          temperature: sensorData.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(0, Math.min(100, sensorData.humidity + (Math.random() - 0.5) * 5)),
          soilMoisture: Math.max(0, Math.min(100, sensorData.soilMoisture + (Math.random() - 0.5) * 3)),
          lightLevel: Math.max(0, sensorData.lightLevel + (Math.random() - 0.5) * 50),
          timestamp: new Date().toISOString(),
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sensorData]);

  if (!plant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Plant Not Found</h2>
            <p className="text-muted-foreground">The plant you requested could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden bg-muted h-[300px] shadow-sm">
          <Image
            src={plant.image}
            alt={plant.name}
            fill
            className="object-cover blur-[2px] opacity-40 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 flex items-end gap-6 w-full">
            <div className="h-32 w-32 rounded-xl overflow-hidden border-4 border-background shadow-lg relative bg-muted">
              <Image src={plant.image} alt={plant.name} fill className="object-cover" />
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{plant.name}</h1>
                <Badge 
                  variant={plant.healthStatus === 'healthy' ? 'default' : 'destructive'}
                  className={cn(
                    "text-base px-3 py-1 shadow-sm",
                    plant.healthStatus === 'healthy' 
                      ? "bg-green-500 hover:bg-green-600 dark:bg-green-600" 
                      : "bg-red-500 hover:bg-red-600 dark:bg-red-600"
                  )}
                >
                  {plant.healthStatus === 'healthy' ? 'Healthy' : 'Attention Needed'}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground font-medium">{plant.species}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Planted: {new Date(plant.plantedDate).toLocaleDateString()}
                </span>
                <Separator orientation="vertical" className="h-4 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-4 w-4" />
                  Last Watered: {new Date(plant.lastWatered).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="growth">Growth History</TabsTrigger>
            <TabsTrigger value="care">Care Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Sensor Data Grid */}
            {sensorData && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                    <Thermometer className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.temperature.toFixed(1)}°C</div>
                    <Progress value={sensorData.temperature * 2} className="mt-2 h-2 bg-muted [&>div]:bg-orange-500" />
                  </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                    <Droplets className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.humidity.toFixed(0)}%</div>
                    <Progress value={sensorData.humidity} className="mt-2 h-2 bg-muted [&>div]:bg-blue-500" />
                  </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Soil Moisture</CardTitle>
                    <Droplets className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.soilMoisture.toFixed(0)}%</div>
                    <Progress value={sensorData.soilMoisture} className="mt-2 h-2 bg-muted [&>div]:bg-green-500" />
                  </CardContent>
                </Card>
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Light Level</CardTitle>
                    <Sun className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sensorData.lightLevel.toFixed(0)} lux</div>
                    <Progress value={(sensorData.lightLevel / 1000) * 100} className="mt-2 h-2 bg-muted [&>div]:bg-yellow-500" />
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-7">
              <Card className="md:col-span-4 border-muted/60">
                <CardHeader>
                  <CardTitle>Upcoming Care</CardTitle>
                  <CardDescription>
                    Scheduled tasks for the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {careSchedule.map((schedule) => (
                        <div key={schedule.id} className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                          <div className="p-2 rounded-full bg-primary/10 mr-4 dark:bg-primary/20">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium capitalize text-foreground">{schedule.type.replace('-', ' ')}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(schedule.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Mark Done</Button>
                        </div>
                      ))}
                      {careSchedule.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                          <Activity className="h-8 w-8 mb-2 opacity-20" />
                          <p>No upcoming tasks.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="md:col-span-3 border-muted/60">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for this plant</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button className="w-full justify-start gap-2 h-12" variant="outline">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Log Watering
                  </Button>
                  <Button className="w-full justify-start gap-2 h-12" variant="outline">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    Record Growth
                  </Button>
                  <Button className="w-full justify-start gap-2 h-12" variant="outline">
                    <Activity className="h-4 w-4 text-orange-500" />
                    Check Health
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="animate-in fade-in slide-in-from-bottom-2">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trajectory</CardTitle>
                <CardDescription>Height tracking over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}cm`}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid hsl(var(--border))', 
                          backgroundColor: 'hsl(var(--background))',
                          color: 'hsl(var(--foreground))',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="height" 
                        stroke="#22c55e" 
                        fillOpacity={1} 
                        fill="url(#colorHeight)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid gap-4 md:grid-cols-2">
              {careInstructions.map((instruction) => (
                <Card key={instruction.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                        {instruction.type === 'watering' ? <Droplets className="h-4 w-4 text-primary" /> : 
                         instruction.type === 'fertilizing' ? <Activity className="h-4 w-4 text-primary" /> :
                         <Sun className="h-4 w-4 text-primary" />}
                      </div>
                      {instruction.type.replace('-', ' ')}
                    </CardTitle>
                    <CardDescription>Frequency: {instruction.frequency}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {instruction.instruction}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
