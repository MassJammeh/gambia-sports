import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug, getTournamentsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityAdminTournamentsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: tournaments } = await getTournamentsByCommunity(community.id)
  const supabase = await createClient()

  const tournamentsWithGroups = await Promise.all(
    (tournaments ?? []).map(async (t) => {
      const { data: groups } = await supabase
        .from('tournament_groups')
        .select('*, group_teams(team_id, team:teams(name))')
        .eq('tournament_id', t.id)
        .order('name')
      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', t.id)
      return { ...t, groups: groups ?? [], matchCount: matchCount ?? 0 }
    })
  )

  const statusConfig: Record<string, { color: string; label: string }> = {
    upcoming: { color: '#F5A623', label: 'Upcoming' },
    qualify_round: { color: '#8B5CF6', label: 'Qualify Round' },
    group_stage: { color: '#6B8CFF', label: 'Group Stage' },
    knockout: { color: '#FF3B3B', label: 'Knockout' },
    completed: { color: '#4A5C54', label: 'Completed' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Tournaments</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
        </div>
        <Link
          href={`/community/${slug}/admin/tournaments/new`}
          className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          + New Tournament
        </Link>
      </div>

      {tournamentsWithGroups.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">🏆</div>
          <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>No tournaments yet</div>
          <Link href={`/community/${slug}/admin/tournaments/new`} className="text-xs font-bold" style={{ color: '#00FF87' }}>
            + Create first tournament
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tournamentsWithGroups.map((tournament) => {
            const status = statusConfig[tournament.status] ?? { color: '#4A5C54', label: tournament.status }
            const isNawettan = tournament.type === 'nawettan'

            return (
              <div key={tournament.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{isNawettan ? '🏆' : '🥊'}</span>
                    <div>
                      <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{tournament.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black" style={{ color: status.color }}>
                          {status.label}
                        </span>
                        <span className="text-xs" style={{ color: '#4A5C54' }}>
                          · Season {tournament.season_year}
                          · {tournament.matchCount} matches
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/community/${slug}/admin/tournaments/${tournament.id}`}
                      className="text-xs font-black px-3 py-1.5 rounded"
                      style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                    >
                      Manage
                    </Link>
                    <Link
                      href={`/communities/${slug}/${tournament.type === 'nawettan' ? 'nawettan' : 'knockout'}`}
                      target="_blank"
                      className="text-xs font-black px-3 py-1.5 rounded"
                      style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
                    >
                      View →
                    </Link>
                  </div>
                </div>

                {/* Groups */}
                {tournament.groups.length > 0 && (
                  <div className="px-5 py-3">
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4A5C54' }}>
                      Groups ({tournament.groups.length})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {tournament.groups.map((group: any) => (
                        <div key={group.id} className="rounded-lg px-3 py-2" style={{ backgroundColor: '#1A2320' }}>
                          <div className="text-xs font-black mb-1" style={{ color: '#00FF87' }}>{group.name}</div>
                          <div className="text-xs" style={{ color: '#4A5C54' }}>
                            {(group.group_teams as any[]).length} teams
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status update */}
                <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: '1px solid #1F2B26', backgroundColor: '#111916' }}>
                  <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>Update Status:</span>
                  <div className="flex gap-2 flex-wrap">
                    {['upcoming', 'group_stage', 'knockout', 'completed'].map((s) => (
                      <Link
                        key={s}
                        href={`/community/${slug}/admin/tournaments/${tournament.id}?status=${s}`}
                        className="text-xs font-bold px-2 py-1 rounded transition-all"
                        style={{
                          backgroundColor: tournament.status === s ? '#0D3320' : '#1A2320',
                          color: tournament.status === s ? '#00FF87' : '#4A5C54',
                        }}
                      >
                        {s.replace('_', ' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}