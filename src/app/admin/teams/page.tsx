import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminTeamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'

  let teamsQuery = supabase
    .from('teams')
    .select('*, league:leagues(name)')
    .order('name')

  if (!isSuperAdmin && profile?.league_id) {
    teamsQuery = teamsQuery.eq('league_id', profile.league_id)
  }

  const { data: teams } = await teamsQuery

  const active = teams?.filter(t => t.status === 'active') ?? []
  const inactive = teams?.filter(t => t.status === 'inactive') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Teams
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Manage clubs and squads
          </p>
        </div>
        <Link
          href="/admin/teams/new"
          className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          + New Team
        </Link>
      </div>

      {/* Active teams */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Active Teams ({active.length})
        </h2>
        {active.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-black" style={{ color: '#111827' }}>No teams yet</div>
            <Link href="/admin/teams/new" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#1A6B3A' }}>
              + Add a team
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            {active.map((team, index) => (
              <div
                key={team.id}
                className="px-5 py-4 flex items-center justify-between transition-all hover:bg-gray-50"
                style={{ borderBottom: index < active.length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-sm" style={{ color: '#111827' }}>{team.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      {(team.league as any)?.name}
                      {team.home_ground && ` · 🏟 ${team.home_ground}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/teams/${team.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:opacity-90"
                    style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/teams/${team.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:opacity-90"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive teams */}
      {inactive.length > 0 && (
        <div>
          <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#9CA3AF' }} />
            Inactive Teams ({inactive.length})
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            {inactive.map((team, index) => (
              <div
                key={team.id}
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: index < inactive.length - 1 ? '1px solid #F3F4F6' : 'none', opacity: 0.6 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
                    style={{ backgroundColor: '#9CA3AF' }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div className="font-black text-sm" style={{ color: '#111827' }}>{team.name}</div>
                </div>
                <Link
                  href={`/admin/teams/${team.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-black"
                  style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}