import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TournamentForm from '@/components/admin/TournamentForm'

export default async function ManageTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single()

  if (!tournament) notFound()

  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, league:leagues(name)')
    .eq('status', 'active')

  const { data: groups } = await supabase
    .from('tournament_groups')
    .select('*, tournament_group_teams(team_id, team:teams(id, name))')
    .eq('tournament_id', id)
    .order('name')

  const { data: allTeams } = await supabase
    .from('teams')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            {tournament.name}
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Manage tournament settings and groups
          </p>
        </div>
        <Link
          href={`/tournaments/${tournament.slug}`}
          target="_blank"
          className="px-4 py-2 rounded-xl text-sm font-black"
          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
        >
          View Public →
        </Link>
      </div>

      {/* Edit form */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Tournament Details
        </h2>
        <TournamentForm seasons={seasons ?? []} tournament={tournament} />
      </div>

      {/* Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#0057A8' }} />
            Groups ({groups?.length ?? 0})
          </h2>
        </div>

        {!groups || groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="text-3xl mb-2">👥</div>
            <div className="font-black" style={{ color: '#111827' }}>No groups yet</div>
            <div className="text-sm mt-1" style={{ color: '#6B7280' }}>
              Groups are created via the admin panel once teams are assigned.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div
                  className="px-4 py-3 font-black text-white text-sm"
                  style={{ backgroundColor: '#1A6B3A' }}
                >
                  {group.name}
                </div>
                <div className="p-4">
                  {(group.tournament_group_teams as any[]).length === 0 ? (
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>No teams assigned</div>
                  ) : (
                    <div className="space-y-1.5">
                      {(group.tournament_group_teams as any[]).map((gt: any) => (
                        <div key={gt.team_id} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                            style={{ backgroundColor: '#1A6B3A' }}
                          >
                            {gt.team?.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#111827' }}>
                            {gt.team?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}