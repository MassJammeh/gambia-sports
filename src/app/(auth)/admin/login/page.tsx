'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError('')

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    setError(error.message)
    setLoading(false)
    return
  }

  if (data.session) {
    // Force hard redirect to ensure cookies are set
    window.location.replace('/admin')
  }
}

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0F0D' }}
    >
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #00FF87 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <span className="text-4xl">🇬🇲</span>
            <span
              className="text-3xl font-black uppercase tracking-widest"
              style={{ color: '#00FF87' }}
            >
              GamFoot
            </span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4A5C54' }}>
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
        >
          {/* Card header */}
          <div
            className="px-6 py-5"
            style={{ borderBottom: '1px solid #1F2B26', backgroundColor: '#111916' }}
          >
            <h1 className="text-lg font-black" style={{ color: '#F0F4F2' }}>Sign In</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-6 py-5 space-y-4">
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-xs font-medium"
                style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '1px solid #FF3B3B30' }}
              >
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A5C54' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gamfoot.gm"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all font-medium"
                style={{
                  backgroundColor: '#1A2320',
                  color: '#F0F4F2',
                  border: '1px solid #1F2B26',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF87'}
                onBlur={(e) => e.target.style.borderColor = '#1F2B26'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A5C54' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all font-medium"
                style={{
                  backgroundColor: '#1A2320',
                  color: '#F0F4F2',
                  border: '1px solid #1F2B26',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF87'}
                onBlur={(e) => e.target.style.borderColor = '#1F2B26'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="px-6 pb-5 text-center">
            <Link
              href="/"
              className="text-xs font-bold transition-all hover:text-white"
              style={{ color: '#4A5C54' }}
            >
              Back to GamFoot
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#4A5C54' }}>
            GamFoot · Built by TechPalz 🇬🇲
          </p>
        </div>
      </div>
    </div>
  )
}