'use client';

import { useEffect, useState } from 'react';
import StationCard from './components/StationCard';
import Link from 'next/link';
import type { Organization, Quote } from '@/lib/db/queries';
import { getRandomQuote } from '@/lib/db/queries';

interface StationWithDistance extends Organization {
  distance?: number;
}

export default function Home() {
  const [nearbyStations, setNearbyStations] = useState<StationWithDistance[]>([]);
  const [atRiskStations, setAtRiskStations] = useState<Organization[]>([]);
  const [solidarityStations, setSolidarityStations] = useState<Organization[]>([]);
  const [userRegion, setUserRegion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [zipInput, setZipInput] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    loadStations();
    loadQuote();
  }, []);

  async function loadQuote() {
    const randomQuote = await getRandomQuote();
    if (randomQuote) {
      setQuote(randomQuote);
    }
  }

  async function loadStations() {
    try {
      // Get user location
      const geoResponse = await fetch('/api/geolocate');
      const geoData = await geoResponse.json();
      const regionCode = geoData.region_code || '';
      setUserRegion(regionCode);
      // Store region in localStorage for UTM params
      if (regionCode) {
        localStorage.setItem('userRegion', regionCode);
      }

      // Get nearest stations by lat/lon (get top 3 within 100 miles)
      if (geoData.latitude && geoData.longitude) {
        const localResponse = await fetch(
          `/api/stations?lat=${geoData.latitude}&lon=${geoData.longitude}`
        );
        const localData = await localResponse.json();

        // Get all stations within 100 miles, up to 3 stations
        const nearby = (localData.allStations || [])
          .filter((s: StationWithDistance) => s.distance && s.distance <= 100)
          .slice(0, 4);

        setNearbyStations(nearby);
      }

      // Get at-risk stations (weighted fair selection)
      const atRiskResponse = await fetch('/api/at-risk');
      const atRiskData = await atRiskResponse.json();
      setAtRiskStations(atRiskData.stations || []);

      // Get solidarity stations with weighted selection
      const solidarityResponse = await fetch(`/api/solidarity?region=${regionCode}`);
      const solidarityData = await solidarityResponse.json();
      setSolidarityStations(solidarityData.stations || []);
    } catch (error) {
      console.error('Failed to load stations:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput || zipInput.trim().length === 0) {
      alert('Please enter a ZIP code or station call sign');
      return;
    }

    const input = zipInput.trim().toUpperCase();

    // Check if it's a call sign (letters) or ZIP code (numbers)
    const isCallSign = /^[A-Z]{3,6}(-[A-Z]{2})?$/.test(input);
    const isZipCode = /^\d{5}$/.test(input);

    if (isCallSign) {
      // Search for station by call sign and redirect to detail page
      try {
        const response = await fetch(`/api/stations/search?call_sign=${input}`);
        const data = await response.json();

        if (data.station) {
          window.location.href = `/stations/${data.station.id}`;
          return;
        } else {
          alert(`Station "${input}" not found. Try searching for your ZIP code instead.`);
          return;
        }
      } catch (error) {
        console.error('Failed to search station:', error);
        alert('Could not find that station. Please try again.');
        return;
      }
    } else if (!isZipCode) {
      alert('Please enter a valid 5-digit ZIP code or station call sign (e.g., WGBH)');
      return;
    }

    // Handle ZIP code search
    setLoading(true);
    try {
      // Get location from ZIP
      const geoResponse = await fetch(`/api/geolocate?zip=${input}`);
      const geoData = await geoResponse.json();
      const regionCode = geoData.region_code || '';
      setUserRegion(regionCode);
      // Store region in localStorage for UTM params
      if (regionCode) {
        localStorage.setItem('userRegion', regionCode);
      }

      // Get nearest stations by lat/lon (get top 5 within 100 miles)
      if (geoData.latitude && geoData.longitude) {
        const localResponse = await fetch(
          `/api/stations?lat=${geoData.latitude}&lon=${geoData.longitude}`
        );
        const localData = await localResponse.json();

        // Get all stations within 100 miles, up to 5 stations
        const nearby = (localData.allStations || [])
          .filter((s: StationWithDistance) => s.distance && s.distance <= 100)
          .slice(0, 5);

        setNearbyStations(nearby);
      }

      // Get at-risk stations
      const atRiskResponse = await fetch('/api/at-risk');
      const atRiskData = await atRiskResponse.json();
      setAtRiskStations(atRiskData.stations || []);

      // Get solidarity stations
      const solidarityResponse = await fetch(`/api/solidarity?region=${regionCode}`);
      const solidarityData = await solidarityResponse.json();
      setSolidarityStations(solidarityData.stations || []);
    } catch (error) {
      console.error('Failed to load stations:', error);
      alert('Could not find location for that ZIP code. Please try another.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your local station...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Keep Media Public</h1>
              <p className="text-gray-600 mt-2">Support public media stations navigating the loss of federal funding</p>
            </div>
            {quote && (
              <div className="hidden md:block max-w-md border-l-4 border-blue-500 pl-4">
                <blockquote className="text-gray-700 italic">
                  &ldquo;{quote.quote_text}&rdquo;
                </blockquote>
                <p className="text-sm text-gray-600 mt-2">
                  — {quote.person}, <span className="font-medium">{quote.show_or_role}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ZIP Input */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <form onSubmit={handleZipSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter ZIP code or station call sign (e.g., WGBH)"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Find Stations
            </button>
          </form>
        </div>

        {/* Nearest Station - Featured */}
        {nearbyStations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Nearest Station</h2>
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  

                </h3>
                {nearbyStations[0].distance && (
                  <span className="text-xs text-gray-500">
                    {Math.round(nearbyStations[0].distance)} mi away
                  </span>
                )}
              </div>
              <StationCard station={nearbyStations[0]} slot="local" userRegion={userRegion} />
            </div>
          </section>
        )}

        {/* Solidarity Stations */}
        {solidarityStations.length > 0 && (
          <section className="mb-12">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Stations That Need Your Help</h2>
              <p className="text-gray-600 mt-1">
                These stations relied heavily on CPB funding and need community support to survive
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solidarityStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  slot="solidarity"
                  userRegion={userRegion}
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Nearby Stations */}
        {nearbyStations.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Other Nearby Stations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyStations.slice(1).map((station) => (
                <div key={station.id}>
                  <div className="flex items-center justify-end mb-2">
                    {station.distance && (
                      <span className="text-xs text-gray-500">
                        {Math.round(station.distance)} mi away
                      </span>
                    )}
                  </div>
                  <StationCard station={station} slot="local" userRegion={userRegion} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Link */}
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Learn about our methodology →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Keep Media Public is a community project to support public broadcasting</p>
        </div>
      </footer>
    </div>
  );
}
