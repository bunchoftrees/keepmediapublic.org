import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrganization } from '@/lib/db/queries';
import type { OrganizationWithTransmitters } from '@/lib/db/queries';

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

const riskDescriptions = {
  Critical: 'Station survival uncertain without immediate community support',
  High: 'Significant service cuts or closures likely',
  Moderate: 'Major restructuring required',
  Stable: 'Better positioned with diverse funding sources',
};

export default async function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const org = await getOrganization(id);

  if (!org) {
    notFound();
  }

  // Calculate display values
  const displayName = org.branding || org.station_name;
  const cpbDependency = org.cpb_dependency_pct || 0;

  // Get primary transmitter for location display
  const primaryTransmitter = org.transmitters.find(t => t.call_sign === org.primary_call_sign) || org.transmitters[0];
  const cityState = primaryTransmitter?.city
    ? `${primaryTransmitter.city}, ${org.state}`
    : org.state_name;

  // TODO: Sister stations - would need to add licensee_name to organizations table
  // const sisterStations: OrganizationWithTransmitters[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
        {/* Station Header */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {org.station_type === 'TV' ? '📺' : '📻'}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              </div>
              <p className="text-lg text-gray-600">
                {org.primary_call_sign} • {cityState}
              </p>
              {org.transmitter_count > 1 && (
                <p className="text-sm text-gray-500 mt-1">
                  {org.transmitter_count} transmitters
                  {org.coverage_population && ` • ~${(org.coverage_population / 1000).toFixed(0)}k viewers`}
                </p>
              )}
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded border h-fit ${stationTypeColors[org.station_type as keyof typeof stationTypeColors]}`}>
              {stationTypeEmoji[org.station_type as keyof typeof stationTypeEmoji]} {org.station_type}
            </span>
          </div>

          {/* Risk Tier */}
          {org.risk_tier && (
            <div className={`inline-flex items-center px-4 py-2 rounded-md text-base font-medium border ${riskColors[org.risk_tier as keyof typeof riskColors]} mb-6`}>
              Risk Tier: {org.risk_tier}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-6">
            {org.website_url && (
              <>
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-colors text-lg"
                >
                  Donate Now
                </a>
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-md transition-colors"
                >
                  Visit Website
                </a>
              </>
            )}
          </div>
        </div>

        {/* Risk Assessment */}
        {org.risk_tier && (
          <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <p className="text-gray-700 mb-6">
              {riskDescriptions[org.risk_tier as keyof typeof riskDescriptions]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">CPB Dependency</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {cpbDependency.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  of total revenue came from CPB grants
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview */}
        {(org.total_revenue || org.cpb_funding) && (
          <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Overview (FY 2023)</h2>
            <div className="space-y-4">
              {org.total_revenue && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Total Revenue</span>
                  <span className="text-gray-900 font-semibold">
                    ${org.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {org.cpb_funding && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">CPB Funding</span>
                  <span className="text-gray-900 font-semibold">
                    ${org.cpb_funding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {org.cpb_dependency_pct !== null && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700 font-medium">CPB Share</span>
                  <span className="text-gray-900 font-semibold">
                    {cpbDependency.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transmitters */}
        {org.transmitters.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transmitter{org.transmitters.length > 1 ? 's' : ''}
            </h2>
            <div className="space-y-3">
              {org.transmitters.map((tx) => (
                <div key={tx.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-gray-900">{tx.call_sign}</p>
                  {tx.city && (
                    <p className="text-sm text-gray-600">
                      {tx.city}, {org.state}
                      {tx.channel && ` • Channel ${tx.channel}`}
                    </p>
                  )}
                  {tx.fcc_facility_id && (
                    <p className="text-xs text-gray-500">FCC Facility ID: {tx.fcc_facility_id}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Cities */}
        {org.coverage_cities.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coverage Area</h2>
            <p className="text-gray-700 mb-3">This station serves communities including:</p>
            <div className="flex flex-wrap gap-2">
              {org.coverage_cities.map((city, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Data Quality */}
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Data Sources</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Overall Quality:</span>
                  <span className="ml-2 text-gray-600">{org.overall_quality}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CPB Funding:</span>
                  <span className="ml-2 text-gray-600">{org.cpb_funding_source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Revenue:</span>
                  <span className="ml-2 text-gray-600">{org.revenue_source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{org.coordinates_source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Network:</span>
                  <span className="ml-2 text-gray-600">{org.network_source}</span>
                </div>
                <p className="text-xs text-gray-500 mt-4 pt-3 border-t">
                  Last updated: {new Date(org.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
