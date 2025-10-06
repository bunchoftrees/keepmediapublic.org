'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Station {
  id: number;
  call_sign: string;
  name: string;
  station_type: string;
  city: string;
  state: string;
}

export default function LocalStationsBar() {
  const [tvStation, setTvStation] = useState<Station | null>(null);
  const [radioStation, setRadioStation] = useState<Station | null>(null);
  const [location, setLocation] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('localStations');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setTvStation(data.tv);
        setRadioStation(data.radio);
        setLocation(data.location);
        setIsVisible(true);
      } catch (e) {
        console.error('Failed to parse stored stations:', e);
      }
    }

    // Listen for updates
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ tv: Station; radio: Station; location: string }>;
      const { tv, radio, location } = customEvent.detail;
      setTvStation(tv);
      setRadioStation(radio);
      setLocation(location);
      setIsVisible(true);

      // Save to localStorage
      localStorage.setItem('localStations', JSON.stringify({ tv, radio, location }));
    };

    window.addEventListener('localStationsUpdate', handleUpdate);
    return () => window.removeEventListener('localStationsUpdate', handleUpdate);
  }, []);

  if (!isVisible || (!tvStation && !radioStation)) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">📍 {location}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {radioStation && (
              <div className="flex items-center gap-2">
                <span className="text-sm">📻</span>
                <Link
                  href={`/stations/${radioStation.id}`}
                  className="font-medium text-blue-700 hover:text-blue-900 text-sm"
                >
                  {radioStation.call_sign}
                </Link>
                <a
                  href={`/api/donate?station_id=${radioStation.id}&slot=local&region=${location}`}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors"
                >
                  Donate
                </a>
              </div>
            )}
            {tvStation && (
              <div className="flex items-center gap-2">
                <span className="text-sm">📺</span>
                <Link
                  href={`/stations/${tvStation.id}`}
                  className="font-medium text-blue-700 hover:text-blue-900 text-sm"
                >
                  {tvStation.call_sign}
                </Link>
                <a
                  href={`/api/donate?station_id=${tvStation.id}&slot=local&region=${location}`}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors"
                >
                  Donate
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
