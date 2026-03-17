import { NextResponse } from 'next/server';
import { GrowGuideService } from '@/services/growguide.service';

const service = new GrowGuideService();

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const recommendations = await service.getRecommendations(input);
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
