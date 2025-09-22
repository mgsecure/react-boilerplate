# Development Guidelines

This document captures project-specific practices and commands that help advanced contributors work efficiently across the workspaces.

## Project Overview
- Package manager: Yarn 4 (Corepack) — packageManager set to `yarn@4.10.2` in the root.
- Workspaces: `client` (Vite + React 19), `server` (Node/Express utilities), `shared` (isomorphic utilities).
- Root scripts orchestrate workspace tasks and linting.

Directory layout highlights:
- client: Vite app, React 19, MUI; dev server via `vite`, build via `vite build`.
- server: Node service; dev via `nodemon` watching `src`, start via `node src/index.js`.
- shared: Common modules consumed by both client and server.
- client-dist: Build artifact copied from `client/dist` by the root build script (do not edit directly).

## Build and Run
Prereqs:
- Node 20+ recommended.
- Enable Corepack to use pinned Yarn: `corepack enable` once globally.
- Install dependencies at the root only: `yarn install`.

Common commands (run at repo root):
- Development (client + server concurrently):
  - `yarn dev`
    - Runs client: `yarn workspace @starter/client dev` (Vite on default port 5173).
    - Runs server: `yarn workspace @starter/server dev` (nodemon on src/index.js).
- Client-only:
  - `yarn workspace @starter/client dev`
  - `yarn workspace @starter/client build`
  - `yarn workspace @starter/client preview --port 3000`
- Server-only:
  - `yarn workspace @starter/server dev`
  - `yarn workspace @starter/server start`
- Build for deploy:
  - `yarn build` — Builds client, clears `client-dist`, copies `client/dist` -> `client-dist`.
  - `yarn build-all` — Runs `build` in all workspaces that define it.

Notes:
- Root build currently builds only the client. If server needs a build step in the future, wire it via workspace `build` and rely on `build-all`.
- Static deploys can serve `client-dist` as the SPA artifact.

## Linting and Code Style
- Root lint command: `yarn lint` (targets `{client,server,shared}/**/*.{js,jsx}`).
- Config: `eslint.config.cjs` (flat config, React rules, import plugin, globals for browser+node).
  - Key rules tweaked:
    - `react/prop-types`: off (prefer TS or other typing; not enforced).
    - `no-unused-vars`: warn with `ignoreRestSiblings` true.
    - `react-hooks/exhaustive-deps`: warn.
    - Quotes: single preferred; Semicolons: omitted (warn on deviations).
    - `import/extensions`: enforce bare imports for js/jsx; json needs explicit extension.
  - Global ignores include build outputs, node_modules, assets, and markdown.
- Pre-commit (optional): lint-staged config exists; wire into git hooks as desired.

## Testing
There is no dedicated test framework configured yet (e.g., Jest/Vitest). For quick verification and to keep the repo minimal, you can run workspace-level assertions using Node’s built-in `assert`. Below is a demonstrated example that was created, executed, and then removed to keep the repo clean. Use this pattern when you need a lightweight check without adding dependencies.

Quick test pattern (example):
1. Create a temporary script file (e.g., `shared/src/example.test.js`) that imports a utility from `@starter/shared` (or any module you need to validate) and uses `node:assert/strict`.

   Example content:
   - `import assert from 'node:assert/strict'
import { example } from '../src/index.js' // adjust path as needed

assert.equal(example(2), 4, 'example should double the input')
console.log('ok: example doubles input')`

2. Run the test using Node from the workspace directory to ensure module resolution and ESM semantics match:
   - `node shared/src/example.test.js`

3. Observe output:
   - On success: `ok: example doubles input`
   - On failure, Node will throw an AssertionError with details and non-zero exit code.

4. Remove the temporary test file(s) after validating to keep the repo tidy, as per project convention.

Guidelines for adding tests going forward:
- If the project grows, prefer introducing Vitest in the client and a light-weight runner (Vitest or node:test) in shared and server.
- When adding a formal test runner:
  - Avoid global state; keep tests workspace-local.
  - Configure ESM properly; this repo uses `"type": "module"` in workspaces.
  - Add a `test` script per workspace and, optionally, a root `workspaces foreach run test` script.

## Debugging Tips
- Client (Vite):
  - Source maps are on by default in dev; use the browser devtools. React 19 Fast Refresh is supported by Vite’s plugin.
  - If you see import resolution warnings for bare imports or JSON extensions, check `import/extensions` rule alignment and Vite aliasing.
- Server:
  - Run `yarn workspace @starter/server dev` to get `nodemon` reloads.
  - Use `NODE_OPTIONS=--inspect` with `server start` if you need an inspector: `NODE_OPTIONS=--inspect yarn workspace @starter/server start`.
- Shared:
  - Keep modules ESM-friendly; avoid CommonJS-specific patterns unless gated.

## Environment Configuration
- Server reads `.env` via `dotenv` in `server/src/index.js`. Place `.env` in `server/`.
- Required env vars:
  - `CORS_ORIGIN` (optional): comma-separated origins. Defaults to permissive `true` in dev.
  - `DISCORD_WEBHOOK_URL` (required for /api/discord): full Discord webhook URL. Not set in code; must be provided in env. The server returns `{ error: 'server_misconfigured' }` if missing.
- Client environment variables should use Vite’s `import.meta.env` convention if introduced later; remember to prefix with `VITE_`.

## Conventions
- Imports prefer extensionless `.js`/`.jsx` within the repo; JSON must include `.json` per ESLint rule.
- Use named exports from shared modules when practical to aid tree-shaking.
- Keep React components function-based; follow React Hooks rules (already enforced).

## Minimal Verified Test Run (documented)
- Verified on 2025-09-20: created `shared/src/example.test.js` that asserted `API_PREFIX === '/api'` and that `sleep(50)` awaited ~50ms, then ran `node shared/src/example.test.js` with output:
  - `ok: shared utilities basic test passed`
- The temporary file was removed afterward to keep the repo clean. Recreate it as needed using the Quick test pattern.


## Additional Improvements (2025-09-20)
- Server CORS origin is now configurable via env var `CORS_ORIGIN` (comma-separated list allowed). Example: `CORS_ORIGIN=http://localhost:3000,https://example.com`. Defaults to permissive `true` in dev.
- Added readiness endpoint: `GET /api/ready` (returns `{ ready: true }`). Existing health check `GET /api/health` returns `{ ok: true }`.
- Startup logging now includes `{ env, port, host, corsOrigin }` for quick diagnostics.
- New shared helper: `assertEnv(name, fallback?)` exported from `@starter/shared` to fetch env vars with optional fallback or throw if missing.
- Root convenience scripts added:
  - `yarn client` => runs client dev server.
  - `yarn server` => runs API dev server.
