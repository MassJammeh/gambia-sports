import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { bg: string }> = {
  GK: { bg: '#D97706' },
  DEF: { bg: '#1D4ED8' },
  MID: { bg: '#1A6B3A' },
  FWD: { bg: '#C1272D' },
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Get team
  const { data: team } = await supabase
    .from('teams')
    .select('*, league:leagues(*)')
    .eq('slug', slug)
    .single()

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
    .select('*, home_team:teams!home_team_id(name,slug), away_team:teams!away_team_id(name,slug)')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(5)

  // Get upcoming fixtures
  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name,slug), away_team:teams!away_team_id(name,slug)')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const positionOrder = ['GK', 'DEF', 'MID', 'FWD']
  const sortedPlayers = [...(players || [])].sort(
    (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  )

  return (
    <div className="space-y-8">

      {/* Team Hero Banner */}
      <section
        className="relative rounded-2xl overflow-hidden py-12 px-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 60%, #2D8A50 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-white font-black text-4xl shadow-xl flex-shrink-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            {team.name.charAt(0)}
          </div>
          <div>
            <div className="text-green-200 text-sm font-semibold mb-1">
              {(team.league as any)?.name}
            </div>
            <h1 className="text-3xl font-black">{team.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {team.home_ground && <span>🏟 {team.home_ground}</span>}
              {team.founded_year && <span>📅 Est. {team.founded_year}</span>}
              {team.colours && <span>🎨 {team.colours}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Players', value: players?.length ?? 0, color: '#1A6B3A' },
          { label: 'Recent Results', value: recentMatches?.length ?? 0, color: '#C1272D' },
          { label: 'Upcoming', value: upcomingMatches?.length ?? 0, color: '#0057A8' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 text-center shadow-sm"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div className="text-3xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {team.description && (
        <div
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <h2 className="text-lg font-black mb-3" style={{ color: '#111827' }}>About</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            {team.description}
          </p>
        </div>
      )}

      {/* Recent Results + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Results */}
        <div>
          <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#C1272D' }} />
            Recent Results
          </h2>
          <div className="space-y-2">
            {!recentMatches || recentMatches.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No results yet
              </div>
            ) : (
              recentMatches.map((match) => {
                const isHome = match.home_team_id === team.id
                const teamScore = isHome ? match.home_score : match.away_score
                const oppScore = isHome ? match.away_score : match.home_score
                const opponent = isHome ? (match.away_team as any)?.name : (match.home_team as any)?.name
                const won = teamScore! > oppScore!
                const drew = teamScore === oppScore

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ backgroundColor: won ? '#16A34A' : drew ? '#9CA3AF' : '#C1272D' }}
                      >
                        {won ? 'W' : drew ? 'D' : 'L'}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
                        {isHome ? 'vs' : '@'} {opponent}
                      </span>
                    </div>
                    <span
                      className="text-sm font-black px-3 py-1 rounded-lg text-white"
                      style={{ backgroundColor: '#1A6B3A' }}
                    >
                      {teamScore} — {oppScore}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div>
          <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
            Upcoming Fixtures
          </h2>
          <div className="space-y-2">
            {!upcomingMatches || upcomingMatches.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No upcoming fixtures
              </div>
            ) : (
              upcomingMatches.map((match) => {
                const isHome = match.home_team_id === team.id
                const opponent = isHome ? (match.away_team as any)?.name : (match.home_team as any)?.name
                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                      >
                        {isHome ? 'HOME' : 'AWAY'}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#1F2937' }}>
                        vs {opponent}
                      </span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : 'TBD'}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Squad */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Squad ({players?.length ?? 0} Players)
        </h2>

        {sortedPlayers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
            No players registered yet
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {sortedPlayers.map((player) => {
                const config = positionConfig[player.position] ?? { bg: '#6B7280' }
                return (
                  <div
                    key={player.id}
                    className="px-6 py-3.5 flex items-center gap-4 transition-all hover:bg-gray-50"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                      style={{ backgroundColor: config.bg }}
                    >
                      {player.jersey_number ?? '—'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{ color: '#111827' }}>
                        {player.name}
                      </div>
                      {player.nationality && (
                        <div className="text-xs" style={{ color: '#6B7280' }}>
                          🇬🇲 {player.nationality}
                        </div>
                      )}
                    </div>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: config.bg }}
                    >
                      {player.position}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Back link */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
        style={{ color: '#1A6B3A' }}
      >
        ← Back to all teams
      </Link>
    </div>
  )
}