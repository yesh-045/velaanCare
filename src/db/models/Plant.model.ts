import mongoose, { Schema, Model, models } from 'mongoose';
import { Plant, HealthStatus } from '@/types';

const PlantSchema = new Schema<Plant>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gardenId: { type: String, required: true, index: true },
  image: { type: String, required: true },
  healthStatus: { 
    type: String, 
    enum: ['healthy', 'needs-attention', 'critical'], 
    default: 'healthy' 
  },
  species: { type: String, required: true },
  plantedDate: { type: Date, required: true },
  lastWatered: { type: Date, required: true },
}, {
  timestamps: true,
});

export const PlantModel: Model<Plant> = models.Plant || mongoose.model<Plant>('Plant', PlantSchema);
