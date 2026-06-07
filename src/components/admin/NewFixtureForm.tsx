'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewFixtureForm({
  seasons,
  teams,
}: {
  seasons: any[]
  teams: any[]
}) {
  const [seasonId, setSeasonId] = useState(seasons[0]?.id ?? '')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [venue, setVenue] = useState('')
  const [matchday, setMatchday] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (homeTeamId === awayTeamId) {
      setError('Home and away teams must be different.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from('matches').insert({
      season_id: seasonId,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      scheduled_at: scheduledAt || null,
      venue: venue || null,
      status: 'scheduled',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/matches')
      router.refresh()
    }, 1500)
  }

  if (success) {
    return (
      <div
        className="bg-white rounded-2xl p-8 text-center shadow-sm"
        style={{ border: '1px solid #E5E7EB' }}
      >
        <div className="text-5xl mb-4">✅</div>
        <div className="font-black text-xl mb-2" style={{ color: '#111827' }}>Fixture Scheduled!</div>
        <div className="text-sm" style={{ color: '#6B7280' }}>Redirecting to matches...</div>
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

      {/* Season */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          Season *
        </label>
        <select
          value={seasonId}
          onChange={(e) => setSeasonId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">Select season...</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {(s.league as any)?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Home team */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          Home Team *
        </label>
        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #1A6B3A', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">Select home team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Away team */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          Away Team *
        </label>
        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #C1272D', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          <option value="">Select away team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      {/* Venue */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
          Venue
        </label>
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="e.g. Independence Stadium, Bakau"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
      >
        {loading ? '⏳ Scheduling...' : '📅 Schedule Fixture'}
      </button>
    </form>
  )
}