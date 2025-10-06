import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if ZIP code is provided as a query param
    const zipParam = request.nextUrl.searchParams.get('zip');
    if (zipParam) {
      // Use zippopotam.us free API to look up ZIP code
      const zipResponse = await fetch(`https://api.zippopotam.us/us/${zipParam}`);
      if (zipResponse.ok) {
        const zipData = await zipResponse.json();
        const place = zipData.places[0];
        return NextResponse.json({
          city: place['place name'],
          region: place['state'],
          region_code: place['state abbreviation'],
          country: 'US',
          postal: zipParam,
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          timezone: 'America/New_York', // Default timezone
        });
      } else {
        throw new Error(`ZIP code ${zipParam} not found`);
      }
    }

    // Get IP from headers (handles proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');

    // If we have a local/private IP, use ipapi.co without an IP parameter
    // which will automatically detect the server's public IP
    const isLocalIP = !ip || ip === '127.0.0.1' || ip === '::1' ||
                      ip.startsWith('192.168.') || ip.startsWith('10.') ||
                      ip.startsWith('172.16.') || ip.startsWith('172.17.') ||
                      ip.startsWith('172.18.') || ip.startsWith('172.19.') ||
                      ip.startsWith('172.20.') || ip.startsWith('172.21.') ||
                      ip.startsWith('172.22.') || ip.startsWith('172.23.') ||
                      ip.startsWith('172.24.') || ip.startsWith('172.25.') ||
                      ip.startsWith('172.26.') || ip.startsWith('172.27.') ||
                      ip.startsWith('172.28.') || ip.startsWith('172.29.') ||
                      ip.startsWith('172.30.') || ip.startsWith('172.31.');

    // Call ipapi.co for geolocation
    // If we have a local IP, omit the IP from the URL to let ipapi.co detect the public IP
    const apiUrl = isLocalIP ? 'https://ipapi.co/json/' : `https://ipapi.co/${ip}/json/`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Keep Media Public/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Geolocation API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`ipapi.co error: ${data.reason}`);
    }

    return NextResponse.json({
      city: data.city,
      region: data.region,
      region_code: data.region_code,
      country: data.country_code,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    });
  } catch (error) {
    console.error('Geolocation error:', error);
    // Return central US location on error
    return NextResponse.json({
      city: 'Chicago',
      region: 'Illinois',
      region_code: 'IL',
      country: 'US',
      postal: '60601',
      latitude: 41.8781,
      longitude: -87.6298,
      timezone: 'America/Chicago',
    });
  }
}
