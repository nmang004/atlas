# CLAUDE.md

This file provides context for AI assistants working on the Atlas codebase.

## Project Purpose

Atlas is an internal SEO agency tool for prompt governance. It stores battle-tested LLM prompts with variable injection, enables crowdsourced quality maintenance through voting at the point of use, and reduces output variance across team members. The system is designed to be a "living" prompt library that self-maintains through collective verification.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel (frontend), Supabase Cloud (backend)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/(auth)/` | Login and signup pages |
| `src/app/(dashboard)/` | Main application pages (prompts, categories, admin) |
| `src/app/api/` | API routes (voting, etc.) |
| `src/components/ui/` | shadcn/ui base components |
| `src/components/prompts/` | Prompt-specific components (cards, forms, voting) |
| `src/components/layout/` | Sidebar, header, navigation |
| `src/lib/supabase/` | Supabase client configuration (client & server) |
| `src/hooks/` | Custom React hooks for data fetching |
| `src/types/` | TypeScript types including database types |
| `supabase/migrations/` | Database schema migrations |

## Database Schema

```
users           - User accounts with email, name, role (admin/user)
categories      - Prompt categories (e.g., "Ticket Responses")
prompts         - Main prompt storage with content, tags, ratings
prompt_variables - Dynamic variables for prompts (text/textarea/select)
prompt_examples  - Before/after examples for teaching
prompt_votes     - User votes (positive/negative) with feedback
```

**Key Relationships**:
- `prompts.category_id` → `categories.id`
- `prompts.created_by` → `users.id`
- `prompt_variables.prompt_id` → `prompts.id` (CASCADE)
- `prompt_examples.prompt_id` → `prompts.id` (CASCADE)
- `prompt_votes.prompt_id` → `prompts.id` (CASCADE)
- `prompt_votes.user_id` → `users.id` (CASCADE)

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm run db:push          # Push migrations to Supabase
npm run db:reset         # Reset database
npm run db:generate-types # Generate TypeScript types from schema
```

## Coding Conventions

- **TypeScript**: Strict mode, no `any` types
- **Components**: Prefer React Server Components; use `'use client'` only when needed
- **UI**: Use shadcn/ui components exclusively
- **Styling**: Tailwind CSS only, no CSS modules
- **Supabase**: Use `createClient()` from `@/lib/supabase/client` in browser, `createServerClient()` from `@/lib/supabase/server` in RSC/API routes
- **Forms**: React Hook Form + Zod for validation
- **State**: Optimistic updates for voting UI

## Current Phase: MVP

### In Scope
- Prompt library with categories and tags
- Variable injection system (text, textarea, select)
- Copy with voting workflow
- Crowdsourced maintenance (verification, flagging)
- Data requirements and review checklists
- Before/after examples
- Basic auth with RLS

### Out of Scope (Future Phases)
- Browser extension
- AI-powered prompt suggestions
- Team analytics dashboard
- Prompt versioning/history
- API access for external tools
- SSO integration
