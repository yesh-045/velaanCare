import connectDB from '@/db/connection';
import { AlertModel } from '@/db/models/Alert.model';
import { DiseaseReportModel } from '@/db/models/DiseaseReport.model';
import { IrrigationCycleModel } from '@/db/models/IrrigationCycle.model';
import { IrrigationSettingsModel } from '@/db/models/IrrigationSettings.model';
import { PlantModel } from '@/db/models/Plant.model';
import { SensorReadingModel } from '@/db/models/SensorReading.model';

const seedPlants = [
  {
    id: 'plant-1',
    name: 'Cherry Tomatoes',
    gardenId: '1',
    image: '/images/plants/tomato.svg',
    healthStatus: 'healthy' as const,
    species: 'Solanum lycopersicum',
    plantedDate: new Date('2026-01-08T09:00:00.000Z'),
    lastWatered: new Date(),
  },
  {
    id: 'plant-2',
    name: 'Lettuce',
    gardenId: '1',
    image: '/images/plants/lettuce.svg',
    healthStatus: 'healthy' as const,
    species: 'Lactuca sativa',
    plantedDate: new Date('2026-01-19T09:00:00.000Z'),
    lastWatered: new Date(),
  },
  {
    id: 'plant-3',
    name: 'Basil',
    gardenId: '2',
    image: '/images/plants/basil.svg',
    healthStatus: 'needs-attention' as const,
    species: 'Ocimum basilicum',
    plantedDate: new Date('2026-02-01T09:00:00.000Z'),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 28),
  },
  {
    id: 'plant-4',
    name: 'Mint',
    gardenId: '2',
    image: '/images/plants/mint.svg',
    healthStatus: 'healthy' as const,
    species: 'Mentha spicata',
    plantedDate: new Date('2026-02-06T09:00:00.000Z'),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 'plant-5',
    name: 'Spinach',
    gardenId: '1',
    image: '/images/plants/spinach.svg',
    healthStatus: 'critical' as const,
    species: 'Spinacia oleracea',
    plantedDate: new Date('2026-02-12T09:00:00.000Z'),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 40),
  },
  {
    id: 'plant-6',
    name: 'Bell Pepper',
    gardenId: '1',
    image: '/images/plants/pepper.svg',
    healthStatus: 'healthy' as const,
    species: 'Capsicum annuum',
    plantedDate: new Date('2026-02-17T09:00:00.000Z'),
    lastWatered: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

function buildSensorReadings() {
  const now = Date.now();
  const readings = [] as Array<{
    plantId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lightLevel: number;
    timestamp: Date;
  }>;

  for (const plant of seedPlants) {
    for (let i = 11; i >= 0; i--) {
      readings.push({
        plantId: plant.id,
        temperature: 21 + (i % 3),
        humidity: 52 + (i % 7),
        soilMoisture: Math.max(25, 70 - i * 3),
        lightLevel: 420 + i * 20,
        timestamp: new Date(now - i * 1000 * 60 * 20),
      });
    }
  }

  return readings;
}

const seedAlerts = [
  {
    type: 'watering' as const,
    severity: 'medium' as const,
    message: 'Basil moisture dropped below threshold.',
    plantId: 'plant-3',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    type: 'disease' as const,
    severity: 'high' as const,
    message: 'Spinach leaf pattern suggests powdery mildew.',
    plantId: 'plant-5',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    type: 'system' as const,
    severity: 'low' as const,
    message: 'Irrigation schedule synced successfully.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    type: 'nutrient' as const,
    severity: 'medium' as const,
    message: 'Lettuce may benefit from nitrogen-rich feed this week.',
    plantId: 'plant-2',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 65),
    updatedAt: new Date(Date.now() - 1000 * 60 * 65),
  },
];

const seedIrrigationCycles = [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    amount: 450,
    duration: 45,
    mode: 'automated' as const,
    status: 'completed' as const,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 34),
    amount: 500,
    duration: 50,
    mode: 'manual' as const,
    status: 'completed' as const,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 58),
    amount: 400,
    duration: 40,
    mode: 'automated' as const,
    status: 'completed' as const,
  },
];

const seedDiseaseReports = [
  {
    plantId: 'plant-5',
    imageUrl: '/images/greenguard/analyzed-leaf.svg',
    diseaseName: 'Powdery Mildew',
    confidence: 0.76,
    recommendations: ['Prune infected leaves', 'Improve airflow', 'Avoid overhead watering'],
    status: 'analyzed' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 170),
    updatedAt: new Date(Date.now() - 1000 * 60 * 170),
  },
  {
    plantId: 'plant-1',
    imageUrl: '/images/greenguard/analyzed-leaf.svg',
    diseaseName: 'Healthy',
    confidence: 0.98,
    recommendations: ['Continue regular care'],
    status: 'analyzed' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 420),
    updatedAt: new Date(Date.now() - 1000 * 60 * 420),
  },
];

async function seedCollections() {
  if (await PlantModel.countDocuments() === 0) {
    await PlantModel.insertMany(seedPlants);
  }

  if (await SensorReadingModel.countDocuments() === 0) {
    await SensorReadingModel.insertMany(buildSensorReadings());
  }

  if (await AlertModel.countDocuments() === 0) {
    await AlertModel.insertMany(seedAlerts);
  }

  if (await IrrigationCycleModel.countDocuments() === 0) {
    await IrrigationCycleModel.insertMany(seedIrrigationCycles);
  }

  if (await IrrigationSettingsModel.countDocuments() === 0) {
    await IrrigationSettingsModel.create({
      mode: 'manual',
      irrigationAmount: 500,
      soilMoistureThreshold: 40,
    });
  }

  if (await DiseaseReportModel.countDocuments() === 0) {
    await DiseaseReportModel.insertMany(seedDiseaseReports);
  }
}

export async function seedDatabaseIfEmpty() {
  await connectDB();
  await seedCollections();
}

export async function reseedDatabase() {
  await connectDB();

  await Promise.all([
    PlantModel.deleteMany({}),
    SensorReadingModel.deleteMany({}),
    AlertModel.deleteMany({}),
    IrrigationCycleModel.deleteMany({}),
    IrrigationSettingsModel.deleteMany({}),
    DiseaseReportModel.deleteMany({}),
  ]);

  await seedCollections();
}
