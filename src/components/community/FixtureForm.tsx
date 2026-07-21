'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommunityFixtureForm({
  teams,
  tournaments,
  communityId,
  communitySlug,
}: {
  teams: any[]
  tournaments: any[]
  communityId: string
  communitySlug: string
}) {
  const [tournamentId, setTournamentId] = useState(tournaments[0]?.id ?? '')
  const [groupId, setGroupId] = useState('')
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [venue, setVenue] = useState('')
  const [stage, setStage] = useState('group')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const selectedTournament = tournaments.find(t => t.id === tournamentId)
  const groups = selectedTournament?.groups ?? []

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
      group_id: groupId || null,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      scheduled_at: scheduledAt || null,
      venue: venue || null,
      stage: stage || null,
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(`/community/${communitySlug}/admin/matches`)
      router.refresh()
    }, 1500)
  }

  if (success) {
    return (
      <div className="rounded-xl p-10 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="text-4xl mb-3">✅</div>
        <div className="font-black text-sm mb-1" style={{ color: '#00FF87' }}>Fixture Scheduled!</div>
        <div className="text-xs" style={{ color: '#4A5C54' }}>Redirecting to matches...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
      {error && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
          {error}
        </div>
      )}

      {/* Tournament */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Tournament *</label>
        <select value={tournamentId} onChange={(e) => { setTournamentId(e.target.value); setGroupId('') }} required
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Group (if tournament has groups) */}
      {groups.length > 0 && (
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Group</label>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          >
            <option value="">No group (knockout)</option>
            {groups.map((g: any) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Stage */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Stage</label>
        <select value={stage} onChange={(e) => setStage(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        >
          <option value="group">Group Stage</option>
          <option value="qualify_round">Qualify Round</option>
          <option value="round_of_16">Round of 16</option>
          <option value="quarter_final">Quarter Final</option>
          <option value="semi_final">Semi Final</option>
          <option value="final">Final</option>
          <option value="third_place">Third Place</option>
        </select>
      </div>

      {/* Home team */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Home Team *</label>
        <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} required
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #00FF8730' }}
        >
          <option value="">Select home team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Away team */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Away Team *</label>
        <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} required
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #FF3B3B30' }}
        >
          <option value="">Select away team...</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Date & Time</label>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      {/* Venue */}
      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Venue</label>
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)}
          placeholder="e.g. Serekunda West Mini Stadium"
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <a
          href={`/community/${communitySlug}/admin/matches`}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
          style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
        >
          Cancel
        </a>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? 'Scheduling...' : 'Schedule Fixture'}
        </button>
      </div>
    </form>
  )
}