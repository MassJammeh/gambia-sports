'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      window.location.href = '/admin'
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#0A0F0D' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <div className="font-black text-xl mb-2" style={{ color: '#00FF87' }}>
            Password Set!
          </div>
          <div className="text-xs" style={{ color: '#4A5C54' }}>
            Redirecting to admin dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0F0D' }}>
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #00FF87 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <span className="text-4xl">🇬🇲</span>
            <span className="text-3xl font-black uppercase tracking-widest"
              style={{ color: '#00FF87' }}>GamFoot</span>
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#4A5C54' }}>Set Your Password</span>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-6 py-5"
            style={{ borderBottom: '1px solid #1F2B26', backgroundColor: '#111916' }}>
            <h1 className="text-lg font-black" style={{ color: '#F0F4F2' }}>
              Create Your Password
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
              Set a password to access your admin portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-xs font-medium"
                style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '1px solid #FF3B3B30' }}>
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A5C54' }}>
                New Password *
              </label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required minLength={8}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none font-medium"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF87'}
                onBlur={(e) => e.target.style.borderColor = '#1F2B26'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A5C54' }}>
                Confirm Password *
              </label>
              <input
                type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required minLength={8}
                placeholder="Repeat your password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none font-medium"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF87'}
                onBlur={(e) => e.target.style.borderColor = '#1F2B26'}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}>
              {loading ? '⏳ Setting password...' : '🔐 Set Password & Login'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#4A5C54' }}>
            GamFoot · Built by TechPalz 🇬🇲
          </p>
        </div>
      </div>
    </div>
  )
}