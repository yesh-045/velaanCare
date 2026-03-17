import { ensureDatabaseBootstrap } from '@/db/bootstrap';
import { SensorReadingModel } from '@/db/models/SensorReading.model';
import { SensorReading } from '@/types';

export class SensorRepository {
  async addReading(data: Omit<SensorReading, '_id'>): Promise<SensorReading> {
    await ensureDatabaseBootstrap();
    const reading = await SensorReadingModel.create(data);
    return reading.toObject();
  }

  async getHistory(plantId: string, limit: number = 100): Promise<SensorReading[]> {
    await ensureDatabaseBootstrap();
    const readings = await SensorReadingModel.find({ plantId })
      .sort({ timestamp: -1 })
      .limit(limit);
    return readings.map(doc => doc.toObject()).reverse(); // Return chronological for charts
  }

  async getLatest(plantId: string): Promise<SensorReading | null> {
    await ensureDatabaseBootstrap();
    const reading = await SensorReadingModel.findOne({ plantId })
      .sort({ timestamp: -1 });
    return reading ? reading.toObject() : null;
  }
}
