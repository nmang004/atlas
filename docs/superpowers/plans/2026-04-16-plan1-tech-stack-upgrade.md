# Plan 1: Tech Stack Upgrade

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Atlas from Next.js 14/React 18/Tailwind 3 to Next.js 16/React 19/Tailwind 4/TypeScript 6/ESLint 9 with the existing app fully functional on the modern stack.

**Architecture:** Upgrade dependencies in order of cascading impact — Next.js+React first (biggest breaking changes), then Tailwind (touches all components), then TypeScript and Supabase (smaller surface). Each upgrade step ends with a passing build.

**Tech Stack:** Next.js 16.2.4, React 19.2.5, Tailwind CSS 4.x, TypeScript 6.0.2, @supabase/ssr 0.10.2, @supabase/supabase-js 2.103.2, ESLint 9.x

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Update all dependency versions |
| `next.config.js` → `next.config.ts` | Replace | Migrate to TS config, update Sentry integration for Next.js 16 |
| `tsconfig.json` | Modify | Update for TypeScript 6 |
| `src/app/globals.css` | Modify | Migrate Tailwind directives + config from JS to CSS |
| `tailwind.config.ts` | Delete | Config moves into CSS in Tailwind 4 |
| `postcss.config.js` | Delete | Not needed with Tailwind 4 |
| `.eslintrc.json` → `eslint.config.mjs` | Replace | Migrate to ESLint 9 flat config |
| `src/middleware.ts` | Modify | No changes needed (already minimal) |
| `src/lib/supabase/server.ts` | Modify | Update cookie API for @supabase/ssr 0.10.x |
| `src/lib/supabase/middleware.ts` | Modify | Update cookie API for @supabase/ssr 0.10.x |
| `src/lib/supabase/client.ts` | No change | Browser client API is unchanged |
| `src/app/layout.tsx` | Modify | Update metadata for Next.js 16, font loading |
| `src/app/(dashboard)/layout.tsx` | Modify | Await cookies() (async in Next.js 16) |
| `src/lib/auth.ts` | Modify | Await cookies() via createClient |
| `src/app/api/prompts/[id]/vote/route.ts` | Modify | Await params (async in Next.js 16) |
| `src/app/api/prompts/[id]/route.ts` | Modify | Await params |
| `src/app/api/admin/prompts/[id]/mark-reviewed/route.ts` | Modify | Await params |
| `src/app/api/admin/prompts/[id]/unflag/route.ts` | Modify | Await params |

---

### Task 1: Upgrade Next.js 16 + React 19 + Core Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Run the Next.js upgrade codemod**

```bash
cd /Users/nick/atlas && npx @next/codemod@latest upgrade
```

Select "Yes" to upgrade to Next.js 16. This automatically:
- Updates `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `eslint-config-next`
- Runs codemods for async dynamic APIs (`cookies()`, `headers()`, `params`, `searchParams`)

- [ ] **Step 2: Verify the codemod applied changes**

```bash
cd /Users/nick/atlas && git diff --stat
```

Check that the codemod updated:
- `package.json` versions
- Added `await` to `cookies()` calls in `src/lib/supabase/server.ts`
- Added `await` to `params` in dynamic route handlers

- [ ] **Step 3: Install dependencies**

```bash
cd /Users/nick/atlas && npm install
```

- [ ] **Step 4: Fix any remaining async API issues the codemod missed**

Check for any `cookies()` calls that weren't awaited. The server Supabase client calls `cookies()` synchronously — the codemod should have fixed these, but verify:

```bash
cd /Users/nick/atlas && grep -rn "cookies()" src/lib/supabase/
```

If `src/lib/supabase/server.ts` still has synchronous `cookies()`, update it:

```typescript
// src/lib/supabase/server.ts
import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — middleware handles refresh
          }
        },
      },
    }
  )
}
```

Note: `createClient()` is now `async` — all callers must `await` it.

- [ ] **Step 5: Update all createClient() callers to await**

Every file that calls `createClient()` from `@/lib/supabase/server` must now await it. Update these files:

`src/lib/auth.ts`:
```typescript
export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient()
  // ... rest unchanged
}

export async function requireAdmin(): Promise<AdminAuthResult> {
  // ... calls requireAuth which already awaits, no change needed
}

export async function checkVoteRateLimit(userId: string): Promise<boolean> {
  const supabase = await createClient()
  // ... rest unchanged
}
```

`src/app/(dashboard)/layout.tsx` — `getCategories()` and `getCurrentUser()`:
```typescript
async function getCategories() {
  const supabase = await createClient()
  // ... rest unchanged
}

async function getCurrentUser(): Promise<{ user: User | null; isAdmin: boolean }> {
  const supabase = await createClient()
  // ... rest unchanged
}
```

All API route handlers (`src/app/api/**/*.ts`) that call `createClient()`:
```typescript
// Pattern: change `const supabase = createClient()` to:
const supabase = await createClient()
```

Search for all occurrences:
```bash
cd /Users/nick/atlas && grep -rn "createClient()" src/app/api/ src/lib/auth.ts src/app/\(dashboard\)/layout.tsx
```

Update each file.

- [ ] **Step 6: Update dynamic route params to be awaited**

In Next.js 16, `params` is a Promise. Update all `[id]` route handlers:

`src/app/api/prompts/[id]/vote/route.ts`:
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Replace all `params.id` with `id`
  // ...
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ...
}
```

Apply the same pattern to:
- `src/app/api/prompts/[id]/route.ts`
- `src/app/api/admin/prompts/[id]/mark-reviewed/route.ts`
- `src/app/api/admin/prompts/[id]/unflag/route.ts`

- [ ] **Step 7: Try a build**

```bash
cd /Users/nick/atlas && npm run build
```

Fix any type errors that appear. Common ones:
- `Type 'string' is not assignable to type 'Promise<...>'` — missed an `await`
- React 19 removed some deprecated APIs — check for `defaultProps` on function components

- [ ] **Step 8: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "feat: upgrade to Next.js 16 + React 19"
```

---

### Task 2: Update Supabase Middleware for New Cookie API

**Files:**
- Modify: `src/lib/supabase/middleware.ts`

- [ ] **Step 1: Update the middleware Supabase client**

The `@supabase/ssr` 0.10.x uses `getAll`/`setAll` instead of individual `get`/`set`/`remove`:

```typescript
// src/lib/supabase/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/types/database'

const protectedRoutes = ['/prompts', '/categories', '/admin', '/settings', '/sme']
const authRoutes = ['/login', '/signup']
const publicRoutes = ['/about']

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPublicRoute) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  const isAuthRoute = authRoutes.some((route) => pathname === route)

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/prompts', request.url))
  }

  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/prompts', request.url))
    } else {
      return NextResponse.redirect(new URL('/about', request.url))
    }
  }

  return supabaseResponse
}
```

- [ ] **Step 2: Verify build still passes**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add src/lib/supabase/ && git commit -m "refactor: update Supabase SSR to getAll/setAll cookie API"
```

---

### Task 3: Upgrade Supabase Client Packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update Supabase packages**

```bash
cd /Users/nick/atlas && npm install @supabase/ssr@latest @supabase/supabase-js@latest
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add package.json package-lock.json && git commit -m "chore: upgrade Supabase packages to latest"
```

---

### Task 4: Migrate to Tailwind CSS 4

**Files:**
- Modify: `src/app/globals.css`
- Delete: `tailwind.config.ts`
- Delete: `postcss.config.js`
- Modify: `package.json`

- [ ] **Step 1: Run the Tailwind 4 upgrade tool**

```bash
cd /Users/nick/atlas && npx @tailwindcss/upgrade
```

This tool automatically:
- Installs `tailwindcss` v4 and `@tailwindcss/postcss`
- Migrates `tailwind.config.ts` into CSS `@theme` directives in `globals.css`
- Updates `postcss.config.js` or removes it
- Converts Tailwind directives (`@tailwind base/components/utilities` → `@import "tailwindcss"`)
- Migrates plugin usage

- [ ] **Step 2: Review the migrated globals.css**

The upgrade tool should have converted the config. Verify the CSS looks correct. The expected structure after migration:

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&display=swap');

@plugin "@tailwindcss/typography";

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-primary-light: hsl(var(--primary-light));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-secondary-light: hsl(var(--secondary-light));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-navy: hsl(var(--navy));

  --font-heading: var(--font-outfit), 'Outfit', system-ui, sans-serif;
  --font-body: 'Host Grotesk', system-ui, sans-serif;

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --shadow-glow-primary: 0 0 0 0.35rem rgba(0, 127, 253, 0.25);
  --shadow-glow-secondary: 0 0 0 0.35rem rgba(109, 90, 255, 0.25);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}
```

The CSS variable definitions (`:root` and `.dark`) should remain as-is — the upgrade tool preserves `@layer base` blocks.

- [ ] **Step 3: Fix any class name changes**

Tailwind 4 renamed some utilities. Common ones to check:
- `shadow-sm` → still works
- `ring-*` → still works
- `decoration-*` → may need `underline-offset-*`

Search for deprecated classes:
```bash
cd /Users/nick/atlas && grep -rn "bg-opacity-\|text-opacity-\|border-opacity-" src/
```

In Tailwind 4, opacity modifiers use the slash syntax: `bg-blue-500/50` instead of `bg-blue-500 bg-opacity-50`.

- [ ] **Step 4: Verify tailwind.config.ts is deleted**

```bash
ls /Users/nick/atlas/tailwind.config.ts 2>/dev/null && echo "DELETE THIS FILE" || echo "Already gone"
```

If it still exists, delete it — the config is now in CSS.

- [ ] **Step 5: Remove tailwindcss-animate if migrated**

The upgrade tool should handle this. Check if the plugin was migrated to CSS or still referenced:

```bash
cd /Users/nick/atlas && grep -rn "tailwindcss-animate" src/ package.json
```

If still in package.json but no longer used in CSS config, remove it:
```bash
cd /Users/nick/atlas && npm uninstall tailwindcss-animate
```

- [ ] **Step 6: Verify build passes**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 7: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "feat: migrate to Tailwind CSS 4"
```

---

### Task 5: Upgrade TypeScript to 6.x

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install TypeScript 6**

```bash
cd /Users/nick/atlas && npm install -D typescript@latest @types/node@latest
```

- [ ] **Step 2: Update tsconfig.json**

TypeScript 6 defaults to `--erasableSyntaxOnly`. Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Run typecheck to find issues**

```bash
cd /Users/nick/atlas && npx tsc --noEmit
```

TypeScript 6 with `erasableSyntaxOnly` disallows:
- `enum` declarations (must use `const enum` or string union types)
- Parameter properties in constructors (`constructor(public x: number)`)
- `namespace` declarations

Check for enums:
```bash
cd /Users/nick/atlas && grep -rn "^export enum\|^enum " src/
```

If any exist, convert to string union types:
```typescript
// Before
enum Foo { A = 'a', B = 'b' }
// After
type Foo = 'a' | 'b'
```

- [ ] **Step 4: Verify build passes**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/nick/atlas && git add package.json package-lock.json tsconfig.json && git commit -m "chore: upgrade TypeScript to 6.x"
```

---

### Task 6: Migrate ESLint to Flat Config (v9)

**Files:**
- Delete: `.eslintrc.json`
- Create: `eslint.config.mjs`
- Modify: `package.json`

- [ ] **Step 1: Install ESLint 9 and updated plugins**

```bash
cd /Users/nick/atlas && npm install -D eslint@latest eslint-config-next@latest eslint-config-prettier@latest eslint-plugin-prettier@latest
```

Remove old plugins that are now built-in or incompatible:
```bash
cd /Users/nick/atlas && npm uninstall @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-import-resolver-typescript eslint-plugin-react eslint-plugin-react-hooks
```

Install the new typescript-eslint:
```bash
cd /Users/nick/atlas && npm install -D typescript-eslint
```

- [ ] **Step 2: Create eslint.config.mjs**

```javascript
// eslint.config.mjs
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier'
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
  },
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'public/',
    ],
  },
]

export default eslintConfig
```

- [ ] **Step 3: Delete old .eslintrc.json**

```bash
rm /Users/nick/atlas/.eslintrc.json
```

- [ ] **Step 4: Install @eslint/eslintrc for FlatCompat**

```bash
cd /Users/nick/atlas && npm install -D @eslint/eslintrc
```

- [ ] **Step 5: Run lint to verify**

```bash
cd /Users/nick/atlas && npm run lint
```

Fix any new lint errors that appear. Common ones:
- Import ordering rules may behave differently — fix manually or relax the rule

- [ ] **Step 6: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "refactor: migrate to ESLint 9 flat config"
```

---

### Task 7: Update next.config to TypeScript

**Files:**
- Delete: `next.config.js`
- Create: `next.config.ts`

- [ ] **Step 1: Convert next.config.js to next.config.ts**

Next.js 16 supports `next.config.ts` natively:

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://static.cloudflareinsights.com https://*.sentry-cdn.com https://browser.sentry-cdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.sentry.io https://*.ingest.us.sentry.io",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  tunnelRoute: '/monitoring',
  reactComponentAnnotation: {
    enabled: true,
  },
})
```

- [ ] **Step 2: Delete old config**

```bash
rm /Users/nick/atlas/next.config.js
```

- [ ] **Step 3: Verify build passes**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "refactor: convert next.config to TypeScript"
```

---

### Task 8: Remove Unused Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove SME/MDX-related packages (no longer needed)**

```bash
cd /Users/nick/atlas && npm uninstall next-mdx-remote gray-matter reading-time rehype-autolink-headings rehype-sanitize rehype-slug remark-gfm fuse.js
```

- [ ] **Step 2: Verify build passes**

```bash
cd /Users/nick/atlas && npm run build
```

If any imports still reference these packages, the build will fail — fix those files by removing the dead imports.

```bash
cd /Users/nick/atlas && grep -rn "next-mdx-remote\|gray-matter\|reading-time\|rehype-\|remark-gfm\|fuse.js" src/
```

Remove any files or imports that reference them.

- [ ] **Step 3: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "chore: remove unused SME/MDX dependencies"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Clean install**

```bash
cd /Users/nick/atlas && rm -rf node_modules .next && npm install
```

- [ ] **Step 2: Full build**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 3: Lint check**

```bash
cd /Users/nick/atlas && npm run lint
```

- [ ] **Step 4: Type check**

```bash
cd /Users/nick/atlas && npm run typecheck
```

- [ ] **Step 5: Start dev server and verify app works**

```bash
cd /Users/nick/atlas && npm run dev
```

Open the app in browser. Verify:
- Login page renders
- Can log in
- Prompts page loads with data
- Sidebar navigation works
- Admin page loads (if admin user)
- Dark/light mode toggle works

- [ ] **Step 6: Commit any remaining fixes**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "chore: final cleanup after tech stack upgrade"
```
