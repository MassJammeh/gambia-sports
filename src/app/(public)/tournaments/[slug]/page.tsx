import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { calculateStandings } from '@/lib/standings'

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#E8F5EE', color: '#1A6B3A', label: '⏳ Upcoming' },
  group_stage: { bg: '#EFF6FF', color: '#1D4ED8', label: '⚽ Group Stage' },
  knockout: { bg: '#FEF3C7', color: '#D97706', label: '🔥 Knockout Stage' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: '✅ Completed' },
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*, season:seasons(name, league_id)')
    .eq('slug', slug)
    .single()

  if (!tournament) notFound()

  // Get groups with teams
  const { data: groups } = await supabase
    .from('tournament_groups')
    .select(`
      *,
      tournament_group_teams(
        team_id,
        team:teams(id, name, slug)
      )
    `)
    .eq('tournament_id', tournament.id)
    .order('name')

  // Get all tournament matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('tournament_id', tournament.id)
    .order('scheduled_at', { ascending: true })

  const status = statusConfig[tournament.status] ?? statusConfig.upcoming
  const completedMatches = matches?.filter(m => m.status === 'completed') ?? []
  const upcomingMatches = matches?.filter(m => m.status === 'scheduled') ?? []

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section
        className="relative rounded-2xl overflow-hidden py-12 px-8 text-white"
        style={{ background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 60%, #2D8A50 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-black px-3 py-1.5 rounded-full"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {(tournament.season as any)?.name}
            </span>
          </div>
          <h1 className="text-3xl font-black mb-2">{tournament.name}</h1>
          {tournament.description && (
            <p className="text-sm max-w-2xl" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {tournament.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {tournament.start_date && <span>📅 Starts {new Date(tournament.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            {tournament.num_groups && <span>👥 {tournament.num_groups} Groups</span>}
            {tournament.teams_advance_per_group && <span>⬆️ Top {tournament.teams_advance_per_group} advance</span>}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Groups', value: groups?.length ?? 0, color: '#1A6B3A' },
          { label: 'Played', value: completedMatches.length, color: '#C1272D' },
          { label: 'Upcoming', value: upcomingMatches.length, color: '#0057A8' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-3">
        <Link
          href={`/tournaments/${slug}/groups`}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-md"
          style={{ backgroundColor: '#1A6B3A', color: 'white' }}
        >
          📊 Group Tables
        </Link>
        <Link
          href={`/tournaments/${slug}/bracket`}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-md"
          style={{ backgroundColor: '#0F4A28', color: 'white' }}
        >
          🏆 Bracket
        </Link>
      </div>

      {/* Groups preview */}
      {groups && groups.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
              Groups
            </h2>
            <Link href={`/tournaments/${slug}/groups`} className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              Full tables →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => {
              const groupMatches = matches?.filter(m => m.group_id === group.id) ?? []
              const groupStandings = calculateStandings(groupMatches as any)
              const teams = (group.tournament_group_teams as any[]) ?? []

              return (
                <div key={group.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="px-4 py-3 font-black text-sm text-white" style={{ backgroundColor: '#1A6B3A' }}>
                    {group.name}
                  </div>
                  {groupStandings.length > 0 ? (
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ backgroundColor: '#F9FAFB' }}>
                          <th className="px-3 py-2 text-left font-bold" style={{ color: '#6B7280' }}>Team</th>
                          <th className="px-3 py-2 text-center font-bold" style={{ color: '#6B7280' }}>MP</th>
                          <th className="px-3 py-2 text-center font-bold" style={{ color: '#6B7280' }}>PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupStandings.map((row, i) => (
                          <tr key={row.team_id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                            <td className="px-3 py-2 font-semibold truncate" style={{ color: '#111827', maxWidth: '120px' }}>{row.team_name}</td>
                            <td className="px-3 py-2 text-center" style={{ color: '#6B7280' }}>{row.played}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="font-black text-white px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#1A6B3A' }}>{row.points}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-4 py-4">
                      <div className="space-y-1">
                        {teams.map((gt: any) => (
                          <div key={gt.team_id} className="text-xs font-medium py-1" style={{ color: '#6B7280' }}>
                            • {gt.team?.name ?? 'Unknown'}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs mt-2" style={{ color: '#9CA3AF' }}>No matches played yet</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {completedMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#C1272D' }} />
            Recent Results
          </h2>
          <div className="space-y-2">
            {completedMatches.slice(0, 5).map((match) => (
              <div key={match.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={{ border: '1px solid #E5E7EB' }}>
                <span className="flex-1 text-right text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="mx-3 px-3 py-1 rounded-lg text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: '#1A6B3A' }}>
                  {match.home_score} — {match.away_score}
                </span>
                <span className="flex-1 text-left text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <Link href="/tournaments" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1A6B3A' }}>
        ← All tournaments
      </Link>
    </div>
  )
}