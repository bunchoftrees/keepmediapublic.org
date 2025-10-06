/**
 * Database query functions for Keep Media Public (Supabase version)
 * Uses Supabase PostgreSQL instead of SQLite
 */

import { supabase } from './supabase';

// Type definitions matching the database schema
export interface Organization {
  id: string;
  slug: string;
  station_name: string;
  state: string;
  state_name: string;
  branding: string | null;
  website_url: string | null;
  primary_call_sign: string;
  transmitter_count: number;
  coverage_population: number | null;

  // Financial data
  cpb_funding: number | null;
  total_revenue: number | null;
  cpb_dependency_pct: number | null;
  risk_tier: string | null;

  // Network data
  is_pbs_member: boolean;
  network_affiliation: string | null;
  station_type: string;

  // Data quality
  cpb_funding_source: string;
  revenue_source: string;
  coordinates_source: string;
  network_source: string;
  overall_quality: string;

  // Metadata
  updated_at: string;
}

export interface Transmitter {
  id: string;
  organization_id: string;
  call_sign: string;
  city: string | null;
  channel: string | null;
  zip_code: string | null;
  fcc_facility_id: string | null;
  latitude: number | null;
  longitude: number | null;
  has_coordinates: boolean;
  has_zip_code: boolean;
}

export interface CoverageCity {
  id: number;
  organization_id: string;
  city_name: string;
}

export interface Quote {
  id: number;
  quote_text: string;
  person: string;
  show_or_role: string;
  theme?: string;
  created_at: string;
}

export interface OrganizationWithTransmitters extends Organization {
  transmitters: Transmitter[];
  coverage_cities: string[];
}

/**
 * Get all organizations with optional filtering
 */
export async function getAllOrganizations(filters?: {
  state?: string;
  risk_tier?: string;
  network_affiliation?: string;
  limit?: number;
  offset?: number;
}): Promise<Organization[]> {
  let query = supabase
    .from('organizations')
    .select('*')
    .order('station_name');

  if (filters?.state) {
    query = query.eq('state', filters.state);
  }

  if (filters?.risk_tier) {
    query = query.eq('risk_tier', filters.risk_tier);
  }

  if (filters?.network_affiliation) {
    query = query.eq('network_affiliation', filters.network_affiliation);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }

  return data as Organization[];
}

/**
 * Get a single organization by ID or slug
 */
export async function getOrganization(idOrSlug: string): Promise<OrganizationWithTransmitters | null> {
  // Try by ID first, then by slug
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .single();

  if (orgError || !org) {
    return null;
  }

  // Get transmitters
  const { data: transmitters, error: txError } = await supabase
    .from('transmitters')
    .select('*')
    .eq('organization_id', org.id)
    .order('call_sign');

  if (txError) {
    console.error('Error fetching transmitters:', txError);
    throw txError;
  }

  // Get coverage cities
  const { data: cities, error: citiesError } = await supabase
    .from('coverage_cities')
    .select('city_name')
    .eq('organization_id', org.id)
    .order('city_name');

  if (citiesError) {
    console.error('Error fetching coverage cities:', citiesError);
    throw citiesError;
  }

  const coverage_cities = cities.map(c => c.city_name);

  return {
    ...org,
    transmitters: transmitters as Transmitter[],
    coverage_cities
  } as OrganizationWithTransmitters;
}

/**
 * Search organizations by name, call sign, city, or state
 */
export async function searchOrganizations(query: string, limit: number = 20): Promise<Organization[]> {
  const searchPattern = `%${query}%`;

  // Search in organizations table
  const { data: orgResults, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .or(`station_name.ilike.${searchPattern},primary_call_sign.ilike.${searchPattern},state.ilike.${searchPattern},state_name.ilike.${searchPattern}`)
    .order('station_name')
    .limit(limit);

  if (orgError) {
    console.error('Error searching organizations:', orgError);
    throw orgError;
  }

  // Also search in transmitters and get their organizations
  const { data: txResults, error: txError } = await supabase
    .from('transmitters')
    .select('organization_id, organizations(*)')
    .or(`call_sign.ilike.${searchPattern},city.ilike.${searchPattern}`)
    .limit(limit);

  if (txError) {
    console.error('Error searching transmitters:', txError);
    throw txError;
  }

  // Also search in coverage cities
  const { data: cityResults, error: cityError } = await supabase
    .from('coverage_cities')
    .select('organization_id, organizations(*)')
    .ilike('city_name', searchPattern)
    .limit(limit);

  if (cityError) {
    console.error('Error searching coverage cities:', cityError);
    throw cityError;
  }

  // Combine results and deduplicate by organization ID
  const allOrgs = new Map<string, Organization>();

  orgResults?.forEach(org => allOrgs.set(org.id, org as Organization));
  txResults?.forEach(tx => {
    if (tx.organizations) {
      // Supabase returns foreign key relations as arrays, take first element
      const org = Array.isArray(tx.organizations) ? tx.organizations[0] : tx.organizations;
      if (org) {
        allOrgs.set(org.id, org as Organization);
      }
    }
  });
  cityResults?.forEach(city => {
    if (city.organizations) {
      // Supabase returns foreign key relations as arrays, take first element
      const org = Array.isArray(city.organizations) ? city.organizations[0] : city.organizations;
      if (org) {
        allOrgs.set(org.id, org as Organization);
      }
    }
  });

  return Array.from(allOrgs.values()).slice(0, limit);
}

/**
 * Get organizations by risk tier
 */
export async function getOrganizationsByRiskTier(riskTier: string): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('risk_tier', riskTier)
    .order('cpb_dependency_pct', { ascending: false });

  if (error) {
    console.error('Error fetching organizations by risk tier:', error);
    throw error;
  }

  return data as Organization[];
}

/**
 * Get organizations by state
 */
export async function getOrganizationsByState(state: string): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('state', state)
    .order('station_name');

  if (error) {
    console.error('Error fetching organizations by state:', error);
    throw error;
  }

  return data as Organization[];
}

/**
 * Find nearest stations to a given coordinate
 */
export async function findNearestStations(
  lat: number,
  lon: number,
  limit: number = 10
): Promise<Array<Organization & { distance: number }>> {
  // Get all organizations with transmitter coordinates
  const { data: rows, error } = await supabase
    .from('transmitters')
    .select('organization_id, latitude, longitude, organizations(*)')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    console.error('Error fetching transmitters for distance calculation:', error);
    throw error;
  }

  // Calculate distances and group by organization ID, keeping only the closest transmitter
  const orgMap = new Map<string, Organization & { distance: number }>();

  for (const row of rows) {
    if (!row.latitude || !row.longitude || !row.organizations) continue;

    const lat1 = lat * Math.PI / 180;
    const lat2 = row.latitude * Math.PI / 180;
    const deltaLat = (row.latitude - lat) * Math.PI / 180;
    const deltaLon = (row.longitude - lon) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 3959 * c; // Earth radius in miles

    // Supabase returns foreign key relations as arrays, take first element
    const orgData = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
    if (!orgData) continue;
    const org = orgData as Organization;

    // Keep only the closest transmitter for each organization
    const existing = orgMap.get(org.id);
    if (!existing || distance < existing.distance) {
      orgMap.set(org.id, { ...org, distance });
    }
  }

  // Convert map to array, sort by distance, and return top results
  return Array.from(orgMap.values())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  const [orgCount, txCount, cityCount, fundingSum, riskTiers, states] = await Promise.all([
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('transmitters').select('*', { count: 'exact', head: true }),
    supabase.from('coverage_cities').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('cpb_funding').not('cpb_funding', 'is', null),
    supabase.from('organizations').select('risk_tier').not('risk_tier', 'is', null),
    supabase.from('organizations').select('state, state_name')
  ]);

  // Calculate total CPB funding
  const total_cpb_funding = fundingSum.data?.reduce((sum, org) => sum + (org.cpb_funding || 0), 0) || 0;

  // Group by risk tier
  const riskTierCounts = riskTiers.data?.reduce((acc, org) => {
    const tier = org.risk_tier || 'Unknown';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Group by state
  const stateCounts = states.data?.reduce((acc, org) => {
    const key = org.state;
    if (!acc.find(s => s.state === key)) {
      acc.push({ state: org.state, state_name: org.state_name, count: 1 });
    } else {
      const existing = acc.find(s => s.state === key);
      if (existing) existing.count++;
    }
    return acc;
  }, [] as Array<{ state: string; state_name: string; count: number }>) || [];

  return {
    organizations: orgCount.count || 0,
    transmitters: txCount.count || 0,
    coverage_cities: cityCount.count || 0,
    total_cpb_funding,
    risk_tiers: Object.entries(riskTierCounts).map(([risk_tier, count]) => ({ risk_tier, count })),
    states: stateCounts.sort((a, b) => b.count - a.count)
  };
}

/**
 * Get all unique states with organization counts
 */
export async function getStatesWithCounts(): Promise<Array<{ state: string; state_name: string; count: number }>> {
  const { data, error } = await supabase
    .from('organizations')
    .select('state, state_name');

  if (error) {
    console.error('Error fetching states:', error);
    throw error;
  }

  // Group by state
  const stateCounts = data.reduce((acc, org) => {
    const existing = acc.find(s => s.state === org.state);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ state: org.state, state_name: org.state_name, count: 1 });
    }
    return acc;
  }, [] as Array<{ state: string; state_name: string; count: number }>);

  return stateCounts.sort((a, b) => a.state_name.localeCompare(b.state_name));
}

/**
 * Get at-risk stations using fair weighted selection
 */
export async function getAtRiskStations(count: number = 3): Promise<Organization[]> {
  // Get all high-risk stations with their exposure metrics (last 7 days)
  const { data: stations, error } = await supabase
    .from('organizations')
    .select(`
      *,
      impressions:station_impressions!organization_id(count),
      clicks:station_clicks!organization_id(count)
    `)
    .in('risk_tier', ['Critical', 'High'])
    .order('cpb_dependency_pct', { ascending: false });

  if (error) {
    console.error('Error fetching at-risk stations:', error);
    throw error;
  }

  if (!stations || stations.length === 0) {
    return [];
  }

  // Process the aggregated counts
  const processedStations = stations.map(station => {
    // Supabase returns aggregated counts differently
    const impression_count = Array.isArray(station.impressions) ? station.impressions.length : 0;
    const click_count = Array.isArray(station.clicks) ? station.clicks.length : 0;

    return {
      station,
      impression_count,
      click_count
    };
  });

  // Calculate weights for each station
  const weighted = processedStations.map(({ station, impression_count, click_count }) => {
    const riskMultiplier = station.risk_tier === 'Critical' ? 2.0 : 1.0;
    const exposureScore = 1 + impression_count + (2 * click_count);
    const weight = riskMultiplier / exposureScore;

    return {
      station,
      weight
    };
  });

  // Normalize weights to sum to 1
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  const normalized = weighted.map(item => ({
    station: item.station,
    weight: item.weight / totalWeight
  }));

  // Weighted random selection without replacement
  const selected: Organization[] = [];
  const remaining = [...normalized];

  for (let i = 0; i < Math.min(count, stations.length); i++) {
    // Calculate cumulative weights
    let cumulativeWeight = 0;
    const random = Math.random();

    // Recalculate total for remaining stations
    const remainingTotal = remaining.reduce((sum, item) => sum + item.weight, 0);

    for (let j = 0; j < remaining.length; j++) {
      cumulativeWeight += remaining[j].weight / remainingTotal;
      if (random <= cumulativeWeight) {
        // Extract only Organization fields (impressions and clicks are removed)
        const { impressions: _impressions, clicks: _clicks, ...orgData } = remaining[j].station;
        selected.push(orgData as Organization);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}

/**
 * Track station impression
 */
export async function trackImpression(organizationId: string, slot: string, userRegion?: string) {
  const { error } = await supabase
    .from('station_impressions')
    .insert({
      organization_id: organizationId,
      slot,
      user_region: userRegion || null
    });

  if (error) {
    console.error('Error tracking impression:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Track station click
 */
export async function trackClick(organizationId: string, clickType: 'donate' | 'detail', slot: string, userRegion?: string) {
  const { error } = await supabase
    .from('station_clicks')
    .insert({
      organization_id: organizationId,
      click_type: clickType,
      slot,
      user_region: userRegion || null
    });

  if (error) {
    console.error('Error tracking click:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Get a random quote using the Postgres function
 */
export async function getRandomQuote(): Promise<Quote | null> {
  const { data, error } = await supabase.rpc('get_random_quote');

  if (error) {
    console.error('Error fetching random quote:', error);
    return null;
  }

  // RPC functions that return a single row might return an array with one item
  // or a single object depending on the function definition
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as Quote;
  }

  return data as Quote;
}
