# VelaanCare App

A smart garden management app built with Next.js 15, React 19, and MongoDB.

## What This Includes

- Dashboard for plant health and alerts
- Plant, irrigation, sensor, and disease-analysis APIs
- MongoDB-backed repositories and models
- Auto-bootstrap seed data for first run
- Manual seed and reseed scripts

## Tech Stack

- Next.js 15 (`app` router)
- React 19 + TypeScript
- Mongoose + MongoDB
- TanStack Query for client data fetching
- Tailwind CSS + Radix UI

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create or update `.env.local`:

```env
MONGODB_URI=
```

You can also use MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Database Seeding

The backend auto-seeds default data on first API access if collections are empty.

You can also run seeding manually:

```bash
npm run seed
```

Force reset and reseed:

```bash
npm run seed:force
```

## Scripts

- `npm run dev` - Start dev server (Turbopack)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed if empty
- `npm run seed:force` - Clear and reseed all collections

## API Endpoints

- `GET /api/plants` - List plants
- `POST /api/plants` - Create plant
- `GET /api/alerts` - List active alerts
- `PATCH /api/alerts` - Mark alert as read
- `GET /api/sensors?plantId=<id>&limit=<n>` - Sensor history
- `POST /api/sensors` - Add sensor reading
- `GET /api/irrigation` - Irrigation status/history/settings
- `POST /api/irrigation` - Trigger irrigation
- `PATCH /api/irrigation` - Update irrigation settings
- `POST /api/growguide` - Crop recommendations
- `GET /api/greenguard` - Disease report history
- `POST /api/greenguard` - Analyze uploaded image

## Project Structure (Key Paths)

- `src/app/api/*` - Route handlers
- `src/db/models/*` - Mongoose schemas
- `src/repositories/*` - Data access layer
- `src/services/*` - Domain/business logic
- `src/db/seed.ts` - Seed data and helpers
- `src/scripts/seed.ts` - CLI seed entrypoint

## Troubleshooting

### API returning 500

- Confirm `MONGODB_URI` is set in `.env.local`
- Ensure MongoDB is reachable
- Run `npm run seed:force` to reset data

### Missing/blank data in UI

- Verify backend routes respond (e.g., `/api/plants`)
- Reseed with `npm run seed`

### Lockfile/dependency issues

- Remove `node_modules` and reinstall:

```bash
npm install
```

## Notes

- Local image assets are used for stable UI rendering.
- Seed logic is safe for first-run local environments and only inserts defaults when collections are empty.
