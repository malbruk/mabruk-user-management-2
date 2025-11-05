# Mabruk User Management Prototype

This repository hosts exploration assets for the Mabruk user-management platform. It now includes:

- A React client prototype backed by mock data that mirrors the UI wireframes in `docs/ui-sketch.md`.
- A .NET 8 Web API project that exposes endpoints aligned with the existing Supabase/PostgreSQL schema.

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

## Server application

The `server/src` directory contains an ASP.NET Core Web API (`net8.0`) that implements CRUD operations and filtered queries for organizations, groups, courses, subscribers, subscriptions, and course assignments according to the Supabase schema.

### Prerequisites

- .NET SDK 8.0+
- PostgreSQL database that matches the Supabase schema provided earlier

### Configuration

Set the `DefaultConnection` string in `server/src/appsettings.json` (or via environment variables) to point to your Supabase-managed Postgres instance. The Supabase authentication section expects the standard values:

- `Supabase:ProjectRef` – your Supabase project reference (e.g., `abcxyz`)
- `Supabase:Url` – `https://<projectRef>.supabase.co`
- `Supabase:Audience` – usually the same as the project reference

When Supabase Google authentication is enabled, the API validates incoming JWTs issued by Supabase using the configured authority and audience. Endpoints require authentication by default, except for `/health` and Swagger UI in development.

### Running locally

```bash
cd server/src
dotnet restore
dotnet run
```

The API will be available on `https://localhost:7144` (Swagger UI opens automatically in development). Use the exposed routes to manage organizations, assign courses, and control subscribers/subscriptions while staying faithful to the database schema.

## Documentation

High-level UI flows and design assumptions are documented in [`docs/ui-sketch.md`](docs/ui-sketch.md).
