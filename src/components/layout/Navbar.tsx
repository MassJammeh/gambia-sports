'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: '#1A6B3A' }} className="text-white shadow-lg sticky top-0 z-40">
      <div className="h-1 w-full" style={{ backgroundColor: '#C1272D' }} />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🇬🇲</span>
          <span className="text-xl font-black uppercase tracking-widest transition-all group-hover:text-yellow-300">
            GamFoot
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/#communities"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Communities
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-lg text-sm font-black transition-all hover:opacity-90 ml-2"
            style={{ backgroundColor: '#C1272D', color: 'white' }}
          >
            🔐 Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
          style={{ backgroundColor: menuOpen ? 'rgba(255,255,255,0.15)' : 'transparent' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
          <span className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 bg-white transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-1" style={{ backgroundColor: '#0F4A28' }}>
          <Link href="/#communities" onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.8)' }}>
            🏟 Communities
          </Link>
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-xl text-sm font-black"
            style={{ backgroundColor: '#C1272D', color: 'white' }}>
            🔐 Admin Login
          </Link>
        </div>
      )}
    </nav>
  )
}