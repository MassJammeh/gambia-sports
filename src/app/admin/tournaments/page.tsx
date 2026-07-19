import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#E8F5EE', color: '#1A6B3A', label: 'Upcoming' },
  group_stage: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Group Stage' },
  knockout: { bg: '#FEF3C7', color: '#D97706', label: 'Knockout' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
}

export default async function AdminTournamentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
  const isSuperAdmin = profile?.role === 'super_admin'

  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, league:leagues(name)')
    .eq('status', 'active')

  const seasonIds = seasons?.map(s => s.id) ?? []

  const { data: tournaments } = seasonIds.length > 0
    ? await supabase
        .from('tournaments')
        .select('*, season:seasons(name, league:leagues(name))')
        .in('season_id', seasonIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Tournaments
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Manage Nawetans and cup competitions
          </p>
        </div>
        <Link
          href="/admin/tournaments/new"
          className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          + New Tournament
        </Link>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-black text-lg mb-2" style={{ color: '#111827' }}>No tournaments yet</div>
          <Link
            href="/admin/tournaments/new"
            className="text-sm font-semibold"
            style={{ color: '#1A6B3A' }}
          >
            + Create your first tournament
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          {tournaments.map((tournament, index) => {
            const status = statusConfig[tournament.status] ?? statusConfig.upcoming
            return (
              <div
                key={tournament.id}
                className="px-5 py-4 flex items-center justify-between transition-all hover:bg-gray-50"
                style={{ borderBottom: index < tournaments.length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
                  >
                    🏆
                  </div>
                  <div>
                    <div className="font-black text-sm" style={{ color: '#111827' }}>{tournament.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {(tournament.season as any)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/tournaments/${tournament.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-black"
                    style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                  >
                    Manage
                  </Link>
                  <Link
                    href={`/tournaments/${tournament.slug}`}
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
  )
}