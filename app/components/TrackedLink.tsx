'use client';

import { track } from '@vercel/analytics';

interface TrackedLinkProps {
  stationId: string;
  stationWebsite: string;
  clickType: 'donate' | 'visit';
  slot?: string;
  userRegion?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TrackedLink({
  stationId,
  stationWebsite,
  clickType,
  slot = 'detail',
  userRegion,
  children,
  className,
}: TrackedLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Track the click in Supabase
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'click',
          organizationId: stationId,
          clickType,
          slot,
          userRegion,
        }),
      });
    } catch (err) {
      console.error('Analytics tracking failed:', err);
    }

    // Track in Vercel Analytics
    track('station_click', {
      stationId,
      clickType,
      slot,
      userRegion: userRegion || 'unknown',
    });

    // Build URL with UTM parameters
    const url = new URL(stationWebsite);
    url.searchParams.set('utm_source', 'keepmediapublic');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'station_support');
    url.searchParams.set('utm_content', `${slot}_${clickType}`);
    if (userRegion) {
      url.searchParams.set('utm_term', userRegion);
    }

    // Open in new tab
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={stationWebsite}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
