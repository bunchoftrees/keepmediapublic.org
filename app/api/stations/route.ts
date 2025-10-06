import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOrganizations,
  getOrganizationsByState,
  getOrganizationsByRiskTier,
  findNearestStations,
  type Organization
} from '@/lib/db/queries';

interface StationResponse extends Organization {
  distance?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const solidarityOnly = searchParams.get('solidarity') === 'true';

  try {
    if (solidarityOnly) {
      // Get high-dependency stations for solidarity cards
      // We'll combine Critical and High risk tiers and randomly select 3
      const criticalStations = await getOrganizationsByRiskTier('Critical');
      const highStations = await getOrganizationsByRiskTier('High');
      const allHighRisk = [...criticalStations, ...highStations];

      // Shuffle and take 3
      const shuffled = allHighRisk.sort(() => Math.random() - 0.5);
      const stations = shuffled.slice(0, 3);

      return NextResponse.json({ stations });
    }

    if (lat && lon) {
      // Get nearest stations
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);
      const nearest = await findNearestStations(userLat, userLon, 20);

      // Separate TV and Radio (for now all are TV, but keeping logic for future)
      const tvStations = nearest.filter(s => s.station_type === 'TV');
      const radioStations = nearest.filter(s => s.station_type === 'Radio');

      return NextResponse.json({
        nearestTV: tvStations[0] || null,
        nearestRadio: radioStations[0] || null,
        allStations: nearest
      });
    }

    if (state) {
      // Get stations for a specific state
      const stations = await getOrganizationsByState(state);
      return NextResponse.json({ stations });
    }

    // Get all stations
    const stations = await getAllOrganizations();
    return NextResponse.json({ stations });

  } catch (error) {
    console.error('Stations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
