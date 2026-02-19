# FindBuyers

Full-stack app with TypeScript backend (Express) and React frontend (Vite).

## How to run

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Development

**Run both backend and frontend:**

```bash
npm run dev
```

**Or run separately:**

```bash
# Terminal 1: backend (http://localhost:3000)
npm run dev:backend

# Terminal 2: frontend (http://localhost:5173)
npm run dev:frontend
```

The frontend proxies `/api` and `/health` to the backend during development.

### PredictLeads API

The `/api/news-reports` endpoint requires a PredictLeads API key and token. Copy the example env file and set both:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set PREDICTLEADS_API_KEY and PREDICTLEADS_API_TOKEN
```

### Endpoints

- `GET /health` -- health check
- `GET /api/news-reports` -- fetches news reports from PredictLeads
- `POST /api/v1/user-details` -- (contract stub) create/update user-details after Supabase signup
- `POST /api/v1/agencies` -- (contract stub) create agency (creator becomes admin)
- `GET|PATCH|DELETE /api/v1/agencies/:agencyUuid` -- (contract stub) agency CRUD

API contract (OpenAPI): `backend/openapi.yaml`

Regenerate the OpenAPI spec from Zod (Zod-first):

```bash
npm run generate:openapi -w findbuyers-backend
```

### Build

```bash
npm run build
```

### Production

```bash
npm run build:backend
npm start -w findbuyers-backend   # or: node backend/dist/index.js
```
