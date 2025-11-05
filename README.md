# Mabruk User Management Prototype

This repository hosts exploration assets for the Mabruk user-management platform. It now includes a React client prototype backed by mock data that mirrors the UI wireframes in `docs/ui-sketch.md`.

## Client application

The `client` folder contains a Vite + React + TypeScript application styled with Tailwind CSS. It renders the core flows for both the global administrator and organization managers:

- Landing overview with quick navigation cards
- Organization management tables for the global admin
- Detailed organization dashboard with subscribers, groups, and course assignments
- Organization-level view with status filtering and recent activity cards
- Course catalog summary and executive insights dashboard

### Prerequisites

- Node.js 18+

### Setup & scripts

```bash
cd client
npm install       # installs dependencies (requires npm registry access)
npm run dev       # starts the Vite dev server on http://localhost:5173
npm run build     # builds the production bundle under dist/
npm run preview   # serves the production build locally
```

> **Note:** The project uses static mock data and does not communicate with the .NET backend yet.

## Documentation

High-level UI flows and design assumptions are documented in [`docs/ui-sketch.md`](docs/ui-sketch.md).
