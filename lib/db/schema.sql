-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  call_sign TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  station_type TEXT NOT NULL CHECK(station_type IN ('TV', 'Radio')),
  network TEXT NOT NULL CHECK(network IN ('PBS', 'NPR', 'Both')),
  licensee_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat REAL,
  lon REAL,
  donate_url TEXT NOT NULL,
  website_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Finance table
CREATE TABLE IF NOT EXISTS finance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER NOT NULL,
  fiscal_year INTEGER NOT NULL,
  total_revenue REAL NOT NULL,
  cpb_amount REAL NOT NULL,
  cpb_revenue_share REAL NOT NULL,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  UNIQUE(station_id, fiscal_year)
);

-- Risk table
CREATE TABLE IF NOT EXISTS risk (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER NOT NULL UNIQUE,
  impact_score REAL NOT NULL,
  risk_tier TEXT NOT NULL CHECK(risk_tier IN ('Critical', 'High', 'Moderate', 'Stable')),
  cpb_share_component REAL NOT NULL,
  rurality_component REAL NOT NULL,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Click log table
CREATE TABLE IF NOT EXISTS click_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER NOT NULL,
  slot TEXT NOT NULL CHECK(slot IN ('local', 'solidarity')),
  user_region TEXT,
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Impressions table (tracks when solidarity stations are shown to users)
CREATE TABLE IF NOT EXISTS impressions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER NOT NULL,
  user_region TEXT,
  shown_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stations_state ON stations(state);
CREATE INDEX IF NOT EXISTS idx_stations_type ON stations(station_type);
CREATE INDEX IF NOT EXISTS idx_stations_network ON stations(network);
CREATE INDEX IF NOT EXISTS idx_stations_location ON stations(lat, lon);
CREATE INDEX IF NOT EXISTS idx_finance_station ON finance(station_id);
CREATE INDEX IF NOT EXISTS idx_risk_tier ON risk(risk_tier);
CREATE INDEX IF NOT EXISTS idx_click_log_station ON click_log(station_id);
CREATE INDEX IF NOT EXISTS idx_click_log_date ON click_log(clicked_at);
CREATE INDEX IF NOT EXISTS idx_impressions_station ON impressions(station_id);
CREATE INDEX IF NOT EXISTS idx_impressions_date ON impressions(shown_at);
