import mongoose, { Schema, Model, models } from 'mongoose';
import { IrrigationCycle } from '@/types';

const IrrigationCycleSchema = new Schema<IrrigationCycle>({
  timestamp: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true },
  mode: { type: String, enum: ['automated', 'manual'], required: true },
  status: { type: String, enum: ['completed', 'interrupted', 'failed'], required: true },
});

export const IrrigationCycleModel: Model<IrrigationCycle> = models.IrrigationCycle || mongoose.model<IrrigationCycle>('IrrigationCycle', IrrigationCycleSchema);
