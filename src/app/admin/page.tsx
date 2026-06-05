import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, league:leagues(*)')
    .eq('id', user!.id)
    .single()

  const leagueId = (profile as any)?.league_id
  const isSuperAdmin = profile?.role === 'super_admin'

  // Get active season
  let seasonId: string | null = null
  if (leagueId) {
    const { data: season } = await supabase
      .from('seasons')
      .select('id')
      .eq('league_id', leagueId)
      .eq('status', 'active')
      .single()
    seasonId = season?.id ?? null
  }

  // Get stats
  const [
    { count: teamsCount },
    { count: playersCount },
    { count: completedCount },
    { count: upcomingCount },
    { count: postponedCount },
  ] = await Promise.all([
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('league_id', leagueId ?? '').eq('status', 'active'),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    seasonId ? supabase.from('matches').select('*', { count: 'exact', head: true }).eq('season_id', seasonId).eq('status', 'completed') : Promise.resolve({ count: 0 }),
    seasonId ? supabase.from('matches').select('*', { count: 'exact', head: true }).eq('season_id', seasonId).eq('status', 'scheduled') : Promise.resolve({ count: 0 }),
    seasonId ? supabase.from('matches').select('*', { count: 'exact', head: true }).eq('season_id', seasonId).eq('status', 'postponed') : Promise.resolve({ count: 0 }),
  ])

  // Get recent results
  const { data: recentResults } = seasonId ? await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('season_id', seasonId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(3) : { data: null }

  // Get upcoming fixtures
  const { data: upcomingFixtures } = seasonId ? await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('season_id', seasonId)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(3) : { data: null }

  const stats = [
    { label: 'Teams', value: teamsCount ?? 0, icon: '🛡️', color: '#1A6B3A', href: '/admin/teams' },
    { label: 'Players', value: playersCount ?? 0, icon: '👤', color: '#0057A8', href: '/admin/players' },
    { label: 'Completed', value: completedCount ?? 0, icon: '✅', color: '#16A34A', href: '/admin/matches' },
    { label: 'Upcoming', value: upcomingCount ?? 0, icon: '📅', color: '#D97706', href: '/admin/matches' },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          Welcome back, {profile?.display_name ?? 'Admin'} · {(profile as any)?.league?.name ?? 'All Leagues'}
        </p>
      </div>

      {/* Alerts */}
      {(postponedCount ?? 0) > 0 && (
        <div
          className="px-5 py-4 rounded-2xl flex items-center gap-3"
          style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}
        >
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-black text-sm" style={{ color: '#D97706' }}>
              {postponedCount} postponed match{(postponedCount ?? 0) > 1 ? 'es' : ''} need rescheduling
            </div>
            <Link href="/admin/matches" className="text-xs font-semibold" style={{ color: '#D97706' }}>
              View matches →
            </Link>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: '/admin/matches', label: 'Enter Result', icon: '⚽', color: '#C1272D' },
            { href: '/admin/fixtures/new', label: 'Schedule Fixture', icon: '📅', color: '#1A6B3A' },
            { href: '/admin/teams', label: 'Manage Teams', icon: '🛡️', color: '#0F4A28' },
            { href: '/admin/players', label: 'Manage Players', icon: '👤', color: '#0057A8' },
            { href: '/admin/tournaments', label: 'Tournaments', icon: '🏆', color: '#D97706' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-4 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-xs font-black uppercase tracking-wide" style={{ color: action.color }}>
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Results + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#C1272D' }} />
              Recent Results
            </h2>
            <Link href="/admin/matches" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              All matches →
            </Link>
          </div>
          <div className="space-y-2">
            {!recentResults || recentResults.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No results yet
              </div>
            ) : (
              recentResults.map((match) => (
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
              ))
            )}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
              Upcoming Fixtures
            </h2>
            <Link href="/admin/fixtures/new" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              + Schedule →
            </Link>
          </div>
          <div className="space-y-2">
            {!upcomingFixtures || upcomingFixtures.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No upcoming fixtures
              </div>
            ) : (
              upcomingFixtures.map((match) => (
                <div key={match.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={{ border: '1px solid #E5E7EB' }}>
                  <span className="flex-1 text-right text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <div className="mx-3 text-center flex-shrink-0">
                    <div className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}>
                      {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                    </div>
                  </div>
                  <span className="flex-1 text-left text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  )
}