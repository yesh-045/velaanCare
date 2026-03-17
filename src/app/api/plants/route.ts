import { NextResponse } from 'next/server';
import { PlantRepository } from '@/repositories/plant.repo';

const repo = new PlantRepository();

export async function GET() {
  try {
    const plants = await repo.findAll();
    return NextResponse.json(plants);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plant = await repo.create(body);
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 });
  }
}
