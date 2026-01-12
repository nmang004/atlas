# Atlas

A Prompt Library & Governance System for standardizing AI/LLM usage across agency teams.

## Problem Statement

Agencies face dangerous variance in AI output quality. One strategist uses LLMs brilliantly while another produces hallucinated garbage that goes to clients. Static prompt libraries become shelfware because they don't account for model drift, lack governance, and create friction.

## Solution Overview

Atlas is a living governance system that:

- **Stores proven prompts** with variable injection for consistent, reusable outputs
- **Self-maintains through crowdsourced voting** at the moment of use
- **Teaches users why prompts work** (not just what to copy)
- **Meets users where they work** (webapp now, browser extension later)

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js (App Router) | 14.1+ |
| Language | TypeScript | 5.3+ |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | shadcn/ui | Latest |
| Backend | Supabase | Latest |
| Database | PostgreSQL | 15 |
| Auth | Supabase Auth | Latest |
| Deployment | Vercel (frontend), Supabase Cloud (backend) | - |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Supabase account (or Supabase CLI for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/atlas.git
   cd atlas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up the database**

   Option A: Using Supabase Dashboard
   - Go to your Supabase project's SQL Editor
   - Run the contents of `supabase/migrations/00001_initial_schema.sql`
   - Optionally run `supabase/seed.sql` for sample data

   Option B: Using Supabase CLI
   ```bash
   supabase link --project-ref your-project-ref
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
atlas/
├── docs/                    # Documentation
│   └── SRS.md              # Software Requirements Specification
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   ├── seed.sql           # Sample data
│   └── config.toml        # Supabase CLI config
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (dashboard)/   # Main application routes
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components
│   │   ├── prompts/       # Prompt-related components
│   │   └── common/        # Shared components
│   ├── lib/               # Utility functions
│   │   └── supabase/      # Supabase client configuration
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push migrations to Supabase |
| `npm run db:reset` | Reset database |
| `npm run db:generate-types` | Generate TypeScript types from schema |

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel's project settings
4. Deploy

### Backend (Supabase Cloud)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration SQL in the SQL Editor
3. Configure authentication settings
4. Copy the project URL and anon key to your environment variables

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

MIT License - see [LICENSE](LICENSE) for details.
