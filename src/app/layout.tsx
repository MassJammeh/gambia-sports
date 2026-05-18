import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gambia Sports Platform',
  description: 'Minimal Next.js scaffold with Supabase connection support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
