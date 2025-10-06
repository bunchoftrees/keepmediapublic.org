'use client';

import { useEffect, useState } from 'react';
import type { Organization } from '@/lib/db/queries';

interface StationWithDistance extends Organization {
  distance?: number;
}

export default function GlobalBanner() {
  const [nearestStation, setNearestStation] = useState<StationWithDistance | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showZipPrompt, setShowZipPrompt] = useState(false);
  const [zipInput, setZipInput] = useState('');

  useEffect(() => {
    loadNearestStation();
  }, []);

  async function loadNearestStation(zip?: string) {
    try {
      // Check if we have a stored ZIP code in sessionStorage
      const storedZip = sessionStorage.getItem('userZip');
      const zipToUse = zip || storedZip;

      // Get user location
      const geoUrl = zipToUse ? `/api/geolocate?zip=${zipToUse}` : '/api/geolocate';
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      const locationName = geoData.city && geoData.region ? `${geoData.city}, ${geoData.region_code}` : geoData.region_code || '';

      // If geolocation failed and we don't have a stored ZIP, show prompt
      if (!geoData.latitude && !zipToUse) {
        setShowZipPrompt(true);
        setLoading(false);
        return;
      }

      setUserLocation(locationName);

      // Get nearest station
      if (geoData.latitude && geoData.longitude) {
        const localResponse = await fetch(
          `/api/stations?lat=${geoData.latitude}&lon=${geoData.longitude}`
        );
        const localData = await localResponse.json();

        const nearest = (localData.allStations || [])
          .filter((s: StationWithDistance) => s.distance && s.distance <= 100)
          .slice(0, 1)[0];

        setNearestStation(nearest || null);

        // If we got a valid result with a ZIP, store it
        if (nearest && zipToUse) {
          sessionStorage.setItem('userZip', zipToUse);
        }
      }
    } catch (error) {
      console.error('Failed to load nearest station:', error);
      // Show ZIP prompt if geolocation failed
      if (!sessionStorage.getItem('userZip')) {
        setShowZipPrompt(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    const zip = zipInput.trim();

    if (!/^\d{5}$/.test(zip)) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    setShowZipPrompt(false);
    setLoading(true);
    await loadNearestStation(zip);
  }

  // Show ZIP prompt modal if geolocation failed
  if (showZipPrompt) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowZipPrompt(false)} />

        {/* Modal */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Find Your Local Station</h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t detect your location automatically. Please enter your ZIP code to find your nearest public media station.
          </p>
          <form onSubmit={handleZipSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter ZIP code"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Find
            </button>
          </form>
          <button
            onClick={() => setShowZipPrompt(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip for now
          </button>
        </div>
      </>
    );
  }

  // Don't show banner if loading or no station found
  if (loading || !nearestStation || !userLocation) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 bg-blue-50 border-b border-blue-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              📍 {userLocation} • Your local station: <span className="font-bold">{nearestStation.branding || nearestStation.station_name}</span>
              {nearestStation.distance && (
                <span className="text-blue-700 ml-1">
                  ({Math.round(nearestStation.distance)} mi)
                </span>
              )}
            </p>
          </div>
          <a
            href={nearestStation.website_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors whitespace-nowrap text-sm"
          >
            Donate to {nearestStation.branding || nearestStation.primary_call_sign}
          </a>
        </div>
      </div>
    </div>
  );
}
