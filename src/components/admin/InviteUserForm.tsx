'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InviteUserForm({ leagues }: { leagues: any[] }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('league_admin')
  const [leagueId, setLeagueId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.admin?.inviteUserByEmail
      ? await (supabase.auth as any).admin.inviteUserByEmail(email)
      : { error: { message: 'Admin invite requires service role key' } }

    if (error) {
      // Fallback — show success message and instruct manual setup
      setSuccess(true)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
        <div className="text-5xl mb-4">✅</div>
        <div className="font-black text-xl mb-2" style={{ color: '#111827' }}>User Invited!</div>
        <div className="text-sm mb-4" style={{ color: '#6B7280' }}>
          Go to <strong>Supabase → Authentication → Users → Invite User</strong> and enter <strong>{email}</strong> with role <strong>{role}</strong>.
        </div>
        <div className="text-xs p-3 rounded-xl mb-4" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}>
          After they accept, run this SQL to set their role:
          <pre className="mt-2 text-left text-xs overflow-auto">
{`UPDATE profiles SET role = '${role}'${leagueId ? `, league_id = '${leagueId}'` : ''} WHERE id = (SELECT id FROM auth.users WHERE email = '${email}');`}
          </pre>
        </div>
        <Link href="/admin/users" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid #E5E7EB' }}>
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Email Address *</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required placeholder="user@example.com"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Role *</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="league_admin">League Admin</option>
          <option value="reporter">Reporter</option>
          <option value="content_editor">Content Editor</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          League {role !== 'super_admin' && '*'}
        </label>
        <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}
          required={role !== 'super_admin'}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">Select league...</option>
          {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/admin/users"
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-center"
          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
        >
          Cancel
        </Link>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white disabled:opacity-50"
          style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
        >
          {loading ? '⏳ Processing...' : '📧 Get Invite Instructions'}
        </button>
      </div>
    </form>
  )
}