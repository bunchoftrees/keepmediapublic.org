import { NextRequest, NextResponse } from 'next/server';
import { searchOrganizations } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const callSign = searchParams.get('call_sign');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Support both 'q' (general search) and 'call_sign' (specific search)
  const searchQuery = q || callSign;

  if (!searchQuery) {
    return NextResponse.json(
      { error: 'Missing search parameter (q or call_sign)' },
      { status: 400 }
    );
  }

  try {
    // Search across station names, call signs, cities, and states
    const stations = searchOrganizations(searchQuery, limit);

    // For backwards compatibility with call_sign parameter, return single station
    if (callSign && !q) {
      return NextResponse.json({ station: stations[0] || null });
    }

    return NextResponse.json({ stations });
  } catch (error) {
    console.error('Station search error:', error);
    return NextResponse.json(
      { error: 'Failed to search for stations' },
      { status: 500 }
    );
  }
}
