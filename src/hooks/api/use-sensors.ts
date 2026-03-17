import { useQuery } from '@tanstack/react-query';
import { SensorReading } from '@/types';

export function useSensorHistory(plantId: string, limit: number = 100) {
  return useQuery<SensorReading[]>({
    queryKey: ['sensors', plantId],
    queryFn: async () => {
      const res = await fetch(`/api/sensors?plantId=${plantId}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch sensors');
      return res.json();
    },
    enabled: !!plantId,
    refetchInterval: 5000, // Real-time polling
  });
}
