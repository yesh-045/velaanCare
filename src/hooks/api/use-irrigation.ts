import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IrrigationCycle, IrrigationStatus, IrrigationSettings } from '@/types';

interface IrrigationData {
  history: IrrigationCycle[];
  status: IrrigationStatus;
  settings: IrrigationSettings;
}

export function useIrrigation() {
  return useQuery<IrrigationData>({
    queryKey: ['irrigation'],
    queryFn: async () => {
      const res = await fetch('/api/irrigation');
      if (!res.ok) throw new Error('Failed to fetch irrigation data');
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useTriggerIrrigation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, mode }: { amount: number, mode: 'automated' | 'manual' }) => {
      const res = await fetch('/api/irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to trigger irrigation');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['irrigation'] });
    }
  });
}

export function useUpdateIrrigationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<IrrigationSettings>) => {
      const res = await fetch('/api/irrigation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['irrigation'] });
    }
  });
}
