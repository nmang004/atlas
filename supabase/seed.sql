-- Atlas Seed Data
-- Run this after the initial migration to populate sample data

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Ticket Responses', 'Pre-built responses for common client support tickets and inquiries'),
  ('c1000000-0000-0000-0000-000000000002', 'Audit & Analysis', 'Prompts for conducting SEO audits, competitor analysis, and site reviews'),
  ('c1000000-0000-0000-0000-000000000003', 'Client Communications', 'Templates for client emails, reports, and strategic recommendations');

-- ============================================================================
-- PROMPTS
-- ============================================================================

-- Prompt 1: Ranking Drop Analysis (Audit & Analysis)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000002',
  'Ranking Drop Root Cause Analysis',
  'You are an expert SEO analyst investigating a ranking drop for {{client_name}}.

## Context
- Website: {{website_url}}
- Drop detected: {{drop_date}}
- Affected pages/keywords: {{affected_assets}}
- Traffic change: {{traffic_change}}

## Your Task
Analyze the potential causes of this ranking drop and provide a structured diagnosis. Consider:

1. **Algorithm Updates**: Check if the timing aligns with known Google updates
2. **Technical Issues**: Crawlability, indexation, Core Web Vitals changes
3. **Content Changes**: Recent edits, thin content, duplicate content
4. **Backlink Profile**: Lost links, toxic link acquisition, competitor link building
5. **Competitive Landscape**: New competitors, competitor improvements
6. **SERP Feature Changes**: Featured snippets, local pack changes

## Output Format
Provide your analysis in this structure:
- **Primary Hypothesis** (most likely cause with confidence level)
- **Supporting Evidence** (what data supports this)
- **Secondary Factors** (contributing issues)
- **Recommended Actions** (prioritized by impact)
- **Data Needed** (what additional information would confirm the diagnosis)',
  ARRAY['#ranking-drops', '#technical', '#audit'],
  '### Data to Gather Before Using This Prompt

- [ ] Google Search Console data (compare 28 days before/after drop)
- [ ] Google Analytics traffic data for affected pages
- [ ] List of specific keywords/pages affected
- [ ] Recent site changes log (content updates, technical changes)
- [ ] Backlink profile export from Ahrefs/Semrush
- [ ] Check Google Algorithm Update tracker for timing',
  '### Review Checklist

- [ ] Hypothesis is specific and testable (not vague)
- [ ] Timeline analysis accounts for algorithm update dates
- [ ] Technical factors verified against actual GSC data
- [ ] Recommendations are actionable (not generic advice)
- [ ] No hallucinated algorithm names or dates
- [ ] Confidence levels are realistic',
  'Claude 3.5 Sonnet',
  92.5,
  40
);

-- Prompt 2: Technical SEO Ticket Response (Ticket Responses)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'Technical SEO Issue Response',
  'Write a professional client response explaining a technical SEO issue and our remediation plan.

## Context
- Client: {{client_name}}
- Issue type: {{issue_type}}
- Severity: {{severity}}
- Issue details: {{issue_details}}
- Our proposed fix: {{proposed_fix}}
- Timeline: {{timeline}}

## Tone Guidelines
- Professional but approachable
- Avoid jargon—explain technical concepts simply
- Focus on business impact, not just technical details
- Be reassuring without minimizing the issue

## Response Structure
1. Acknowledge the issue clearly
2. Explain what it means for their site (business impact)
3. Outline our action plan with specific steps
4. Set clear expectations on timeline
5. Offer to discuss further if needed

Keep the response concise (under 200 words) unless the issue requires detailed explanation.',
  ARRAY['#technical', '#client-facing', '#tickets'],
  '### Required Information

- Issue type and technical details
- Business impact assessment
- Proposed remediation steps
- Realistic timeline for fix',
  '### Before Sending, Verify

- [ ] Technical explanation is accurate and simplified
- [ ] Timeline is realistic (check with dev team)
- [ ] No blame language or defensiveness
- [ ] Clear next steps for client
- [ ] Proofread for typos and tone',
  'GPT-4',
  88.0,
  25
);

-- Prompt 3: Monthly Report Executive Summary (Client Communications)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003',
  'Monthly SEO Report Executive Summary',
  'Create an executive summary for {{client_name}}''s monthly SEO report.

## Performance Data
- Organic sessions: {{organic_sessions}} ({{sessions_change}} vs last month)
- Organic conversions: {{conversions}} ({{conversions_change}} vs last month)
- Average position: {{avg_position}} ({{position_change}} vs last month)
- Top performing pages: {{top_pages}}

## Key Activities This Month
{{activities_completed}}

## Context
{{additional_context}}

## Requirements
Write a 3-4 paragraph executive summary that:
1. **Leads with results** - Start with the most important metric change
2. **Tells a story** - Connect activities to outcomes
3. **Addresses concerns proactively** - If metrics are down, explain why and what we''re doing
4. **Sets up next month** - Preview upcoming initiatives
5. **Maintains confidence** - Professional, strategic tone

Avoid: Generic statements, unexplained jargon, burying bad news, over-promising.',
  ARRAY['#content', '#client-facing', '#reporting'],
  '### Data Required

- [ ] Full month GA4 organic data
- [ ] GSC performance metrics
- [ ] List of completed deliverables
- [ ] Any known issues or context
- [ ] Comparison period data',
  '### Quality Check

- [ ] Numbers match the actual data
- [ ] Story is coherent and logical
- [ ] Negative trends are addressed honestly
- [ ] No generic filler content
- [ ] Appropriate length (not too long)',
  'Claude 3.5 Sonnet',
  95.0,
  52
);

-- Prompt 4: Local SEO Citation Audit (Audit & Analysis)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000002',
  'Local SEO Citation Audit Framework',
  'Analyze the local citation profile for {{business_name}} and identify optimization opportunities.

## Business Information
- Business Name: {{business_name}}
- Address: {{address}}
- Phone: {{phone}}
- Website: {{website}}
- Primary Category: {{primary_category}}
- Service Areas: {{service_areas}}

## Known Citations
{{existing_citations}}

## Audit Objectives
1. **NAP Consistency Analysis**: Identify discrepancies in Name, Address, Phone across citations
2. **Citation Gap Analysis**: Find high-authority directories where the business is missing
3. **Duplicate Detection**: Flag potential duplicate listings that could cause issues
4. **Category Optimization**: Assess category selections across platforms
5. **Priority Recommendations**: Rank fixes by impact

## Output Format
Provide a structured audit with:
- Summary of current citation health (score out of 100)
- Critical issues requiring immediate attention
- Table of inconsistencies found
- List of recommended new citations (prioritized)
- Duplicate listings to merge/remove
- Estimated impact of fixes',
  ARRAY['#local-seo', '#audit', '#citations'],
  '### Pre-Audit Data Collection

- [ ] Verified correct NAP from client
- [ ] Export from BrightLocal/Whitespark/Yext
- [ ] Google Business Profile status
- [ ] Bing Places status
- [ ] Apple Maps status',
  '### Audit Quality Checks

- [ ] NAP format is consistent in recommendations
- [ ] Cited directories are legitimate (no PBNs)
- [ ] Priority ranking is logical
- [ ] Duplicate detection is accurate
- [ ] Recommendations are actionable',
  'GPT-4',
  78.5,
  18
);

-- Prompt 5: Site Migration Pre-Launch Checklist (Audit & Analysis)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000002',
  'Site Migration SEO Checklist Generator',
  'Generate a comprehensive SEO checklist for {{client_name}}''s upcoming site migration.

## Migration Details
- Migration type: {{migration_type}}
- Current URL: {{current_url}}
- New URL: {{new_url}}
- Launch date: {{launch_date}}
- CMS change: {{cms_info}}
- Design change: {{design_info}}

## Scope
{{migration_scope}}

## Known Risks
{{known_risks}}

## Generate Checklist For
Create detailed checklists covering:

### Pre-Migration (2-4 weeks before)
- Benchmarking current performance
- URL mapping and redirect planning
- Content audit and inventory

### Migration Day
- Technical validation steps
- Redirect implementation verification
- Monitoring setup

### Post-Migration (first 30 days)
- Performance monitoring cadence
- Issue escalation triggers
- Rollback criteria

Format each item as an actionable checkbox with owner assignment placeholder and priority level (Critical/High/Medium/Low).',
  ARRAY['#migrations', '#technical', '#checklists'],
  '### Information Needed

- [ ] Complete URL inventory of current site
- [ ] Staging site access for new version
- [ ] List of high-value pages (top 50 by traffic)
- [ ] Current XML sitemap
- [ ] Backlink profile for redirect mapping',
  '### Checklist Validation

- [ ] All critical SEO elements covered
- [ ] Timeline is realistic for team size
- [ ] Rollback plan is included
- [ ] Monitoring metrics defined
- [ ] Owner assignments make sense',
  'Claude 3.5 Sonnet',
  91.0,
  33
);

-- Prompt 6: Apology Email for Missed Deadline (Client Communications)
INSERT INTO prompts (id, category_id, title, content, tags, data_requirements, review_checklist, model_version, rating_score, vote_count) VALUES
(
  'p1000000-0000-0000-0000-000000000006',
  'c1000000-0000-0000-0000-000000000003',
  'Deadline Miss Client Communication',
  'Write a professional apology email for a missed deliverable deadline.

## Situation
- Client: {{client_name}}
- Deliverable: {{deliverable}}
- Original deadline: {{original_deadline}}
- New deadline: {{new_deadline}}
- Reason (internal): {{internal_reason}}
- Tone: {{tone}}

## Guidelines
1. **Take ownership** - No excuses or blame-shifting
2. **Be specific** - State exactly what was missed and new timeline
3. **Explain appropriately** - Brief context without over-explaining
4. **Offer value** - Consider what we can offer to maintain trust
5. **Prevent recurrence** - Briefly mention what we''re doing differently

## Constraints
- Keep under 150 words
- Don''t over-apologize (once is enough)
- Don''t promise things we can''t guarantee
- Maintain professional confidence

The email should acknowledge the miss, provide the new timeline, and reinforce our commitment to the work.',
  ARRAY['#client-facing', '#difficult-conversations', '#content'],
  '### Context Required

- Accurate new deadline (confirmed with team)
- Understanding of client relationship history
- Any previous misses with this client
- Approved offerings/concessions if any',
  '### Before Sending

- [ ] Tone matches client relationship
- [ ] New deadline is confirmed and realistic
- [ ] No defensive language
- [ ] Concise and professional
- [ ] Manager approved (if required)',
  'GPT-4',
  85.5,
  22
);

-- ============================================================================
-- PROMPT VARIABLES
-- ============================================================================

-- Variables for Prompt 1: Ranking Drop Analysis
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000001', 'client_name', 'Client Name', 'text', '[]', true, 'Acme Corp', 0),
('p1000000-0000-0000-0000-000000000001', 'website_url', 'Website URL', 'text', '[]', true, 'https://example.com', 1),
('p1000000-0000-0000-0000-000000000001', 'drop_date', 'Drop Detection Date', 'text', '[]', true, 'January 15, 2024', 2),
('p1000000-0000-0000-0000-000000000001', 'affected_assets', 'Affected Pages/Keywords', 'textarea', '[]', true, 'List the specific pages or keywords that dropped...', 3),
('p1000000-0000-0000-0000-000000000001', 'traffic_change', 'Traffic Change', 'text', '[]', true, '-35% organic sessions', 4);

-- Variables for Prompt 2: Technical SEO Ticket Response
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000002', 'client_name', 'Client Name', 'text', '[]', true, 'Acme Corp', 0),
('p1000000-0000-0000-0000-000000000002', 'issue_type', 'Issue Type', 'select', '["Indexation Issue", "Crawl Errors", "Core Web Vitals", "Redirect Problem", "Canonical Issue", "Structured Data Error", "Other"]', true, null, 1),
('p1000000-0000-0000-0000-000000000002', 'severity', 'Severity Level', 'select', '["Critical - Immediate Impact", "High - Significant Impact", "Medium - Moderate Impact", "Low - Minor Impact"]', true, null, 2),
('p1000000-0000-0000-0000-000000000002', 'issue_details', 'Issue Details', 'textarea', '[]', true, 'Describe the technical issue...', 3),
('p1000000-0000-0000-0000-000000000002', 'proposed_fix', 'Proposed Fix', 'textarea', '[]', true, 'Outline the remediation steps...', 4),
('p1000000-0000-0000-0000-000000000002', 'timeline', 'Fix Timeline', 'text', '[]', true, '3-5 business days', 5);

-- Variables for Prompt 3: Monthly Report Executive Summary
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000003', 'client_name', 'Client Name', 'text', '[]', true, 'Acme Corp', 0),
('p1000000-0000-0000-0000-000000000003', 'organic_sessions', 'Organic Sessions', 'text', '[]', true, '45,230', 1),
('p1000000-0000-0000-0000-000000000003', 'sessions_change', 'Sessions Change', 'text', '[]', true, '+12%', 2),
('p1000000-0000-0000-0000-000000000003', 'conversions', 'Organic Conversions', 'text', '[]', true, '523', 3),
('p1000000-0000-0000-0000-000000000003', 'conversions_change', 'Conversions Change', 'text', '[]', true, '+8%', 4),
('p1000000-0000-0000-0000-000000000003', 'avg_position', 'Average Position', 'text', '[]', true, '14.2', 5),
('p1000000-0000-0000-0000-000000000003', 'position_change', 'Position Change', 'text', '[]', true, 'improved by 1.3', 6),
('p1000000-0000-0000-0000-000000000003', 'top_pages', 'Top Performing Pages', 'textarea', '[]', true, 'List top 3-5 pages...', 7),
('p1000000-0000-0000-0000-000000000003', 'activities_completed', 'Activities Completed', 'textarea', '[]', true, 'List key deliverables and activities...', 8),
('p1000000-0000-0000-0000-000000000003', 'additional_context', 'Additional Context', 'textarea', '[]', false, 'Any relevant context or notes...', 9);

-- Variables for Prompt 4: Local SEO Citation Audit
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000004', 'business_name', 'Business Name', 'text', '[]', true, 'Joe''s Plumbing LLC', 0),
('p1000000-0000-0000-0000-000000000004', 'address', 'Full Address', 'text', '[]', true, '123 Main St, Suite 100, Austin, TX 78701', 1),
('p1000000-0000-0000-0000-000000000004', 'phone', 'Phone Number', 'text', '[]', true, '(512) 555-0123', 2),
('p1000000-0000-0000-0000-000000000004', 'website', 'Website URL', 'text', '[]', true, 'https://joesplumbing.com', 3),
('p1000000-0000-0000-0000-000000000004', 'primary_category', 'Primary Business Category', 'text', '[]', true, 'Plumber', 4),
('p1000000-0000-0000-0000-000000000004', 'service_areas', 'Service Areas', 'textarea', '[]', true, 'Austin, Round Rock, Cedar Park, Georgetown', 5),
('p1000000-0000-0000-0000-000000000004', 'existing_citations', 'Known Existing Citations', 'textarea', '[]', false, 'Paste list of known citations...', 6);

-- Variables for Prompt 5: Site Migration Checklist
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000005', 'client_name', 'Client Name', 'text', '[]', true, 'Acme Corp', 0),
('p1000000-0000-0000-0000-000000000005', 'migration_type', 'Migration Type', 'select', '["Domain Change", "HTTP to HTTPS", "CMS Migration", "Site Redesign", "URL Structure Change", "Full Rebrand"]', true, null, 1),
('p1000000-0000-0000-0000-000000000005', 'current_url', 'Current Site URL', 'text', '[]', true, 'https://old-domain.com', 2),
('p1000000-0000-0000-0000-000000000005', 'new_url', 'New Site URL', 'text', '[]', true, 'https://new-domain.com', 3),
('p1000000-0000-0000-0000-000000000005', 'launch_date', 'Target Launch Date', 'text', '[]', true, 'February 15, 2024', 4),
('p1000000-0000-0000-0000-000000000005', 'cms_info', 'CMS Change Details', 'text', '[]', false, 'WordPress to Webflow', 5),
('p1000000-0000-0000-0000-000000000005', 'design_info', 'Design Change Details', 'text', '[]', false, 'Complete redesign with new IA', 6),
('p1000000-0000-0000-0000-000000000005', 'migration_scope', 'Migration Scope', 'textarea', '[]', true, 'Describe what''s changing...', 7),
('p1000000-0000-0000-0000-000000000005', 'known_risks', 'Known Risks', 'textarea', '[]', false, 'Any specific concerns or risks...', 8);

-- Variables for Prompt 6: Apology Email
INSERT INTO prompt_variables (prompt_id, key, label, type, options, is_required, placeholder, order_index) VALUES
('p1000000-0000-0000-0000-000000000006', 'client_name', 'Client Name', 'text', '[]', true, 'Acme Corp', 0),
('p1000000-0000-0000-0000-000000000006', 'deliverable', 'Missed Deliverable', 'text', '[]', true, 'Monthly SEO Report', 1),
('p1000000-0000-0000-0000-000000000006', 'original_deadline', 'Original Deadline', 'text', '[]', true, 'January 15, 2024', 2),
('p1000000-0000-0000-0000-000000000006', 'new_deadline', 'New Deadline', 'text', '[]', true, 'January 18, 2024', 3),
('p1000000-0000-0000-0000-000000000006', 'internal_reason', 'Internal Reason (not shared)', 'textarea', '[]', true, 'Resource constraints due to...' , 4),
('p1000000-0000-0000-0000-000000000006', 'tone', 'Email Tone', 'select', '["Formal", "Warm Professional", "Casual"]', true, null, 5);

-- ============================================================================
-- PROMPT EXAMPLES (Before/After)
-- ============================================================================

-- Example for Prompt 1: Ranking Drop Analysis
INSERT INTO prompt_examples (prompt_id, weak_version, strong_version, weak_output, strong_output) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'Why did my client''s rankings drop? They lost traffic last month. Help me figure out what happened.',
  'You are an expert SEO analyst investigating a ranking drop for TechStart Inc.

## Context
- Website: https://techstart.io
- Drop detected: January 10, 2024
- Affected pages/keywords: /blog/ai-tools (dropped from position 3 to 15 for "best AI tools 2024"), /product page (dropped from 5 to 22 for "project management software")
- Traffic change: -42% organic sessions week-over-week

## Your Task
Analyze the potential causes of this ranking drop considering algorithm updates, technical issues, content changes, backlink profile, competitive landscape, and SERP feature changes.

Provide: Primary Hypothesis with confidence level, Supporting Evidence, Secondary Factors, Recommended Actions prioritized by impact, and Data Needed for confirmation.',
  'The rankings probably dropped because of a Google update or maybe some technical issue. You should check Google Search Console and see if there are any errors. It could also be that competitors are doing better now. Try adding more content and building some backlinks to recover.',
  '## Primary Hypothesis: January 2024 Core Update Impact (Confidence: 75%)

The timing aligns precisely with Google''s January 10, 2024 core update rollout. The affected pages show patterns consistent with content quality reassessment:

**Supporting Evidence:**
- Drop timing matches update deployment within 24 hours
- Both affected pages are informational/comparative content (common update targets)
- No technical issues detected in GSC during this period
- Backlink profile stable (verified via Ahrefs - no significant losses)

**Secondary Factors:**
1. The "best AI tools 2024" page hasn''t been updated since October 2023 - freshness signal weakness
2. Competitor analysis shows 3 new comprehensive guides published in December outranking original position

**Recommended Actions (Priority Order):**
1. **Immediate**: Comprehensive content refresh on /blog/ai-tools - add 2024 tool updates, user reviews, comparison tables
2. **This Week**: Audit E-E-A-T signals on product page - add case studies, customer testimonials
3. **Ongoing**: Implement content freshness schedule for high-value pages

**Data Needed for Confirmation:**
- GSC data comparison: impressions vs clicks trend (looking for impression drops preceding click drops)
- Core Web Vitals check for affected pages
- SERP feature analysis - did featured snippets change?'
);
