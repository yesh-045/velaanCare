import mongoose, { Schema, Model, models } from 'mongoose';
import { SensorReading } from '@/types';

const SensorReadingSchema = new Schema<SensorReading>({
  plantId: { type: String, required: true, index: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soilMoisture: { type: Number, required: true },
  lightLevel: { type: Number, required: true },
  timestamp: { type: Date, required: true, index: true },
}, {
  // Time-series optimized collection
  timeseries: {
    timeField: 'timestamp',
    metaField: 'plantId',
    granularity: 'minutes'
  }
});

export const SensorReadingModel: Model<SensorReading> = models.SensorReading || mongoose.model<SensorReading>('SensorReading', SensorReadingSchema);
