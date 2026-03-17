import { useMutation, useQuery } from '@tanstack/react-query';
import { GrowGuideInput, CropRecommendation } from '@/types';

export function useGrowGuideRecommendations() {
  return useMutation({
    mutationFn: async (input: GrowGuideInput) => {
      const res = await fetch('/api/growguide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json() as Promise<CropRecommendation[]>;
    }
  });
}
