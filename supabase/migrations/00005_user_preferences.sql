-- Migration: User Preferences Table
-- Purpose: Store user settings for notifications, theme, and default prompt behavior

-- Create user_preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Notification preferences (future-ready)
    notify_prompt_flagged BOOLEAN DEFAULT true,
    notify_voted_prompt_updated BOOLEAN DEFAULT true,
    notify_weekly_digest BOOLEAN DEFAULT false,

    -- Default prompt settings
    preferred_model TEXT DEFAULT NULL,
    default_copy_with_placeholders BOOLEAN DEFAULT false,

    -- Theme preference (also stored in localStorage for SSR)
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by user
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- No delete policy - preferences persist with user (CASCADE handles cleanup)
