-- Performance optimization indexes
-- This migration adds additional indexes for common query patterns

-- Index for sorting prompts by created_at (newest first)
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- Index for sorting prompts by last_verified_at (most recently verified first)
CREATE INDEX IF NOT EXISTS idx_prompts_last_verified_at ON prompts(last_verified_at DESC);

-- Partial index for flagged prompts (admin view optimization)
-- Only indexes rows where is_flagged = true, making it very efficient
CREATE INDEX IF NOT EXISTS idx_prompts_flagged ON prompts(is_flagged, last_verified_at DESC)
WHERE is_flagged = true;

-- Composite index for prompts needing review (flagged OR stale)
-- Optimizes the prompts_needing_review view
CREATE INDEX IF NOT EXISTS idx_prompts_needs_review ON prompts(is_flagged, last_verified_at);

-- Index for vote outcome filtering (useful for vote analytics)
CREATE INDEX IF NOT EXISTS idx_prompt_votes_outcome ON prompt_votes(outcome);

-- Composite index for user voting history lookup
CREATE INDEX IF NOT EXISTS idx_prompt_votes_user_prompt ON prompt_votes(user_id, prompt_id);
