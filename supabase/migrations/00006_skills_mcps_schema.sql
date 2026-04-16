-- Atlas Rework: Skills, MCPs, Generalized Votes
-- Migration 00006

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
