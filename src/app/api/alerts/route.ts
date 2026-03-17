import { NextResponse } from 'next/server';
import { AlertRepository } from '@/repositories/alert.repo';

const repo = new AlertRepository();

export async function GET() {
  try {
    const alerts = await repo.getActiveAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    const success = await repo.markAsRead(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
