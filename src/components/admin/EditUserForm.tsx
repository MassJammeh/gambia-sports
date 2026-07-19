'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditUserForm({
  profile,
  leagues,
}: {
  profile: any
  leagues: any[]
}) {
  const [role, setRole] = useState(profile.role)
  const [leagueId, setLeagueId] = useState(profile.league_id ?? '')
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [status, setStatus] = useState(profile.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        role,
        league_id: leagueId || null,
        display_name: displayName || null,
        status,
      })
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/users')
      router.refresh()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid #E5E7EB' }}>
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}>
          ✅ User updated successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Display Name</label>
        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. John Smith"
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
          <option value="fan">Fan</option>
          <option value="reporter">Reporter</option>
          <option value="content_editor">Content Editor</option>
          <option value="league_admin">League Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>League</label>
        <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">None (Platform-wide)</option>
          {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
          {loading ? '⏳ Saving...' : '✅ Save Changes'}
        </button>
      </div>
    </form>
  )
}