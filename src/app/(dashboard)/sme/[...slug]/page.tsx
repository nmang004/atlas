// MDX deps removed (Task 8). SME hub deleted in Plan 3.
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return []
}

export default async function SMEContentPage() {
  notFound()
}
