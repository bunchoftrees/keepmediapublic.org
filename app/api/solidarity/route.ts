import { NextRequest, NextResponse } from 'next/server';
import { getAtRiskStations, trackImpression } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userRegion = searchParams.get('region') || undefined;

  try {
    // Get 3 at-risk stations using weighted selection algorithm
    const stations = await getAtRiskStations(3);

    if (stations.length === 0) {
      return NextResponse.json({ stations: [] });
    }

    // Track impressions for each station
    await Promise.all(
      stations.map(station =>
        trackImpression(station.id, 'at-risk', userRegion)
      )
    );

    return NextResponse.json({ stations });
  } catch (error) {
    console.error('Solidarity stations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solidarity stations' },
      { status: 500 }
    );
  }
}
