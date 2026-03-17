export interface Reminder {
  id: string;
  plantId: string;
  plantName: string;
  type: 'watering' | 'pest-check' | 'fertilizing' | 'harvest';
  message: string;
  dueDate: string;
}
