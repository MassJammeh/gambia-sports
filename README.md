# Gambia Sports

A minimal Next.js scaffold for the Gambian football platform.

This repository currently contains the reduced starter version of the app with a Supabase browser client connection and the main app shell. The README is the primary source of truth for the current codebase and must be updated whenever the project structure, dependencies, or supported features change.

## Current state

- `src/app/page.tsx` — minimal home page component
- `src/app/layout.tsx` — root layout for the Next.js App Router
- `src/app/globals.css` — global styles for the app
- `src/lib/supabase/client.ts` — Supabase browser client setup
- `project_docs/` — design and requirements documents
- `CLAUDE.md` — agent workflow guidance and repo conventions

The app is intentionally minimal today. New pages, components, and business logic should be added in a way that matches the existing structure and the project documentation.

## Repository structure

```
.
├── CLAUDE.md
├── README.md
├── package.json
├── package-lock.json
├── project_docs/
│   ├── srs.md
│   ├── technical_blueprint.md
│   └── ui_ux_design.md
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── supabase/
│           └── client.ts
├── next.config.ts
├── tsconfig.json
└── .gitignore
```

## Key files

- `src/app/page.tsx`
  - Rendered home page contents.
- `src/app/layout.tsx`
  - Root App Router layout, metadata, and hydration guidance.
- `src/app/globals.css`
  - Minimal global CSS for the application.
- `src/lib/supabase/client.ts`
  - Creates the Supabase browser client using environment variables.
- `CLAUDE.md`
  - Working conventions, documentation expectations, and architecture guidance.
- `project_docs/`
  - Contains SRS, blueprint, and UI design documentation.

## Documentation

This repo uses `project_docs/` as the documentation source for overall architecture and product requirements:

- `project_docs/srs.md` — user stories, business rules, acceptance criteria
- `project_docs/technical_blueprint.md` — architecture, schema, tech stack, revenue model
- `project_docs/ui_ux_design.md` — UI patterns, colour palette, components, layouts

Also review `CLAUDE.md` before making changes. It explains teamwork conventions and how to avoid unnecessary rewrites.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with Supabase environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Lint the code:

```bash
npm run lint
```

## Supabase client

The Supabase client is created in `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

Make sure the required environment variables are present in `.env.local` before running the app.

## Development notes

- Keep page-level data fetching in dedicated query modules when adding new features.
- Keep UI components small and focused.
- Use TypeScript types and avoid `any`.
- Document new code in comments and update this README when new sections are added.

## Update policy

This `README.md` should be updated regularly as the repository evolves. If a new feature, route, or major refactor is added, update the relevant sections here so future developers and collaborators understand the current codebase immediately.
