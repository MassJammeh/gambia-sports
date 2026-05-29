import { getActiveLeagues, getCurrentSeason, getResults } from '@/lib/queries'

export default async function ResultsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active season found.</div>
  }

  const { data: results } = await getResults(season.id)

  // Group by date
  const grouped: Record<string, typeof results> = {}
  results?.forEach((match) => {
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
            Results
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} — {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}
        >
          ✅ Full Time
        </div>
      </div>

      {!results || results.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No results yet.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, matches]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: '#C1272D', color: 'white' }}
                >
                  {date}
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Matches */}
              <div className="space-y-2">
                {matches?.map((match) => {
                  const homeScore = match.home_score ?? 0
                  const awayScore = match.away_score ?? 0
                  const homeWon = homeScore > awayScore
                  const awayWon = awayScore > homeScore

                  return (
                    <div
                      key={match.id}
                      className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      style={{ border: '1px solid #E5E7EB' }}
                    >
                      {/* Home team */}
                      <div className="flex-1 flex items-center justify-end gap-3">
                        <span
                          className="font-bold text-base text-right"
                          style={{ color: homeWon ? '#111827' : '#6B7280' }}
                        >
                          {(match.home_team as any)?.name}
                        </span>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                          style={{
                            background: homeWon
                              ? 'linear-gradient(135deg, #1A6B3A, #2D8A50)'
                              : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
                          }}
                        >
                          {(match.home_team as any)?.name?.charAt(0)}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="mx-6 text-center flex-shrink-0">
                        <div
                          className="px-5 py-2 rounded-xl font-black text-xl text-white shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)',
                            minWidth: '80px',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {homeScore} — {awayScore}
                        </div>
                        <div
                          className="text-xs font-black uppercase tracking-widest mt-1.5"
                          style={{ color: '#C1272D' }}
                        >
                          FT
                        </div>
                      </div>

                      {/* Away team */}
                      <div className="flex-1 flex items-center justify-start gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                          style={{
                            background: awayWon
                              ? 'linear-gradient(135deg, #1A6B3A, #2D8A50)'
                              : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
                          }}
                        >
                          {(match.away_team as any)?.name?.charAt(0)}
                        </div>
                        <span
                          className="font-bold text-base"
                          style={{ color: awayWon ? '#111827' : '#6B7280' }}
                        >
                          {(match.away_team as any)?.name}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}