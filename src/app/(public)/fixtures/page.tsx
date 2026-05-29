import { getActiveLeagues, getCurrentSeason, getFixtures } from '@/lib/queries'

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

  // Group fixtures by date
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Fixtures
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} — {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
        >
          📅 Upcoming
        </div>
      </div>

      {!fixtures || fixtures.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No upcoming fixtures.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, matches]) => (
            <div key={date}>
              {/* Matchday date header */}
              <div
                className="flex items-center gap-3 mb-3"
              >
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: '#0F4A28', color: 'white' }}
                >
                  {date}
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Matches for this date */}
              <div className="space-y-2">
                {matches?.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {/* Home team */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <span className="font-bold text-base text-right" style={{ color: '#111827' }}>
                        {(match.home_team as any)?.name}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                      >
                        {(match.home_team as any)?.name?.charAt(0)}
                      </div>
                    </div>

                    {/* VS / Time */}
                    <div className="mx-6 text-center flex-shrink-0">
                      <div
                        className="px-4 py-2 rounded-xl text-sm font-black"
                        style={{ backgroundColor: '#F3F4F6', color: '#1A6B3A', border: '2px solid #E5E7EB', minWidth: '64px' }}
                      >
                        {match.scheduled_at
                          ? new Date(match.scheduled_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                          : 'VS'}
                      </div>
                      {match.venue && (
                        <div className="text-xs mt-1.5 font-medium" style={{ color: '#6B7280' }}>
                          📍 {match.venue}
                        </div>
                      )}
                    </div>

                    {/* Away team */}
                    <div className="flex-1 flex items-center justify-start gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #C1272D, #e03040)' }}
                      >
                        {(match.away_team as any)?.name?.charAt(0)}
                      </div>
                      <span className="font-bold text-base" style={{ color: '#111827' }}>
                        {(match.away_team as any)?.name}
                      </span>
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