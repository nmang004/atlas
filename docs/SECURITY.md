# Security Documentation

This document outlines the security measures implemented in Atlas.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
3. [API Security](#api-security)
4. [Rate Limiting](#rate-limiting)
5. [Security Headers](#security-headers)
6. [Input Validation](#input-validation)
7. [XSS Prevention](#xss-prevention)
8. [Reporting Security Issues](#reporting-security-issues)

---

## Authentication & Authorization

### Authentication Flow

1. **Login**: Users authenticate via Supabase Auth with email/password
2. **Session Management**: Sessions are managed via HTTP-only cookies using `@supabase/ssr`
3. **Token Refresh**: Sessions are automatically refreshed via Next.js middleware
4. **Logout**: Sessions are invalidated server-side

### Authorization Levels

| Role | Permissions |
|------|-------------|
| `user` | View prompts, vote on prompts, update own profile |
| `admin` | All user permissions + create/edit/delete prompts and categories |

### Protected Routes

Routes requiring authentication (handled in `src/middleware.ts`):
- `/prompts/*` - Prompt library
- `/categories/*` - Category management
- `/admin/*` - Admin dashboard

---

## Row Level Security (RLS) Policies

All tables have RLS enabled. Policies are defined in `supabase/migrations/00002_security_hardening.sql`.

### Users Table

| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated users can view all users (for display names) |
| UPDATE | Users can only update their own profile |
| INSERT | Users can only insert their own record (during signup) |

### Categories Table

| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated users only |
| INSERT | Admin role only |
| UPDATE | Admin role only |
| DELETE | Admin role only |

### Prompts Table

| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated users only |
| INSERT | Admin role only |
| UPDATE | Admin role only |
| DELETE | Admin role only |

### Prompt Variables & Examples Tables

Follow the same pattern as prompts - authenticated users can read, only admins can modify.

### Prompt Votes Table

| Operation | Policy |
|-----------|--------|
| SELECT | Authenticated users can view all votes |
| INSERT | Users can only insert votes for themselves |
| UPDATE | Users can only update their own votes |
| DELETE | Users can only delete their own votes |

---

## API Security

### Authentication Checks

All API routes verify authentication using `requireAuth()` or `requireAdmin()` from `src/lib/auth.ts`:

- **401 Unauthorized**: Returned when no valid session exists
- **403 Forbidden**: Returned when user lacks required role

### API Routes

| Route | Method | Auth | Admin |
|-------|--------|------|-------|
| `/api/auth/signup` | POST | No | No |
| `/api/profile` | GET, PATCH | Yes | No |
| `/api/prompts` | POST | Yes | Yes |
| `/api/prompts/[id]` | PUT, DELETE | Yes | Yes |
| `/api/prompts/[id]/vote` | GET, POST | Yes* | No |
| `/api/admin/prompts/[id]/mark-reviewed` | POST | Yes | Yes |
| `/api/admin/prompts/[id]/unflag` | POST | Yes | Yes |

*GET returns null vote for unauthenticated users; POST requires authentication

---

## Rate Limiting

### Voting Endpoint

The voting endpoint (`/api/prompts/[id]/vote`) is rate-limited:

- **Limit**: 10 votes per minute per user
- **Window**: 1 minute (rolling)
- **Response**: 429 Too Many Requests

Implementation uses database-backed rate limiting via the `vote_rate_limits` table and `check_vote_rate_limit()` function (see migration file).

### Rate Limit Table Schema

```sql
vote_rate_limits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  window_start TIMESTAMPTZ NOT NULL,
  vote_count INT NOT NULL,
  UNIQUE(user_id, window_start)
)
```

---

## Security Headers

Applied to all routes via `next.config.js`:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-DNS-Prefetch-Control` | `on` | Optimize DNS prefetching |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leakage |
| `Permissions-Policy` | Disabled camera, mic, geolocation | Reduce attack surface |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforce HTTPS |

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://*.supabase.co;
font-src 'self' data:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

**Notes**:
- `unsafe-inline` and `unsafe-eval` are required for Next.js hydration
- For stricter CSP, consider implementing nonce-based scripts
- Supabase domains are whitelisted for API calls and real-time connections

---

## Input Validation

All API inputs are validated server-side using Zod schemas:

### Prompt Creation/Update

```typescript
{
  title: string (1-200 chars),
  content: string (1-50000 chars),
  category_id: UUID (optional),
  tags: string[] (max 20, each max 50 chars),
  model_version: string (max 50 chars, optional),
  data_requirements: string (max 10000 chars, optional),
  review_checklist: string (max 10000 chars, optional),
  variables: array (max 50) of {
    key: string (1-50 chars),
    label: string (1-100 chars),
    type: 'text' | 'textarea' | 'select',
    placeholder: string (max 200 chars, optional),
    is_required: boolean,
    options: string[] (max 50, each max 100 chars),
    order_index: int (0-100)
  }
}
```

### Vote

```typescript
{
  outcome: 'positive' | 'negative',
  feedback: string (max 2000 chars, optional)
}
```

### Parameter Validation

All URL parameters (prompt IDs) are validated as UUIDs before processing.

---

## XSS Prevention

### Markdown Rendering

User-generated markdown content is sanitized using `rehype-sanitize`:

- **Component**: `src/components/ui/safe-markdown.tsx`
- **Allowed Tags**: Basic formatting (headings, paragraphs, lists, links, code blocks, tables)
- **Allowed Protocols**: `http`, `https`, `mailto` only
- **Blocked**: All other HTML elements, event handlers, JavaScript URIs

### Database

Supabase client uses parameterized queries, preventing SQL injection.

---

## CSRF Protection

- Supabase Auth cookies use `SameSite` attribute (default: `Lax`)
- All mutating operations use POST/PUT/DELETE (not GET)
- State-changing API routes require valid session cookies

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email security concerns to the development team privately
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours and will coordinate disclosure timelines with you.

---

## Security Checklist

Before deploying updates:

- [ ] All API routes validate input with Zod
- [ ] All API routes check authentication/authorization
- [ ] No sensitive data in error messages
- [ ] New database tables have RLS enabled
- [ ] New RLS policies follow least-privilege principle
- [ ] User-generated content is sanitized before rendering
- [ ] Security headers are applied
- [ ] Dependencies are audited (`npm audit`)

---

*Last updated: 2025-01-01*
