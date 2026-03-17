'use client';

import { DashboardLayout } from '@/components/layout';
import { PlantCard, ReminderPanel, QuickAddPlant } from '@/components/garden';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { usePlants, useAddPlant } from '@/hooks/api/use-plants';
import { useAlerts } from '@/hooks/api/use-alerts';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const { data: plants, isLoading: plantsLoading, error: plantsError } = usePlants();
  const { data: alerts } = useAlerts();
  const addPlant = useAddPlant();

  const handleAddPlant = (name: string, species: string) => {
    addPlant.mutate(
      {
        name,
        species,
        gardenId: '1', // Default garden for now
        image: '/images/plants/new-plant.svg',
        healthStatus: 'healthy',
        plantedDate: new Date(),
        lastWatered: new Date(),
      },
      {
        onSuccess: () => toast.success(`Added ${name} to your garden`),
        onError: () => toast.error('Failed to add plant'),
      }
    );
  };

  // Transform alerts to reminders format for UI compatibility
  const reminders = (alerts || []).map(alert => ({
    id: alert._id!,
    plantId: alert.plantId || '',
    plantName: 'System', // Should resolve actual name in a real app
    type: alert.type as any,
    message: alert.message,
    dueDate: new Date(alert.createdAt).toISOString()
  }));

  if (plantsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (plantsError) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load dashboard data. Please try refreshing.</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your garden&apos;s health and upcoming tasks.
            </p>
          </div>
          <QuickAddPlant onAdd={handleAddPlant} />
        </div>

        <StatsCards plants={plants || []} />

        <div className="grid gap-8 lg:grid-cols-7">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Your Plants</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants?.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ReminderPanel reminders={reminders} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
