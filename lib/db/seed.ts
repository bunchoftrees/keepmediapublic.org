import db, { initializeDatabase } from './index';

// Initialize database and seed with example data
export function seedDatabase() {
  console.log('Initializing database...');
  initializeDatabase();

  // Check if already seeded
  const existing = db.prepare('SELECT COUNT(*) as count FROM stations').get() as { count: number };
  if (existing.count > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // Sample stations with realistic data
  const stations = [
    {
      call_sign: 'WNYC',
      name: 'WNYC New York Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'New York Public Radio',
      city: 'New York',
      state: 'NY',
      lat: 40.7128,
      lon: -74.0060,
      donate_url: 'https://pledge3.wnyc.org/',
      website_url: 'https://www.wnyc.org'
    },
    {
      call_sign: 'THIRTEEN',
      name: 'THIRTEEN (WNET)',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'WNET',
      city: 'New York',
      state: 'NY',
      lat: 40.7128,
      lon: -74.0060,
      donate_url: 'https://www.thirteen.org/support/',
      website_url: 'https://www.thirteen.org'
    },
    {
      call_sign: 'KQED-FM',
      name: 'KQED Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Northern California Public Broadcasting',
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7749,
      lon: -122.4194,
      donate_url: 'https://www.kqed.org/donate',
      website_url: 'https://www.kqed.org'
    },
    {
      call_sign: 'KQED',
      name: 'KQED Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Northern California Public Broadcasting',
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7749,
      lon: -122.4194,
      donate_url: 'https://www.kqed.org/donate',
      website_url: 'https://www.kqed.org'
    },
    {
      call_sign: 'WGBH',
      name: 'GBH Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'WGBH Educational Foundation',
      city: 'Boston',
      state: 'MA',
      lat: 42.3601,
      lon: -71.0589,
      donate_url: 'https://www.wgbh.org/support',
      website_url: 'https://www.wgbh.org'
    },
    {
      call_sign: 'WGBH-FM',
      name: 'GBH Radio Boston',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'WGBH Educational Foundation',
      city: 'Boston',
      state: 'MA',
      lat: 42.3601,
      lon: -71.0589,
      donate_url: 'https://www.wgbh.org/support',
      website_url: 'https://www.wgbh.org'
    },
    {
      call_sign: 'KUOW',
      name: 'KUOW Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'University of Washington',
      city: 'Seattle',
      state: 'WA',
      lat: 47.6062,
      lon: -122.3321,
      donate_url: 'https://www.kuow.org/donate',
      website_url: 'https://www.kuow.org'
    },
    {
      call_sign: 'KCTS',
      name: 'KCTS 9 Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'KCTS Television',
      city: 'Seattle',
      state: 'WA',
      lat: 47.6062,
      lon: -122.3321,
      donate_url: 'https://kcts9.org/give',
      website_url: 'https://kcts9.org'
    },
    {
      call_sign: 'WHRO-FM',
      name: 'WHRO Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Hampton Roads Educational TV Association',
      city: 'Norfolk',
      state: 'VA',
      lat: 36.8508,
      lon: -76.2859,
      donate_url: 'https://whro.org/donate',
      website_url: 'https://whro.org'
    },
    {
      call_sign: 'WHRO',
      name: 'WHRO Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Hampton Roads Educational TV Association',
      city: 'Norfolk',
      state: 'VA',
      lat: 36.8508,
      lon: -76.2859,
      donate_url: 'https://whro.org/donate',
      website_url: 'https://whro.org'
    },
    {
      call_sign: 'KYUK-AM',
      name: 'KYUK Alaska Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Bethel Broadcasting',
      city: 'Bethel',
      state: 'AK',
      lat: 60.7922,
      lon: -161.7558,
      donate_url: 'https://www.kyuk.org/support',
      website_url: 'https://www.kyuk.org'
    },
    {
      call_sign: 'KYUK',
      name: 'KYUK Alaska Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Bethel Broadcasting',
      city: 'Bethel',
      state: 'AK',
      lat: 60.7922,
      lon: -161.7558,
      donate_url: 'https://www.kyuk.org/support',
      website_url: 'https://www.kyuk.org'
    },
    {
      call_sign: 'KRWG-FM',
      name: 'KRWG Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'New Mexico State University',
      city: 'Las Cruces',
      state: 'NM',
      lat: 32.3199,
      lon: -106.7637,
      donate_url: 'https://krwg.org/donate',
      website_url: 'https://krwg.org'
    },
    {
      call_sign: 'KRWG-TV',
      name: 'KRWG Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'New Mexico State University',
      city: 'Las Cruces',
      state: 'NM',
      lat: 32.3199,
      lon: -106.7637,
      donate_url: 'https://krwg.org/donate',
      website_url: 'https://krwg.org'
    },
    {
      call_sign: 'WMFE-FM',
      name: 'WMFE Orlando Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Community Communications',
      city: 'Orlando',
      state: 'FL',
      lat: 28.5383,
      lon: -81.3792,
      donate_url: 'https://www.wmfe.org/donate',
      website_url: 'https://www.wmfe.org'
    },
    {
      call_sign: 'WMFE-TV',
      name: 'WMFE Orlando Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Community Communications',
      city: 'Orlando',
      state: 'FL',
      lat: 28.5383,
      lon: -81.3792,
      donate_url: 'https://www.wmfe.org/donate',
      website_url: 'https://www.wmfe.org'
    },
    {
      call_sign: 'KDLG',
      name: 'KDLG Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Dillingham City School District',
      city: 'Dillingham',
      state: 'AK',
      lat: 59.0397,
      lon: -158.5072,
      donate_url: 'https://www.kdlg.org/donate',
      website_url: 'https://www.kdlg.org'
    },
    {
      call_sign: 'KTOO-FM',
      name: 'KTOO Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Capital Community Broadcasting',
      city: 'Juneau',
      state: 'AK',
      lat: 58.3019,
      lon: -134.4197,
      donate_url: 'https://www.ktoo.org/donate',
      website_url: 'https://www.ktoo.org'
    },
    {
      call_sign: 'KTOO',
      name: 'KTOO Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Capital Community Broadcasting',
      city: 'Juneau',
      state: 'AK',
      lat: 58.3019,
      lon: -134.4197,
      donate_url: 'https://www.ktoo.org/donate',
      website_url: 'https://www.ktoo.org'
    },
    {
      call_sign: 'WQPT',
      name: 'WQPT Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Western Illinois University',
      city: 'Moline',
      state: 'IL',
      lat: 41.5067,
      lon: -90.5151,
      donate_url: 'https://www.wqpt.org/support',
      website_url: 'https://www.wqpt.org'
    },
    {
      call_sign: 'WVIK',
      name: 'WVIK Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Augustana College',
      city: 'Rock Island',
      state: 'IL',
      lat: 41.5095,
      lon: -90.5787,
      donate_url: 'https://www.wvik.org/donate',
      website_url: 'https://www.wvik.org'
    },
    {
      call_sign: 'WILL-FM',
      name: 'WILL Illinois Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'University of Illinois',
      city: 'Urbana',
      state: 'IL',
      lat: 40.1106,
      lon: -88.2073,
      donate_url: 'https://will.illinois.edu/donate',
      website_url: 'https://will.illinois.edu'
    },
    {
      call_sign: 'WILL-TV',
      name: 'WILL Illinois Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'University of Illinois',
      city: 'Urbana',
      state: 'IL',
      lat: 40.1106,
      lon: -88.2073,
      donate_url: 'https://will.illinois.edu/donate',
      website_url: 'https://will.illinois.edu'
    },
    {
      call_sign: 'WTVP',
      name: 'WTVP Public Television',
      station_type: 'TV',
      network: 'PBS',
      licensee_name: 'Peoria Public Broadcasting Council',
      city: 'Peoria',
      state: 'IL',
      lat: 40.6936,
      lon: -89.5890,
      donate_url: 'https://www.wtvp.org/support',
      website_url: 'https://www.wtvp.org'
    },
    {
      call_sign: 'WCBU',
      name: 'WCBU Public Radio',
      station_type: 'Radio',
      network: 'NPR',
      licensee_name: 'Bradley University',
      city: 'Peoria',
      state: 'IL',
      lat: 40.6936,
      lon: -89.5890,
      donate_url: 'https://www.wcbu.org/donate',
      website_url: 'https://www.wcbu.org'
    }
  ];

  const insertStation = db.prepare(`
    INSERT INTO stations (call_sign, name, station_type, network, licensee_name, city, state, lat, lon, donate_url, website_url)
    VALUES (@call_sign, @name, @station_type, @network, @licensee_name, @city, @state, @lat, @lon, @donate_url, @website_url)
  `);

  const insertFinance = db.prepare(`
    INSERT INTO finance (station_id, fiscal_year, total_revenue, cpb_amount, cpb_revenue_share)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertRisk = db.prepare(`
    INSERT INTO risk (station_id, impact_score, risk_tier, cpb_share_component, rurality_component)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Insert stations and related data
  for (const station of stations) {
    const result = insertStation.run(station);
    const stationId = result.lastInsertRowid as number;

    // Add financial data (fiscal year 2023)
    let totalRevenue: number;
    let cpbAmount: number;
    let cpbShare: number;

    // Vary financial data based on location/type
    if (station.state === 'AK') {
      // Rural Alaska stations - high CPB dependency
      totalRevenue = 800000 + Math.random() * 400000;
      cpbShare = 0.35 + Math.random() * 0.25; // 35-60% CPB dependency
      cpbAmount = totalRevenue * cpbShare;
    } else if (['NY', 'CA', 'MA'].includes(station.state)) {
      // Major market stations - lower CPB dependency
      totalRevenue = 25000000 + Math.random() * 50000000;
      cpbShare = 0.02 + Math.random() * 0.08; // 2-10% CPB dependency
      cpbAmount = totalRevenue * cpbShare;
    } else {
      // Mid-market stations - moderate CPB dependency
      totalRevenue = 3000000 + Math.random() * 7000000;
      cpbShare = 0.12 + Math.random() * 0.18; // 12-30% CPB dependency
      cpbAmount = totalRevenue * cpbShare;
    }

    insertFinance.run(stationId, 2023, totalRevenue, cpbAmount, cpbShare);

    // Add risk assessment
    let riskTier: string;
    let impactScore: number;
    let ruralityComponent: number;

    if (cpbShare > 0.4) {
      riskTier = 'Critical';
      impactScore = 75 + Math.random() * 25;
      ruralityComponent = 0.6 + Math.random() * 0.4;
    } else if (cpbShare > 0.25) {
      riskTier = 'High';
      impactScore = 50 + Math.random() * 25;
      ruralityComponent = 0.4 + Math.random() * 0.3;
    } else if (cpbShare > 0.15) {
      riskTier = 'Moderate';
      impactScore = 25 + Math.random() * 25;
      ruralityComponent = 0.2 + Math.random() * 0.3;
    } else {
      riskTier = 'Stable';
      impactScore = 5 + Math.random() * 20;
      ruralityComponent = 0.0 + Math.random() * 0.2;
    }

    insertRisk.run(stationId, impactScore, riskTier, cpbShare, ruralityComponent);
  }

  console.log(`Seeded ${stations.length} stations with financial and risk data`);
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
  db.close();
}
