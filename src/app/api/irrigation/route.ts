import { NextResponse } from 'next/server';
import { IrrigationService } from '@/services/irrigation.service';

const service = new IrrigationService();

export async function POST(request: Request) {
  try {
    const { amount, mode } = await request.json();
    const result = await service.triggerIrrigation(amount, mode);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 429 }); // Too Many Requests (Cooldown)
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger irrigation' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const settings = await service.updateSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const history = await service.getHistory();
    const status = await service.getStatus();
    const settings = await service.getSettings();
    
    return NextResponse.json({ history, status, settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch irrigation data' }, { status: 500 });
  }
}
