-- Analytics tables for tracking station impressions and donate clicks
-- These track user interactions to enable fair distribution of at-risk station visibility

-- Station impressions (when a station card is shown to a user)
CREATE TABLE IF NOT EXISTS station_impressions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id TEXT NOT NULL,
  slot TEXT NOT NULL CHECK(slot IN ('local', 'at-risk', 'solidarity')),
  user_region TEXT,
  shown_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Station clicks (when user clicks donate button)
CREATE TABLE IF NOT EXISTS station_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id TEXT NOT NULL,
  click_type TEXT NOT NULL CHECK(click_type IN ('donate', 'detail')),
  slot TEXT NOT NULL CHECK(slot IN ('local', 'at-risk', 'solidarity')),
  user_region TEXT,
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_impressions_org ON station_impressions(organization_id);
CREATE INDEX IF NOT EXISTS idx_impressions_date ON station_impressions(shown_at);
CREATE INDEX IF NOT EXISTS idx_impressions_slot ON station_impressions(slot);

CREATE INDEX IF NOT EXISTS idx_clicks_org ON station_clicks(organization_id);
CREATE INDEX IF NOT EXISTS idx_clicks_date ON station_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_type ON station_clicks(click_type);
CREATE INDEX IF NOT EXISTS idx_clicks_slot ON station_clicks(slot);
