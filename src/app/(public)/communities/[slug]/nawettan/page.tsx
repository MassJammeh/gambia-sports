import { getCommunityBySlug, getTournamentsByCommunity, getMatchesByTournament, calculateStandings } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function NawettanPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: tournaments } = await getTournamentsByCommunity(community.id)
  const nawettan = tournaments?.find(t => t.type === 'nawettan')

  if (!nawettan) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
          <Link href="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <Link href={`/communities/${slug}`} className="hover:text-white">{community.name}</Link>
          <span>›</span>
          <span style={{ color: '#8A9E96' }}>Nawettan</span>
        </div>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">🏆</div>
          <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>Nawettan Not Started</div>
          <div className="text-xs" style={{ color: '#4A5C54' }}>The Nawettan for {community.name} has not been created yet.</div>
        </div>
      </div>
    )
  }

  const { data: matches } = await getMatchesByTournament(nawettan.id)
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from('tournament_groups')
    .select(`*, group_teams(team_id, team:teams(id, name, slug))`)
    .eq('tournament_id', nawettan.id)
    .order('name')

  const completedMatches = matches?.filter(m => m.status === 'completed') ?? []
  const upcomingMatches = matches?.filter(m => m.status === 'scheduled') ?? []
  const liveMatches = matches?.filter(m => m.status === 'live') ?? []

  const statusColors: Record<string, string> = {
    upcoming: '#F5A623',
    qualify_round: '#8B5CF6',
    group_stage: '#6B8CFF',
    knockout: '#FF3B3B',
    completed: '#4A5C54',
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white transition-colors">{community.name}</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>Nawettan</span>
      </div>

      {/* Header */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>{nawettan.name}</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Group stage + knockout bracket · Like the FIFA World Cup</p>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded" style={{ backgroundColor: '#1A2320', color: statusColors[nawettan.status] ?? '#F5A623' }}>
            {nawettan.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#4A5C54' }}>
          {nawettan.num_groups && <span>👥 {nawettan.num_groups} Groups</span>}
          {nawettan.teams_advance_per_group && <span>⬆️ Top {nawettan.teams_advance_per_group} advance</span>}
          {nawettan.season_year && <span>📅 Season {nawettan.season_year}</span>}
          {nawettan.start_date && <span>🗓 {new Date(nawettan.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Groups', value: groups?.length ?? 0, color: '#00FF87' },
          { label: 'Played', value: completedMatches.length, color: '#FF3B3B' },
          { label: 'Upcoming', value: upcomingMatches.length, color: '#6B8CFF' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #FF3B3B' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #FF3B3B30' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>Live Now</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {liveMatches.map((match) => (
              <div key={match.id} className="px-5 py-4 flex items-center gap-3">
                <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.home_team as any)?.name}
                </span>
                <div className="flex-shrink-0 text-center px-4 py-2 rounded font-black text-sm" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', minWidth: '80px' }}>
                  {match.home_score} — {match.away_score}
                  <div className="text-xs mt-0.5">{match.minute}'</div>
                </div>
                <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Groups */}
      {groups && groups.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Group Standings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => {
              const groupMatches = matches?.filter(m => m.group_id === group.id) ?? []
              const standings = calculateStandings(groupMatches)
              const advanceCount = nawettan.teams_advance_per_group ?? 2

              return (
                <div key={group.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                  <div className="px-4 py-2.5 text-xs font-black uppercase tracking-widest" style={{ backgroundColor: '#1A2320', color: '#00FF87', borderBottom: '1px solid #1F2B26' }}>
                    {group.name}
                  </div>

                  {standings.length === 0 ? (
                    <div className="p-4 space-y-2">
                      {(group.group_teams as any[]).map((gt: any) => (
                        <div key={gt.team_id} className="flex items-center gap-3 py-1">
                          <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black flex-shrink-0"
                            style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                            {gt.team?.name?.charAt(0)}
                          </div>
                          <span className="text-xs font-medium" style={{ color: '#8A9E96' }}>{gt.team?.name}</span>
                        </div>
                      ))}
                      <div className="text-xs pt-2" style={{ color: '#4A5C54' }}>No matches played yet</div>
                    </div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: '1px solid #1F2B26' }}>
                          <th className="px-4 py-2 text-left font-bold" style={{ color: '#4A5C54' }}>#</th>
                          <th className="px-4 py-2 text-left font-bold" style={{ color: '#4A5C54' }}>Team</th>
                          <th className="px-4 py-2 text-center font-bold" style={{ color: '#4A5C54' }}>MP</th>
                          <th className="px-4 py-2 text-center font-bold" style={{ color: '#4A5C54' }}>GD</th>
                          <th className="px-4 py-2 text-center font-bold" style={{ color: '#4A5C54' }}>PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((row, i) => (
                          <tr
                            key={row.team_id}
                            style={{
                              backgroundColor: i < advanceCount ? '#0D2318' : 'transparent',
                              borderLeft: i < advanceCount ? '2px solid #00FF87' : '2px solid transparent',
                              borderBottom: '1px solid #1F2B26',
                            }}
                          >
                            <td className="px-4 py-2.5">
                              <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
                                style={{ backgroundColor: i < advanceCount ? '#00FF87' : '#1A2320', color: i < advanceCount ? '#0A0F0D' : '#4A5C54' }}>
                                {i + 1}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 font-bold truncate" style={{ color: '#F0F4F2', maxWidth: '100px' }}>{row.team_name}</td>
                            <td className="px-4 py-2.5 text-center" style={{ color: '#4A5C54' }}>{row.played}</td>
                            <td className="px-4 py-2.5 text-center font-bold"
                              style={{ color: row.goal_difference > 0 ? '#00FF87' : row.goal_difference < 0 ? '#FF3B3B' : '#4A5C54' }}>
                              {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="font-black px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                                {row.points}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs font-bold" style={{ color: '#4A5C54' }}>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#00FF87' }} />
            Advances to knockout stage
          </div>
        </div>
      )}

      {/* Results */}
      {completedMatches.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Recent Results</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {completedMatches.slice(0, 5).map((match) => {
              const homeWon = match.home_score > match.away_score
              const awayWon = match.away_score > match.home_score
              return (
                <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="flex-1 text-right text-xs font-black truncate" style={{ color: homeWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '64px', textAlign: 'center' }}>
                    {match.home_score} — {match.away_score}
                  </span>
                  <span className="flex-1 text-left text-xs font-black truncate" style={{ color: awayWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Upcoming Fixtures</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {upcomingMatches.slice(0, 5).map((match) => (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#0D3320', color: '#00FF87', minWidth: '64px', textAlign: 'center' }}>
                  {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <Link href={`/communities/${slug}`} className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white" style={{ color: '#4A5C54' }}>
        ← Back to {community.name}
      </Link>
    </div>
  )
}