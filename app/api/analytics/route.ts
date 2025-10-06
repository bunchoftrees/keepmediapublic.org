import { NextRequest, NextResponse } from 'next/server';
import { trackImpression, trackClick } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, organizationId, slot, clickType, userRegion } = body;

    if (!organizationId || !slot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'impression') {
      await trackImpression(organizationId, slot, userRegion);
    } else if (type === 'click') {
      if (!clickType) {
        return NextResponse.json(
          { error: 'Click type required' },
          { status: 400 }
        );
      }
      await trackClick(organizationId, clickType, slot, userRegion);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track' },
      { status: 500 }
    );
  }
}
