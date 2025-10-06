import { NextRequest, NextResponse } from 'next/server';
import { getOrganization } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug parameter' },
      { status: 400 }
    );
  }

  try {
    // Get organization by slug (or ID for backwards compatibility)
    const station = await getOrganization(slug);

    if (!station) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ station });
  } catch (error) {
    console.error('Station detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch station details' },
      { status: 500 }
    );
  }
}
