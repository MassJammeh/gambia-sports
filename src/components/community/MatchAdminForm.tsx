'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [liveEvents, setLiveEvents] = useState(events)

  // Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [timerRunning, setTimerRunning] = useState(match.status === 'live')

  // Event form
  const [eventType, setEventType] = useState('goal')
  const [eventTeam, setEventTeam] = useState(match.home_team_id)
  const [eventPlayer, setEventPlayer] = useState('')
  const [eventMinute, setEventMinute] = useState(String(minute))
  const [addingEvent, setAddingEvent] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Real-time timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setMinute((prev: number) => prev + 1)
      }, 60000) // every minute
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`match-${match.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_events',
        filter: `match_id=eq.${match.id}`,
      }, () => {
        router.refresh()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [match.id])

  const currentPlayers = eventTeam === match.home_team_id ? homePlayers : awayPlayers

  async function handleStartMatch() {
    setLoading(true)
    const { error } = await supabase
      .from('matches')
      .update({ status: 'live', minute: 0 })
      .eq('id', match.id)

    if (!error) {
      setStatus('live')
      setMinute(0)
      setTimerRunning(true)
    }
    setLoading(false)
  }

  async function handleEndMatch() {
    setLoading(true)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimerRunning(false)

    const { error } = await supabase
      .from('matches')
      .update({ status: 'completed', home_score: homeScore, away_score: awayScore, minute })
      .eq('id', match.id)

    if (!error) {
      setStatus('completed')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleScoreChange(team: 'home' | 'away', delta: number) {
    const newHome = team === 'home' ? Math.max(0, homeScore + delta) : homeScore
    const newAway = team === 'away' ? Math.max(0, awayScore + delta) : awayScore

    setHomeScore(newHome)
    setAwayScore(newAway)

    await supabase.from('matches').update({
      home_score: newHome,
      away_score: newAway,
      minute,
    }).eq('id', match.id)
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase
      .from('matches')
      .update({ home_score: homeScore, away_score: awayScore, minute, status })
      .eq('id', match.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Saved!')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleAddEvent() {
    if (!eventMinute) return
    setAddingEvent(true)

    const { data: newEvent, error } = await supabase
      .from('match_events')
      .insert({
        match_id: match.id,
        team_id: eventTeam,
        player_id: eventPlayer || null,
        event_type: eventType,
        minute: Number(eventMinute),
      })
      .select('*, player:players(name, jersey_number)')
      .single()

    if (!error && newEvent) {
      setLiveEvents(prev => [...prev, newEvent].sort((a, b) => a.minute - b.minute))

      // Auto-update score for goals
      if (eventType === 'goal' || eventType === 'penalty_scored') {
        if (eventTeam === match.home_team_id) {
          await handleScoreChange('home', 1)
        } else {
          await handleScoreChange('away', 1)
        }
      } else if (eventType === 'own_goal') {
        if (eventTeam === match.home_team_id) {
          await handleScoreChange('away', 1)
        } else {
          await handleScoreChange('home', 1)
        }
      }
    }

    setEventMinute(String(minute))
    setEventPlayer('')
    setAddingEvent(false)
  }

  async function handleDeleteEvent(eventId: string) {
    await supabase.from('match_events').delete().eq('id', eventId)
    setLiveEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const eventIcons: Record<string, string> = {
    goal: '⚽',
    own_goal: '🔴',
    yellow_card: '🟨',
    red_card: '🟥',
    penalty_scored: '⚽',
    penalty_missed: '❌',
    substitution_in: '🔁',
    substitution_out: '🔁',
  }

  const isLive = status === 'live'
  const isCompleted = status === 'completed'

  return (
    <div className="space-y-4">

      {error && (
        <div className="px-4 py-3 rounded-xl text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '1px solid #FF3B3B30' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Live Score Board */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#141A17',
          border: isLive ? '1px solid #FF3B3B' : '1px solid #1F2B26',
        }}
      >
        {/* Status bar */}
        <div
          className="px-5 py-2.5 flex items-center justify-between"
          style={{
            backgroundColor: isLive ? '#2A0A0A' : '#1A2320',
            borderBottom: '1px solid #1F2B26',
          }}
        >
          <div className="flex items-center gap-2">
            {isLive && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />}
            <span className="text-xs font-black uppercase tracking-widest"
              style={{ color: isLive ? '#FF3B3B' : isCompleted ? '#00FF87' : '#4A5C54' }}>
              {isLive ? `LIVE · ${minute}'` : isCompleted ? 'Full Time' : 'Not Started'}
            </span>
          </div>
          {isLive && (
            <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>
              {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
            </span>
          )}
        </div>

        {/* Score */}
        <div className="px-5 py-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Home */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-2"
                style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                {match.home_team?.name?.charAt(0)}
              </div>
              <div className="font-black text-sm truncate" style={{ color: '#F0F4F2' }}>
                {match.home_team?.name}
              </div>
              {isLive && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button onClick={() => handleScoreChange('home', -1)}
                    className="w-8 h-8 rounded-lg font-black text-lg flex items-center justify-center"
                    style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
                    −
                  </button>
                  <span className="text-3xl font-black" style={{ color: '#F0F4F2' }}>{homeScore}</span>
                  <button onClick={() => handleScoreChange('home', 1)}
                    className="w-8 h-8 rounded-lg font-black text-lg flex items-center justify-center"
                    style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                    +
                  </button>
                </div>
              )}
              {!isLive && (
                <div className="text-3xl font-black mt-2" style={{ color: '#F0F4F2' }}>{homeScore}</div>
              )}
            </div>

            {/* VS / Score */}
            <div className="text-center">
              {isLive ? (
                <div>
                  <div className="text-4xl font-black" style={{ color: '#FF3B3B' }}>
                    {homeScore} — {awayScore}
                  </div>
                  <div className="text-xs font-black mt-1 animate-pulse" style={{ color: '#FF3B3B' }}>
                    {minute}'
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="text-4xl font-black" style={{ color: '#00FF87' }}>
                  {homeScore} — {awayScore}
                </div>
              ) : (
                <div className="text-xl font-black" style={{ color: '#4A5C54' }}>VS</div>
              )}
            </div>

            {/* Away */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-2"
                style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
                {match.away_team?.name?.charAt(0)}
              </div>
              <div className="font-black text-sm truncate" style={{ color: '#F0F4F2' }}>
                {match.away_team?.name}
              </div>
              {isLive && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button onClick={() => handleScoreChange('away', -1)}
                    className="w-8 h-8 rounded-lg font-black text-lg flex items-center justify-center"
                    style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
                    −
                  </button>
                  <span className="text-3xl font-black" style={{ color: '#F0F4F2' }}>{awayScore}</span>
                  <button onClick={() => handleScoreChange('away', 1)}
                    className="w-8 h-8 rounded-lg font-black text-lg flex items-center justify-center"
                    style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                    +
                  </button>
                </div>
              )}
              {!isLive && (
                <div className="text-3xl font-black mt-2" style={{ color: '#F0F4F2' }}>{awayScore}</div>
              )}
            </div>
          </div>

          {/* Match controls */}
          <div className="flex gap-3 mt-6">
            {status === 'scheduled' && (
              <button onClick={handleStartMatch} disabled={loading}
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide disabled:opacity-50 animate-pulse"
                style={{ backgroundColor: '#FF3B3B', color: 'white' }}>
                {loading ? 'Starting...' : '🔴 Start Match'}
              </button>
            )}
            {isLive && (
              <>
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide disabled:opacity-50"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                  Save
                </button>
                <button onClick={handleEndMatch} disabled={loading}
                  className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide disabled:opacity-50"
                  style={{ backgroundColor: '#1A2320', color: '#F0F4F2' }}>
                  {loading ? '...' : '✅ End Match'}
                </button>
              </>
            )}
            {isCompleted && (
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide disabled:opacity-50"
                style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            {status === 'postponed' && (
              <button onClick={handleSave} disabled={loading}
                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide disabled:opacity-50"
                style={{ backgroundColor: '#1A2320', color: '#F5A623' }}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual controls for non-live */}
      {!isLive && (
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>Manual Update</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Minute</label>
              <input type="number" min={0} max={120} value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
                {match.home_team?.name} Score
              </label>
              <input type="number" min={0} value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#00FF87', border: '1px solid #1F2B26' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
                {match.away_team?.name} Score
              </label>
              <input type="number" min={0} value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#FF3B3B', border: '1px solid #1F2B26' }}
              />
            </div>
          </div>
          <button onClick={handleSave} disabled={loading}
            className="w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
            style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}>
            {loading ? 'Saving...' : 'Save Match'}
          </button>
        </div>
      )}

      {/* Match Events */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>
            Match Events ({liveEvents.length})
          </div>
        </div>

        {/* Add event form */}
        <div className="px-5 py-4 space-y-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Event</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value="goal">⚽ Goal</option>
                <option value="own_goal">🔴 Own Goal</option>
                <option value="yellow_card">🟨 Yellow Card</option>
                <option value="red_card">🟥 Red Card</option>
                <option value="penalty_scored">⚽ Penalty Scored</option>
                <option value="penalty_missed">❌ Penalty Missed</option>
                <option value="substitution_in">🔁 Sub In</option>
                <option value="substitution_out">🔁 Sub Out</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Team</label>
              <select value={eventTeam} onChange={(e) => setEventTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value={match.home_team_id}>{match.home_team?.name}</option>
                <option value={match.away_team_id}>{match.away_team?.name}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Player</label>
              <select value={eventPlayer} onChange={(e) => setEventPlayer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              >
                <option value="">Unknown</option>
                {currentPlayers.map((p) => (
                  <option key={p.id} value={p.id}>#{p.jersey_number} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Minute *</label>
              <input type="number" min={1} max={120} value={eventMinute}
                onChange={(e) => setEventMinute(e.target.value)}
                placeholder={`${minute}'`}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
          </div>
          <button onClick={handleAddEvent} disabled={addingEvent || !eventMinute}
            className="w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-40"
            style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00FF8720' }}>
            {addingEvent ? 'Adding...' : '+ Add Event'}
          </button>
        </div>

        {/* Events list */}
        {liveEvents.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>
            No events recorded yet
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {liveEvents.map((event: any) => (
              <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-base flex-shrink-0">{eventIcons[event.event_type] ?? '⚽'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black" style={{ color: '#F0F4F2' }}>
                    {event.player?.name ?? 'Unknown'}
                    {event.player?.jersey_number ? ` #${event.player.jersey_number}` : ''}
                  </div>
                  <div className="text-xs" style={{ color: '#4A5C54' }}>
                    {event.event_type.replace(/_/g, ' ')} · {event.minute}'
                  </div>
                </div>
                <button onClick={() => handleDeleteEvent(event.id)}
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back */}
      <a href={`/community/${communitySlug}/admin/matches`}
        className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white"
        style={{ color: '#4A5C54' }}>
        Back to Matches
      </a>
    </div>
  )
}