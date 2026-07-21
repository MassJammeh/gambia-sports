'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MatchAdminForm({
  match,
  homePlayers,
  awayPlayers,
  events,
  communitySlug,
}: {
  match: any
  homePlayers: any[]
  awayPlayers: any[]
  events: any[]
  communitySlug: string
}) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0)
  const [minute, setMinute] = useState(match.minute ?? 0)
  const [status, setStatus] = useState(match.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Event form
  const [eventType, setEventType] = useState('goal')
  const [eventTeam, setEventTeam] = useState(match.home_team_id)
  const [eventPlayer, setEventPlayer] = useState('')
  const [eventMinute, setEventMinute] = useState('')
  const [addingEvent, setAddingEvent] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const currentPlayers = eventTeam === match.home_team_id ? homePlayers : awayPlayers

  async function handleSave() {
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        minute,
        status,
      })
      .eq('id', match.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Match updated successfully!')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleAddEvent() {
    if (!eventMinute) return
    setAddingEvent(true)

    const { error } = await supabase
      .from('match_events')
      .insert({
        match_id: match.id,
        team_id: eventTeam,
        player_id: eventPlayer || null,
        event_type: eventType,
        minute: Number(eventMinute),
      })

    if (!error) {
      setEventMinute('')
      setEventPlayer('')
      router.refresh()
    }
    setAddingEvent(false)
  }

  async function handleDeleteEvent(eventId: string) {
    await supabase.from('match_events').delete().eq('id', eventId)
    router.refresh()
  }

  const eventIcons: Record<string, string> = {
    goal: '⚽',
    own_goal: '🔴',
    yellow_card: '🟨',
    red_card: '🟥',
    penalty_scored: '⚽🎯',
    penalty_missed: '❌',
    substitution_in: '🔁',
    substitution_out: '🔁',
  }

  return (
    <div className="space-y-5">

      {error && (
        <div className="px-4 py-3 rounded-xl text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '1px solid #FF3B3B30' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl text-xs font-medium" style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00FF8730' }}>
          ✅ {success}
        </div>
      )}

      {/* Score + Status */}
      <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#4A5C54' }}>Score & Status</div>

        {/* Score inputs */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-xs font-bold mb-2 truncate" style={{ color: '#4A5C54' }}>{match.home_team?.name}</div>
            <input
              type="number" min={0} max={99} value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              className="w-full text-center text-3xl font-black py-3 rounded-xl outline-none"
              style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '2px solid #00FF8730' }}
            />
          </div>
          <div className="text-center text-xl font-black" style={{ color: '#4A5C54' }}>—</div>
          <div className="text-center">
            <div className="text-xs font-bold mb-2 truncate" style={{ color: '#4A5C54' }}>{match.away_team?.name}</div>
            <input
              type="number" min={0} max={99} value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              className="w-full text-center text-3xl font-black py-3 rounded-xl outline-none"
              style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '2px solid #FF3B3B30' }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Match Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">🔴 Live</option>
              <option value="completed">✅ Completed</option>
              <option value="postponed">⚠️ Postponed</option>
            </select>
          </div>
          {status === 'live' && (
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Minute</label>
              <input
                type="number" min={0} max={120} value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: loading ? '#1A2320' : '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? 'Saving...' : 'Save Match'}
        </button>
      </div>

      {/* Match Events */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>Match Events</div>
        </div>

        {/* Add event */}
        <div className="px-5 py-4 space-y-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Event Type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value="goal">⚽ Goal</option>
                <option value="own_goal">🔴 Own Goal</option>
                <option value="yellow_card">🟨 Yellow Card</option>
                <option value="red_card">🟥 Red Card</option>
                <option value="penalty_scored">⚽ Penalty Scored</option>
                <option value="penalty_missed">❌ Penalty Missed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Team</label>
              <select value={eventTeam} onChange={(e) => setEventTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value={match.home_team_id}>{match.home_team?.name}</option>
                <option value={match.away_team_id}>{match.away_team?.name}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Player (optional)</label>
              <select value={eventPlayer} onChange={(e) => setEventPlayer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value="">Unknown Player</option>
                {currentPlayers.map((p) => (
                  <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Minute *</label>
              <input
                type="number" min={1} max={120} value={eventMinute}
                onChange={(e) => setEventMinute(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
          </div>
          <button
            onClick={handleAddEvent}
            disabled={addingEvent || !eventMinute}
            className="w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00FF8720' }}
          >
            {addingEvent ? 'Adding...' : '+ Add Event'}
          </button>
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No events recorded yet</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {events.map((event) => (
              <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-lg flex-shrink-0">{eventIcons[event.event_type] ?? '⚽'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black" style={{ color: '#F0F4F2' }}>
                    {event.player?.name ?? 'Unknown'} {event.player?.jersey_number ? `#${event.player.jersey_number}` : ''}
                  </div>
                  <div className="text-xs" style={{ color: '#4A5C54' }}>
                    {event.event_type.replace('_', ' ')} · {event.minute}'
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-xs font-bold px-2 py-1 rounded transition-all hover:opacity-80"
                  style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

     {/* Back */}
      <a
        href={`/community/${communitySlug}/admin/matches`}
        className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white"
        style={{ color: '#4A5C54' }}
      >
        Back to Matches
      </a>
    </div>
  )
}
