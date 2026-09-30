# Project Sticky Notes architecture

## Current baseline

This repository is a Next.js 16 App Router starter with React 19, strict TypeScript, Tailwind CSS v4, shadcn/base-ui primitives, Zod, react-hook-form, and Sonner notifications. It has a protected-route layout shell and a typed API client ready for backend integration, but it does not yet have authentication, a database, Prisma, API routes, a scheduler, or a test runner.

The application will extend these established conventions:

- Feature code belongs in `features/<feature>` and is exposed through its `index.ts` barrel.
- Interactive UI remains in focused client components; pages and data access stay server-side where possible.
- Forms use react-hook-form and Zod; mutations validate on the server too.
- UI uses existing `components/ui`, Tailwind tokens in `app/globals.css`, and `lib/toast.ts` for user-facing feedback.
- Routes and navigation are added through `config/routes.ts` and the existing panel shell, rather than by replacing the layout.

## Planned MVP boundaries

PostgreSQL and Prisma will be the authoritative data layer. A future auth implementation must provide a server-side current-user boundary before any project or note mutation is exposed; every query and mutation will constrain records by that user. The starter's current no-op `proxy.ts` is not security.

The initial models will be `User`, `UserSettings`, `Project`, and `StickyNote`. `Project` and `StickyNote` use ACTIVE/ARCHIVED status enums. Notes have nullable `projectId`, `expiresAt`, `archivedAt`, and `deletedAt` fields. Expiration is always archival, never deletion; `expiresAt <= now` is the expiry source of truth even if the maintenance job is delayed.

Database migrations will be created with Prisma and include only query-driven indexes: note `projectId + status`, `userId + status`, and `status + expiresAt`. All timestamps are UTC. User-selected display timezone can be added to `UserSettings` when settings are introduced.

## Delivery phases

1. **Foundation** — add Prisma/PostgreSQL configuration, an authentication boundary, the initial migration, and project CRUD.
2. **Notes** — add validated, ownership-scoped sticky-note CRUD with soft delete and the project page.
3. **Lifecycle** — add expiration calculation, idempotent archival maintenance callable by a deployment scheduler, and archived-note restore.
4. **Quick Capture** — add a compact, keyboard-first dialog with browser-scoped Ctrl/Cmd+Shift+Space and Ctrl/Cmd+Enter; it uses the current project route when available and otherwise creates a global inbox note.
5. **Find and settings** — add PostgreSQL-backed search, archive filtering, project assignment for inbox notes, and default expiration settings.
6. **Hardening** — add unit/integration/e2e coverage, accessibility review, pagination, error states, and deployment scheduling instructions.

Each phase will be checked with lint, TypeScript/build validation, and the test coverage added for that phase before the next one begins.

## Scheduling contract

The app will expose a deployment-neutral, authenticated maintenance entrypoint or command. The host scheduler invokes it roughly daily. The operation updates only notes that are ACTIVE, not soft-deleted, have a non-null `expiresAt`, and are expired at execution time. It is deliberately idempotent.

## Deliberate non-goals

No Redis, Cloudinary integration, rich-text editor, desktop/global OS shortcut, team collaboration, AI, or external developer integrations are part of this MVP.
