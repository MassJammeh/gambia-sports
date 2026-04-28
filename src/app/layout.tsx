import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gambia Sports Platform',
  description: 'Your home for Gambian football',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <nav className="bg-blue-800 text-white py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="font-bold text-xl">
              Gambia Sports
            </a>
            <div className="flex gap-6 text-sm font-medium">
              <a href="/standings" className="hover:text-blue-200">
                Standings
              </a>
              <a href="/fixtures" className="hover:text-blue-200">
                Fixtures
              </a>
              <a href="/results" className="hover:text-blue-200">
                Results
              </a>
              <a href="/teams" className="hover:text-blue-200">
                Teams
              </a>
              <a href="/admin" className="hover:text-blue-200">
                Admin
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
