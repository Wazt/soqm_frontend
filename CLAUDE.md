# Project Overview
Frontend dashboard app built with Vite + React (JavaScript). Uses JWT authentication, a sidebar-based layout, and communicates with a REST backend via Axios.

# Tech Stack
- React 19 + Vite
- React Router DOM (routing)
- Tailwind CSS v4 (via @tailwindcss/vite)
- shadcn/ui, "base-nova" style on @base-ui/react (components live in src/components/ui/)
- Axios (API calls)
- JWT (authentication)

# Project Structure
src/
├── api/               # Axios client + endpoint functions per resource
├── components/ui/     # shadcn auto-generated components (do not edit manually)
├── components/common/ # Shared custom components
├── context/           # AuthContext (JWT state, login, logout)
├── hooks/             # Custom hooks (useAuth, useFetch, etc.)
├── layouts/           # AppLayout (sidebar + outlet), AuthLayout
├── pages/             # One folder per feature/route
├── router/            # AppRouter, PrivateRoute, route constants
├── utils/             # tokenUtils, formatters, validators
└── assets/            # Static files

# Path Aliases
@ maps to src/ — always use @/ imports, never relative paths like ../../

# Environment Variables
- VITE_API_BASE_URL — backend base URL
- .env.development   → /api/v1 (relative — requests go through the Vite dev proxy
  in vite.config.js to the FastAPI backend on http://localhost:8000; the backend
  has no CORS middleware and uses a SameSite=Lax refresh cookie, so same-origin
  proxying is required in dev)
- .env.production    → real backend URL (never committed)

# Backend Contract (refactored soqm_backend — FastAPI on :8000, base path /api/v1, CORS for :5173)
- Auth: POST /auth/login/ {email,password}→{access_token}+httpOnly refresh cookie; POST /auth/refresh/;
  POST /auth/register/ {first_name,last_name,email,password,role_id}; GET /auth/list?page&limit;
  PATCH /auth/{id}/block/; GET /auth/roles→[{id,name}]; POST /auth/{id}/roles/ {role_id}.
  NO generic user PUT/DELETE — only register + block + assign-role.
- Components: GET /components (perm component:read); POST /components/; GET /components/{id};
  PATCH /components/{id}/; DELETE /components/{id}/. status ∈ ACTIVE|IN_ACTIVE|ARCHIVED
  (state machine ACTIVE↔IN_ACTIVE, both→ARCHIVED terminal). Max 8; delete only when ARCHIVED. display_order 1-8.
- Objectives (no auth yet): GET /objectives?page&limit; POST /objectives/; GET /objectives/{id};
  PATCH /objectives/{id}/; DELETE /objectives/{id}/. 9 states draft→approved→active↔under_review→revised,
  active/suspended→archived. Edit/delete only while draft.
- Risks: POST /risks/ only (GET not implemented → degrade gracefully). score = occurence × significance (1-9).
- Departments: GET /organization/departments; POST /organization/departments/; GET /{id}. children_dept hierarchy.
- Roles: SUPER_ADMIN, ADMIN, MANAGER, REVIEWER, OPERATOR, QUALITY_CHAMPION, VIEWER (seeded perms: admins=all,
  MANAGER=auth:read+component:read, OPERATOR=component:read, rest=none).
- Trailing slashes matter (see above). Errors: {message, code, details}; validation 422 {message, errors:[...]}.
- No /me endpoint — identity (sub, email, role) decoded from the access JWT.
- src/lib/status.js mirrors all enums + state machines; src/lib/demo.js is a faithful in-memory simulator.
- Remaining preview-only pages (documents, processes, eqr, findings, …) still use <PreviewBanner /> sample data.

# API Layer
- src/api/axiosClient.js is the base Axios instance
- It reads VITE_API_BASE_URL from env (falls back to /api/v1)
- Interceptors: request injects Bearer token; response retries once after
  /auth/refresh/ on 401 (auth endpoints excluded), then logs out on failure
- All API calls go through axiosClient, never raw fetch

# Auth
- JWT access token stored in localStorage via src/utils/tokenUtils.js
- Refresh token lives in an httpOnly cookie managed by the backend
- AuthContext provides: user (decoded JWT: sub, email, role), login(), logout(), isAuthenticated
- PrivateRoute wraps all protected routes and redirects to /login if not authenticated

# Routing Convention
- Public routes use AuthLayout (centered card)
- Protected routes use PrivateRoute → AppLayout (sidebar + topbar)
- Route path constants defined in src/router/routes.js

# Component Conventions
- shadcn components: added via `npx shadcn@latest add <component>`, never written manually
- Custom shared components go in src/components/common/
- Feature-specific components go inside the page folder (e.g. src/pages/users/components/)

# Commands
- npm run dev       → start dev server
- npm run build     → production build
- npm run preview   → preview production build