-- Atlas Initial Schema
-- This migration creates the core tables for the Prompt Library & Governance System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PROMPTS TABLE
-- ============================================================================
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    data_requirements TEXT,
    review_checklist TEXT,
    model_version TEXT,
    last_verified_at TIMESTAMPTZ DEFAULT now(),
    rating_score FLOAT DEFAULT 0,
    vote_count INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster category lookups
CREATE INDEX idx_prompts_category_id ON prompts(category_id);
CREATE INDEX idx_prompts_created_by ON prompts(created_by);
CREATE INDEX idx_prompts_tags ON prompts USING GIN(tags);

-- ============================================================================
-- PROMPT_VARIABLES TABLE
-- ============================================================================
CREATE TABLE prompt_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'select')),
    options JSONB DEFAULT '[]',
    is_required BOOLEAN DEFAULT true,
    placeholder TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster prompt variable lookups
CREATE INDEX idx_prompt_variables_prompt_id ON prompt_variables(prompt_id);

-- ============================================================================
-- PROMPT_EXAMPLES TABLE
-- ============================================================================
CREATE TABLE prompt_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    weak_version TEXT,
    strong_version TEXT,
    weak_output TEXT,
    strong_output TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster prompt example lookups
CREATE INDEX idx_prompt_examples_prompt_id ON prompt_examples(prompt_id);

-- ============================================================================
-- PROMPT_VOTES TABLE
-- ============================================================================
CREATE TABLE prompt_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    outcome TEXT NOT NULL CHECK (outcome IN ('positive', 'negative')),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Prevent duplicate votes from same user on same prompt
    UNIQUE(prompt_id, user_id)
);

-- Create indexes for faster vote lookups
CREATE INDEX idx_prompt_votes_prompt_id ON prompt_votes(prompt_id);
CREATE INDEX idx_prompt_votes_user_id ON prompt_votes(user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on prompts table
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update prompt rating after a vote
CREATE OR REPLACE FUNCTION update_prompt_rating()
RETURNS TRIGGER AS $$
DECLARE
    positive_count INT;
    total_count INT;
    new_rating FLOAT;
BEGIN
    -- Count votes for this prompt
    SELECT
        COUNT(*) FILTER (WHERE outcome = 'positive'),
        COUNT(*)
    INTO positive_count, total_count
    FROM prompt_votes
    WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id);

    -- Calculate rating (percentage of positive votes)
    IF total_count > 0 THEN
        new_rating := (positive_count::FLOAT / total_count::FLOAT) * 100;
    ELSE
        new_rating := 0;
    END IF;

    -- Update the prompt
    UPDATE prompts
    SET
        rating_score = new_rating,
        vote_count = total_count,
        -- Reset verification date on positive vote
        last_verified_at = CASE
            WHEN TG_OP = 'INSERT' AND NEW.outcome = 'positive' THEN now()
            ELSE last_verified_at
        END,
        -- Flag prompt on negative vote
        is_flagged = CASE
            WHEN TG_OP = 'INSERT' AND NEW.outcome = 'negative' THEN true
            ELSE is_flagged
        END
    WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating after vote insert/update/delete
CREATE TRIGGER update_rating_on_vote
    AFTER INSERT OR UPDATE OR DELETE ON prompt_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_prompt_rating();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Prompts policies
CREATE POLICY "Anyone can view prompts" ON prompts
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert prompts" ON prompts
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update prompts" ON prompts
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can delete prompts" ON prompts
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Prompt variables policies
CREATE POLICY "Anyone can view prompt variables" ON prompt_variables
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert prompt variables" ON prompt_variables
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update prompt variables" ON prompt_variables
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can delete prompt variables" ON prompt_variables
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Prompt examples policies
CREATE POLICY "Anyone can view prompt examples" ON prompt_examples
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert prompt examples" ON prompt_examples
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update prompt examples" ON prompt_examples
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can delete prompt examples" ON prompt_examples
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Prompt votes policies
CREATE POLICY "Users can view all votes" ON prompt_votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own votes" ON prompt_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON prompt_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON prompt_votes
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for prompts that need review (not verified in 60 days or flagged)
CREATE VIEW prompts_needing_review AS
SELECT
    p.*,
    c.name as category_name
FROM prompts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE
    p.is_flagged = true
    OR p.last_verified_at < (now() - INTERVAL '60 days');
