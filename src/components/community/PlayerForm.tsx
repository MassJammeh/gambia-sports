'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommunityPlayerForm({
  communityId,
  communitySlug,
  teams,
  player,
}: {
  communityId: string
  communitySlug: string
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
      community_id: communityId,
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

    router.push(`/community/${communitySlug}/admin/players`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
      {error && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Full Name *</label>
          <input type="text" value={name}
            onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
            required placeholder="e.g. Modou Barrow"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Slug *</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            required placeholder="e.g. modou-barrow"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Team</label>
        <select value={teamId} onChange={(e) => setTeamId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        >
          <option value="">Unassigned</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Position *</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          >
            <option value="GK">GK</option>
            <option value="DEF">DEF</option>
            <option value="MID">MID</option>
            <option value="FWD">FWD</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Jersey #</label>
          <input type="number" value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)}
            min={1} max={99} placeholder="10"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Nationality</label>
          <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}
            placeholder="Gambian"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Date of Birth</label>
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Biography</label>
        <textarea value={biography} onChange={(e) => setBiography(e.target.value)}
          rows={2} placeholder="Brief biography..."
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      {isEdit && (
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <a href={`/community/${communitySlug}/admin/players`}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
          style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
        >
          Cancel
        </a>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Player'}
        </button>
      </div>
    </form>
  )
}