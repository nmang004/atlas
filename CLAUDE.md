# CLAUDE.md

Context for AI assistants working on Atlas.

## What is Atlas?

Internal prompt governance tool. Stores proven LLM prompts with variable injection, crowdsourced quality via voting, reduces output variance across team members.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL 17, Auth, RLS)
- **Hosting**: Vercel + Supabase Cloud
- **Monitoring**: Sentry (errors), PostHog (analytics)

## Directory Structure

```
src/app/(auth)/        → Login, signup
src/app/(dashboard)/   → Prompts, categories, admin, settings
src/app/(marketing)/   → About, security (public pages)
src/app/api/           → API routes
src/components/ui/     → shadcn/ui components
src/components/prompts/→ Prompt cards, forms, voting
src/components/layout/ → Sidebar, header
src/lib/supabase/      → Client (browser) & server configs
src/hooks/             → Data fetching hooks
src/types/             → TypeScript types
supabase/migrations/   → Database migrations
```

## Database Tables

All tables have RLS enabled.

| Table | Purpose |
|-------|---------|
| `users` | Accounts with role (admin/user) |
| `categories` | Prompt organization |
| `prompts` | Main storage with content, tags, ratings |
| `prompt_variables` | Dynamic fields (text/textarea/select) |
| `prompt_examples` | Before/after teaching examples |
| `prompt_votes` | User votes with feedback |
| `prompt_variants` | Basic/advanced/custom variants |
| `user_preferences` | User settings |
| `vote_rate_limits` | Rate limiting for votes |

## Coding Conventions

- TypeScript strict, no `any`
- Prefer Server Components; `'use client'` only when needed
- shadcn/ui for all UI components
- Tailwind only, no CSS modules
- Supabase: `createClient()` in browser, `createServerClient()` in RSC/API
- Forms: React Hook Form + Zod
- Optimistic updates for voting

## Commands

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Git Commits

- Do NOT mention Claude/AI in commit messages
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Keep messages concise

## Security Notes

- RLS on all tables - users only access authorized data
- Admins: full CRUD on prompts/categories
- Users: view, copy, vote only
- No service_role key in client code
- All secrets in environment variables

## Current State

MVP complete and deployed. Core features working:
- Prompt library with categories/tags
- Variable injection
- Voting workflow
- Admin management
- User settings

## Out of Scope (Future)

- Browser extension
- AI-powered suggestions
- Team analytics
- Prompt versioning
- SSO
