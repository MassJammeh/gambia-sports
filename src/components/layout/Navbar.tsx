'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="text-white sticky top-0 z-40" style={{ backgroundColor: '#0A0F0D', borderBottom: '1px solid #1F2B26' }}>
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

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/#communities"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-white/5"
            style={{ color: '#8A9E96' }}
          >
            Communities
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-lg text-sm font-black transition-all ml-2"
            style={{ backgroundColor: '#006837', color: '#00FF87', border: '1px solid #00C96820' }}
          >
            Admin →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#8A9E96', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#8A9E96', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: '#8A9E96', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1" style={{ backgroundColor: '#0A0F0D', borderTop: '1px solid #1F2B26' }}>
          <Link href="/#communities" onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ color: '#8A9E96' }}>
            🏟 Communities
          </Link>
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl text-sm font-black"
            style={{ backgroundColor: '#006837', color: '#00FF87' }}>
            Admin Login →
          </Link>
        </div>
      )}
    </nav>
  )
}