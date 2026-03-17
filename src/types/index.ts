export interface Garden {
  id: string;
  name: string;
  plantCount: number;
}

export type HealthStatus = 'healthy' | 'needs-attention' | 'critical';

export interface Plant {
  _id?: string;
  id: string;
  name: string;
  gardenId: string;
  image: string;
  healthStatus: HealthStatus;
  species: string;
  plantedDate: Date;
  lastWatered: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SensorReading {
  _id?: string;
  plantId: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
  timestamp: Date;
}

export interface IrrigationCycle {
  _id?: string;
  timestamp: Date;
  amount: number; // in ml
  duration: number; // in seconds
  mode: 'automated' | 'manual';
  status: 'completed' | 'interrupted' | 'failed';
}

export interface Alert {
  _id?: string;
  type: 'watering' | 'pest' | 'disease' | 'system' | 'nutrient';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  plantId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DiseaseReport {
  _id?: string;
  plantId?: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
  recommendations: string[];
  status: 'analyzed' | 'pending' | 'inconclusive';
  createdAt: Date;
}

export interface CropRecommendation {
  id: string;
  name: string;
  image: string;
  rating: number;
  growTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sunlight: 'full' | 'partial' | 'shade';
  space: 'small' | 'medium' | 'large';
  description: string;
  matchScore?: number; // Calculated field for ranking
}

export interface GrowGuideInput {
  growingSpace: 'small' | 'medium' | 'large';
  sunlight: 'full' | 'partial' | 'shade';
  maintenancePreference: 'low' | 'medium' | 'high';
}

// Keeping legacy types for compatibility during migration if needed, 
// but Phase 2 emphasizes the models above.
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: { name: string; amount: string; fromGarden: boolean }[];
  instructions: string[];
  nutritionalInfo: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  prepTime: string;
  cookTime: string;
  servings: number;
  plantTags: string[];
}

export type RecipeCategory = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';
