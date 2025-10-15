# React Boilerplate (Client + Server + Shared)

A modern Yarn 4 monorepo starter with:
- client: Vite + React 19 + MUI
- server: Node/Express utilities (ESM)
- shared: isomorphic utilities used by both client and server

This README covers cloning, installing Node & Yarn, installing dependencies, running in dev, building, environment configuration, linting, quick testing, and adding a Git repository/remote.

## Prerequisites
- Node.js 20+ recommended (LTS works). Verify with:
  - `node -v`
- Yarn 4 via Corepack (pinned to yarn@4.10.2 in package.json). Enable Corepack once:
  - `corepack enable`
  - Optionally verify: `yarn -v`

If you don't have Node, install from https://nodejs.org or via a version manager (nvm, fnm, volta).

## Getting Started

### 1) Clone this repository
- Using HTTPS:
  - `git clone https://github.com/<your-org-or-user>/react-boilerplate.git`
- Or with SSH:
  - `git clone git@github.com:<your-org-or-user>/react-boilerplate.git`

Then change into the project directory:
- `cd react-boilerplate`

### Alternative: Start from an empty directory and add this as a remote
If you created a new, empty repo locally:
- `git init -b main`
- `git remote add origin https://github.com/<your-org-or-user>/<your-repo>.git`
- Add your first commit:
  - `git add -A`
  - `git commit -m "chore: initial commit from react boilerplate"`
  - `git push -u origin main`

### 2) Install dependencies
Run at the repository root only (workspaces are wired automatically):
- `yarn install`

This uses the pinned Yarn 4 via Corepack and installs for all workspaces.

## Workspace Overview
- client: Vite app, React 19, MUI; dev via `vite`, build via `vite build`.
- server: Node service; dev via `nodemon` watching `src`, start via `node src/lockpickersUnitedServer.js`.
- shared: Common ESM modules used by both client and server.
- client-dist: Build artifact copied from `client/dist` by the root build script (do not edit directly).

## Run in Development
From the repo root:
- Full dev (client + server concurrently):
  - `yarn dev`
    - Client: Vite on http://localhost:5173
    - Server: nodemon on the API (see server section)

Client-only:
- `yarn workspace @starter/client dev`

Server-only:
- `yarn workspace @starter/server dev`

Convenience aliases at root:
- `yarn client` → client dev server
- `yarn server` → API dev server

## Build and Preview
- Build client and copy artifact to `client-dist/`:
  - `yarn build`
- Build all workspaces that define a build script:
  - `yarn build-all`
- Preview the built client (serve static):
  - `yarn workspace @starter/client preview --port 3000`

Notes:
- Root build currently builds only the client. If the server needs a build step later, wire it via its workspace `build` script and rely on `build-all`.

## Environment Configuration
Server reads `.env` via `dotenv` in `server/src/lockpickersUnitedServer.js`. Create `server/.env` with:

```
# Optional: comma-separated CORS origins. In dev, defaults to permissive true.
CORS_ORIGIN=http://localhost:3000,https://example.com

# Required for /api/discord: full Discord webhook URL.
# If missing, server returns { error: 'server_misconfigured' } for that route.
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/…
```

Client environment variables (if you add any) should follow Vite’s convention and be prefixed with `VITE_` (e.g., `VITE_API_BASE`). Access via `import.meta.env.VITE_API_BASE`.

Readiness and health endpoints (server):
- `GET /api/ready` → `{ ready: true }`
- `GET /api/health` → `{ ok: true }`

## Linting & Code Style
- Run linter at root:
  - `yarn lint`
- Config: `eslint.config.cjs` (flat config). Highlights:
  - React rules enabled; `react/prop-types` disabled.
  - `no-unused-vars`: warn with `ignoreRestSiblings: true`.
  - `react-hooks/exhaustive-deps`: warn.
  - Quotes: single preferred; Semicolons: omitted (warn on deviations).
  - `import/extensions`: enforce bare imports for js/jsx; json requires explicit `.json`.

## Minimal Test Pattern (no test runner yet)
A formal test framework isn’t configured. For quick checks, use Node’s built-in `assert` in a temporary file and run it directly with Node. Example:

Create `shared/src/example.test.js`:
```js
import assert from 'node:assert/strict'
import { API_PREFIX, sleep } from '@starter/shared'

assert.equal(API_PREFIX, '/api', 'API prefix should be /api')
const t0 = Date.now()
await sleep(50)
assert.ok(Date.now() - t0 >= 45, 'sleep should wait ~50ms')
console.log('ok: shared utilities basic tests passed')
```
Run it:
- `node shared/src/example.test.js`
Then remove the temporary test file to keep the repo tidy.

Guidance for future tests:
- Consider Vitest for the client and a light-weight runner (Vitest or node:test) for shared/server.
- Keep tests workspace-local and ESM-friendly.

## Git: Initialize or Connect to a Remote
Initialize a new repo locally (if starting fresh):
- `git init -b main`
- `git add -A`
- `git commit -m "chore: initial commit"`

Add a remote and push:
- HTTPS: `git remote add origin https://github.com/<your-org>/<your-repo>.git`
- SSH: `git remote add origin git@github.com:<your-org>/<your-repo>.git`
- `git push -u origin main`

If you cloned first and just need to set your own remote:
- `git remote set-url origin https://github.com/<your-org>/<your-repo>.git`

## Debugging Tips
- Client (Vite): Fast Refresh enabled; use browser devtools. If you see import resolution warnings for bare imports or JSON extensions, check ESLint rules and Vite aliasing.
- Server: `yarn workspace @starter/server dev` gives nodemon reloads. For inspector:
  - `NODE_OPTIONS=--inspect yarn workspace @starter/server start`
- Shared: Keep modules ESM-friendly; avoid CommonJS-only patterns unless gated.

## Project Structure (high level)
```
client/        # Vite + React 19 app
server/        # Node/Express utilities (ESM), routes, .env support
shared/        # Common isomorphic utilities
client-dist/   # Build artifact copied from client/dist (do not edit)
scripts/       # Build and convenience scripts
```

## Troubleshooting
- Ensure Corepack is enabled; Yarn should be v4.x per the repo pin:
  - `corepack enable && yarn -v`
- Delete node_modules and reinstall if packages look out-of-sync:
  - `rm -rf node_modules && yarn install`
- Port conflicts: Vite defaults to 5173; preview example uses 3000.
- Discord webhook errors will surface as `discord_webhook_failed`; ensure `DISCORD_WEBHOOK_URL` is set and valid.

## License
See [LICENSE](./LICENSE).
