import { getActiveLeagues, getCurrentSeason, getFixtures } from '@/lib/queries'
import Link from 'next/link'

export default async function FixturesPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)
  if (!season) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active season found.</div>
  }

  const { data: fixtures } = await getFixtures(season.id)

  // Group by date
  const grouped: Record<string, typeof fixtures> = {}
  fixtures?.forEach((match) => {
    const date = match.scheduled_at
      ? new Date(match.scheduled_at).toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })
      : 'Date TBD'
    if (!grouped[date]) grouped[date] = []
    grouped[date]!.push(match)
  })

  const totalFixtures = fixtures?.length ?? 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Fixtures</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} · {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          📅 {totalFixtures} Upcoming
        </div>
      </div>

      {!fixtures || fixtures.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">📅</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No upcoming fixtures</div>
          <div className="text-sm mt-1" style={{ color: '#6B7280' }}>Check back soon for scheduled matches</div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, matches]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white flex-shrink-0"
                  style={{ backgroundColor: '#0F4A28' }}
                >
                  {date}
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                <div className="text-xs font-bold flex-shrink-0" style={{ color: '#9CA3AF' }}>
                  {matches?.length} match{(matches?.length ?? 0) > 1 ? 'es' : ''}
                </div>
              </div>

              {/* Matches */}
              <div className="space-y-2">
                {matches?.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {/* Top bar */}
                    <div
                      className="px-5 py-2 flex items-center justify-between"
                      style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#6B7280' }}>
                        {firstLeague.name}
                      </span>
                      {match.scheduled_at && (
                        <span className="text-xs font-black" style={{ color: '#1A6B3A' }}>
                          🕐 {new Date(match.scheduled_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {/* Match row */}
                    <div className="px-5 py-4 flex items-center gap-3">
                      {/* Home team */}
                      <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
                        <span className="font-black text-base truncate text-right" style={{ color: '#111827' }}>
                          {(match.home_team as any)?.name}
                        </span>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                        >
                          {(match.home_team as any)?.name?.charAt(0)}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="flex-shrink-0 text-center px-4">
                        <div
                          className="px-4 py-2 rounded-xl font-black text-sm"
                          style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF', minWidth: '52px' }}
                        >
                          VS
                        </div>
                        {match.venue && (
                          <div className="text-xs mt-1.5 font-medium truncate max-w-24" style={{ color: '#9CA3AF' }}>
                            📍 {match.venue}
                          </div>
                        )}
                      </div>

                      {/* Away team */}
                      <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #C1272D, #e03040)' }}
                        >
                          {(match.away_team as any)?.name?.charAt(0)}
                        </div>
                        <span className="font-black text-base truncate" style={{ color: '#111827' }}>
                          {(match.away_team as any)?.name}
                        </span>
                      </div>
                    </div>

                    {/* Status bar */}
                    <div
                      className="px-5 py-2 flex items-center justify-between"
                      style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}
                    >
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{
                          backgroundColor: match.status === 'postponed' ? '#FEF3C7' : '#E8F5EE',
                          color: match.status === 'postponed' ? '#D97706' : '#1A6B3A',
                        }}
                      >
                        {match.status === 'postponed' ? '⚠️ Postponed' : '⏳ Scheduled'}
                      </span>
                      <Link
                        href="/standings"
                        className="text-xs font-bold"
                        style={{ color: '#9CA3AF' }}
                      >
                        View Table →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}