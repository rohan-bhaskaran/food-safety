# SIH26034 — Legal Metrology Compliance Scanner

Hackathon prototype for **Smart India Hackathon 2026**, Problem Statement **SIH26034**:

> Software System to check compliance of Packaged Commmodities under Legal Metrology Rules, 2011 by scanning products, images and labels.

Issued by the **Ministry of Consumer Affairs, Food & Public Distribution — Legal Metrology Division**.

## Architecture

```
Product Image → Gemini Vision (extract) → Structured JSON → Deterministic Validators → Compliance Report
```

**Core principle:** AI reads the label. Code decides compliance. No LLM makes the final legal decision.

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API key

### 1. Server

```bash
cd server
cp .env.example .env
# Edit .env and set GEMINI_API_KEY
npm install
npm run dev
```

Server runs at `http://localhost:3001`

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173` (proxies `/api` to server)

## Demo Script (~60 seconds)

1. Open `http://localhost:5173`
2. Click **Test Product A — Compliant** → shows **COMPLIANT** with all checks passing
3. Click **Scan Another Label**
4. Click **Test Product B — Non-Compliant** → shows **NON-COMPLIANT** with 3 issues:
   - Missing consumer-care details
   - MRP without "inclusive of all taxes"
   - Missing net quantity
5. Expand **View Extracted Data** to show judges what AI extracted vs what rules checked
6. Say: *"AI reads the package. Deterministic code checks Rule 6."*

Demo mode uses cached extraction JSON — clearly labeled in the UI.

For live demo, upload a real label photo (JPG/PNG).

## API

### `GET /api/health`

Health check.

### `POST /api/scan`

- **Live mode:** `multipart/form-data` with `image` field (JPG/JPEG/PNG, max 5MB)
- **Demo mode:** `?mode=demo-a` or `?mode=demo-b` (no image needed)

Response:

```json
{
  "extraction": { "...": "structured fields" },
  "report": {
    "overallStatus": "COMPLIANT | NON_COMPLIANT | UNCERTAIN",
    "issueCount": 0,
    "results": [{ "field": "...", "status": "PASS|FAIL|UNCERTAIN", "reason": "...", "reference": "..." }],
    "summary": "..."
  },
  "meta": { "mode": "live | demo", "processingMs": 4200 }
}
```

## Validation Rules (Rule 6)

| Check | Rule Reference |
|-------|----------------|
| Manufacturer / Packer / Importer name & address | Rule 6(1) |
| Common/generic commodity name | Rule 6(2) |
| Net quantity with standard unit | Rule 6(3) |
| Month & year of manufacture/packing/import | Rule 6(4) |
| MRP + explicit "inclusive of all taxes" | Rule 6(5) |
| Consumer complaint/contact details | Rule 6(6) |
| Country of origin (imported products only) | Rule 6(7) |
| Unit sale price (where applicable) | Rule 6(8) |

Each validator returns **PASS**, **FAIL**, or **UNCERTAIN**.

## Project Structure

```
├── client/          # React + Vite + Tailwind
├── server/          # Express + TypeScript
│   └── src/
│       ├── validators/       # Deterministic Rule 6 checks
│       ├── services/ocr/     # Gemini Vision extraction
│       └── demo/             # Cached demo extractions
└── README.md
```

## Deployment

### Frontend (Vercel)

- Root directory: `client`
- Build command: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://your-backend.onrender.com`

### Backend (Render / Railway)

- Root directory: `server`
- Build: `npm install && npm run build`
- Start: `npm start`
- Env: `GEMINI_API_KEY`, `CORS_ORIGIN=https://your-app.vercel.app`

## Disclaimer

This is a **prototype decision-support system**, not an official legal inspection platform. Validation logic is based on applicable provisions of the Legal Metrology (Packaged Commodities) Rules, 2011, particularly Rule 6.
