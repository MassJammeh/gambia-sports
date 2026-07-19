import { getActiveLeagues, getCurrentSeason, getResults } from '@/lib/queries'
import Link from 'next/link'

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

  const totalResults = results?.length ?? 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #7B0D1E, #C1272D)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Results</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} · {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          ✅ {totalResults} Played
        </div>
      </div>

      {!results || results.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">✅</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No results yet</div>
          <div className="text-sm mt-1" style={{ color: '#6B7280' }}>Results will appear once matches are completed</div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, matches]) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white flex-shrink-0"
                  style={{ backgroundColor: '#C1272D' }}
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
                {matches?.map((match) => {
                  const homeScore = match.home_score ?? 0
                  const awayScore = match.away_score ?? 0
                  const homeWon = homeScore > awayScore
                  const awayWon = awayScore > homeScore
                  const isDraw = homeScore === awayScore

                  return (
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
                        <span
                          className="text-xs font-black px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}
                        >
                          Full Time
                        </span>
                      </div>

                      {/* Match row */}
                      <div className="px-5 py-4 flex items-center gap-3">
                        {/* Home team */}
                        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
                          <span
                            className="font-black text-base truncate text-right"
                            style={{ color: homeWon ? '#111827' : '#9CA3AF' }}
                          >
                            {(match.home_team as any)?.name}
                          </span>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm"
                            style={{
                              background: homeWon
                                ? 'linear-gradient(135deg, #1A6B3A, #2D8A50)'
                                : isDraw
                                  ? 'linear-gradient(135deg, #6B7280, #9CA3AF)'
                                  : 'linear-gradient(135deg, #9CA3AF, #D1D5DB)',
                            }}
                          >
                            {(match.home_team as any)?.name?.charAt(0)}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-center px-2">
                          <div
                            className="px-5 py-2.5 rounded-xl font-black text-xl text-white shadow-md"
                            style={{
                              background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)',
                              minWidth: '80px',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {homeScore} — {awayScore}
                          </div>
                          <div className="text-xs font-black mt-1.5 uppercase tracking-widest" style={{ color: '#C1272D' }}>
                            FT
                          </div>
                        </div>

                        {/* Away team */}
                        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm"
                            style={{
                              background: awayWon
                                ? 'linear-gradient(135deg, #1A6B3A, #2D8A50)'
                                : isDraw
                                  ? 'linear-gradient(135deg, #6B7280, #9CA3AF)'
                                  : 'linear-gradient(135deg, #9CA3AF, #D1D5DB)',
                            }}
                          >
                            {(match.away_team as any)?.name?.charAt(0)}
                          </div>
                          <span
                            className="font-black text-base truncate"
                            style={{ color: awayWon ? '#111827' : '#9CA3AF' }}
                          >
                            {(match.away_team as any)?.name}
                          </span>
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div
                        className="px-5 py-2 flex items-center justify-between"
                        style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}
                      >
                        <div className="flex items-center gap-2">
                          {homeWon && (
                            <span className="text-xs font-black" style={{ color: '#1A6B3A' }}>
                              🏆 {(match.home_team as any)?.name} Win
                            </span>
                          )}
                          {awayWon && (
                            <span className="text-xs font-black" style={{ color: '#1A6B3A' }}>
                              🏆 {(match.away_team as any)?.name} Win
                            </span>
                          )}
                          {isDraw && (
                            <span className="text-xs font-black" style={{ color: '#6B7280' }}>
                              🤝 Draw
                            </span>
                          )}
                        </div>
                        <Link href="/standings" className="text-xs font-bold" style={{ color: '#9CA3AF' }}>
                          View Table →
                        </Link>
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