'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function KnockoutFixtureForm({
  tournamentId,
  communityId,
  communitySlug,
  teams,
}: {
  tournamentId: string
  communityId: string
  communitySlug: string
  teams: any[]
}) {
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [stage, setStage] = useState('quarter_final')
  const [scheduledAt, setScheduledAt] = useState('')
  const [venue, setVenue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (homeTeamId === awayTeamId) {
      setError('Home and away teams must be different.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('matches').insert({
      tournament_id: tournamentId,
      community_id: communityId,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      stage,
      scheduled_at: scheduledAt || null,
      venue: venue || null,
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Fixture scheduled!')
    setHomeTeamId('')
    setAwayTeamId('')
    setScheduledAt('')
    setVenue('')
    setTimeout(() => setSuccess(''), 2000)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
          ✅ {success}
        </div>
      )}

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Stage *</label>
        <select value={stage} onChange={(e) => setStage(e.target.value)} required
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        >
          <option value="qualify_round">🔑 Qualify Round</option>
          <option value="round_of_16">Round of 16</option>
          <option value="quarter_final">⚡ Quarter Final</option>
          <option value="semi_final">🔥 Semi Final</option>
          <option value="final">🏆 Final</option>
          <option value="third_place">🥉 Third Place</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Home Team *</label>
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #00FF8730' }}
          >
            <option value="">Select...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Away Team *</label>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #FF3B3B30' }}
          >
            <option value="">Select...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Date & Time</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Venue</label>
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g. Mini Stadium"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
        style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
      >
        {loading ? 'Scheduling...' : '+ Schedule Knockout Fixture'}
      </button>
    </form>
  )
}