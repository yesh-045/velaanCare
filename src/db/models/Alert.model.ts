import mongoose, { Schema, Model, models } from 'mongoose';
import { Alert } from '@/types';

const AlertSchema = new Schema<Alert>({
  type: { type: String, enum: ['watering', 'pest', 'disease', 'system', 'nutrient'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  message: { type: String, required: true },
  plantId: { type: String, required: false },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const AlertModel: Model<Alert> = models.Alert || mongoose.model<Alert>('Alert', AlertSchema);
