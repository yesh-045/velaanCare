import { GrowGuideInput, CropRecommendation, DiseaseAnalysisResult } from '@/types';
import {
  mockCropRecommendations,
  mockDiseaseResults,
  mockIrrigationSettings,
  mockIrrigationHistory,
  mockIrrigationStatus,
} from '@/data/mock-data';

export function getRecommendedCrops(input: GrowGuideInput): CropRecommendation[] {
  const { growingSpace, sunlight, maintenancePreference } = input;

  const difficultyMap: Record<string, ('easy' | 'medium' | 'hard')[]> = {
    low: ['easy'],
    medium: ['easy', 'medium'],
    high: ['easy', 'medium', 'hard'],
  };

  const allowedDifficulties = difficultyMap[maintenancePreference];

  const filtered = mockCropRecommendations.filter((crop) => {
    const spaceMatch = crop.space === growingSpace || 
      (growingSpace === 'large' && ['small', 'medium', 'large'].includes(crop.space)) ||
      (growingSpace === 'medium' && ['small', 'medium'].includes(crop.space));
    
    const sunlightMatch = crop.sunlight === sunlight ||
      (sunlight === 'full' && crop.sunlight === 'partial') ||
      (sunlight === 'partial' && crop.sunlight === 'shade');
    
    const difficultyMatch = allowedDifficulties.includes(crop.difficulty);

    return spaceMatch && sunlightMatch && difficultyMatch;
  });

  return filtered.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.space === growingSpace) scoreA += 3;
    if (b.space === growingSpace) scoreB += 3;

    if (a.sunlight === sunlight) scoreA += 2;
    if (b.sunlight === sunlight) scoreB += 2;

    scoreA += a.rating;
    scoreB += b.rating;

    return scoreB - scoreA;
  });
}

export async function analyzePlantDisease(imageFile: File): Promise<DiseaseAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const randomResult = Math.random() > 0.3 ? 'blight' : 'healthy';
  return mockDiseaseResults[randomResult];
}

export function getIrrigationSettings() {
  return mockIrrigationSettings;
}

export function getIrrigationHistory() {
  return mockIrrigationHistory;
}

export function getIrrigationStatus() {
  return mockIrrigationStatus;
}

export async function triggerIrrigation(amount: number): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    message: `Irrigation triggered: ${amount}ml dispensed`,
  };
}

export function calculateMoistureStatus(moisture: number): {
  status: 'dry' | 'moist' | 'wet';
  message: string;
} {
  if (moisture < 30) {
    return { status: 'dry', message: 'Soil is too dry. Watering recommended.' };
  } else if (moisture < 70) {
    return { status: 'moist', message: 'Soil is perfectly moist.' };
  } else {
    return { status: 'wet', message: 'Soil is well hydrated.' };
  }
}
