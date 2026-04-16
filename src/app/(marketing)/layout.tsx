import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <nav className="container flex h-16 items-center justify-between">
          <Link href="/about" className="flex items-center gap-2">
            <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/features">Features</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/how-it-works">How it Works</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/use-cases">Use Cases</Link>
              </Button>
            </nav>
            <div className="bg-border hidden h-6 w-px md:block" />
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">Atlas</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The prompt governance platform for teams that ship consistent AI-powered work.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases" className="hover:text-foreground">
                    Use Cases
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-foreground">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Get Started</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-foreground">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Atlas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
