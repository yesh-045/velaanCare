import { NextResponse } from 'next/server';
import { GreenGuardService } from '@/services/greenguard.service';

const service = new GreenGuardService();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const report = await service.analyzeImage(file);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const history = await service.getReportHistory();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
