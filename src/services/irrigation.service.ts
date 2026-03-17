import { IrrigationRepository } from '@/repositories/irrigation.repo';
import { IrrigationCycle, IrrigationStatus, IrrigationSettings } from '@/types';

export class IrrigationService {
  private repo: IrrigationRepository;

  constructor() {
    this.repo = new IrrigationRepository();
  }

  async getSettings(): Promise<IrrigationSettings> {
    return this.repo.getSettings();
  }

  async updateSettings(data: Partial<IrrigationSettings>): Promise<IrrigationSettings> {
    return this.repo.updateSettings(data);
  }

  /**
   * Triggers a new irrigation cycle.
   * State Machine Logic:
   * 1. Check if system is in COOLDOWN (prevent flooding).
   * 2. If valid, log 'completed' cycle.
   * 3. Update simulated moisture state.
   */
  async triggerIrrigation(amount: number, mode: 'automated' | 'manual' = 'manual'): Promise<{ success: boolean; message: string }> {
    const lastCycle = await this.repo.getLastCycle();
    
    // Cooldown rule: 30 minutes between waterings
    if (lastCycle) {
      const diffMinutes = (new Date().getTime() - new Date(lastCycle.timestamp).getTime()) / (1000 * 60);
      if (diffMinutes < 30) {
        return { 
          success: false, 
          message: `System in cooldown. Wait ${Math.ceil(30 - diffMinutes)} minutes.` 
        };
      }
    }

    // Persist new cycle
    await this.repo.logCycle({
      timestamp: new Date(),
      amount,
      duration: amount / 10, // Simulate 10ml/sec flow rate
      mode,
      status: 'completed'
    });

    return { success: true, message: `Successfully dispensed ${amount}ml.` };
  }

  async getHistory(): Promise<IrrigationCycle[]> {
    return this.repo.getHistory();
  }

  /**
   * Simulates current moisture status based on last watering time.
   * Logic: Moisture decays by 5% per hour. Watering boosts it to 100%.
   */
  async getStatus(): Promise<IrrigationStatus> {
    const lastCycle = await this.repo.getLastCycle();
    let moisture = 20; // Default dry base

    if (lastCycle) {
      const hoursSince = (new Date().getTime() - new Date(lastCycle.timestamp).getTime()) / (1000 * 60 * 60);
      const decay = hoursSince * 5; // 5% loss per hour
      moisture = Math.max(20, 100 - decay);
    }

    let status: 'dry' | 'moist' | 'wet' = 'moist';
    let message = 'Soil moisture is optimal.';

    if (moisture < 30) {
      status = 'dry';
      message = 'Soil is dry. Watering needed.';
    } else if (moisture > 80) {
      status = 'wet';
      message = 'Soil is saturated.';
    }

    return {
      currentMoisture: Math.round(moisture),
      status,
      statusMessage: message,
      nextCheckIn: 15 // Mock check-in interval
    };
  }
}
