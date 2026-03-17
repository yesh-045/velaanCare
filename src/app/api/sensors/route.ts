import { NextResponse } from 'next/server';
import { SensorRepository } from '@/repositories/sensor.repo';

const repo = new SensorRepository();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reading = await repo.addReading({
      ...body,
      timestamp: new Date()
    });
    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add sensor reading' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('plantId');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!plantId) {
      return NextResponse.json({ error: 'plantId is required' }, { status: 400 });
    }

    const readings = await repo.getHistory(plantId, limit);
    return NextResponse.json(readings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sensor history' }, { status: 500 });
  }
}
