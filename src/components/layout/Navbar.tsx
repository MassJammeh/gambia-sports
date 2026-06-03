'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/fixtures', label: 'Fixtures' },
  { href: '/results', label: 'Results' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
  { href: '/leagues', label: 'Leagues' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: '#1A6B3A' }} className="text-white shadow-lg sticky top-0 z-40">
      {/* Top red stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: '#C1272D' }} />

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🇬🇲</span>
          <span className="text-xl font-black uppercase tracking-widest transition-all group-hover:text-yellow-300">
            GamFoot
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-all"
          style={{ backgroundColor: menuOpen ? 'rgba(255,255,255,0.15)' : 'transparent' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 space-y-1"
          style={{ backgroundColor: '#0F4A28', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                  borderLeft: isActive ? '3px solid #C1272D' : '3px solid transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}