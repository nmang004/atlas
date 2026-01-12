-- Migration: Add prompt_variants table for flexible variant system
-- Allows prompts to have multiple versions (Default with variables, Basic for copy-paste, etc.)

-- Create prompt_variants table
CREATE TABLE prompt_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL CHECK (variant_type IN ('basic', 'advanced', 'custom')),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- One variant per type per prompt
    UNIQUE(prompt_id, variant_type)
);

-- Index for faster lookups by prompt
CREATE INDEX idx_prompt_variants_prompt_id ON prompt_variants(prompt_id);

-- Enable RLS
ALTER TABLE prompt_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies (mirror prompts table policies)
CREATE POLICY "Anyone authenticated can view prompt variants" ON prompt_variants
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can insert prompt variants" ON prompt_variants
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update prompt variants" ON prompt_variants
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can delete prompt variants" ON prompt_variants
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Auto-update timestamp trigger
CREATE TRIGGER update_prompt_variants_updated_at
    BEFORE UPDATE ON prompt_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate basic variants for all existing prompts
-- Strategy: Replace {{variable_name}} with [VARIABLE_NAME] for manual replacement
INSERT INTO prompt_variants (prompt_id, variant_type, name, content, description, order_index)
SELECT
    id,
    'basic',
    'Basic Version',
    -- Replace {{variable_name}} with [VARIABLE_NAME] (uppercase)
    regexp_replace(
        content,
        '\{\{(\w+)\}\}',
        '[\1]',
        'g'
    ),
    'Simpler copy-paste version. Replace [PLACEHOLDERS] with your data before pasting into your AI tool.',
    1
FROM prompts;
