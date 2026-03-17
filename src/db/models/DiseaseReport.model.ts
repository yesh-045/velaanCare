import mongoose, { Schema, Model, models } from 'mongoose';
import { DiseaseReport } from '@/types';

const DiseaseReportSchema = new Schema<DiseaseReport>({
  plantId: { type: String, required: false }, // Optional link to a plant
  imageUrl: { type: String, required: true },
  diseaseName: { type: String, required: true },
  confidence: { type: Number, required: true },
  recommendations: [{ type: String }],
  status: { type: String, enum: ['analyzed', 'pending', 'inconclusive'], default: 'pending' },
}, {
  timestamps: true,
});

export const DiseaseReportModel: Model<DiseaseReport> = models.DiseaseReport || mongoose.model<DiseaseReport>('DiseaseReport', DiseaseReportSchema);
