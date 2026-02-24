# Camp 42 Dashboard

A mobile-friendly web dashboard for monitoring Camp 42. Designed to track batteries
and solar, via Ecoflow, weather via Tempest, and on site cameras.

## Architecture

This project is a monorepo using **pnpm workspace** with three packages:

- **`apps/frontend`** -- Vite + Mithril + Web Awesome. A lightweight SPA that displays camp status.
- **`apps/backend`** -- Firebase Cloud Functions (2nd Gen, Node 24, ESM). Bundled with tsup, which inlines the shared package for seamless cloud deployment.
- **`shared`** -- `@camp42/shared`, an internal package containing TypeScript interfaces and data contracts used by both frontend and backend.

## Prerequisites

- **Node 24 with Corepack enabled**
- **Firebase CLI**

## Getting Started

```bash
# Install dependencies
pnpm install

# Verify everything compiles and passes lint
pnpm run check
```

## Development

The project is hosted on Firebase and supports running the Firebase emulators for
local testing and development. Recommended setup is to run the Cloud Functions
emulator and the Vite dev server in **separate terminals**. This gives you hot module
reloading on the frontend while the backend emulator serves your Cloud Functions
locally.

**Terminal 1 -- Backend emulator:**

```bash
cd apps/backend
pnpm run serve
```

**Terminal 2 -- Vite dev server with HMR:**

```bash
cd apps/frontend
pnpm run dev
```

## Scripts

Root-level scripts that operate across all packages:

| Script               | Description              |
| -------------------- | ------------------------ |
| `pnpm run typecheck` | TypeScript type checking |
| `pnpm run lint`      | Link checking            |
| `pnpm run check`     | Both typecheck and lint  |
| `pnpm run build`     | Build all packages       |

Each package also has its own `check`, `typecheck`, `lint`, and `build` scripts. The frontend additionally has `analyze` for bundle size visualization.

## Project Structure

```
camp-dashboard/
├── apps/
│   ├── frontend/             # Vite + Mithril SPA
│   │   └── src/
│   │       ├── components/   # UI components
│   │       ├── services/     # data fetching from the back end
│   │       ├── firebase.ts   # Firebase client config
│   │       └── main.ts       # app entry point
│   └── backend/              # Firebase Cloud Functions
│       └── src/
│           ├── index.ts      # Cloud Function exports
│           ├── batteries.ts  # battery status and management
│           └── libEcoflow.ts # simple library wrapping Ecoflow REST API
├── shared/                   # '@camp42/shared' TypeScript interfaces
│   └── src/
│       └── index.ts          # types shared between front and back end
├── firebase.json             # Firebase project config & emulator ports
├── tsconfig.base.json        # shared TypeScript settings
└── eslint.config.js          # lint settings
```
