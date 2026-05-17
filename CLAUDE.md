# CLAUDE.md — Gambia Sports Platform

## What This Is

A Next.js web platform for Gambian football. Full product documentation is in `project_docs/`:

- `Blueprint.md` — vision, database schema, tech stack, revenue model, architecture
- `SRS.md` — user stories, business rules, acceptance criteria, permissions
- `UIDesign.md` — colour palette, component specs, page layouts, interaction patterns
- `ImplementationGuide.md` — step-by-step build guide for all phases

Read the relevant doc before starting any module. This file covers how to work, not what to build.

---

## Before Writing Any Code

1. **Check `README.md`** — it documents the current state of the codebase. Use it as the source of truth for what exists.
2. **Verify before creating** — before creating any file, check whether it already exists. If it does, read it first and work with it rather than replacing it.
3. **Flag disagreements before acting** — if something in `project_docs/` appears incorrect, conflicts with what is in the codebase, or if there is a better approach, say so clearly before implementing anything. Do not silently deviate.

---

## Stack

| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16 | App Router. Verify next.config details in README. |
| Supabase | 2.x | DB + Auth + Realtime + Storage |
| Tailwind CSS | 4.x | CSS-first config |
| TypeScript | 5.x | Strict mode |
| Vercel | Latest | Auto-deploys `main` |

---

## Core Principles

These are guidelines, not rigid rules. If there is a better way to achieve the same goal, propose it before implementing.

### Keep data fetching in one place
Database queries should live in a dedicated queries module rather than scattered across page files. This makes them easy to find, reuse, and test. Where exactly that module lives — confirm with the existing structure in README.

### Server components for data, client components for interaction
Pages that only display data should be server components. Components that need `useState`, event handlers, or browser APIs should be client components. If the existing codebase has established a different pattern for good reason, follow that pattern and document why.

### Business logic separate from UI
Calculations like standings, tiebreakers, permission checks, and slug generation should live in utility modules — not inside page or component files.

### Types over `any`
Use TypeScript types throughout. If the project has a types file, use it. If types are missing or incomplete, add them.

### Components do one thing
Each component should have a clear single purpose. If a component is doing too much, split it.

---

## Styles

All shared styles, colour tokens, and design constants go in one place. Check README for where the project currently defines these — it may be `globals.css`, a `tokens.css` file, a `theme.ts`, or similar.

Do not scatter colour values or spacing constants across component files. If a colour is used in more than one place, it belongs in the shared styles location.

The full design system — colours, typography, component patterns, spacing — is documented in `project_docs/UIDesign.md`. Use it as the reference when building UI.

---

## Code Organisation

- One component per file
- File names reflect what the component or module does
- Folder structure groups by feature or responsibility — check README for the established structure and follow it
- No dead code — do not leave commented-out blocks in committed files
- No hardcoded IDs, UUIDs, or magic strings — query for them or define them as named constants

---

## Documentation

Everything must be documented. This is what makes the project continuable by any developer or agent at any point.

### Query functions
Every database query function needs a comment explaining what it fetches, what parameters it takes, and which pages or features use it.

```typescript
/**
 * Returns all completed matches for a season with home/away team data.
 * Excludes tournament matches. Used by the standings and results pages.
 */
export async function getMatchesForStandings(seasonId: string) { ... }
```

### Components
Every component needs a brief comment on its purpose, its props, and any non-obvious behaviour.

```typescript
/**
 * Renders the last N match results for a team as W/D/L badges.
 * Ordered oldest-left to newest-right. Each badge links to the match page.
 */
export function FormStrip({ results, teamId }: Props) { ... }
```

### Complex logic
Any logic that is not immediately obvious — tiebreaker calculations, bracket seeding, fixture generation, permission resolution — must have inline comments walking through each step. Another developer should be able to understand it without reading the SRS.

### Decisions and deviations
If you make a structural decision that differs from what is in `project_docs/`, or if you discover an error in the documentation, add a comment at the point of divergence explaining what was changed and why. Also note it in your response so the developer is aware.

---

## When Something Is Unclear or Wrong

Do not guess and do not silently deviate. If you encounter any of the following:

- A conflict between `project_docs/` and the actual codebase
- An error or inconsistency in the documentation
- A situation where the documented approach would cause a problem
- A better architectural approach than what is documented

Stop and explain the issue clearly before writing code. Describe what you found, what the options are, and what you recommend. Wait for confirmation if the decision is significant.

---

## Error Handling

Every async operation that can fail should handle failure gracefully:

- Server components: wrap data fetching in try/catch and render a friendly error state
- Client components: show inline errors near the relevant field — never use `alert()`
- Forms: disable the submit button while a request is in flight, show the result clearly

---

## Destructive Actions

Any action that permanently changes data — correcting a final score, deactivating a user, deleting a record — must show a confirmation step that states exactly what will happen before executing.

---

## Mobile

Every public page must work on a 375px screen without horizontal scrolling (the knockout bracket is the one intentional exception). All tappable elements must be large enough to tap comfortably. Test at mobile width before marking a page done.

---

## Empty States

Every list and table section needs a defined empty state. Never render an empty container with no explanation.

---

## Phase Boundaries

Build phases in order. Do not build Phase 2+ features while Phase 1 is incomplete. The phase breakdown is in `project_docs/ImplementationGuide.md`.

---

## Git Commits

```
feat: add standings page with promotion zone highlighting
fix: correct tiebreaker logic for equal goal difference
refactor: move FormStrip into standalone component
docs: add JSDoc to query functions
```

Lowercase, imperative, one concern per commit.

---

## Definition of Done

A feature is complete when:

- [ ] Works on desktop and 375px mobile
- [ ] Loading and error states are handled
- [ ] Empty states are defined
- [ ] All functions and components are commented
- [ ] Complex logic has inline comments
- [ ] No `any` types
- [ ] Styles use shared tokens, not scattered hex values
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] README is updated to reflect the current state
