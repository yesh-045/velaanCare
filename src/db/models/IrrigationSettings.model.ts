import mongoose, { Schema, Model, models } from 'mongoose';
import { IrrigationSettings } from '@/types';

const IrrigationSettingsSchema = new Schema<IrrigationSettings>({
  mode: { type: String, enum: ['automated', 'manual'], required: true, default: 'manual' },
  irrigationAmount: { type: Number, required: true, default: 500 },
  soilMoistureThreshold: { type: Number, required: true, default: 40 },
}, { timestamps: true });

// We treat this as a singleton collection (only one settings doc)
export const IrrigationSettingsModel: Model<IrrigationSettings> = models.IrrigationSettings || mongoose.model<IrrigationSettings>('IrrigationSettings', IrrigationSettingsSchema);
