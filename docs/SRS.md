# Software Requirements Specification (SRS)

## Atlas - Prompt Library & Governance System

**Version**: 1.0
**Date**: January 2024
**Status**: Draft

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for Atlas, an internal prompt governance system for SEO agencies. This document is intended for developers, testers, project managers, and stakeholders involved in the development and deployment of the system.

### 1.2 Scope

Atlas is a web-based application that enables SEO agency teams to:

- Store, organize, and retrieve battle-tested LLM prompts
- Inject variables into prompts for customization
- Maintain prompt quality through crowdsourced voting
- Learn prompt engineering best practices through examples
- Identify stale or problematic prompts requiring review

The system will be deployed as a Next.js application with a Supabase backend, accessible via modern web browsers.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| LLM | Large Language Model (e.g., GPT-4, Claude) |
| Prompt | A text instruction given to an LLM to generate output |
| Variable | A placeholder in a prompt (e.g., `{{client_name}}`) that gets replaced with user input |
| RLS | Row Level Security - Supabase/PostgreSQL feature for data access control |
| RSC | React Server Components |
| SEO | Search Engine Optimization |

### 1.4 References

- Next.js 14 Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- shadcn/ui Components: https://ui.shadcn.com

---

## 2. Overall Description

### 2.1 Product Perspective

Atlas is a standalone web application that serves as an internal tool for SEO agencies. It interfaces with:

- **Supabase**: Backend services (database, authentication)
- **User's Clipboard**: For copying assembled prompts
- **LLM Interfaces**: Users copy prompts to external LLM tools (ChatGPT, Claude, etc.)

Future phases may include:
- Browser extension for in-context prompt access
- Direct LLM API integration
- Team analytics dashboards

### 2.2 Product Features (High-Level)

1. **Prompt Library**: Browse, search, and filter prompts by category and tags
2. **Variable Injection**: Dynamic form generation based on prompt variables
3. **Smart Copy**: Copy assembled prompts with voting workflow
4. **Crowdsourced Maintenance**: Voting, verification, and flagging system
5. **Educational Content**: Data requirements, review checklists, and before/after examples
6. **Authentication & Authorization**: Role-based access control

### 2.3 User Classes and Characteristics

| User Class | Description | Permissions |
|------------|-------------|-------------|
| **User** | Regular team member who uses prompts | View prompts, copy prompts, vote on prompts, view own vote history |
| **Admin** | Team lead or prompt curator | All User permissions + create/edit/delete prompts, manage categories, view flagged prompts |

### 2.4 Operating Environment

- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Server**: Vercel (Next.js), Supabase Cloud (PostgreSQL 15)
- **Network**: HTTPS required

### 2.5 Design and Implementation Constraints

- Must use Next.js 14+ with App Router
- Must use Supabase for backend services
- Must implement Row Level Security for all tables
- TypeScript strict mode required
- Must be responsive for tablet+ screen sizes

### 2.6 Assumptions and Dependencies

- Users have access to modern web browsers
- Users have Supabase project credentials for deployment
- Users have accounts with external LLM providers (prompts are copied, not executed)

---

## 3. System Features

### 3.1 Prompt Library with Categories & Tags

#### FR-001: Category-Based Navigation

**Description**: Users shall be able to browse prompts organized by category through a sidebar navigation.

**Acceptance Criteria**:
- Sidebar displays all categories with prompt counts
- Clicking a category filters the prompt list
- "All Prompts" option shows unfiltered list
- Categories are sorted alphabetically

#### FR-002: Tag Filtering

**Description**: Users shall be able to filter prompts by one or more tags.

**Acceptance Criteria**:
- Multi-select chip interface for tag selection
- Selecting multiple tags shows prompts matching ANY selected tag (OR logic)
- Active filters are visually indicated
- "Clear filters" option available

#### FR-003: Prompt Search

**Description**: Users shall be able to search prompts by title and content.

**Acceptance Criteria**:
- Search input with debounced query (300ms delay)
- Search matches against prompt title and content
- Results update in real-time
- Search can be combined with category and tag filters

#### FR-004: Prompt Card Display

**Description**: Prompts shall be displayed as cards with key information.

**Acceptance Criteria**:
- Card shows: title, category, tags (max 3 + overflow indicator), rating, vote count
- "Needs Review" badge if not verified in 60 days
- Click navigates to prompt detail page
- Cards are displayed in a responsive grid layout

#### FR-005: Prompt Sorting

**Description**: Users shall be able to sort the prompt list.

**Acceptance Criteria**:
- Sort options: Recently verified, Highest rated, Most voted, Newest
- Default sort: Recently verified
- Sort preference persists during session

---

### 3.2 Variable Injection System

#### FR-010: Variable Parsing

**Description**: System shall parse `{{variable_key}}` patterns from prompt content.

**Acceptance Criteria**:
- Handlebars-style syntax recognized: `{{variable_key}}`
- Variables extracted and matched with `prompt_variables` table entries
- Unmatched variables in content display as-is (warning in admin view)

#### FR-011: Dynamic Form Generation

**Description**: System shall generate input forms based on prompt variables.

**Acceptance Criteria**:
- Form fields rendered in `order_index` sequence
- Each field shows label and optional placeholder
- Required fields marked with asterisk
- Form validates before allowing copy

#### FR-012: Text Input Variables

**Description**: Variables of type "text" shall render as single-line inputs.

**Acceptance Criteria**:
- Standard text input with placeholder support
- Max length validation (if specified)
- Real-time preview of assembled prompt

#### FR-013: Textarea Variables

**Description**: Variables of type "textarea" shall render as multi-line inputs.

**Acceptance Criteria**:
- Multi-line textarea with placeholder support
- Auto-resize based on content
- Preserves line breaks in assembled prompt

#### FR-014: Select Variables

**Description**: Variables of type "select" shall render as dropdowns.

**Acceptance Criteria**:
- Dropdown populated from `options` JSONB field
- First option selected by default (if required)
- Placeholder text for optional selects

#### FR-015: Prompt Assembly

**Description**: System shall assemble final prompt by replacing variables with user input.

**Acceptance Criteria**:
- All `{{variable_key}}` instances replaced with corresponding input
- Whitespace preserved
- Preview updates in real-time as user types

---

### 3.3 Copy & Voting Workflow

#### FR-020: Copy Button State

**Description**: Copy button shall be disabled until all required variables are filled.

**Acceptance Criteria**:
- Button disabled with visual indication when requirements unmet
- Tooltip explains what's missing
- Button enables immediately when requirements met

#### FR-021: Copy to Clipboard

**Description**: Clicking copy shall copy assembled prompt to user's clipboard.

**Acceptance Criteria**:
- Uses Clipboard API (falls back to execCommand if needed)
- Toast notification confirms successful copy
- Toast includes reminder about Review Checklist

#### FR-022: Voting UI Transition

**Description**: After copy, button shall transform into voting interface.

**Acceptance Criteria**:
- Copy button replaced with thumbs up/down icons
- Icons have hover states
- "How did it work?" helper text displayed
- User can skip voting (UI resets after 30 seconds of inactivity)

#### FR-023: Positive Vote

**Description**: Positive vote shall update prompt verification status.

**Acceptance Criteria**:
- Creates record in `prompt_votes` with outcome "positive"
- Updates `last_verified_at` to current timestamp
- Recalculates `rating_score`
- Increments `vote_count`
- Toast confirms vote recorded

#### FR-024: Negative Vote

**Description**: Negative vote shall flag prompt and optionally collect feedback.

**Acceptance Criteria**:
- Creates record in `prompt_votes` with outcome "negative"
- Sets `is_flagged` to true on prompt
- Shows optional feedback textarea
- Recalculates `rating_score`
- Toast confirms vote recorded

#### FR-025: Vote Deduplication

**Description**: Users shall only have one vote per prompt (most recent).

**Acceptance Criteria**:
- Database constraint prevents duplicate votes
- New vote replaces previous vote
- UI indicates if user has previously voted

---

### 3.4 Crowdsourced Maintenance System

#### FR-030: Verification Tracking

**Description**: System shall track when prompts were last verified as working.

**Acceptance Criteria**:
- `last_verified_at` updated on positive vote
- Timestamp displayed on prompt detail page
- Relative time format ("3 days ago")

#### FR-031: Stale Prompt Detection

**Description**: System shall identify prompts not verified in 60 days.

**Acceptance Criteria**:
- "Needs Review" badge on prompt cards
- Filter option to show only stale prompts
- Admin dashboard shows stale prompt count

#### FR-032: Flagged Prompt Detection

**Description**: System shall identify prompts flagged by negative votes.

**Acceptance Criteria**:
- Flagged status visible in admin view
- Filter option to show only flagged prompts
- Feedback from negative votes displayed

#### FR-033: Admin Review Dashboard

**Description**: Admins shall have a dedicated view for reviewing problematic prompts.

**Acceptance Criteria**:
- Lists flagged and stale prompts
- Shows vote counts and recent feedback
- Quick actions: unflag, archive, edit
- Sorted by urgency (flagged first, then by staleness)

#### FR-034: Unflag Prompt

**Description**: Admins shall be able to clear the flagged status after review.

**Acceptance Criteria**:
- Unflag action sets `is_flagged` to false
- Action logged with timestamp
- Prompt returns to normal state

#### FR-035: Model Version Tracking

**Description**: Prompts shall track which LLM version they were optimized for.

**Acceptance Criteria**:
- `model_version` field displayed on prompt detail
- Filterable by model version
- Visual indicator if model version is outdated

---

### 3.5 Educational Content

#### FR-040: Data Requirements Display

**Description**: Prompts shall display what data users need before using the prompt.

**Acceptance Criteria**:
- Displayed above variable input form
- Markdown rendering supported
- Collapsible for long content

#### FR-041: Review Checklist Display

**Description**: Prompts shall display verification steps for LLM output.

**Acceptance Criteria**:
- Displayed below copy button
- Markdown rendering supported
- Collapsible, expanded by default after copy

#### FR-042: Before/After Examples

**Description**: Prompts may include weak vs. strong prompt examples.

**Acceptance Criteria**:
- Expandable section when examples exist
- Side-by-side or tabbed display
- Shows both prompt versions and sample outputs
- "Why it's better" explanation (optional)

---

### 3.6 Authentication & Authorization

#### FR-050: Email Authentication

**Description**: Users shall authenticate via email/password or magic link.

**Acceptance Criteria**:
- Email/password registration and login
- Magic link option for passwordless auth
- Email verification required for new accounts

#### FR-051: Session Management

**Description**: System shall maintain user sessions securely.

**Acceptance Criteria**:
- JWT-based sessions via Supabase Auth
- Sessions expire after 1 week of inactivity
- Logout functionality available

#### FR-052: Role-Based Access Control

**Description**: System shall enforce permissions based on user role.

**Acceptance Criteria**:
- RLS policies enforce read/write permissions
- Admin actions hidden from regular users
- Unauthorized API requests return 403

#### FR-053: User Profile

**Description**: Users shall have access to their profile information.

**Acceptance Criteria**:
- View and edit name
- View email (non-editable)
- View role
- View vote history

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements

- Responsive design (minimum 768px viewport width)
- Consistent shadcn/ui component usage
- Dark mode support (future enhancement)
- Keyboard navigation for accessibility

#### 4.1.2 Key Screens

| Screen | Description |
|--------|-------------|
| Login/Signup | Authentication forms with email/password |
| Prompt Library | Grid of prompt cards with sidebar navigation |
| Prompt Detail | Full prompt view with variable form and voting |
| Prompt Editor | Admin form for creating/editing prompts |
| Admin Dashboard | Flagged/stale prompts management |
| User Profile | User info and vote history |

### 4.2 API Interfaces

#### 4.2.1 Supabase Client API

All data operations use Supabase JavaScript client library:

- `supabase.from('table').select()` - Read operations
- `supabase.from('table').insert()` - Create operations
- `supabase.from('table').update()` - Update operations
- `supabase.from('table').delete()` - Delete operations
- `supabase.auth.signIn()` - Authentication

#### 4.2.2 Next.js API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/prompts/[id]/vote` | POST | Submit vote for a prompt |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **NFR-001**: Page load time shall be under 3 seconds on 4G connection
- **NFR-002**: Search results shall appear within 500ms of typing
- **NFR-003**: Copy to clipboard shall complete within 100ms

### 5.2 Security

- **NFR-010**: All API requests shall be authenticated except public read operations
- **NFR-011**: RLS policies shall be enforced at database level
- **NFR-012**: Passwords shall meet minimum complexity requirements
- **NFR-013**: All traffic shall be encrypted via HTTPS

### 5.3 Usability

- **NFR-020**: System shall be usable without training for basic operations
- **NFR-021**: Error messages shall be actionable and user-friendly
- **NFR-022**: Loading states shall be indicated for all async operations

### 5.4 Reliability

- **NFR-030**: System shall have 99.5% uptime (excluding scheduled maintenance)
- **NFR-031**: Data shall be backed up daily with 30-day retention

### 5.5 Scalability

- **NFR-040**: System shall support up to 100 concurrent users
- **NFR-041**: Database shall support up to 10,000 prompts

---

## 6. Database Requirements

### 6.1 Schema Overview

See `supabase/migrations/00001_initial_schema.sql` for complete schema definition.

### 6.2 Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐
│   users     │     │ categories  │
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │
│ email       │     │ name        │
│ name        │     │ description │
│ role        │     │ created_at  │
│ created_at  │     └──────┬──────┘
└──────┬──────┘            │
       │                   │
       │         ┌─────────┴─────────┐
       │         │                   │
       │    ┌────▼────┐              │
       └────►  prompts ◄─────────────┘
            ├─────────┤
            │ id (PK) │
            │ category_id (FK)
            │ title   │
            │ content │
            │ tags[]  │
            │ ...     │
            │ created_by (FK)
            └────┬────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
┌─────▼─────┐ ┌──▼───┐ ┌────▼─────┐
│ variables │ │ votes│ │ examples │
└───────────┘ └──────┘ └──────────┘
```

### 6.3 Data Integrity

- Foreign key constraints enforce referential integrity
- CASCADE deletes for dependent records (variables, examples, votes)
- Unique constraint on user votes per prompt
- Check constraints on enum fields (role, type, outcome)

---

## 7. Future Phases (Out of Scope for MVP)

### 7.1 Phase 2: Browser Extension

- Chrome/Firefox extension for in-context prompt access
- Quick copy from any webpage
- Context-aware prompt suggestions

### 7.2 Phase 3: Advanced Features

- AI-powered prompt suggestions based on task description
- Team analytics dashboard (usage patterns, top performers)
- Prompt versioning and change history
- Direct LLM API integration for testing prompts
- SSO integration (Google, Okta)
- API access for external tools and integrations

---

## Appendix A: Acceptance Criteria Checklist

| ID | Requirement | Acceptance Criteria Status |
|----|-------------|---------------------------|
| FR-001 | Category Navigation | [ ] Pending |
| FR-002 | Tag Filtering | [ ] Pending |
| FR-003 | Prompt Search | [ ] Pending |
| ... | ... | ... |

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Jan 2024 | Atlas Team | Initial draft |
