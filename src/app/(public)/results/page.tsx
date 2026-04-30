import { getResults, getActiveSeason, getLeagues } from '@/lib/queries'
import Link from 'next/link'
import { groupMatchesByDate } from '@/lib/utils'
import { Match } from '@/types/database'

async function loadResultsData() {
  const leagues = await getLeagues()
  if (!leagues || leagues.length === 0) {
    throw new Error('NO_LEAGUES')
  }

  const season = await getActiveSeason(leagues[0].id)
  if (!season) {
    throw new Error('NO_SEASON')
  }

  const results = await getResults(season.id)
  return { results: results || [], league: leagues[0], season }
}

export default async function ResultsPage() {
  let data

  try {
    data = await loadResultsData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Results</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600">No leagues available yet</p>
          </div>
        </main>
      )
    }

    if (message === 'NO_SEASON') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Results</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600">No active season</p>
          </div>
        </main>
      )
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Results</h1>
        <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
          <p className="text-red-600 text-lg">Error loading results. Please try again later.</p>
        </div>
      </main>
    )
  }

  const { results, league, season } = data
  const groupedResults = groupMatchesByDate(results)

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Results</span>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Match Results</h1>
        <p className="text-lg text-gray-600">{league.name} • {season.name}</p>
      </div>

      {/* Results Grouped by Date */}
      <div className="space-y-8">
        {groupedResults.length > 0 ? (
          groupedResults.map((group) => (
            <section key={group.date}>
              {/* Date Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">
                {group.date}
              </h2>

              {/* Results for this date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.matches.map((match: Match) => {
                  const homeScore = match.home_score ?? 0
                  const awayScore = match.away_score ?? 0
                  const isHomeWin = homeScore > awayScore
                  const isAwayWin = awayScore > homeScore
                  const isDraw = homeScore === awayScore

                  return (
                    <Link
                      key={match.id}
                      href={`/matches/${match.id}`}
                      className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-102 transition-all border border-green-200"
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        {/* Home Team */}
                        <div className="flex-1">
                          <span
                            className={`font-semibold text-gray-900 block ${
                              isHomeWin ? 'text-green-700 font-bold' : ''
                            }`}
                          >
                            {match.home_team?.name || 'Home Team'}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="text-center px-4">
                          <p className="text-3xl font-bold text-gray-900">
                            {homeScore}
                          </p>
                          <p className="text-sm text-gray-500 font-semibold">-</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {awayScore}
                          </p>
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 text-right">
                          <span
                            className={`font-semibold text-gray-900 block ${
                              isAwayWin ? 'text-green-700 font-bold' : ''
                            }`}
                          >
                            {match.away_team?.name || 'Away Team'}
                          </span>
                        </div>
                      </div>

                      {/* Venue and Result Status */}
                      <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                        {match.venue && (
                          <p className="text-sm text-gray-600">📍 {match.venue}</p>
                        )}
                        <div className="text-sm font-semibold">
                          {isDraw && <span className="text-blue-600">Draw</span>}
                          {isHomeWin && <span className="text-green-600">Home Win</span>}
                          {isAwayWin && <span className="text-green-600">Away Win</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="bg-white text-gray-900 rounded-lg shadow p-12 text-center">
            <p className="text-lg text-gray-600 mb-2">No results yet</p>
            <p className="text-sm text-gray-500">Completed matches will appear here</p>
          </div>
        )}
      </div>
    </main>
  )
}
