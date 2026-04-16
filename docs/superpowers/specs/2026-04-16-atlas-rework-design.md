# Atlas Rework: Skill & MCP Marketplace

**Date:** 2026-04-16
**Status:** Design
**Approach:** Surgical Pivot (keep auth/admin/settings shell, rebuild around skills/MCPs)

---

## Overview

Atlas pivots from a prompt governance library to an internal skill and MCP hosting platform. Users browse, contribute, and install Claude Code skills and MCP server configurations. Prompts remain as a first-class but secondary content type — still independently browsable and linkable to skills.

**Inspiration:** GitHub + Google Drive model — shared global library, community-contributed, admin-moderated.

### Users

- Mixed technical audience: developers who author skills/MCPs and non-technical users who consume them
- Small team scale (dozens of skills/MCPs, under 50 users)
- Internal tool — no public access

### Core Concepts

- **Skill**: A Claude Code skill file (`.md` with frontmatter). Primary entity. Can also host system prompts or custom formats.
- **MCP**: An MCP server configuration (`.mcp.json`). Peer to skills, independently browsable.
- **Prompt**: Existing prompt entity. Independently browsable and linkable to skills.
- Skills and MCPs are separate top-level entities that can be linked to each other.
- Prompts can exist standalone or be attached to skills.

---

## Tech Stack Upgrade

All upgrades happen before rebuilding pages. New code is written on the modern stack from day one.

| Package | From | To |
|---------|------|----|
| Next.js | 14.1.0 | 16.2.4 |
| React | 18.2.0 | 19.2.5 |
| TypeScript | 5.3.3 | 6.0.2 |
| Tailwind CSS | 3.4.1 | 4.x |
| @supabase/ssr | 0.1.0 | 0.10.2 |
| @supabase/supabase-js | 2.39.3 | 2.103.2 |
| ESLint | 8.x | 9.x (flat config) |

### Upgrade Order

1. **Next.js 16 + React 19 + ESLint 9** — run `npx @next/codemod@latest upgrade`, fix middleware/layouts/pages, get build passing
2. **Tailwind 4** — run `npx @tailwindcss/upgrade`, migrate from `tailwind.config.js` to CSS-based config
3. **TypeScript 6** — update `tsconfig.json`, fix new strict errors
4. **Supabase packages** — update SSR cookie handling in `lib/supabase/`, test auth flow
5. **Cleanup** — remove deprecated patterns, verify build + lint pass

### Packages Retained

shadcn/ui, React Query, Zod, React Hook Form, cmdk, lucide-react, react-markdown, posthog-js, @sentry/nextjs — all support React 19.

### Packages Removed

- `next-mdx-remote`, `gray-matter`, `reading-time`, `rehype-*`, `remark-gfm` — SME hub is being removed
- `fuse.js` — replaced by server-side full-text search

---

## Data Model

### New Tables

#### `skills`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, gen_random_uuid() |
| title | text | NOT NULL |
| slug | text | UNIQUE, NOT NULL, URL-friendly |
| description | text | Short summary for cards/search |
| content | text | Full documentation in markdown |
| raw_file | text | Original `.md` file content including frontmatter |
| format | text | `claude_code_skill`, `system_prompt`, `custom` — CHECK constraint |
| category_id | uuid | FK → categories, nullable |
| tags | text[] | Cross-cutting labels |
| install_command | text | Generated CLI/config snippet |
| source_url | text | Optional GitHub source link |
| created_by | uuid | FK → users, NOT NULL |
| is_published | boolean | DEFAULT false (draft until approved) |
| is_flagged | boolean | DEFAULT false |
| rating_score | numeric | DEFAULT 0 |
| vote_count | integer | DEFAULT 0 |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now(), trigger-updated |

#### `mcps`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, gen_random_uuid() |
| title | text | NOT NULL |
| slug | text | UNIQUE, NOT NULL |
| description | text | What this MCP does |
| content | text | Full docs in markdown — setup guide, use cases |
| config_json | jsonb | The actual MCP config payload |
| server_type | text | `stdio`, `sse`, `http`, `websocket` — CHECK constraint |
| category_id | uuid | FK → categories, nullable |
| tags | text[] | |
| source_url | text | Link to MCP repo/docs |
| created_by | uuid | FK → users, NOT NULL |
| is_published | boolean | DEFAULT false |
| is_flagged | boolean | DEFAULT false |
| rating_score | numeric | DEFAULT 0 |
| vote_count | integer | DEFAULT 0 |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

#### `skill_prompts` (join table)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| skill_id | uuid | FK → skills, NOT NULL |
| prompt_id | uuid | FK → prompts, NOT NULL |
| relationship | text | `used_by`, `recommended_with` |
| order_index | integer | Display order on skill page |
| UNIQUE | | (skill_id, prompt_id) |

#### `skill_mcps` (join table)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| skill_id | uuid | FK → skills, NOT NULL |
| mcp_id | uuid | FK → mcps, NOT NULL |
| relationship | text | `requires`, `works_with` |
| UNIQUE | | (skill_id, mcp_id) |

#### `votes` (replaces `prompt_votes`)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| entity_type | text | `skill`, `mcp`, `prompt` — CHECK constraint |
| entity_id | uuid | NOT NULL |
| user_id | uuid | FK → users, NOT NULL |
| outcome | text | `positive`, `negative` |
| feedback | text | Optional comment |
| created_at | timestamptz | DEFAULT now() |
| UNIQUE | | (entity_type, entity_id, user_id) |

### Modified Tables

- **`categories`**: Add `entity_type text DEFAULT 'all'` — values: `skill`, `mcp`, `prompt`, `all`. Allows categories to be scoped or shared.

### Kept As-Is

- `users` — no changes
- `user_preferences` — no changes
- `vote_rate_limits` — no changes
- `prompts` — no changes (existing voting, variables, variants stay)
- `prompt_variables` — no changes
- `prompt_examples` — no changes
- `prompt_variants` — no changes

### Removed Tables

- `prompt_votes` — replaced by generalized `votes` table. Data migrated.

### Triggers & Functions

- `update_updated_at()` — reuse existing trigger on skills and mcps tables
- `recalculate_rating()` — new trigger on `votes` table, updates rating_score/vote_count on the appropriate entity table based on entity_type
- `auto_flag_on_negative_vote()` — adapted for entity_type, sets is_flagged on the right table
- `check_vote_rate_limit()` — reuse existing function

### RLS Policies

- **Skills/MCPs**: SELECT for authenticated users where `is_published = true` OR `created_by = auth.uid()` OR user is admin. INSERT for authenticated. UPDATE/DELETE for owner or admin.
- **Votes**: INSERT/UPDATE for authenticated on own votes. SELECT for own votes.
- **Join tables (skill_prompts, skill_mcps)**: SELECT for authenticated. INSERT/UPDATE/DELETE for skill owner or admin.

### Indexes

- `skills(slug)` UNIQUE
- `skills(category_id)`, `skills(created_at)`, `skills(rating_score)`, `skills(is_published, is_flagged)`
- `skills` GIN index on `tags`
- `mcps(slug)` UNIQUE
- `mcps(category_id)`, `mcps(created_at)`, `mcps(rating_score)`
- `mcps` GIN index on `tags`
- `votes(entity_type, entity_id)`, `votes(user_id)`

---

## Navigation & Information Architecture

### Sidebar

```
ATLAS
─────────────────
  Search (Cmd+K)
─────────────────
  Skills            ← primary, top of nav
  MCPs
  Prompts           ← third position
─────────────────
  Categories        ← browse by use-case
─────────────────
  + Contribute      ← upload/create new content
─────────────────
  Admin             ← admin-only
  Settings
```

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/skills` |
| `/skills` | Skills library — grid, filters, search |
| `/skills/[slug]` | Skill detail — docs, raw file, linked prompts/MCPs, install |
| `/mcps` | MCP library — grid, filters, search |
| `/mcps/[slug]` | MCP detail — docs, config JSON, linked skills, install |
| `/prompts` | Prompt library (existing, lighter) |
| `/prompts/[id]` | Prompt detail (existing) |
| `/categories` | All categories with content counts |
| `/categories/[slug]` | Category page showing skills, MCPs, prompts in that category |
| `/contribute` | Tabbed upload/create page (Skill / MCP / Prompt) |
| `/admin` | Dashboard stats, pending approvals, flagged items |
| `/admin/pending` | All unpublished items across types |
| `/admin/flagged` | All flagged items across types |
| `/settings` | User preferences (kept from current) |
| `/(auth)/login` | Login (kept) |
| `/(auth)/signup` | Signup (kept) |

---

## Skill Upload Flows

### 1. Paste/Form

- User navigates to `/contribute` → Skills tab
- Text editor for raw skill content (markdown with frontmatter)
- Live preview panel: parsed frontmatter fields + rendered markdown
- Category selector, tag input
- Submit → creates draft skill (`is_published: false`)

### 2. File Upload

- Drag-and-drop zone accepts `.md` files (single or multiple)
- For each file: parse frontmatter, show preview card of what will be created
- User confirms metadata, selects category/tags
- Bulk upload creates multiple draft skills

### 3. GitHub Import

- User pastes a GitHub URL (repo, directory, or single file)
- `POST /api/import/github` fetches via GitHub API (public repos) or raw URL
- Directory URL: scan for `.md` files with valid skill frontmatter, return list
- Single file URL: parse and return preview
- User selects which files to import, confirms metadata
- One-time pull — no ongoing sync

All three flows end at the same review screen before submission.

---

## Install Flows

### Skills

1. User clicks "Install" on skill detail page
2. Modal shows:
   - File path: where to save (e.g. `.claude/skills/skill-name.md`)
   - Full file content with copy button
   - Step-by-step instructions
3. If linked MCPs exist: callout suggesting "This skill works with [MCP Name]"

### MCPs

1. User clicks "Install" on MCP detail page
2. Modal shows:
   - The `.mcp.json` config snippet with copy button
   - Instructions for where to add it (project `.mcp.json` or global config)
3. If linked skills exist: cross-reference callout

### Prompts

- Copy-to-clipboard (existing flow)
- "Used in [Skill Name]" badge linking to the parent skill

---

## API Routes

### Skills

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | `/api/skills` | Authenticated | Paginated, filters: category, tags, format, search |
| POST | `/api/skills` | Authenticated | Create draft skill |
| GET | `/api/skills/[slug]` | Authenticated | Detail with linked prompts/MCPs |
| PATCH | `/api/skills/[slug]` | Owner or Admin | Update skill |
| DELETE | `/api/skills/[slug]` | Owner or Admin | Delete skill |

### MCPs

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | `/api/mcps` | Authenticated | Paginated, filters: category, tags, server_type, search |
| POST | `/api/mcps` | Authenticated | Create draft MCP |
| GET | `/api/mcps/[slug]` | Authenticated | Detail with linked skills |
| PATCH | `/api/mcps/[slug]` | Owner or Admin | Update MCP |
| DELETE | `/api/mcps/[slug]` | Owner or Admin | Delete MCP |

### GitHub Import

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| POST | `/api/import/github` | Authenticated | Fetch + parse skill files from GitHub URL |

### Voting (Generalized)

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| POST | `/api/vote` | Authenticated | Body: `{ entity_type, entity_id, outcome }` |
| GET | `/api/vote` | Authenticated | Query: `?entity_type=skill&entity_id=xxx` |

### Linking

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| POST | `/api/skills/[slug]/links` | Owner or Admin | Link a prompt or MCP to a skill |
| DELETE | `/api/skills/[slug]/links/[linkId]` | Owner or Admin | Remove link |

### Search

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | `/api/search` | Authenticated | Query: `?q=term&types=skill,mcp,prompt` — results grouped by type |

### Admin

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | `/api/admin/pending` | Admin | All unpublished items across types |
| POST | `/api/admin/publish/[entity_type]/[id]` | Admin | Approve and publish |
| POST | `/api/admin/flag/[entity_type]/[id]` | Admin | Flag content |

### Kept Routes (No Changes)

- `/api/auth/signup`
- `/api/settings`, `/api/settings/password`, `/api/settings/export`, `/api/settings/delete-account`
- `/api/feedback`
- `/api/prompts/*` — existing CRUD stays functional. Voting routes (`/api/prompts/[id]/vote`) updated to use the new generalized `votes` table instead of `prompt_votes`.

---

## UI/UX Design Direction

### Principles

1. **Content-first** — skills, MCPs, and prompts are the stars. Minimal chrome, generous whitespace.
2. **Scannable** — strong visual hierarchy, clear cards, prominent search. Find things in seconds.
3. **Polished details** — subtle animations, smooth transitions, consistent spacing.
4. **Dark mode first** — developer tool, internal audience. Dark default, light supported.

### Key UI Improvements

**Cards**: Category color accents, format badges, rating display, author avatar, tag pills. Hover lift + shadow. Consistent height with content truncation.

**Detail Pages**: Hero section with metadata at a glance. Tabbed content (Docs / Raw File / Config). Sticky sidebar with install CTA + linked items. Syntax-highlighted code blocks with one-click copy.

**Navigation**: Collapsible sidebar with icons + labels, active state indicators. Global `Cmd+K` command palette (using existing `cmdk`). Breadcrumbs on detail pages.

**Contribute/Upload**: Multi-step with live preview. Drag-and-drop with visual feedback. Markdown editor with split preview. Parsed frontmatter shown as structured fields in real-time.

**Search & Discovery**: `Cmd+K` command palette for power users. Prominent search bar for everyone. Faceted filtering (category, tags, type, format). Results grouped by content type with counts.

**Branding**: Keep the existing blue color palette to match Scorpion branding. All accent colors, active states, CTAs, and category highlights stay within the blue family.

**Typography & Spacing**: Inter or Geist font. Larger headings, more whitespace. Consistent 4px/8px spacing scale via Tailwind.

**Micro-interactions**: Skeleton loaders instead of spinners. Toast notifications for copy/install/vote. Optimistic UI for votes. Smooth page transitions.

### Component Library

Continue with shadcn/ui — re-init with latest versions for Tailwind 4 compatibility. All existing shadcn components get refreshed.

---

## What Gets Kept, Gutted, and Built

### Kept (migrate to new stack)

- `src/lib/supabase/` — update for new `@supabase/ssr`
- `src/middleware.ts` — update for Next.js 16
- `src/app/(auth)/` — login/signup pages
- `src/app/api/auth/` — auth routes
- `src/app/api/settings/` — user preference routes
- `src/app/api/feedback` — feedback route
- `src/components/ui/` — re-init shadcn with latest
- `src/hooks/useVoting.ts` — generalize for entity_type/entity_id
- `src/types/` — extend with new types
- `supabase/migrations/` — add new migrations on top
- User preferences, admin role system, RLS approach

### Gutted (remove)

- `src/app/(dashboard)/sme/` — SME hub removed entirely
- `src/app/(marketing)/` — marketing pages removed (internal tool)
- `tailwind.config.js` — replaced by Tailwind 4 CSS config
- `.eslintrc.*` — replaced by ESLint 9 flat config
- `fuse.js`, `next-mdx-remote`, `gray-matter`, `reading-time`, `rehype-*`, `remark-gfm` dependencies

### Gutted (rebuild)

- `src/app/(dashboard)/prompts/` — rebuild as lighter secondary section
- `src/app/(dashboard)/categories/` — rebuild for multi-entity browsing
- `src/app/(dashboard)/admin/` — rebuild for multi-entity moderation
- `src/components/prompts/` — replaced by new skill/MCP components
- `src/components/layout/` — new sidebar, header, command palette
- `src/hooks/usePrompts.ts`, `useCategories.ts` — replaced by new hooks

### Built New

- `src/app/(dashboard)/skills/` — library + detail pages
- `src/app/(dashboard)/mcps/` — library + detail pages
- `src/app/(dashboard)/contribute/` — unified upload/create
- `src/app/api/skills/` — full CRUD
- `src/app/api/mcps/` — full CRUD
- `src/app/api/vote/` — generalized voting
- `src/app/api/search/` — global search
- `src/app/api/import/` — GitHub import
- `src/app/api/admin/` — multi-entity moderation
- `src/components/skills/` — cards, detail view, forms
- `src/components/mcps/` — cards, detail view, forms
- `src/components/contribute/` — upload flows, markdown editor, preview
- `src/components/layout/` — new sidebar, header, command palette
- `src/hooks/useSkills.ts`, `useMcps.ts`, `useSearch.ts`, `useGithubImport.ts`
- New Supabase migration for all new tables, triggers, indexes, RLS policies
