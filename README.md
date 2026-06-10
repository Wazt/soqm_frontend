# SOQM Frontend — Quality Reviewer Assistant

Frontend for the SOQM platform: an ISQM 1 quality-management dashboard for audit
teams, built around the **Quality Reviewer Assistant** vision — upload final work
(PDF, PPTX), have it reviewed against the firm's Quality Standards, and ask the
SOQM Chatbot questions grounded in those standards.

## Stack

- React 19 + Vite, JavaScript (JSX)
- Tailwind CSS v4 (CSS-first, no tailwind.config)
- shadcn/ui ("base-nova" style on @base-ui/react)
- React Router DOM 7, Axios, JWT auth

## Getting started

1. Start the backend ([soqm_backend](https://github.com/abdelatifaitouche/soqm_backend)):
   `docker compose up` (FastAPI on **:8000**, Postgres on :5432), then run
   `python init_db.py` / `seed_db.py` to create tables, roles, permissions, the
   super user, and the 8 SOQM components.
2. Start the frontend:

   ```sh
   npm install
   npm run dev        # http://localhost:5173
   ```

   API calls are proxied by Vite (`/api` → `http://localhost:8000`) because the
   backend has no CORS middleware and the refresh cookie is SameSite=Lax —
   no extra configuration needed.
3. Sign in with the seeded super user (the credentials defined in the backend's
   `.env`: `SUPER_USER_EMAIL` / `SUPER_USER_PWD`).

## Feature status

| Module | Route | Status |
| --- | --- | --- |
| Login / JWT session (refresh rotation) | `/login` | **Live** against `/api/v1/auth/*` |
| Quality Dashboard | `/` | **Live** components data + sample widgets |
| SOQM Components | `/components` | **Live** against `GET /api/v1/components` |
| Quality Objectives | `/objectives` | Preview (live components + sample objectives) |
| Document Library + Quality Review | `/documents`, `/documents/:id` | Preview — mirrors the planned ingestion/review API |
| SOQM Chatbot | `/chatbot` | Preview — mirrors the planned RAG retrieval API |
| Departments, Employees, Processes, Procedures, Risks, Monitoring, EQR, Findings, Tasks, Alerts, Reports | various | Preview (sample data) |

Preview pages are marked in-app with a "Preview module" banner and are driven by
module-level `SAMPLE_*` data, structured to match the backend vocabulary
(document statuses `PENDING → PROCESSING → INGESTED`, criteria-based review
scores, chunk sources) so they can be wired to real endpoints as they ship.

## Project conventions

See [CLAUDE.md](CLAUDE.md) for structure, path aliases, the backend contract,
and component conventions.
