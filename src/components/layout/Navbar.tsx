'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/results', label: 'Results' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{ backgroundColor: '#1A6B3A' }} className="text-white shadow-lg sticky top-0 z-40">
      {/* Top red stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: '#C1272D' }} />

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl">🇬🇲</span>
          <span
            className="text-xl font-black uppercase tracking-widest transition-all group-hover:text-yellow-300"
          >
            GamFoot
          </span>
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                    borderBottom: isActive ? '2px solid #C1272D' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}