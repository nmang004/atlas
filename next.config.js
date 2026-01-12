/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            // Prevent browsers from incorrectly detecting non-scripts as scripts
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Prevent clickjacking attacks
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Control referrer information sent with requests
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Disable unnecessary browser features
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
          {
            // Content Security Policy - strict but allows necessary sources
            // Note: 'unsafe-inline' for styles is needed for Tailwind/styled-jsx
            // In production, consider using nonces or hashes instead
            key: 'Content-Security-Policy',
            value: [
              // Default to self only
              "default-src 'self'",
              // Scripts: self + inline (needed for Next.js hydration) + PostHog
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://static.cloudflareinsights.com",
              // Styles: self + inline (needed for Tailwind) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images: self + data URIs + Supabase storage
              "img-src 'self' data: blob: https://*.supabase.co",
              // Fonts: self + data URIs + Google Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Connect to: self + Supabase APIs + PostHog
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com",
              // Frame ancestors: none (prevent embedding)
              "frame-ancestors 'none'",
              // Base URI: self only
              "base-uri 'self'",
              // Form action: self only
              "form-action 'self'",
              // Upgrade insecure requests
              'upgrade-insecure-requests',
            ].join('; '),
          },
          {
            // Strict Transport Security (HSTS)
            // Only sent over HTTPS, tells browsers to always use HTTPS
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
