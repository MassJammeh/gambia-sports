import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  scheduled: { bg: '#E8F5EE', color: '#1A6B3A', label: 'Scheduled' },
  live: { bg: '#FEE2E2', color: '#EF4444', label: 'Live' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  postponed: { bg: '#FEF3C7', color: '#D97706', label: 'Postponed' },
}

export default async function AdminMatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'

  // Get all seasons
  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, league:leagues(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Get matches
  let matchQuery = supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id, name),
      away_team:teams!away_team_id(id, name),
      season:seasons(name, league:leagues(name))
    `)
    .order('scheduled_at', { ascending: false })

  if (!isSuperAdmin && profile?.league_id) {
    const { data: seasonIds } = await supabase
      .from('seasons')
      .select('id')
      .eq('league_id', profile.league_id)
    const ids = seasonIds?.map(s => s.id) ?? []
    if (ids.length > 0) {
      matchQuery = matchQuery.in('season_id', ids)
    }
  }

  const { data: matches } = await matchQuery

  const scheduled = matches?.filter(m => m.status === 'scheduled') ?? []
  const completed = matches?.filter(m => m.status === 'completed') ?? []
  const postponed = matches?.filter(m => m.status === 'postponed') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Matches
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Enter results and manage fixtures
          </p>
        </div>
        <Link
          href="/admin/fixtures/new"
          className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          + New Fixture
        </Link>
      </div>

      {/* Postponed alerts */}
      {postponed.length > 0 && (
        <div className="px-5 py-4 rounded-2xl" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <div className="font-black text-sm mb-3" style={{ color: '#D97706' }}>
            ⚠️ {postponed.length} postponed match{postponed.length > 1 ? 'es' : ''} need rescheduling
          </div>
          <div className="space-y-2">
            {postponed.map((match) => (
              <div key={match.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3" style={{ border: '1px solid #FDE68A' }}>
                <span className="text-sm font-bold" style={{ color: '#111827' }}>
                  {(match.home_team as any)?.name} vs {(match.away_team as any)?.name}
                </span>
                <Link
                  href={`/admin/matches/${match.id}`}
                  className="text-xs font-black px-3 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: '#D97706' }}
                >
                  Reschedule
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled matches */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
          Scheduled ({scheduled.length})
        </h2>
        {scheduled.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="text-3xl mb-2">📅</div>
            <div className="font-black" style={{ color: '#111827' }}>No scheduled matches</div>
            <Link href="/admin/fixtures/new" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#1A6B3A' }}>
              + Schedule a fixture
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduled.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-base" style={{ color: '#111827' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                      vs
                    </span>
                    <span className="font-black text-base" style={{ color: '#111827' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                      📅 {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                    </span>
                    {match.venue && (
                      <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        📍 {match.venue}
                      </span>
                    )}
                    <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                      {(match.season as any)?.name}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/matches/${match.id}`}
                  className="ml-4 px-4 py-2 rounded-xl text-sm font-black text-white flex-shrink-0 transition-all hover:opacity-90"
                  style={{ backgroundColor: '#C1272D' }}
                >
                  Enter Result
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed matches */}
      <div>
        <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
          <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#6B7280' }} />
          Completed ({completed.length})
        </h2>
        {completed.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
            No completed matches yet
          </div>
        ) : (
          <div className="space-y-2">
            {completed.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: '#111827' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-black text-white"
                      style={{ backgroundColor: '#1A6B3A' }}
                    >
                      {match.home_score} — {match.away_score}
                    </span>
                    <span className="font-bold text-sm" style={{ color: '#111827' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </div>
                </div>
                {isSuperAdmin && (
                  <Link
                    href={`/admin/matches/${match.id}`}
                    className="ml-4 px-4 py-2 rounded-xl text-sm font-black flex-shrink-0 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  >
                    Edit Score
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}