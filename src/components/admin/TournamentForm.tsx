'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TournamentForm({
  seasons,
  tournament,
}: {
  seasons: any[]
  tournament?: any
}) {
  const isEdit = !!tournament
  const [name, setName] = useState(tournament?.name ?? '')
  const [slug, setSlug] = useState(tournament?.slug ?? '')
  const [seasonId, setSeasonId] = useState(tournament?.season_id ?? seasons[0]?.id ?? '')
  const [format, setFormat] = useState(tournament?.format ?? 'nawetans')
  const [status, setStatus] = useState(tournament?.status ?? 'upcoming')
  const [description, setDescription] = useState(tournament?.description ?? '')
  const [numGroups, setNumGroups] = useState(tournament?.num_groups ?? 2)
  const [teamsAdvance, setTeamsAdvance] = useState(tournament?.teams_advance_per_group ?? 2)
  const [startDate, setStartDate] = useState(tournament?.start_date ?? '')
  const [endDate, setEndDate] = useState(tournament?.end_date ?? '')
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
      season_id: seasonId,
      format,
      status,
      description: description || null,
      num_groups: numGroups ? Number(numGroups) : null,
      teams_advance_per_group: teamsAdvance ? Number(teamsAdvance) : null,
      start_date: startDate || null,
      end_date: endDate || null,
    }

    const { error } = isEdit
      ? await supabase.from('tournaments').update(payload).eq('id', tournament.id)
      : await supabase.from('tournaments').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/tournaments')
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
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Tournament Name *</label>
          <input
            type="text" value={name}
            onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
            required placeholder="e.g. Nawetans 2025"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Slug *</label>
          <input
            type="text" value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required placeholder="e.g. nawetans-2025"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Season *</label>
        <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)} required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {(s.league as any)?.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Format *</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          >
            <option value="nawetans">🏆 Nawetans</option>
            <option value="league">📊 League</option>
            <option value="cup">🥇 Cup</option>
            <option value="friendly">🤝 Friendly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          >
            <option value="upcoming">Upcoming</option>
            <option value="group_stage">Group Stage</option>
            <option value="knockout">Knockout</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Number of Groups</label>
          <input type="number" value={numGroups} onChange={(e) => setNumGroups(e.target.value)}
            min={1} max={8} placeholder="e.g. 4"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Teams Advancing per Group</label>
          <input type="number" value={teamsAdvance} onChange={(e) => setTeamsAdvance(e.target.value)}
            min={1} max={4} placeholder="e.g. 2"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={3} placeholder="Brief description of the tournament..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/admin/tournaments"
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-center"
          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
        >
          Cancel
        </Link>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white disabled:opacity-50"
          style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
        >
          {loading ? '⏳ Saving...' : isEdit ? '✅ Save Changes' : '➕ Create Tournament'}
        </button>
      </div>
    </form>
  )
}