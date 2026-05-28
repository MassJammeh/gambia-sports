import { getActiveLeagues, getCurrentSeason, getResults } from '@/lib/queries'

export default async function ResultsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20 text-gray-500">No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return <div className="text-center py-20 text-gray-500">No active season found.</div>
  }

  const { data: results } = await getResults(season.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Results</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {firstLeague.name} — {season.name}
        </p>
      </div>

      {!results || results.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No results yet.
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((match) => {
            const homeScore = match.home_score ?? 0
            const awayScore = match.away_score ?? 0
            return (
              <div
                key={match.id}
                className="bg-white rounded-xl px-6 py-4 shadow-sm flex items-center justify-between"
                style={{ border: '1px solid #E5E7EB' }}
              >
                {/* Home team */}
                <div className="flex-1 text-right">
                  <div className="font-semibold" style={{ color: '#1F2937' }}>
                    {(match.home_team as any)?.name}
                  </div>
                </div>

                {/* Score */}
                <div className="mx-6 text-center">
                  <div className="text-xs mb-1" style={{ color: '#6B7280' }}>
                    {match.scheduled_at
                      ? new Date(match.scheduled_at).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })
                      : 'TBD'}
                  </div>
                  <div
                    className="text-lg font-bold px-5 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#1A6B3A' }}
                  >
                    {homeScore} — {awayScore}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    FT
                  </div>
                </div>

                {/* Away team */}
                <div className="flex-1 text-left">
                  <div className="font-semibold" style={{ color: '#1F2937' }}>
                    {(match.away_team as any)?.name}
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