# Plan 2: Database & Core API

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the new database schema (skills, MCPs, generalized votes, join tables) and build all API routes so the backend is fully ready for the UI rebuild in Plan 3.

**Architecture:** New Supabase migration adds tables alongside existing ones. Generalized `votes` table replaces `prompt_votes` with data migration. API routes follow the same patterns as existing prompt routes (Zod validation, auth helpers, cursor pagination). TypeScript types are regenerated from the new schema.

**Tech Stack:** Supabase PostgreSQL 17, Next.js 16 API routes, Zod, TypeScript 6

**Prerequisite:** Plan 1 (Tech Stack Upgrade) must be completed first.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `supabase/migrations/00006_skills_mcps_schema.sql` | Create | New tables, triggers, RLS, indexes |
| `src/types/database.ts` | Regenerate | Auto-generated Supabase types |
| `src/types/index.ts` | Modify | Add new type exports for skills, MCPs, votes |
| `src/lib/constants.ts` | Modify | Add new nav items, sort options |
| `src/lib/auth.ts` | Modify | Add `requireOwnerOrAdmin` helper |
| `src/lib/slug.ts` | Create | Slug generation utility |
| `src/lib/frontmatter.ts` | Create | Parse skill markdown frontmatter |
| `src/app/api/skills/route.ts` | Create | GET (list) + POST (create) skills |
| `src/app/api/skills/[slug]/route.ts` | Create | GET (detail) + PATCH (update) + DELETE |
| `src/app/api/mcps/route.ts` | Create | GET (list) + POST (create) MCPs |
| `src/app/api/mcps/[slug]/route.ts` | Create | GET (detail) + PATCH (update) + DELETE |
| `src/app/api/vote/route.ts` | Create | POST (vote) + GET (get vote) — generalized |
| `src/app/api/search/route.ts` | Create | GET — global search across all types |
| `src/app/api/import/github/route.ts` | Create | POST — fetch + parse skills from GitHub |
| `src/app/api/skills/[slug]/links/route.ts` | Create | POST + DELETE — manage skill links |
| `src/app/api/admin/pending/route.ts` | Create | GET — all unpublished items |
| `src/app/api/admin/publish/[entityType]/[id]/route.ts` | Create | POST — publish item |
| `src/app/api/admin/flag/[entityType]/[id]/route.ts` | Create | POST — flag item |
| `src/app/api/prompts/[id]/vote/route.ts` | Modify | Update to use `votes` table |

---

### Task 1: Create Database Migration

**Files:**
- Create: `supabase/migrations/00006_skills_mcps_schema.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/00006_skills_mcps_schema.sql
-- Atlas Rework: Skills, MCPs, Generalized Votes

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    raw_file TEXT,
    format TEXT NOT NULL DEFAULT 'claude_code_skill'
        CHECK (format IN ('claude_code_skill', 'system_prompt', 'custom')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    install_command TEXT,
    source_url TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    rating_score NUMERIC DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_skills_category_id ON skills(category_id);
CREATE INDEX idx_skills_created_at ON skills(created_at DESC);
CREATE INDEX idx_skills_rating_score ON skills(rating_score DESC);
CREATE INDEX idx_skills_published_flagged ON skills(is_published, is_flagged);
CREATE INDEX idx_skills_tags ON skills USING GIN(tags);
CREATE INDEX idx_skills_created_by ON skills(created_by);

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MCPS TABLE
-- ============================================================================
CREATE TABLE mcps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    config_json JSONB,
    server_type TEXT DEFAULT 'stdio'
        CHECK (server_type IN ('stdio', 'sse', 'http', 'websocket')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    source_url TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    rating_score NUMERIC DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mcps_slug ON mcps(slug);
CREATE INDEX idx_mcps_category_id ON mcps(category_id);
CREATE INDEX idx_mcps_created_at ON mcps(created_at DESC);
CREATE INDEX idx_mcps_rating_score ON mcps(rating_score DESC);
CREATE INDEX idx_mcps_published_flagged ON mcps(is_published, is_flagged);
CREATE INDEX idx_mcps_tags ON mcps USING GIN(tags);
CREATE INDEX idx_mcps_created_by ON mcps(created_by);

CREATE TRIGGER update_mcps_updated_at
    BEFORE UPDATE ON mcps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SKILL_PROMPTS JOIN TABLE
-- ============================================================================
CREATE TABLE skill_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'used_by',
    order_index INTEGER DEFAULT 0,
    UNIQUE(skill_id, prompt_id)
);

CREATE INDEX idx_skill_prompts_skill_id ON skill_prompts(skill_id);
CREATE INDEX idx_skill_prompts_prompt_id ON skill_prompts(prompt_id);

-- ============================================================================
-- SKILL_MCPS JOIN TABLE
-- ============================================================================
CREATE TABLE skill_mcps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    mcp_id UUID NOT NULL REFERENCES mcps(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'works_with',
    UNIQUE(skill_id, mcp_id)
);

CREATE INDEX idx_skill_mcps_skill_id ON skill_mcps(skill_id);
CREATE INDEX idx_skill_mcps_mcp_id ON skill_mcps(mcp_id);

-- ============================================================================
-- GENERALIZED VOTES TABLE
-- ============================================================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('skill', 'mcp', 'prompt')),
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    outcome TEXT NOT NULL CHECK (outcome IN ('positive', 'negative')),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(entity_type, entity_id, user_id)
);

CREATE INDEX idx_votes_entity ON votes(entity_type, entity_id);
CREATE INDEX idx_votes_user ON votes(user_id);

-- ============================================================================
-- MIGRATE PROMPT_VOTES TO VOTES
-- ============================================================================
INSERT INTO votes (id, entity_type, entity_id, user_id, outcome, feedback, created_at)
SELECT id, 'prompt', prompt_id, user_id, outcome, feedback, created_at
FROM prompt_votes;

-- ============================================================================
-- ADD ENTITY_TYPE TO CATEGORIES
-- ============================================================================
ALTER TABLE categories ADD COLUMN entity_type TEXT DEFAULT 'all'
    CHECK (entity_type IN ('skill', 'mcp', 'prompt', 'all'));

-- ============================================================================
-- GENERALIZED RATING TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_entity_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_entity_type TEXT;
    v_entity_id UUID;
    positive_count INT;
    total_count INT;
    new_rating NUMERIC;
BEGIN
    v_entity_type := COALESCE(NEW.entity_type, OLD.entity_type);
    v_entity_id := COALESCE(NEW.entity_id, OLD.entity_id);

    SELECT
        COUNT(*) FILTER (WHERE outcome = 'positive'),
        COUNT(*)
    INTO positive_count, total_count
    FROM votes
    WHERE entity_type = v_entity_type AND entity_id = v_entity_id;

    IF total_count > 0 THEN
        new_rating := (positive_count::NUMERIC / total_count::NUMERIC) * 100;
    ELSE
        new_rating := 0;
    END IF;

    IF v_entity_type = 'skill' THEN
        UPDATE skills SET
            rating_score = new_rating,
            vote_count = total_count,
            is_flagged = CASE
                WHEN TG_OP = 'INSERT' AND NEW.outcome = 'negative' THEN true
                ELSE is_flagged
            END
        WHERE id = v_entity_id;
    ELSIF v_entity_type = 'mcp' THEN
        UPDATE mcps SET
            rating_score = new_rating,
            vote_count = total_count,
            is_flagged = CASE
                WHEN TG_OP = 'INSERT' AND NEW.outcome = 'negative' THEN true
                ELSE is_flagged
            END
        WHERE id = v_entity_id;
    ELSIF v_entity_type = 'prompt' THEN
        UPDATE prompts SET
            rating_score = new_rating,
            vote_count = total_count,
            last_verified_at = CASE
                WHEN TG_OP = 'INSERT' AND NEW.outcome = 'positive' THEN now()
                ELSE last_verified_at
            END,
            is_flagged = CASE
                WHEN TG_OP = 'INSERT' AND NEW.outcome = 'negative' THEN true
                ELSE is_flagged
            END
        WHERE id = v_entity_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_vote_new
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_entity_rating();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published skills" ON skills
    FOR SELECT USING (
        is_published = true
        OR created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Authenticated users can create skills" ON skills
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update skills" ON skills
    FOR UPDATE USING (
        created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Owners and admins can delete skills" ON skills
    FOR DELETE USING (
        created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- MCPs
ALTER TABLE mcps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published mcps" ON mcps
    FOR SELECT USING (
        is_published = true
        OR created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Authenticated users can create mcps" ON mcps
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update mcps" ON mcps
    FOR UPDATE USING (
        created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Owners and admins can delete mcps" ON mcps
    FOR DELETE USING (
        created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own votes" ON votes
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert own votes" ON votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Skill Prompts
ALTER TABLE skill_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skill_prompts" ON skill_prompts
    FOR SELECT USING (true);

CREATE POLICY "Skill owners and admins can manage skill_prompts" ON skill_prompts
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM skills WHERE id = skill_id AND created_by = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Skill owners and admins can delete skill_prompts" ON skill_prompts
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM skills WHERE id = skill_id AND created_by = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Skill MCPs
ALTER TABLE skill_mcps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skill_mcps" ON skill_mcps
    FOR SELECT USING (true);

CREATE POLICY "Skill owners and admins can manage skill_mcps" ON skill_mcps
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM skills WHERE id = skill_id AND created_by = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Skill owners and admins can delete skill_mcps" ON skill_mcps
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM skills WHERE id = skill_id AND created_by = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
```

- [ ] **Step 2: Push migration to Supabase**

```bash
cd /Users/nick/atlas && npx supabase db push
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add supabase/migrations/00006_skills_mcps_schema.sql && git commit -m "feat: add skills, mcps, votes schema migration"
```

---

### Task 2: Regenerate TypeScript Types and Add Exports

**Files:**
- Regenerate: `src/types/database.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Regenerate Supabase types**

```bash
cd /Users/nick/atlas && npm run db:generate-types
```

This runs `supabase gen types typescript --local > src/types/database.ts`.

- [ ] **Step 2: Update type exports in src/types/index.ts**

```typescript
// src/types/index.ts
import type { Database } from './database'

// --- Existing types (keep all) ---
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptVariable = Database['public']['Tables']['prompt_variables']['Row']
export type PromptExample = Database['public']['Tables']['prompt_examples']['Row']
export type PromptVariant = Database['public']['Tables']['prompt_variants']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type PromptInsert = Database['public']['Tables']['prompts']['Insert']
export type PromptVariableInsert = Database['public']['Tables']['prompt_variables']['Insert']
export type PromptExampleInsert = Database['public']['Tables']['prompt_examples']['Insert']
export type PromptVariantInsert = Database['public']['Tables']['prompt_variants']['Insert']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type PromptUpdate = Database['public']['Tables']['prompts']['Update']
export type PromptVariableUpdate = Database['public']['Tables']['prompt_variables']['Update']
export type PromptExampleUpdate = Database['public']['Tables']['prompt_examples']['Update']
export type PromptVariantUpdate = Database['public']['Tables']['prompt_variants']['Update']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type PromptWithCategory = Prompt & {
  category: Category | null
}

export type PromptWithDetails = Prompt & {
  category: Category | null
  variables: PromptVariable[]
  examples: PromptExample[]
  variants: PromptVariant[]
}

export type VariantType = 'basic' | 'advanced' | 'custom'

export type PromptCardData = {
  id: string
  title: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  last_verified_at: string
  is_flagged: boolean
  model_version: string | null
}

export type VariableFormState = Record<string, string>
export type VoteOutcome = 'positive' | 'negative'

// --- New types ---
export type Skill = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type Mcp = Database['public']['Tables']['mcps']['Row']
export type McpInsert = Database['public']['Tables']['mcps']['Insert']
export type McpUpdate = Database['public']['Tables']['mcps']['Update']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']

export type SkillPrompt = Database['public']['Tables']['skill_prompts']['Row']
export type SkillMcp = Database['public']['Tables']['skill_mcps']['Row']

export type SkillFormat = 'claude_code_skill' | 'system_prompt' | 'custom'
export type McpServerType = 'stdio' | 'sse' | 'http' | 'websocket'
export type EntityType = 'skill' | 'mcp' | 'prompt'

export type SkillWithCategory = Skill & {
  category: Category | null
}

export type SkillWithDetails = Skill & {
  category: Category | null
  linked_prompts: (SkillPrompt & { prompt: Prompt })[]
  linked_mcps: (SkillMcp & { mcp: Mcp })[]
  author: Pick<User, 'id' | 'name' | 'email'>
}

export type McpWithCategory = Mcp & {
  category: Category | null
}

export type McpWithDetails = Mcp & {
  category: Category | null
  linked_skills: (SkillMcp & { skill: Skill })[]
  author: Pick<User, 'id' | 'name' | 'email'>
}

export type SkillCardData = {
  id: string
  title: string
  slug: string
  description: string | null
  format: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  author_name: string | null
  created_at: string
}

export type McpCardData = {
  id: string
  title: string
  slug: string
  description: string | null
  server_type: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  author_name: string | null
  created_at: string
}

// Remove old prompt_votes type — replaced by Vote
// Keep PromptVote alias for backwards compat during transition
export type PromptVote = Vote

export type { Database }
```

- [ ] **Step 3: Verify typecheck passes**

```bash
cd /Users/nick/atlas && npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/types/ && git commit -m "feat: add skill, mcp, vote types"
```

---

### Task 3: Create Utility Modules

**Files:**
- Create: `src/lib/slug.ts`
- Create: `src/lib/frontmatter.ts`
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Create slug utility**

```typescript
// src/lib/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  let counter = 1
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++
  }
  return `${baseSlug}-${counter}`
}
```

- [ ] **Step 2: Create frontmatter parser**

```typescript
// src/lib/frontmatter.ts
interface SkillFrontmatter {
  name?: string
  description?: string
  [key: string]: unknown
}

interface ParsedSkillFile {
  frontmatter: SkillFrontmatter
  content: string
  raw: string
}

export function parseSkillFrontmatter(raw: string): ParsedSkillFile {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = raw.match(frontmatterRegex)

  if (!match) {
    return {
      frontmatter: {},
      content: raw,
      raw,
    }
  }

  const [, frontmatterBlock, content] = match
  const frontmatter: SkillFrontmatter = {}

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      continue
    }
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    if (key && value) {
      frontmatter[key] = value
    }
  }

  return { frontmatter, content: content.trim(), raw }
}

export function isValidSkillFile(raw: string): boolean {
  const parsed = parseSkillFrontmatter(raw)
  return Boolean(parsed.frontmatter.name || parsed.frontmatter.description)
}
```

- [ ] **Step 3: Add requireOwnerOrAdmin to auth.ts**

Add to `src/lib/auth.ts`:

```typescript
export async function requireOwnerOrAdmin(
  resourceCreatedBy: string
): Promise<AuthResult> {
  const authResult = await requireAuth()

  if (!authResult.success) {
    return authResult
  }

  if (authResult.user.role === 'admin' || authResult.user.id === resourceCreatedBy) {
    return authResult
  }

  return {
    success: false,
    response: NextResponse.json({ error: 'Not authorized' }, { status: 403 }),
  }
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/lib/slug.ts src/lib/frontmatter.ts src/lib/auth.ts && git commit -m "feat: add slug, frontmatter utils and owner-or-admin auth"
```

---

### Task 4: Skills API — List and Create

**Files:**
- Create: `src/app/api/skills/route.ts`

- [ ] **Step 1: Create the skills list + create route**

```typescript
// src/app/api/skills/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { parseSkillFrontmatter } from '@/lib/frontmatter'
import { generateSlug } from '@/lib/slug'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const cursor = searchParams.get('cursor')
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10),
      MAX_PAGE_SIZE
    )
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')
    const format = searchParams.get('format')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('skills')
      .select(
        `
        id, title, slug, description, format, tags,
        rating_score, vote_count, created_at, is_flagged,
        category_id,
        category:categories(name),
        author:users!skills_created_by_fkey(name)
      `
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (format) {
      query = query.eq('format', format)
    }
    if (tag) {
      query = query.contains('tags', [tag])
    }
    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Skills fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    const skills = (data || []) as Array<{
      id: string
      title: string
      slug: string
      description: string | null
      format: string
      tags: string[] | null
      rating_score: number
      vote_count: number
      created_at: string
      is_flagged: boolean
      category_id: string | null
      category: { name: string } | null
      author: { name: string | null } | null
    }>

    const hasMore = skills.length > limit
    const items = hasMore ? skills.slice(0, limit) : skills
    const nextCursor = hasMore && items.length > 0
      ? items[items.length - 1].created_at
      : null

    return NextResponse.json({
      skills: items.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        format: s.format,
        category_name: s.category?.name || null,
        tags: s.tags || [],
        rating_score: s.rating_score,
        vote_count: s.vote_count,
        author_name: s.author?.name || null,
        created_at: s.created_at,
        is_flagged: s.is_flagged,
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Skills API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSkillSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  raw_file: z.string().max(100000).optional().nullable(),
  format: z.enum(['claude_code_skill', 'system_prompt', 'custom']).default('claude_code_skill'),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  source_url: z.string().url().max(500).optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()
    const body = await request.json()
    const result = createSkillSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Parse frontmatter from raw_file if provided
    let title = data.title
    let description = data.description
    let content = data.content
    if (data.raw_file) {
      const parsed = parseSkillFrontmatter(data.raw_file)
      if (parsed.frontmatter.name && !title) {
        title = String(parsed.frontmatter.name)
      }
      if (parsed.frontmatter.description && !description) {
        description = String(parsed.frontmatter.description)
      }
      if (!content) {
        content = parsed.content
      }
    }

    // Generate unique slug
    const baseSlug = generateSlug(title)
    const { data: existingSlugs } = await supabase
      .from('skills')
      .select('slug')
      .like('slug', `${baseSlug}%`)

    const takenSlugs = (existingSlugs || []).map((r: { slug: string }) => r.slug)
    let slug = baseSlug
    if (takenSlugs.includes(slug)) {
      let counter = 1
      while (takenSlugs.includes(`${baseSlug}-${counter}`)) {
        counter++
      }
      slug = `${baseSlug}-${counter}`
    }

    const isAdmin = authResult.user.role === 'admin'

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .insert({
        title,
        slug,
        description: description || null,
        content: content || null,
        raw_file: data.raw_file || null,
        format: data.format,
        category_id: data.category_id || null,
        tags: data.tags,
        source_url: data.source_url || null,
        created_by: authResult.user.id,
        is_published: isAdmin,
      })
      .select()
      .single()

    if (skillError) {
      console.error('Skill creation error:', skillError)
      return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
    }

    return NextResponse.json({ success: true, skill })
  } catch (error) {
    console.error('Create skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
cd /Users/nick/atlas && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/skills/route.ts && git commit -m "feat: add skills list and create API routes"
```

---

### Task 5: Skills API — Detail, Update, Delete

**Files:**
- Create: `src/app/api/skills/[slug]/route.ts`

- [ ] **Step 1: Create the skill detail route**

```typescript
// src/app/api/skills/[slug]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth, requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: skill, error } = await supabase
      .from('skills')
      .select(
        `
        *,
        category:categories(*),
        author:users!skills_created_by_fkey(id, name, email),
        linked_prompts:skill_prompts(*, prompt:prompts(*)),
        linked_mcps:skill_mcps(*, mcp:mcps(id, title, slug, description))
      `
      )
      .eq('slug', slug)
      .single()

    if (error || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json({ skill })
  } catch (error) {
    console.error('Skill detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateSkillSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  raw_file: z.string().max(100000).optional().nullable(),
  format: z.enum(['claude_code_skill', 'system_prompt', 'custom']).optional(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  source_url: z.string().url().max(500).optional().nullable(),
  install_command: z.string().max(5000).optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch skill to check ownership
    const { data: existing } = await supabase
      .from('skills')
      .select('created_by')
      .eq('slug', slug)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    const authResult = await requireOwnerOrAdmin(existing.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    const body = await request.json()
    const result = updateSkillSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { data: skill, error } = await supabase
      .from('skills')
      .update(result.data)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Skill update error:', error)
      return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
    }

    return NextResponse.json({ success: true, skill })
  } catch (error) {
    console.error('Update skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('skills')
      .select('created_by')
      .eq('slug', slug)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    const authResult = await requireOwnerOrAdmin(existing.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    const { error } = await supabase.from('skills').delete().eq('slug', slug)

    if (error) {
      console.error('Skill delete error:', error)
      return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/skills/[slug]/ && git commit -m "feat: add skill detail, update, delete API routes"
```

---

### Task 6: MCPs API — Full CRUD

**Files:**
- Create: `src/app/api/mcps/route.ts`
- Create: `src/app/api/mcps/[slug]/route.ts`

- [ ] **Step 1: Create MCPs list + create route**

```typescript
// src/app/api/mcps/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/slug'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const cursor = searchParams.get('cursor')
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10),
      MAX_PAGE_SIZE
    )
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')
    const serverType = searchParams.get('server_type')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('mcps')
      .select(
        `
        id, title, slug, description, server_type, tags,
        rating_score, vote_count, created_at, is_flagged,
        category_id,
        category:categories(name),
        author:users!mcps_created_by_fkey(name)
      `
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (serverType) {
      query = query.eq('server_type', serverType)
    }
    if (tag) {
      query = query.contains('tags', [tag])
    }
    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('MCPs fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch MCPs' }, { status: 500 })
    }

    const mcps = (data || []) as Array<{
      id: string
      title: string
      slug: string
      description: string | null
      server_type: string
      tags: string[] | null
      rating_score: number
      vote_count: number
      created_at: string
      is_flagged: boolean
      category_id: string | null
      category: { name: string } | null
      author: { name: string | null } | null
    }>

    const hasMore = mcps.length > limit
    const items = hasMore ? mcps.slice(0, limit) : mcps
    const nextCursor = hasMore && items.length > 0
      ? items[items.length - 1].created_at
      : null

    return NextResponse.json({
      mcps: items.map((m) => ({
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description,
        server_type: m.server_type,
        category_name: m.category?.name || null,
        tags: m.tags || [],
        rating_score: m.rating_score,
        vote_count: m.vote_count,
        author_name: m.author?.name || null,
        created_at: m.created_at,
        is_flagged: m.is_flagged,
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('MCPs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createMcpSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  config_json: z.record(z.unknown()).optional().nullable(),
  server_type: z.enum(['stdio', 'sse', 'http', 'websocket']).default('stdio'),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  source_url: z.string().url().max(500).optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()
    const body = await request.json()
    const result = createMcpSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data
    const baseSlug = generateSlug(data.title)
    const { data: existingSlugs } = await supabase
      .from('mcps')
      .select('slug')
      .like('slug', `${baseSlug}%`)

    const takenSlugs = (existingSlugs || []).map((r: { slug: string }) => r.slug)
    let slug = baseSlug
    if (takenSlugs.includes(slug)) {
      let counter = 1
      while (takenSlugs.includes(`${baseSlug}-${counter}`)) {
        counter++
      }
      slug = `${baseSlug}-${counter}`
    }

    const isAdmin = authResult.user.role === 'admin'

    const { data: mcp, error: mcpError } = await supabase
      .from('mcps')
      .insert({
        title: data.title,
        slug,
        description: data.description || null,
        content: data.content || null,
        config_json: data.config_json || null,
        server_type: data.server_type,
        category_id: data.category_id || null,
        tags: data.tags,
        source_url: data.source_url || null,
        created_by: authResult.user.id,
        is_published: isAdmin,
      })
      .select()
      .single()

    if (mcpError) {
      console.error('MCP creation error:', mcpError)
      return NextResponse.json({ error: 'Failed to create MCP' }, { status: 500 })
    }

    return NextResponse.json({ success: true, mcp })
  } catch (error) {
    console.error('Create MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create MCP detail, update, delete route**

```typescript
// src/app/api/mcps/[slug]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: mcp, error } = await supabase
      .from('mcps')
      .select(
        `
        *,
        category:categories(*),
        author:users!mcps_created_by_fkey(id, name, email),
        linked_skills:skill_mcps(*, skill:skills(id, title, slug, description))
      `
      )
      .eq('slug', slug)
      .single()

    if (error || !mcp) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    return NextResponse.json({ mcp })
  } catch (error) {
    console.error('MCP detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateMcpSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  config_json: z.record(z.unknown()).optional().nullable(),
  server_type: z.enum(['stdio', 'sse', 'http', 'websocket']).optional(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  source_url: z.string().url().max(500).optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('mcps')
      .select('created_by')
      .eq('slug', slug)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    const authResult = await requireOwnerOrAdmin(existing.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    const body = await request.json()
    const result = updateMcpSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { data: mcp, error } = await supabase
      .from('mcps')
      .update(result.data)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('MCP update error:', error)
      return NextResponse.json({ error: 'Failed to update MCP' }, { status: 500 })
    }

    return NextResponse.json({ success: true, mcp })
  } catch (error) {
    console.error('Update MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('mcps')
      .select('created_by')
      .eq('slug', slug)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    const authResult = await requireOwnerOrAdmin(existing.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    const { error } = await supabase.from('mcps').delete().eq('slug', slug)

    if (error) {
      console.error('MCP delete error:', error)
      return NextResponse.json({ error: 'Failed to delete MCP' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/mcps/ && git commit -m "feat: add MCPs full CRUD API routes"
```

---

### Task 7: Generalized Voting API

**Files:**
- Create: `src/app/api/vote/route.ts`
- Modify: `src/app/api/prompts/[id]/vote/route.ts`

- [ ] **Step 1: Create generalized vote route**

```typescript
// src/app/api/vote/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { checkVoteRateLimit, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const voteSchema = z.object({
  entity_type: z.enum(['skill', 'mcp', 'prompt']),
  entity_id: z.string().uuid(),
  outcome: z.enum(['positive', 'negative']),
  feedback: z.string().max(2000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const withinLimit = await checkVoteRateLimit(authResult.user.id)
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before voting again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = voteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { entity_type, entity_id, outcome, feedback } = result.data
    const supabase = await createClient()

    // Verify entity exists
    const table = entity_type === 'skill' ? 'skills'
      : entity_type === 'mcp' ? 'mcps'
      : 'prompts'

    const { data: entity } = await supabase
      .from(table)
      .select('id')
      .eq('id', entity_id)
      .single()

    if (!entity) {
      return NextResponse.json({ error: `${entity_type} not found` }, { status: 404 })
    }

    // Upsert vote — delete existing then insert new
    await supabase
      .from('votes')
      .delete()
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .eq('user_id', authResult.user.id)

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        entity_type,
        entity_id,
        user_id: authResult.user.id,
        outcome,
        feedback: outcome === 'negative' ? feedback : null,
      })
      .select()
      .single()

    if (voteError) {
      console.error('Vote error:', voteError)
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
    }

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return NextResponse.json({ vote: null })
    }

    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entity_type')
    const entityId = searchParams.get('entity_id')

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entity_type and entity_id are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: vote } = await supabase
      .from('votes')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .eq('user_id', authResult.user.id)
      .maybeSingle()

    return NextResponse.json({ vote: vote || null })
  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Update existing prompt vote route to use votes table**

Update `src/app/api/prompts/[id]/vote/route.ts` to use the `votes` table instead of `prompt_votes`:

Replace all `prompt_votes` references with `votes` and add `entity_type: 'prompt'` filters:

```typescript
// src/app/api/prompts/[id]/vote/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { checkVoteRateLimit, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const voteSchema = z.object({
  outcome: z.enum(['positive', 'negative']),
  feedback: z.string().max(2000).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const paramsResult = paramsSchema.safeParse({ id })
    if (!paramsResult.success) {
      return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 })
    }

    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const withinLimit = await checkVoteRateLimit(authResult.user.id)
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before voting again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = voteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { outcome, feedback } = result.data
    const promptId = paramsResult.data.id
    const supabase = await createClient()

    const { data: prompt } = await supabase
      .from('prompts')
      .select('id')
      .eq('id', promptId)
      .single()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    await supabase
      .from('votes')
      .delete()
      .eq('entity_type', 'prompt')
      .eq('entity_id', promptId)
      .eq('user_id', authResult.user.id)

    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        entity_type: 'prompt',
        entity_id: promptId,
        user_id: authResult.user.id,
        outcome,
        feedback: outcome === 'negative' ? feedback : null,
      })
      .select()
      .single()

    if (voteError) {
      console.error('Vote error:', voteError)
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
    }

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const paramsResult = paramsSchema.safeParse({ id })
    if (!paramsResult.success) {
      return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 })
    }

    const authResult = await requireAuth()
    if (!authResult.success) {
      return NextResponse.json({ vote: null })
    }

    const promptId = paramsResult.data.id
    const supabase = await createClient()

    const { data: vote } = await supabase
      .from('votes')
      .select('*')
      .eq('entity_type', 'prompt')
      .eq('entity_id', promptId)
      .eq('user_id', authResult.user.id)
      .maybeSingle()

    return NextResponse.json({ vote: vote || null })
  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/vote/ src/app/api/prompts/[id]/vote/ && git commit -m "feat: add generalized voting API and migrate prompt votes"
```

---

### Task 8: Global Search API

**Files:**
- Create: `src/app/api/search/route.ts`

- [ ] **Step 1: Create search route**

```typescript
// src/app/api/search/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')?.trim()
    const types = searchParams.get('types')?.split(',') || ['skill', 'mcp', 'prompt']
    const limit = 10

    if (!query) {
      return NextResponse.json({ results: { skills: [], mcps: [], prompts: [] } })
    }

    const searchPattern = `%${query}%`
    const results: {
      skills: Array<{ id: string; title: string; slug: string; description: string | null }>
      mcps: Array<{ id: string; title: string; slug: string; description: string | null }>
      prompts: Array<{ id: string; title: string; description: string | null }>
    } = { skills: [], mcps: [], prompts: [] }

    if (types.includes('skill')) {
      const { data } = await supabase
        .from('skills')
        .select('id, title, slug, description')
        .eq('is_published', true)
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .order('rating_score', { ascending: false })
        .limit(limit)

      results.skills = data || []
    }

    if (types.includes('mcp')) {
      const { data } = await supabase
        .from('mcps')
        .select('id, title, slug, description')
        .eq('is_published', true)
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .order('rating_score', { ascending: false })
        .limit(limit)

      results.mcps = data || []
    }

    if (types.includes('prompt')) {
      const { data } = await supabase
        .from('prompts')
        .select('id, title, content')
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .order('rating_score', { ascending: false })
        .limit(limit)

      results.prompts = (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.content?.slice(0, 200) || null,
      }))
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/search/ && git commit -m "feat: add global search API across skills, mcps, prompts"
```

---

### Task 9: GitHub Import API

**Files:**
- Create: `src/app/api/import/github/route.ts`

- [ ] **Step 1: Create GitHub import route**

```typescript
// src/app/api/import/github/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { isValidSkillFile, parseSkillFrontmatter } from '@/lib/frontmatter'

const importSchema = z.object({
  url: z.string().url(),
})

function parseGitHubUrl(url: string): {
  owner: string
  repo: string
  path: string
  type: 'file' | 'directory'
} | null {
  // Match: github.com/owner/repo/blob/branch/path (file)
  // Match: github.com/owner/repo/tree/branch/path (directory)
  // Match: github.com/owner/repo (root)
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)(?:\/(blob|tree)\/[^/]+\/(.+))?/
  )
  if (!match) {
    return null
  }
  const [, owner, repo, blobOrTree, path] = match
  return {
    owner,
    repo,
    path: path || '',
    type: blobOrTree === 'blob' ? 'file' : 'directory',
  }
}

async function fetchGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`
  const response = await fetch(rawUrl)
  if (!response.ok) {
    // Try master branch
    const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`
    const masterResponse = await fetch(masterUrl)
    if (!masterResponse.ok) {
      return null
    }
    return masterResponse.text()
  }
  return response.text()
}

async function fetchGitHubDirectory(
  owner: string,
  repo: string,
  path: string
): Promise<Array<{ name: string; path: string }>> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const response = await fetch(apiUrl, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!response.ok) {
    return []
  }
  const items = (await response.json()) as Array<{
    name: string
    path: string
    type: string
  }>
  return items
    .filter((item) => item.type === 'file' && item.name.endsWith('.md'))
    .map((item) => ({ name: item.name, path: item.path }))
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const body = await request.json()
    const result = importSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid URL', details: result.error.issues },
        { status: 400 }
      )
    }

    const parsed = parseGitHubUrl(result.data.url)
    if (!parsed) {
      return NextResponse.json({ error: 'Could not parse GitHub URL' }, { status: 400 })
    }

    const { owner, repo, path, type } = parsed

    if (type === 'file') {
      const content = await fetchGitHubFile(owner, repo, path)
      if (!content) {
        return NextResponse.json({ error: 'Could not fetch file' }, { status: 404 })
      }

      const parsedFile = parseSkillFrontmatter(content)
      return NextResponse.json({
        files: [
          {
            name: path.split('/').pop() || 'skill.md',
            path,
            raw: content,
            frontmatter: parsedFile.frontmatter,
            content: parsedFile.content,
            is_valid: isValidSkillFile(content),
          },
        ],
      })
    }

    // Directory — list .md files and parse each
    const mdFiles = await fetchGitHubDirectory(owner, repo, path)

    const files = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fetchGitHubFile(owner, repo, file.path)
        if (!content) {
          return null
        }
        const parsedFile = parseSkillFrontmatter(content)
        return {
          name: file.name,
          path: file.path,
          raw: content,
          frontmatter: parsedFile.frontmatter,
          content: parsedFile.content,
          is_valid: isValidSkillFile(content),
        }
      })
    )

    return NextResponse.json({
      files: files.filter(Boolean),
    })
  } catch (error) {
    console.error('GitHub import API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/import/ && git commit -m "feat: add GitHub import API for skills"
```

---

### Task 10: Skill Links and Admin APIs

**Files:**
- Create: `src/app/api/skills/[slug]/links/route.ts`
- Create: `src/app/api/admin/pending/route.ts`
- Create: `src/app/api/admin/publish/[entityType]/[id]/route.ts`
- Create: `src/app/api/admin/flag/[entityType]/[id]/route.ts`

- [ ] **Step 1: Create skill links route**

```typescript
// src/app/api/skills/[slug]/links/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const linkSchema = z.object({
  type: z.enum(['prompt', 'mcp']),
  id: z.string().uuid(),
  relationship: z.string().max(50).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: skill } = await supabase
      .from('skills')
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    const authResult = await requireOwnerOrAdmin(skill.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    const body = await request.json()
    const result = linkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { type, id, relationship } = result.data

    if (type === 'prompt') {
      const { error } = await supabase.from('skill_prompts').insert({
        skill_id: skill.id,
        prompt_id: id,
        relationship: relationship || 'used_by',
      })
      if (error) {
        return NextResponse.json({ error: 'Failed to link prompt' }, { status: 500 })
      }
    } else {
      const { error } = await supabase.from('skill_mcps').insert({
        skill_id: skill.id,
        mcp_id: id,
        relationship: relationship || 'works_with',
      })
      if (error) {
        return NextResponse.json({ error: 'Failed to link MCP' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Link API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create admin pending route**

```typescript
// src/app/api/admin/pending/route.ts
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()

    const [skills, mcps] = await Promise.all([
      supabase
        .from('skills')
        .select('id, title, slug, format, created_at, author:users!skills_created_by_fkey(name)')
        .eq('is_published', false)
        .order('created_at', { ascending: false }),
      supabase
        .from('mcps')
        .select('id, title, slug, server_type, created_at, author:users!mcps_created_by_fkey(name)')
        .eq('is_published', false)
        .order('created_at', { ascending: false }),
    ])

    return NextResponse.json({
      pending: {
        skills: skills.data || [],
        mcps: mcps.data || [],
      },
    })
  } catch (error) {
    console.error('Admin pending API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create admin publish route**

```typescript
// src/app/api/admin/publish/[entityType]/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

import type { EntityType } from '@/types'

const validTypes: EntityType[] = ['skill', 'mcp', 'prompt']
const tableMap: Record<EntityType, string> = {
  skill: 'skills',
  mcp: 'mcps',
  prompt: 'prompts',
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ entityType: string; id: string }> }
) {
  try {
    const { entityType, id } = await params

    if (!validTypes.includes(entityType as EntityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }

    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()
    const table = tableMap[entityType as EntityType]

    const { error } = await supabase
      .from(table)
      .update({ is_published: true, is_flagged: false })
      .eq('id', id)

    if (error) {
      console.error('Publish error:', error)
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin publish API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create admin flag route**

```typescript
// src/app/api/admin/flag/[entityType]/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

import type { EntityType } from '@/types'

const validTypes: EntityType[] = ['skill', 'mcp', 'prompt']
const tableMap: Record<EntityType, string> = {
  skill: 'skills',
  mcp: 'mcps',
  prompt: 'prompts',
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ entityType: string; id: string }> }
) {
  try {
    const { entityType, id } = await params

    if (!validTypes.includes(entityType as EntityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }

    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()
    const table = tableMap[entityType as EntityType]

    const { error } = await supabase
      .from(table)
      .update({ is_flagged: true })
      .eq('id', id)

    if (error) {
      console.error('Flag error:', error)
      return NextResponse.json({ error: 'Failed to flag' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin flag API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/nick/atlas && git add src/app/api/skills/[slug]/links/ src/app/api/admin/pending/ src/app/api/admin/publish/ src/app/api/admin/flag/ && git commit -m "feat: add skill links and admin moderation APIs"
```

---

### Task 11: Update Constants

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Update navigation and sort constants**

```typescript
// src/lib/constants.ts
export const APP_NAME = 'Atlas'
export const APP_DESCRIPTION = 'Skill & MCP Marketplace'

export const STALE_THRESHOLD_DAYS = 60
export const SEARCH_DEBOUNCE_MS = 300
export const VOTING_RESET_TIMEOUT_MS = 30000
export const MAX_VISIBLE_TAGS = 3

export const SKILL_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'votes', label: 'Most Voted' },
] as const

export const PROMPT_SORT_OPTIONS = [
  { value: 'verified', label: 'Recently Verified' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
] as const

export type SkillSortOption = (typeof SKILL_SORT_OPTIONS)[number]['value']
export type PromptSortOption = (typeof PROMPT_SORT_OPTIONS)[number]['value']

// Keep old alias for backwards compat during transition
export const SORT_OPTIONS = PROMPT_SORT_OPTIONS
export type SortOption = PromptSortOption
export const DEFAULT_SORT: SortOption = 'verified'

export const NAV_ITEMS = [
  { href: '/skills', label: 'Skills', icon: 'Sparkles' },
  { href: '/mcps', label: 'MCPs', icon: 'Plug' },
  { href: '/prompts', label: 'Prompts', icon: 'FileText' },
  { href: '/categories', label: 'Categories', icon: 'FolderOpen' },
] as const

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/pending', label: 'Pending', icon: 'Clock' },
  { href: '/admin/flagged', label: 'Flagged', icon: 'Flag' },
] as const

export const CONTRIBUTE_NAV_ITEM = {
  href: '/contribute',
  label: 'Contribute',
  icon: 'Plus',
} as const

export const SKILL_FORMATS = [
  { value: 'claude_code_skill', label: 'Claude Code Skill' },
  { value: 'system_prompt', label: 'System Prompt' },
  { value: 'custom', label: 'Custom' },
] as const

export const MCP_SERVER_TYPES = [
  { value: 'stdio', label: 'stdio' },
  { value: 'sse', label: 'SSE' },
  { value: 'http', label: 'HTTP' },
  { value: 'websocket', label: 'WebSocket' },
] as const
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/lib/constants.ts && git commit -m "refactor: update constants for skill/mcp navigation"
```

---

### Task 12: Final Build Verification

- [ ] **Step 1: Run typecheck**

```bash
cd /Users/nick/atlas && npm run typecheck
```

- [ ] **Step 2: Run build**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 3: Run lint**

```bash
cd /Users/nick/atlas && npm run lint
```

Fix any errors. The new API routes should all compile cleanly since they follow the same patterns as existing routes.

- [ ] **Step 4: Commit any fixes**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "fix: resolve build issues in new API routes"
```
