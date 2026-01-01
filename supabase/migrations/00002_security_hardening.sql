-- ============================================================================
-- SECURITY HARDENING MIGRATION
-- ============================================================================
-- This migration hardens RLS policies to require authentication for all
-- operations and fixes potential security gaps.

-- ============================================================================
-- DROP EXISTING POLICIES (to replace with hardened versions)
-- ============================================================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Categories table policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- Prompts table policies
DROP POLICY IF EXISTS "Anyone can view prompts" ON prompts;
DROP POLICY IF EXISTS "Only admins can insert prompts" ON prompts;
DROP POLICY IF EXISTS "Only admins can update prompts" ON prompts;
DROP POLICY IF EXISTS "Only admins can delete prompts" ON prompts;

-- Prompt variables policies
DROP POLICY IF EXISTS "Anyone can view prompt variables" ON prompt_variables;
DROP POLICY IF EXISTS "Only admins can insert prompt variables" ON prompt_variables;
DROP POLICY IF EXISTS "Only admins can update prompt variables" ON prompt_variables;
DROP POLICY IF EXISTS "Only admins can delete prompt variables" ON prompt_variables;

-- Prompt examples policies
DROP POLICY IF EXISTS "Anyone can view prompt examples" ON prompt_examples;
DROP POLICY IF EXISTS "Only admins can insert prompt examples" ON prompt_examples;
DROP POLICY IF EXISTS "Only admins can update prompt examples" ON prompt_examples;
DROP POLICY IF EXISTS "Only admins can delete prompt examples" ON prompt_examples;

-- Prompt votes policies
DROP POLICY IF EXISTS "Users can view all votes" ON prompt_votes;
DROP POLICY IF EXISTS "Authenticated users can insert their own votes" ON prompt_votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON prompt_votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON prompt_votes;

-- ============================================================================
-- USERS TABLE - HARDENED POLICIES
-- ============================================================================

-- Allow authenticated users to view all users (for display names)
CREATE POLICY "Authenticated users can view all users" ON users
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow service role to insert users during signup
-- Note: This uses a more permissive check because signup creates users
-- The actual user record is created via service role in the API
CREATE POLICY "Service role can insert users" ON users
    FOR INSERT WITH CHECK (
        -- User can only insert their own record (matches auth.uid())
        auth.uid() = id
    );

-- ============================================================================
-- CATEGORIES TABLE - HARDENED POLICIES
-- ============================================================================

-- Require authentication to view categories
CREATE POLICY "Authenticated users can view categories" ON categories
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can update categories
CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- PROMPTS TABLE - HARDENED POLICIES
-- ============================================================================

-- Require authentication to view prompts
CREATE POLICY "Authenticated users can view prompts" ON prompts
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert prompts
CREATE POLICY "Admins can insert prompts" ON prompts
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can update prompts
CREATE POLICY "Admins can update prompts" ON prompts
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can delete prompts
CREATE POLICY "Admins can delete prompts" ON prompts
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- PROMPT_VARIABLES TABLE - HARDENED POLICIES
-- ============================================================================

-- Require authentication to view prompt variables
CREATE POLICY "Authenticated users can view prompt variables" ON prompt_variables
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert prompt variables
CREATE POLICY "Admins can insert prompt variables" ON prompt_variables
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can update prompt variables
CREATE POLICY "Admins can update prompt variables" ON prompt_variables
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can delete prompt variables
CREATE POLICY "Admins can delete prompt variables" ON prompt_variables
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- PROMPT_EXAMPLES TABLE - HARDENED POLICIES
-- ============================================================================

-- Require authentication to view prompt examples
CREATE POLICY "Authenticated users can view prompt examples" ON prompt_examples
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert prompt examples
CREATE POLICY "Admins can insert prompt examples" ON prompt_examples
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can update prompt examples
CREATE POLICY "Admins can update prompt examples" ON prompt_examples
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Only admins can delete prompt examples
CREATE POLICY "Admins can delete prompt examples" ON prompt_examples
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- PROMPT_VOTES TABLE - HARDENED POLICIES
-- ============================================================================

-- Require authentication to view votes
CREATE POLICY "Authenticated users can view votes" ON prompt_votes
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can only insert their own votes
CREATE POLICY "Users can insert their own votes" ON prompt_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own votes
CREATE POLICY "Users can update their own votes" ON prompt_votes
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own votes
CREATE POLICY "Users can delete their own votes" ON prompt_votes
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RATE LIMITING TABLE
-- ============================================================================
-- Create a table to track vote rate limiting

CREATE TABLE IF NOT EXISTS vote_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    vote_count INT NOT NULL DEFAULT 1,
    UNIQUE(user_id, window_start)
);

-- Enable RLS on rate limiting table
ALTER TABLE vote_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow users to see/manage their own rate limit records
CREATE POLICY "Users can view their own rate limits" ON vote_rate_limits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rate limits" ON vote_rate_limits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rate limits" ON vote_rate_limits
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rate limits" ON vote_rate_limits
    FOR DELETE USING (auth.uid() = user_id);

-- Index for faster rate limit lookups
CREATE INDEX IF NOT EXISTS idx_vote_rate_limits_user_window
    ON vote_rate_limits(user_id, window_start);

-- Function to check and update rate limit
-- Returns true if within limits, false if rate limited
CREATE OR REPLACE FUNCTION check_vote_rate_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_current_count INT;
    v_max_votes INT := 10; -- Max 10 votes per minute
BEGIN
    -- Calculate current minute window
    v_window_start := date_trunc('minute', now());

    -- Try to get existing count for this window
    SELECT vote_count INTO v_current_count
    FROM vote_rate_limits
    WHERE user_id = p_user_id AND window_start = v_window_start;

    IF v_current_count IS NULL THEN
        -- No record for this window, create one
        INSERT INTO vote_rate_limits (user_id, window_start, vote_count)
        VALUES (p_user_id, v_window_start, 1)
        ON CONFLICT (user_id, window_start)
        DO UPDATE SET vote_count = vote_rate_limits.vote_count + 1
        RETURNING vote_count INTO v_current_count;
    ELSIF v_current_count >= v_max_votes THEN
        -- Rate limited
        RETURN false;
    ELSE
        -- Increment count
        UPDATE vote_rate_limits
        SET vote_count = vote_count + 1
        WHERE user_id = p_user_id AND window_start = v_window_start;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function to remove old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM vote_rate_limits
    WHERE window_start < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
