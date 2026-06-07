'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PlayerForm({
  teams,
  player,
}: {
  teams: any[]
  player?: any
}) {
  const isEdit = !!player
  const [name, setName] = useState(player?.name ?? '')
  const [slug, setSlug] = useState(player?.slug ?? '')
  const [teamId, setTeamId] = useState(player?.team_id ?? '')
  const [position, setPosition] = useState(player?.position ?? 'MID')
  const [jerseyNumber, setJerseyNumber] = useState(player?.jersey_number ?? '')
  const [nationality, setNationality] = useState(player?.nationality ?? 'Gambian')
  const [dateOfBirth, setDateOfBirth] = useState(player?.date_of_birth ?? '')
  const [biography, setBiography] = useState(player?.biography ?? '')
  const [status, setStatus] = useState(player?.status ?? 'active')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function generateSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const payload = {
      name,
      slug: slug || generateSlug(name),
      team_id: teamId || null,
      position,
      jersey_number: jerseyNumber ? Number(jerseyNumber) : null,
      nationality: nationality || null,
      date_of_birth: dateOfBirth || null,
      biography: biography || null,
      status,
    }

    const { error } = isEdit
      ? await supabase.from('players').update(payload).eq('id', player.id)
      : await supabase.from('players').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/players')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid #E5E7EB' }}>
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Full Name *</label>
          <input
            type="text" value={name}
            onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
            required placeholder="e.g. Modou Barrow"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Slug *</label>
          <input
            type="text" value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required placeholder="e.g. modou-barrow"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Team</label>
        <select value={teamId} onChange={(e) => setTeamId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">Unassigned</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Position *</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          >
            <option value="GK">GK — Goalkeeper</option>
            <option value="DEF">DEF — Defender</option>
            <option value="MID">MID — Midfielder</option>
            <option value="FWD">FWD — Forward</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Jersey Number</label>
          <input type="number" value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)}
            min={1} max={99} placeholder="e.g. 10"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Nationality</label>
          <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}
            placeholder="e.g. Gambian"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Date of Birth</label>
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Biography</label>
        <textarea value={biography} onChange={(e) => setBiography(e.target.value)}
          rows={3} placeholder="Brief biography of the player..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link href="/admin/players"
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-center"
          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
        >
          Cancel
        </Link>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white disabled:opacity-50"
          style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
        >
          {loading ? '⏳ Saving...' : isEdit ? '✅ Save Changes' : '➕ Add Player'}
        </button>
      </div>
    </form>
  )
}