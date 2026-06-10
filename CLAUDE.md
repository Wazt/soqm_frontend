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

# Backend Contract (soqm_backend — FastAPI on :8000, base path /api/v1)
- POST /auth/login/   {email, password} → {access_token}; sets httpOnly refresh_token cookie
- POST /auth/refresh/ (cookie)          → {access_token}; rotates the cookie
- GET  /components    (Bearer)          → [{id, name, isqm_reference}]
- Trailing slashes matter: auth routes have them, /components does not
- App errors: {message, details}; missing-auth-header: 403 {detail}; validation: 422 {detail: [...]}
- No /me endpoint — user identity (sub, email, role) is decoded from the access JWT
- All other modules (documents, objectives, risks, …) have NO endpoints yet —
  their pages are sample-data previews marked with <PreviewBanner />

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