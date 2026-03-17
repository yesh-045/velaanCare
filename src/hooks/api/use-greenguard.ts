import { useMutation, useQuery } from '@tanstack/react-query';
import { DiseaseReport } from '@/types';

export function useGreenGuardHistory() {
  return useQuery<DiseaseReport[]>({
    queryKey: ['greenguard-history'],
    queryFn: async () => {
      const res = await fetch('/api/greenguard');
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    }
  });
}

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/greenguard', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Analysis failed');
      return res.json() as Promise<DiseaseReport>;
    }
  });
}
