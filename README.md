# Atlas

A prompt governance platform for standardizing AI/LLM usage across teams.

**Live:** [scorpionatlas.co](https://www.scorpionatlas.co)

## Overview

Atlas solves the problem of inconsistent AI outputs across team members. It's a living prompt library that:

- **Stores proven prompts** with variable injection for reusable, consistent outputs
- **Self-maintains through voting** - users vote at the point of use, surfacing broken prompts automatically
- **Teaches why prompts work** with before/after examples

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL 17, Auth, Row Level Security) |
| Hosting | Vercel (frontend), Supabase Cloud (backend) |
| Monitoring | Sentry (errors), PostHog (analytics) |

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/nmang004/atlas.git
cd atlas

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn (optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key (optional)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com (optional)
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup
│   ├── (dashboard)/     # Main app (prompts, categories, admin, settings)
│   ├── (marketing)/     # Public pages (about, security)
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Sidebar, header
│   └── prompts/         # Prompt cards, forms, voting
├── lib/
│   └── supabase/        # Client configuration
├── hooks/               # Custom React hooks
└── types/               # TypeScript definitions
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler |

## Database

Schema managed via Supabase migrations in `supabase/migrations/`. All tables have Row Level Security enabled.

**Core tables:** `users`, `categories`, `prompts`, `prompt_variables`, `prompt_examples`, `prompt_votes`, `prompt_variants`, `user_preferences`, `vote_rate_limits`

## Deployment

**Frontend:** Push to main branch triggers automatic Vercel deployment.

**Database:** Migrations applied via Supabase Dashboard or CLI.

## Security

- HTTPS everywhere with HSTS
- Row Level Security on all tables
- Content Security Policy headers
- Leaked password protection enabled
- No secrets in code

See [/security](https://www.scorpionatlas.co/security) for details.

## License

MIT
