'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';
import type { Organization } from '@/lib/db/queries';

interface StationCardProps {
  station: Organization;
  slot: 'local' | 'solidarity' | 'at-risk';
  userRegion?: string;
}

const riskColors = {
  Critical: 'bg-red-100 text-red-900 border-red-400',
  High: 'bg-orange-100 text-orange-900 border-orange-400',
  Moderate: 'bg-yellow-100 text-yellow-900 border-yellow-400',
  Stable: 'bg-green-100 text-green-900 border-green-400',
};

const stationTypeColors = {
  TV: 'bg-blue-100 text-blue-900 border-blue-400',
  Radio: 'bg-amber-100 text-amber-900 border-amber-400',
  Both: 'bg-purple-100 text-purple-900 border-purple-400',
};

const stationTypeEmoji = {
  TV: '📺',
  Radio: '📻',
  Both: '📺📻',
};

export default function StationCard({ station, slot, userRegion }: StationCardProps) {
  // Track impression when card is shown
  useEffect(() => {
    // Track in Supabase (for weighted algorithm)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'impression',
        organizationId: station.id,
        slot,
        userRegion,
      }),
    }).catch(err => console.error('Analytics tracking failed:', err));

    // Track in Vercel Analytics
    track('station_impression', {
      stationId: station.id,
      stationName: station.station_name,
      slot,
      riskTier: station.risk_tier || 'unknown',
      userRegion: userRegion || 'unknown',
    });
  }, [station.id, station.station_name, station.risk_tier, slot, userRegion]);

  const handleDonate = () => {
    // Track donate click in Supabase
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'click',
        organizationId: station.id,
        clickType: 'donate',
        slot,
        userRegion,
      }),
    }).catch(err => console.error('Analytics tracking failed:', err));

    // Track in Vercel Analytics
    track('station_click', {
      stationId: station.id,
      stationName: station.station_name,
      clickType: 'donate',
      slot,
      riskTier: station.risk_tier || 'unknown',
      userRegion: userRegion || 'unknown',
    });

    const params = new URLSearchParams({
      station_id: station.id,
      slot,
      ...(userRegion && { region: userRegion }),
    });
    window.location.href = `/api/donate?${params}`;
  };

  const handleCardClick = () => {
    // Track detail page click in Supabase
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'click',
        organizationId: station.id,
        clickType: 'detail',
        slot,
        userRegion,
      }),
    }).catch(err => console.error('Analytics tracking failed:', err));

    // Track in Vercel Analytics
    track('station_click', {
      stationId: station.id,
      stationName: station.station_name,
      clickType: 'detail',
      slot,
      riskTier: station.risk_tier || 'unknown',
      userRegion: userRegion || 'unknown',
    });

    window.location.href = `/stations/${station.slug}`;
  };

  // Display branding if available, otherwise station name
  const displayName = station.branding || station.station_name;

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{displayName}</h3>
          <p className="text-sm text-gray-600">
            {station.primary_call_sign} • {station.state_name}
          </p>
          {station.transmitter_count > 1 ? (
            <p className="text-xs text-gray-500">
              {station.transmitter_count} transmitters
              {station.coverage_population && ` • ~${(station.coverage_population / 1000).toFixed(0)}k viewers`}
            </p>
          ) : (
            <p className="text-xs text-gray-500 invisible">Spacing</p>
          )}
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded border whitespace-nowrap ml-2 ${stationTypeColors[station.station_type as keyof typeof stationTypeColors]}`}>
          {stationTypeEmoji[station.station_type as keyof typeof stationTypeEmoji]} {station.station_type}
        </span>
      </div>

      <div className="mb-4">
        {station.risk_tier && (
          <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${riskColors[station.risk_tier as keyof typeof riskColors]}`}>
            Risk: {station.risk_tier}
          </div>
        )}
        {station.cpb_dependency_pct !== null && (
          <p className="text-xs text-gray-500 mt-2">
            {station.cpb_dependency_pct.toFixed(1)}% CPB dependent
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDonate();
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Donate Now
      </button>
    </div>
  );
}
