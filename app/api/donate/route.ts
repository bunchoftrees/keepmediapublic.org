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

    // Build URL with UTM parameters
    const redirectUrl = new URL(organization.website_url);
    redirectUrl.searchParams.set('utm_source', 'keepmediapublic');
    redirectUrl.searchParams.set('utm_medium', 'referral');
    redirectUrl.searchParams.set('utm_campaign', 'station_support');
    redirectUrl.searchParams.set('utm_content', slot);
    if (userRegion) {
      redirectUrl.searchParams.set('utm_term', userRegion);
    }

    // Redirect to station's website with UTM parameters
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Donate redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation redirect' },
      { status: 500 }
    );
  }
}
