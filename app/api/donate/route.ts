import { NextRequest, NextResponse } from 'next/server';
import { getOrganization, trackClick } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stationId = searchParams.get('station_id');
  const slot = searchParams.get('slot') || 'local';
  const userRegion = searchParams.get('region') || undefined;

  if (!stationId) {
    return NextResponse.json(
      { error: 'Missing station_id parameter' },
      { status: 400 }
    );
  }

  try {
    // Get organization
    const organization = await getOrganization(stationId);

    if (!organization || !organization.website_url) {
      return NextResponse.json(
        { error: 'Station not found or no website URL available' },
        { status: 404 }
      );
    }

    // Log the click
    await trackClick(stationId, 'donate', slot, userRegion);

    // Redirect to station's website (which should have donation info)
    return NextResponse.redirect(organization.website_url);
  } catch (error) {
    console.error('Donate redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation redirect' },
      { status: 500 }
    );
  }
}
