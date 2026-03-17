import { ensureDatabaseBootstrap } from '@/db/bootstrap';
import { IrrigationCycleModel } from '@/db/models/IrrigationCycle.model';
import { IrrigationSettingsModel } from '@/db/models/IrrigationSettings.model';
import { IrrigationCycle, IrrigationSettings } from '@/types';

export class IrrigationRepository {
  async logCycle(data: Omit<IrrigationCycle, '_id'>): Promise<IrrigationCycle> {
    await ensureDatabaseBootstrap();
    const cycle = await IrrigationCycleModel.create(data);
    return cycle.toObject();
  }

  async getHistory(limit: number = 20): Promise<IrrigationCycle[]> {
    await ensureDatabaseBootstrap();
    const history = await IrrigationCycleModel.find({})
      .sort({ timestamp: -1 })
      .limit(limit);
    return history.map(doc => doc.toObject());
  }

  async getLastCycle(): Promise<IrrigationCycle | null> {
    await ensureDatabaseBootstrap();
    const cycle = await IrrigationCycleModel.findOne({})
      .sort({ timestamp: -1 });
    return cycle ? cycle.toObject() : null;
  }

  // Settings Logic (Singleton)
  async getSettings(): Promise<IrrigationSettings> {
    await ensureDatabaseBootstrap();
    let settings = await IrrigationSettingsModel.findOne({});
    
    if (!settings) {
      settings = await IrrigationSettingsModel.create({
        mode: 'manual',
        irrigationAmount: 500,
        soilMoistureThreshold: 40
      });
    }
    return settings.toObject();
  }

  async updateSettings(data: Partial<IrrigationSettings>): Promise<IrrigationSettings> {
    await ensureDatabaseBootstrap();
    // Upsert ensures we always have one doc
    const settings = await IrrigationSettingsModel.findOneAndUpdate(
      {}, 
      data, 
      { new: true, upsert: true }
    );
    return settings.toObject();
  }
}
