# CyberTwin — Frontend

Enterprise web application for the CyberTwin platform: model an organization's
digital twin, simulate cyber attacks, visualize attack paths, measure risk, and
compare security controls through counterfactual simulations.

## Tech Stack

- React 19 + Vite
- React Router (client-side routing)
- Axios (service layer — prepared for the FastAPI backend)
- React Flow (`@xyflow/react`) — interactive attack graph
- Lucide React (icons)
- Plain CSS with design tokens (no UI framework)

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
```

Copy `.env.example` to `.env` to configure the API:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

`VITE_USE_MOCK=true` (default) runs the app entirely on the deterministic
synthetic demo layer — **the application works without any backend**. Set it to
`false` to call the FastAPI backend; API failures surface in the UI with retry
states.

## Demo Organization

The application ships with a synthetic demo environment:

- **ApexFin Technologies** — Financial Services (simulation environment)
- 12 users, 12 devices, 12 core assets, 2 critical databases — all fictional
- Deterministic data: the same inputs always produce the same results
- No real personal or financial data is used anywhere

## Primary Demo Flow

1. Open **Attack Simulation**
2. Scenario: *Credential Leak* · User: *Rahul Sharma* · MFA: **OFF**
3. **Simulate Attack** → Risk **86**, Blast radius **72%**, 4 critical assets,
   25,000 records, path: Rahul → Laptop → VPN → Finance Server → Finance DB
4. Enable MFA (or use the counterfactual panel) → **Run Counterfactual**
5. Risk drops to **21**, blast radius **8%**, 0 critical assets, 0 records —
   the path is **blocked at the VPN gateway**

## Architecture

```
src/
├── components/
│   ├── common/        # Card, Badge, Button, Modal, Tabs, DataTable, states…
│   ├── navigation/    # Sidebar, Header (responsive drawer)
│   ├── dashboard/     # KPIs, risk gauge, breakdown, events, quick actions
│   ├── simulation/    # Form, status, AttackGraph, result, counterfactual
│   └── risk/          # Overview, categories, detail, controls, comparison
├── hooks/             # useAsync, useSimulationRunner, useTwin
├── layouts/           # DashboardLayout (sidebar + header shell)
├── pages/             # Dashboard, Organization, AttackSimulation, RiskAnalysis, Settings
├── services/          # API layer — mock first, swap to Axios without UI changes
└── utils/             # mockData (synthetic data), simulation engine, twinStore
```

### Service Layer → Backend

Every page reads data through `src/services`. Today each service resolves from
the mock layer; the API contracts are already defined:

| Endpoint | Service |
| --- | --- |
| `GET /api/organization`, `/users`, `/devices`, `/assets`, `/data-assets` | `organizationService` |
| `POST /api/simulations`, `POST /api/simulations/counterfactual` | `simulationService` |
| `GET /api/risk`, `GET /api/risk/{id}` | `riskService` |
| `GET/POST /api/security-controls[/{id}/toggle]` | `controlService` |
| `GET /api/ml/user-risk/{user_id}` | `mlService` |
| `GET /api/blockchain/evidence/{simulation_id}` | `blockchainService` |

ML and blockchain are **display-only** in the frontend: ML predictions and
blockchain-backed evidence are rendered exactly as the backend returns them.

## Labels

The UI strictly distinguishes data provenance:

- `SIMULATED` — deterministic attack simulation output
- `ML-ASSISTED` — machine-learning prediction
- `INTEGRITY VERIFIED` — blockchain-backed evidence record

## Notes

- Dark-first enterprise theme; light theme is intentionally not offered.
- Desktop-first (1440/1280/1024 px), responsive down to 480 px (drawer sidebar,
  scrollable tables, stacked grids).
- Pages are lazy-loaded; the attack graph is a separate lazy chunk.
