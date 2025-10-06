import { NextResponse } from 'next/server';
import { getAtRiskStations } from '@/lib/db/queries';

export async function GET() {
  try {
    const stations = getAtRiskStations(3);

    return NextResponse.json({
      stations
    });
  } catch (error) {
    console.error('Failed to get at-risk stations:', error);
    return NextResponse.json(
      { error: 'Failed to get at-risk stations' },
      { status: 500 }
    );
  }
}
