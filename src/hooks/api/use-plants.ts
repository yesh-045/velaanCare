import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plant } from '@/types';

export function usePlants() {
  return useQuery<Plant[]>({
    queryKey: ['plants'],
    queryFn: async () => {
      const res = await fetch('/api/plants');
      if (!res.ok) throw new Error('Failed to fetch plants');
      return res.json();
    }
  });
}

export function useAddPlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPlant: Omit<Plant, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
      // Generate ID client-side or let server handle it (server handles it in our repo)
      const res = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPlant,
          id: crypto.randomUUID(), // Temp ID generation
          createdAt: new Date(),
          updatedAt: new Date()
        }),
      });
      if (!res.ok) throw new Error('Failed to add plant');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    }
  });
}
