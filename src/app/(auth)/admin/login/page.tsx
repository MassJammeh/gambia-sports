'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 100%)' }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="text-4xl">🇬🇲</span>
            <span className="text-white font-black uppercase tracking-widest text-2xl">GamFoot</span>
          </Link>
          <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Admin Dashboard
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}>
            <h1 className="text-xl font-black text-white">Sign In</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-6 space-y-5">
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#FEE2E2', color: '#C1272D', border: '1px solid #FECACA' }}
              >
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: '2px solid #E5E7EB',
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1A6B3A'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: '2px solid #E5E7EB',
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1A6B3A'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="px-8 pb-6 text-center">
            <Link href="/" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              ← Back to GamFoot
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}