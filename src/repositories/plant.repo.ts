import { ensureDatabaseBootstrap } from '@/db/bootstrap';
import { PlantModel } from '@/db/models/Plant.model';
import { Plant } from '@/types';

export class PlantRepository {
  async findAll(): Promise<Plant[]> {
    await ensureDatabaseBootstrap();
    const plants = await PlantModel.find({}).sort({ createdAt: -1 });
    return plants.map(doc => doc.toObject());
  }

  async findById(id: string): Promise<Plant | null> {
    await ensureDatabaseBootstrap();
    const plant = await PlantModel.findOne({ id });
    return plant ? plant.toObject() : null;
  }

  async create(data: Omit<Plant, '_id'>): Promise<Plant> {
    await ensureDatabaseBootstrap();
    const newPlant = await PlantModel.create(data);
    return newPlant.toObject();
  }

  async update(id: string, data: Partial<Plant>): Promise<Plant | null> {
    await ensureDatabaseBootstrap();
    const updatedPlant = await PlantModel.findOneAndUpdate(
      { id }, 
      data, 
      { new: true }
    );
    return updatedPlant ? updatedPlant.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    await ensureDatabaseBootstrap();
    const result = await PlantModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
