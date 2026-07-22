'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="text-white sticky top-0 z-40" style={{ backgroundColor: '#0D1410', borderBottom: '1px solid #1E2A24' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🇬🇲</span>
          <span
            className="text-xl font-black uppercase tracking-widest transition-all"
            style={{ color: '#00FF87' }}
          >
            GamFoot
          </span>
        </Link>

        {/* Desktop - just the tagline */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>
            The home of Nawettan football 🇬🇲
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#4A5C54', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#4A5C54', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#4A5C54', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ backgroundColor: '#0A0F0D', borderTop: '1px solid #1E2A24' }}>
          <p className="text-xs py-3" style={{ color: '#4A5C54' }}>
            The home of Nawettan football in The Gambia 🇬🇲
          </p>
        </div>
      )}
    </nav>
  )
}