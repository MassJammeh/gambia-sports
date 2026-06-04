import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { calculateStandings } from '@/lib/standings'

export default async function TournamentGroupsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!tournament) notFound()

  const { data: groups } = await supabase
    .from('tournament_groups')
    .select(`*, tournament_group_teams(team_id, team:teams(id, name, slug))`)
    .eq('tournament_id', tournament.id)
    .order('name')

  const { data: matches } = await supabase
    .from('matches')
    .select(`*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)`)
    .eq('tournament_id', tournament.id)
    .order('scheduled_at', { ascending: true })

  const advanceCount = tournament.teams_advance_per_group ?? 2

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Group Tables
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {tournament.name}
          </p>
        </div>
        <Link
          href={`/tournaments/${slug}/bracket`}
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#0F4A28' }}
        >
          🏆 Bracket
        </Link>
      </div>

      {!groups || groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">👥</div>
          <div className="font-black" style={{ color: '#111827' }}>No groups created yet</div>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const groupMatches = matches?.filter(m => m.group_id === group.id) ?? []
            const standings = calculateStandings(groupMatches as any)

            return (
              <div key={group.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                {/* Group header */}
                <div
                  className="px-6 py-4 font-black text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
                >
                  {group.name}
                </div>

                {standings.length === 0 ? (
                  <div className="p-6">
                    <div className="space-y-2">
                      {(group.tournament_group_teams as any[]).map((gt: any) => (
                        <div key={gt.team_id} className="flex items-center gap-3 py-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: '#1A6B3A' }}>
                            {gt.team?.name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm" style={{ color: '#111827' }}>{gt.team?.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs mt-3" style={{ color: '#9CA3AF' }}>No matches played yet</div>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB' }}>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#6B7280' }}>#</th>
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#6B7280' }}>Team</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide" style={{ color: '#6B7280' }}>MP</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>W</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>D</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>L</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>GD</th>
                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide" style={{ color: '#6B7280' }}>PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, index) => {
                        const isAdvancing = index < advanceCount
                        return (
                          <tr
                            key={row.team_id}
                            style={{
                              backgroundColor: isAdvancing ? '#f0fdf4' : index % 2 === 0 ? '#fff' : '#F9FAFB',
                              borderLeft: isAdvancing ? '4px solid #16A34A' : '4px solid transparent',
                            }}
                          >
                            <td className="px-4 py-3">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                                style={{
                                  backgroundColor: isAdvancing ? '#16A34A' : '#E5E7EB',
                                  color: isAdvancing ? 'white' : '#6B7280',
                                }}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold" style={{ color: '#111827' }}>{row.team_name}</td>
                            <td className="px-4 py-3 text-center" style={{ color: '#6B7280' }}>{row.played}</td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: '#16A34A' }}>{row.won}</td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: '#6B7280' }}>{row.drawn}</td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: '#C1272D' }}>{row.lost}</td>
                            <td className="px-4 py-3 text-center hidden sm:table-cell" style={{ color: row.goal_difference > 0 ? '#16A34A' : '#C1272D' }}>
                              {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-black text-white px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: '#1A6B3A' }}>
                                {row.points}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {/* Group matches */}
                {groupMatches.length > 0 && (
                  <div className="px-4 pb-4 mt-2">
                    <div className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>Matches</div>
                    <div className="space-y-1.5">
                      {groupMatches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                          <span className="flex-1 text-right text-xs font-semibold truncate" style={{ color: '#1F2937' }}>
                            {(match.home_team as any)?.name}
                          </span>
                          <span className="mx-2 px-2.5 py-0.5 rounded text-xs font-black text-white flex-shrink-0" style={{ backgroundColor: match.status === 'completed' ? '#1A6B3A' : '#9CA3AF' }}>
                            {match.status === 'completed' ? `${match.home_score} — ${match.away_score}` : match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                          </span>
                          <span className="flex-1 text-left text-xs font-semibold truncate" style={{ color: '#1F2937' }}>
                            {(match.away_team as any)?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#6B7280' }}>
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#16A34A' }} />
        Advances to knockout stage
      </div>

      <Link href={`/tournaments/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1A6B3A' }}>
        ← Back to tournament
      </Link>
    </div>
  )
}