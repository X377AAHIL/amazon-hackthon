# Intelligent Bridge

AI-powered reverse logistics platform for Amazon, built for Amazon Hackathon 2026.

## What This Project Does

Intelligent Bridge is a hackathon prototype for reverse logistics and circular commerce. It takes returned items through an AI-assisted workflow that can:

- grade the product condition from an image
- recommend the best recovery route
- flag suspicious returns for fraud review
- match recovered items with interested marketplace buyers
- track the lifecycle and sustainability impact of each return

The current implementation is intentionally demo-driven. All core flows use mock API routes with artificial delays so the UI feels like it is talking to an AI backend, while the frontend remains fast to iterate on.

## Problem Statement

Amazon returns are a massive operational and environmental challenge. The goal of Intelligent Bridge is to reduce landfill waste, improve resale recovery, and surface fraud earlier in the return lifecycle.

The product narrative behind this prototype is:

- returned items are inspected automatically
- good items are routed into the best recovery channel
- suspicious items are blocked before refund leakage grows
- viable products are connected to buyer demand in real time
- every item gets a lifecycle record and sustainability passport

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- Lucide React
- Axios
- shadcn/ui-style primitives from the Nova preset

## App Architecture

The app uses the Next.js App Router with a persistent shell:

- [src/app/layout.tsx](src/app/layout.tsx) provides the root layout, metadata, top navigation, and sidebar.
- [src/app/page.tsx](src/app/page.tsx) redirects the root route to `/dashboard`.
- [src/app/loading.tsx](src/app/loading.tsx) provides a global loading spinner.

The UI follows a dark Amazon-inspired theme using custom CSS variables and reusable utility classes from [src/app/globals.css](src/app/globals.css).

## Routes

| Route          | Purpose                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `/dashboard`   | Live operational overview with KPI cards, charts, and queue data            |
| `/grading`     | AI product inspection flow with upload, confidence, grade, and route result |
| `/routing`     | Smart routing center with route recommendations and recovery value          |
| `/fraud`       | Fraud detection view with alert cards and side-by-side comparison           |
| `/marketplace` | Buyer matching flow for recovered items                                     |
| `/lifecycle`   | Digital product passport with timeline and sustainability metrics           |

## Data Flow

The current frontend is wired around mock APIs and local mock data.

### API Routes

| Endpoint         | Method |  Delay | Purpose                                                        |
| ---------------- | ------ | -----: | -------------------------------------------------------------- |
| `/api/grade`     | POST   | 1500ms | Returns grade, confidence, resale value, route, and fraud flag |
| `/api/route`     | POST   |  800ms | Returns routing recommendations and recovery impact            |
| `/api/fraud`     | POST   | 1200ms | Returns fraud probability and case details                     |
| `/api/dashboard` | GET    |  500ms | Returns dashboard KPIs and weekly activity data                |
| `/api/match`     | GET    | 2000ms | Returns buyer match list and total matches                     |

### Service Layer

[src/services/api.ts](src/services/api.ts) wraps those endpoints with Axios helpers:

- `gradeProduct(formData?)`
- `getRouteRecommendations(gradeData?)`
- `checkFraud(formData?)`
- `getDashboardData()`
- `findBuyerMatches()`

### Mock Data

[src/lib/mockData.ts](src/lib/mockData.ts) holds the static demo data used by the non-API-driven parts of the UI:

- `PRODUCTS`
- `DASHBOARD_STATS`
- `WEEKLY_DATA`
- `ROUTE_DISTRIBUTION`
- `FRAUD_CASES`
- `BUYERS`
- `TIMELINE_EVENTS`

## Components

The reusable component layer is split between layout and UI primitives.

### Layout Components

- [src/components/layout/Topbar.tsx](src/components/layout/Topbar.tsx) renders the persistent header and active route tabs.
- [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx) renders the icon-based navigation rail.

### UI Components

- [src/components/StatCard.tsx](src/components/StatCard.tsx) renders KPI cards used on the dashboard and other views.
- [src/components/GradeBadge.tsx](src/components/GradeBadge.tsx) renders grade badges for A/B/C/D/FRAUD states.
- [src/components/RouteBadge.tsx](src/components/RouteBadge.tsx) renders route tags for route recommendations.
- [src/components/ConfidenceBar.tsx](src/components/ConfidenceBar.tsx) renders a confidence meter.
- [src/components/UploadZone.tsx](src/components/UploadZone.tsx) handles image upload interaction.
- [src/components/ProductRow.tsx](src/components/ProductRow.tsx) is a lightweight product row helper.

## Styling System

The visual language is Amazon-inspired and consistent across the pages:

- dark backgrounds with high-contrast cards
- orange as the primary brand accent
- semantic color tokens for success, warning, error, and info
- reusable classes such as `.amz-card`, `.btn-primary`, `.btn-ghost`, `.fade-in`, and `.spinner`

This setup keeps the UI visually cohesive without introducing a large design system dependency.

## Important Implementation Notes

- The main pages are client components so the demo can stay highly interactive.
- The current UI uses local state and mock API calls rather than a backend database or auth layer.
- The root route redirects straight to `/dashboard` to make the app feel like a finished product immediately.
- The build is configured to work with both the `src/` app tree and the legacy root shadcn-style scaffold files.
- The project currently focuses on presentation and workflow simulation, not persistence or identity management.

## Project Structure

```text
src/
	app/
		api/
			dashboard/
			fraud/
			grade/
			match/
			route/
		dashboard/
		fraud/
		grading/
		lifecycle/
		marketplace/
		routing/
		layout.tsx
		loading.tsx
		page.tsx
	components/
		layout/
		ConfidenceBar.tsx
		GradeBadge.tsx
		ProductRow.tsx
		RouteBadge.tsx
		StatCard.tsx
		UploadZone.tsx
	hooks/
	lib/
	services/
	types/
```

There are also legacy shadcn-style helpers at the project root (`components/` and `lib/`) that remain part of the workspace.

## Prerequisites

Before running the app, make sure the following are installed on your system:

- Node.js 20 or later
- npm

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build Check

```bash
npm run build
```

The project currently builds successfully with TypeScript enabled.

## Future Work

This prototype is ready for production integration points, but it still uses mocked backend behavior. The next logical steps are:

- wire the API routes to AWS Bedrock or SageMaker
- add persistence for grades, fraud cases, and buyers
- introduce authentication and role-based access
- add responsive refinements for smaller screens
- replace demo delays with real backend latency and error handling

## Team

Built by Coderaki for Amazon Hackathon 2026.
