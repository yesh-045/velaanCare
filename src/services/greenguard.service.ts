import { DiseaseReport } from '@/types';
import { DiseaseReportModel } from '@/db/models/DiseaseReport.model';
import { ensureDatabaseBootstrap } from '@/db/bootstrap';

// Mock AI Service Logic - In production this would call Python/TensorFlow
export class GreenGuardService {
  async analyzeImage(file: File): Promise<DiseaseReport> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple deterministic rule for demo: 
    // Randomly assign 'Healthy', 'Blight', or 'Mildew' based on filename length
    const diseases = [
      { name: 'Healthy', confidence: 0.98, recommendations: ['Continue regular care'] },
      { name: 'Late Blight', confidence: 0.89, recommendations: ['Isolate plant', 'Apply fungicide', 'Reduce humidity'] },
      { name: 'Powdery Mildew', confidence: 0.75, recommendations: ['Remove infected leaves', 'Improve airflow', 'Avoid overhead watering'] }
    ];

    const result = diseases[Math.floor(Math.random() * diseases.length)];

    await ensureDatabaseBootstrap();
    const report = await DiseaseReportModel.create({
      imageUrl: '/images/greenguard/analyzed-leaf.svg',
      diseaseName: result.name,
      confidence: result.confidence,
      recommendations: result.recommendations,
      status: 'analyzed'
    });

    return report.toObject();
  }

  async getReportHistory(): Promise<DiseaseReport[]> {
    await ensureDatabaseBootstrap();
    const reports = await DiseaseReportModel.find({})
      .sort({ createdAt: -1 })
      .limit(20);
    return reports.map(doc => doc.toObject());
  }
}
