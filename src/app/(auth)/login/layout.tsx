import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In to Your Prompt Library',
  description:
    'Access your team\'s AI prompt library. Sign in to Atlas to find proven prompts, track quality, and maintain consistent LLM outputs.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
