import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { color: string; bg: string }> = {
  GK: { color: '#F5A623', bg: '#2A1A00' },
  DEF: { color: '#6B8CFF', bg: '#0A0A2A' },
  MID: { color: '#00FF87', bg: '#0D3320' },
  FWD: { color: '#FF3B3B', bg: '#2A0A0A' },
}

export default async function CommunityTeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  // Try by slug first then by id
  let { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('community_id', community.id)
    .eq('slug', id)
    .single()

  if (!team) {
    const { data: teamById } = await supabase
      .from('teams')
      .select('*')
      .eq('community_id', community.id)
      .eq('id', id)
      .single()
    team = teamById
  }

  if (!team) notFound()

  // Get players
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', team.id)
    .eq('status', 'active')
    .order('position')

  // Get recent results
  const { data: recentMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), tournament:tournaments(name)')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(5)

  // Get upcoming
  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), tournament:tournaments(name)')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const positionOrder = ['GK', 'DEF', 'MID', 'FWD']
  const sortedPlayers = [...(players ?? [])].sort(
    (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  )

  // Win/draw/loss record
  const played = recentMatches?.length ?? 0
  const wins = recentMatches?.filter(m => {
    const isHome = m.home_team_id === team!.id
    return isHome ? m.home_score > m.away_score : m.away_score > m.home_score
  }).length ?? 0
  const losses = recentMatches?.filter(m => {
    const isHome = m.home_team_id === team!.id
    return isHome ? m.home_score < m.away_score : m.away_score < m.home_score
  }).length ?? 0
  const draws = played - wins - losses

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white">{community.name}</Link>
        <span>›</span>
        <Link href={`/communities/${slug}/teams`} className="hover:text-white">Teams</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>{team.name}</span>
      </div>

      {/* Team Hero */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-6 py-6 flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-4xl flex-shrink-0"
            style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00FF8720' }}
          >
            {team.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>{team.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              {team.home_ground && (
                <span className="text-xs font-bold" style={{ color: '#8A9E96' }}>🏟 {team.home_ground}</span>
              )}
              {team.founded_year && (
                <span className="text-xs font-bold" style={{ color: '#8A9E96' }}>📅 Est. {team.founded_year}</span>
              )}
              {team.colours && (
                <span className="text-xs font-bold" style={{ color: '#8A9E96' }}>🎨 {team.colours}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00FF87' }} />
              <span className="text-xs font-bold" style={{ color: '#00FF87' }}>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Players', value: players?.length ?? 0, color: '#00FF87' },
          { label: 'Wins', value: wins, color: '#00FF87' },
          { label: 'Draws', value: draws, color: '#F5A623' },
          { label: 'Losses', value: losses, color: '#FF3B3B' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Results + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Results */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Recent Results
            </span>
          </div>
          {!recentMatches || recentMatches.length === 0 ? (
            <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No results yet</div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
              {recentMatches.map((match) => {
                const isHome = match.home_team_id === team.id
                const teamScore = isHome ? match.home_score : match.away_score
                const oppScore = isHome ? match.away_score : match.home_score
                const opponent = isHome ? (match.away_team as any)?.name : (match.home_team as any)?.name
                const won = teamScore > oppScore
                const drew = teamScore === oppScore
                return (
                  <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        backgroundColor: won ? '#0D3320' : drew ? '#1A2320' : '#2A0A0A',
                        color: won ? '#00FF87' : drew ? '#F5A623' : '#FF3B3B',
                      }}
                    >
                      {won ? 'W' : drew ? 'D' : 'L'}
                    </span>
                    <span className="flex-1 text-xs font-bold truncate" style={{ color: '#8A9E96' }}>
                      {isHome ? 'vs' : '@'} {opponent}
                    </span>
                    <span className="text-xs font-black" style={{ color: '#F0F4F2' }}>
                      {teamScore} — {oppScore}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Upcoming
            </span>
          </div>
          {!upcomingMatches || upcomingMatches.length === 0 ? (
            <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No upcoming fixtures</div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
              {upcomingMatches.map((match) => {
                const isHome = match.home_team_id === team.id
                const opponent = isHome ? (match.away_team as any)?.name : (match.home_team as any)?.name
                return (
                  <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0"
                      style={{ backgroundColor: isHome ? '#0D3320' : '#1A2320', color: isHome ? '#00FF87' : '#4A5C54' }}>
                      {isHome ? 'H' : 'A'}
                    </span>
                    <span className="flex-1 text-xs font-bold truncate" style={{ color: '#8A9E96' }}>
                      vs {opponent}
                    </span>
                    <span className="text-xs font-black" style={{ color: '#6B8CFF' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : 'TBD'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Squad */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Squad ({players?.length ?? 0})
            </span>
          </div>
        </div>
        {sortedPlayers.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No players registered</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {sortedPlayers.map((player) => {
              const config = positionConfig[player.position] ?? { color: '#4A5C54', bg: '#1A2320' }
              return (
                <Link
                  key={player.id}
                  href={`/communities/${slug}/players/${player.id}`}
                  className="px-5 py-3 flex items-center gap-4 transition-all hover:bg-white/5"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}>
                    {player.jersey_number ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black" style={{ color: '#F0F4F2' }}>{player.name}</div>
                    {player.nationality && (
                      <div className="text-xs" style={{ color: '#4A5C54' }}>🇬🇲 {player.nationality}</div>
                    )}
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}>
                    {player.position}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Description */}
      {team.description && (
        <div className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#4A5C54' }}>About</div>
          <p className="text-xs leading-relaxed" style={{ color: '#8A9E96' }}>{team.description}</p>
        </div>
      )}

      <Link href={`/communities/${slug}/teams`}
        className="inline-flex items-center gap-2 text-xs font-bold hover:text-white transition-colors"
        style={{ color: '#4A5C54' }}>
        Back to Teams
      </Link>
    </div>
  )
}