import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const positionConfig: Record<string, { bg: string }> = {
  GK: { bg: '#D97706' },
  DEF: { bg: '#1D4ED8' },
  MID: { bg: '#1A6B3A' },
  FWD: { bg: '#C1272D' },
}

export default async function AdminPlayersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
  const isSuperAdmin = profile?.role === 'super_admin'

  let playersQuery = supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, league_id)')
    .order('name')

  const { data: players } = await playersQuery

  const active = players?.filter(p => p.status === 'active') ?? []
  const inactive = players?.filter(p => p.status !== 'active') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>Players</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Manage player registrations
          </p>
        </div>
        <Link
          href="/admin/players/new"
          className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          + New Player
        </Link>
      </div>

      {/* Active players */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Active Players ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="text-3xl mb-2">👤</div>
            <div className="font-black" style={{ color: '#111827' }}>No players yet</div>
            <Link href="/admin/players/new" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#1A6B3A' }}>
              + Add a player
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            {active.map((player, index) => {
              const config = positionConfig[player.position] ?? { bg: '#6B7280' }
              return (
                <div
                  key={player.id}
                  className="px-5 py-4 flex items-center justify-between transition-all hover:bg-gray-50"
                  style={{ borderBottom: index < active.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                      style={{ backgroundColor: config.bg }}
                    >
                      {player.jersey_number ?? '?'}
                    </div>
                    <div>
                      <div className="font-black text-sm" style={{ color: '#111827' }}>{player.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: config.bg }}
                        >
                          {player.position}
                        </span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>
                          {(player.team as any)?.name ?? 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/players/${player.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-black"
                      style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/players/${player.id}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg text-xs font-black"
                      style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}