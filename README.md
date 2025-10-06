# Keep Media Public

A web application that helps people find and donate to their local public media stations (PBS/NPR). After the Corporation for Public Broadcasting (CPB) shut down on September 30, 2025, over 1,500 stations that relied on federal funding now need direct community support to survive.

## Features

- **IP Geolocation**: Automatically detects user's location to show their local station
- **Risk Assessment**: Displays station vulnerability based on CPB funding dependency
- **Solidarity Stations**: Highlights high-risk stations that need nationwide support
- **Click Tracking**: Logs donation clicks for analytics and equitable exposure
- **Clean UI**: Simple, fast interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: SQLite (local dev) → Supabase/Postgres (production)
- **Deployment**: Vercel
- **Geolocation**: ipapi.co (1000 free requests/day)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
cd ~/git/keepmediapublic.org
```

2. Install dependencies:
```bash
npm install
```

3. Initialize and seed the database:
```bash
bash -c 'cd ~/git/keepmediapublic.org && npx tsx lib/db/seed.ts'
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

- **stations**: Station details (call sign, name, location, donate URL)
- **finance**: Annual financial data (revenue, CPB funding)
- **risk**: Risk assessment (tier, impact score, components)
- **click_log**: Donation click tracking (station, slot, region, timestamp)

## API Endpoints

### `GET /api/geolocate`
Returns user's location based on IP address using ipapi.co.

**Response:**
```json
{
  "city": "Seattle",
  "region": "Washington",
  "region_code": "WA",
  "country": "US",
  "latitude": 47.6062,
  "longitude": -122.3321
}
```

### `GET /api/stations?state=WA`
Get stations by state.

**Query params:**
- `state` (optional): Two-letter state code
- `solidarity=true` (optional): Get high-risk stations for solidarity cards

**Response:**
```json
{
  "stations": [
    {
      "id": 1,
      "call_sign": "KUOW",
      "name": "KUOW Public Radio",
      "network": "NPR",
      "city": "Seattle",
      "state": "WA",
      "risk_tier": "Moderate",
      "cpb_revenue_share": 0.18
    }
  ]
}
```

### `GET /api/donate?station_id=1&slot=local&region=WA`
Logs donation click and redirects to station's donate page.

**Query params:**
- `station_id` (required): Station ID
- `slot` (required): "local" or "solidarity"
- `region` (optional): User's state/region

**Returns:** 302 redirect to station's donate URL

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
bash -c 'cd ~/git/keepmediapublic.org && npx tsx lib/db/seed.ts'   # Initialize and seed database
```

## Project Structure

```
keepmediapublic.org/
├── app/
│   ├── api/
│   │   ├── donate/route.ts      # Donation redirect with click logging
│   │   ├── geolocate/route.ts   # IP geolocation
│   │   └── stations/route.ts    # Station queries
│   ├── components/
│   │   └── StationCard.tsx      # Station card component
│   ├── about/
│   │   └── page.tsx             # About/methodology page
│   └── page.tsx                 # Landing page
├── lib/
│   └── db/
│       ├── index.ts             # Database connection
│       ├── schema.sql           # Database schema
│       └── seed.ts              # Seed script
├── data/
│   └── keepmediapublic.db       # SQLite database (generated)
└── README.md
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (if needed for production)
4. Deploy

**Note:** For production, migrate from SQLite to Supabase/Postgres:
- Update `lib/db/index.ts` to use Postgres connection
- Set `DATABASE_URL` environment variable
- Run migrations on production database

## Future Enhancements

- ZIP to station mapping for better local station matching
- Advanced station search and filtering
- Analytics dashboard for click-through tracking
- Station exposure balancing algorithm
- Email signup for updates
- Social sharing features
- Mobile app

## Data Sources

Station financial data comes from:
- CPB annual financial reports
- IRS Form 990 filings
- State and university budget documents

## Privacy

We collect minimal data:
- Click logs: station ID, slot type, user region, timestamp
- No personal information
- No third-party tracking
- Donations processed entirely by stations

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Contact

For questions or feedback, please open an issue on GitHub.
