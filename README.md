# FOAD Starter Template

A Next.js starter template following the folder structure and implementation patterns of pos-frontend.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **UI Library**: shadcn/ui (base-nova style, @base-ui/react)
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod v4
- **Tables**: @tanstack/react-table v8
- **Auth**: next-auth v5 beta
- **State**: React Context + useState
- **Toasts**: sonner (wrapped in vendor-neutral lib/toast)
- **Package Manager**: pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── auth/               # Authentication flow
│   ├── (protected)/        # Route group for authenticated routes
│   │   └── panel/          # Application panels
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Tailwind v4 + design tokens
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # App shell (Header, Sidebar)
│   ├── shared/             # Cross-cutting components
│   ├── form/               # Form infrastructure
│   ├── table/              # DataTable infrastructure
│   ├── auth/               # Auth UI pieces
│   └── detail/             # Detail view components
├── features/               # Feature modules
├── lib/                    # Shared libraries
│   ├── apiClient/          # HTTP client layer
│   ├── auth/               # Auth service layer
│   ├── date/               # Date formatting service
│   └── utils.ts            # cn() utility
├── config/                 # App configuration
│   ├── routes.ts           # Route constants
│   ├── roles.ts            # Role definitions
│   └── cache-config.ts     # Cache tags
├── hooks/                  # Shared hooks
└── types/                  # Global type declarations
```

## Feature Module Pattern

Each feature follows this structure:

```
features/<name>/
├── index.ts          # Public barrel (the ONLY import surface)
├── actions.ts        # Server mutations
├── queries.ts        # Cached reads
├── components/       # Feature-specific components
├── types/            # TypeScript interfaces
├── schemas/          # Zod validation schemas
├── lib/              # Feature-specific helpers
├── data/             # Fixture/mock data
├── hooks/            # Feature-specific hooks
└── config/           # Feature-specific configuration
```

## Import Convention

All imports use the `@/` alias:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/apiClient";
import { routes } from "@/config/routes";
```

## Scripts

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |
| `format` | `prettier --write .` |

## License

MIT
