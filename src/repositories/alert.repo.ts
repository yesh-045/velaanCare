import { ensureDatabaseBootstrap } from '@/db/bootstrap';
import { AlertModel } from '@/db/models/Alert.model';
import { Alert } from '@/types';

export class AlertRepository {
  async createAlert(data: Omit<Alert, '_id'>): Promise<Alert> {
    await ensureDatabaseBootstrap();
    const alert = await AlertModel.create(data);
    return alert.toObject();
  }

  async getActiveAlerts(limit: number = 50): Promise<Alert[]> {
    await ensureDatabaseBootstrap();
    const alerts = await AlertModel.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(limit);
    return alerts.map(doc => doc.toObject());
  }

  async markAsRead(id: string): Promise<boolean> {
    await ensureDatabaseBootstrap();
    const result = await AlertModel.updateOne(
      { _id: id },
      { $set: { isRead: true } }
    );
    return result.modifiedCount > 0;
  }
}
