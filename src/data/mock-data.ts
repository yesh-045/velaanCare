// This file is now just for static fallback constants or types if needed.
// The seed logic has been moved to src/scripts/seed.ts
import { CropRecommendation, Recipe } from '@/types';

export const mockCropRecommendations: CropRecommendation[] = [
  {
    id: '1',
    name: 'Cherry Tomatoes',
    image: '/images/growguide/cherry-tomatoes.svg',
    rating: 4.8,
    growTime: '60-70 days',
    difficulty: 'easy',
    sunlight: 'full',
    space: 'small',
    description: 'Perfect for sunny balconies. Easy to grow and delicious.',
  },
  {
    id: '2',
    name: 'Lettuce',
    image: '/images/growguide/lettuce.svg',
    rating: 4.5,
    growTime: '30-40 days',
    difficulty: 'easy',
    sunlight: 'partial',
    space: 'small',
    description: 'Fast-growing leafy green that tolerates shade.',
  },
];

export const mockCompostGuides = [
  {
    id: '1',
    title: 'Basic Composting',
    steps: [
      { stepNumber: 1, title: 'Gather Greens', description: 'Collect nitrogen-rich materials like grass clippings and fruit scraps.' },
      { stepNumber: 2, title: 'Gather Browns', description: 'Collect carbon-rich materials like dry leaves and cardboard.' },
    ]
  }
];

export const mockNutrientInfo = [
  {
    symbol: 'N',
    name: 'Nitrogen',
    description: 'Essential for leafy growth.',
    benefits: ['Promotes green leaves', 'Boosts growth'],
    sources: ['Blood meal', 'Fish emulsion']
  },
  {
    symbol: 'P',
    name: 'Phosphorus',
    description: 'Vital for root development and flowering.',
    benefits: ['Strong roots', 'Better blooms'],
    sources: ['Bone meal', 'Rock phosphate']
  },
  {
    symbol: 'K',
    name: 'Potassium',
    description: 'Overall plant health and disease resistance.',
    benefits: ['Disease resistance', 'Water regulation'],
    sources: ['Kelp meal', 'Wood ash']
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Basil Pesto',
    description: 'Classic Italian sauce made with fresh basil.',
    image: '/images/recipes/basil-pesto.svg',
    category: 'lunch',
    ingredients: [{ name: 'Basil', amount: '2 cups', fromGarden: true }],
    instructions: ['Blend all ingredients.'],
    nutritionalInfo: { calories: 200, protein: 5, carbs: 2, fat: 18, fiber: 1 },
    prepTime: '10',
    cookTime: '0',
    servings: 4,
    plantTags: ['Basil']
  }
];

export const mockGardens = [
  { id: '1', name: 'Balcony Garden', plantCount: 5 },
  { id: '2', name: 'Kitchen Herbs', plantCount: 3 }
];

// Placeholder exports for functions that were removed to prevent build errors 
// until we fully refactor the components to use API hooks
export const getPlantById = () => null;
export const getSensorData = () => null;
export const getGrowthData = () => [];
export const getCareInstructions = () => [];
export const mockCareSchedule = [];
export const mockReminders = [];
export const mockPlants = [];
export const mockIrrigationSettings = {
  mode: 'manual',
  irrigationAmount: 500,
  soilMoistureThreshold: 40
};
export const mockIrrigationHistory = [];
export const mockIrrigationStatus = {
  currentMoisture: 65,
  status: 'moist',
  statusMessage: 'Soil is perfectly moist.',
  nextCheckIn: 30
};
export const mockDiseaseResults = {};
