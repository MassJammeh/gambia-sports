import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { color: string; bg: string; label: string }> = {
  GK: { color: '#F5A623', bg: '#2A1A00', label: 'Goalkeeper' },
  DEF: { color: '#6B8CFF', bg: '#0A0A2A', label: 'Defender' },
  MID: { color: '#00FF87', bg: '#0D3320', label: 'Midfielder' },
  FWD: { color: '#FF3B3B', bg: '#2A0A0A', label: 'Forward' },
}

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: '#00FF87', label: '✅ Active' },
  inactive: { color: '#4A5C54', label: '⏸️ Inactive' },
  injured: { color: '#FF3B3B', label: '🤕 Injured' },
  on_loan: { color: '#F5A623', label: '🔄 On Loan' },
  retired: { color: '#4A5C54', label: '🏁 Retired' },
}

export default async function CommunityPlayerProfilePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: player } = await supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, slug)')
    .eq('id', id)
    .eq('community_id', community.id)
    .single()

  if (!player) notFound()

  // Get match events for this player (goals, cards)
  const { data: events } = await supabase
    .from('match_events')
    .select('*, match:matches(id, home_score, away_score, status, scheduled_at, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name))')
    .eq('player_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const goals = events?.filter(e => e.event_type === 'goal' || e.event_type === 'penalty_scored') ?? []
  const yellowCards = events?.filter(e => e.event_type === 'yellow_card') ?? []
  const redCards = events?.filter(e => e.event_type === 'red_card') ?? []

  const config = positionConfig[player.position] ?? { color: '#4A5C54', bg: '#1A2320', label: player.position }
  const status = statusConfig[player.status] ?? { color: '#4A5C54', label: player.status }
  const team = player.team as any

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white">{community.name}</Link>
        <span>›</span>
        <Link href={`/communities/${slug}/players`} className="hover:text-white">Players</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>{player.name}</span>
      </div>

      {/* Player Hero */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-6 py-6 flex items-center gap-5">
          {/* Jersey number */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-4xl flex-shrink-0"
            style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.color}30` }}
          >
            {player.jersey_number ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold mb-1" style={{ color: config.color }}>
              {config.label}
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>{player.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              {team && (
                <Link href={`/communities/${slug}/teams/${team.slug ?? team.id}`}
                  className="text-xs font-bold hover:underline" style={{ color: '#8A9E96' }}>
                  🛡️ {team.name}
                </Link>
              )}
              {player.nationality && (
                <span className="text-xs font-bold" style={{ color: '#8A9E96' }}>
                  🇬🇲 {player.nationality}
                </span>
              )}
              <span className="text-xs font-bold" style={{ color: status.color }}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Goals', value: goals.length, color: '#00FF87', icon: '⚽' },
          { label: 'Yellow Cards', value: yellowCards.length, color: '#F5A623', icon: '🟨' },
          { label: 'Red Cards', value: redCards.length, color: '#FF3B3B', icon: '🟥' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Player Info */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>
            Player Info
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
          {[
            { label: 'Position', value: `${player.position} — ${config.label}` },
            { label: 'Jersey Number', value: player.jersey_number ? `#${player.jersey_number}` : '—' },
            { label: 'Nationality', value: player.nationality ?? '—' },
            { label: 'Date of Birth', value: player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
            { label: 'Club', value: team?.name ?? 'Unassigned' },
            { label: 'Status', value: status.label },
          ].map((item) => (
            <div key={item.label} className="px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>{item.label}</span>
              <span className="text-xs font-black" style={{ color: '#F0F4F2' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Biography */}
      {player.biography && (
        <div className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#4A5C54' }}>
            Biography
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#8A9E96' }}>
            {player.biography}
          </p>
        </div>
      )}

      {/* Recent Events */}
      {events && events.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #1F2B26' }}>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>
              Match Events
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {events.map((event) => {
              const match = event.match as any
              const icons: Record<string, string> = {
                goal: '⚽',
                own_goal: '🔴',
                yellow_card: '🟨',
                red_card: '🟥',
                penalty_scored: '⚽',
                penalty_missed: '❌',
              }
              return (
                <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{icons[event.event_type] ?? '⚽'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black" style={{ color: '#F0F4F2' }}>
                      {event.event_type.replace(/_/g, ' ')} · {event.minute}'
                    </div>
                    {match && (
                      <div className="text-xs mt-0.5 truncate" style={{ color: '#4A5C54' }}>
                        {match.home_team?.name} {match.home_score} — {match.away_score} {match.away_team?.name}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Link href={`/communities/${slug}/players`}
        className="inline-flex items-center gap-2 text-xs font-bold hover:text-white transition-colors"
        style={{ color: '#4A5C54' }}>
        Back to Players
      </Link>
    </div>
  )
}