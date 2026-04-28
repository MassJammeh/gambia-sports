import { getResults, getActiveSeason, getLeagues } from '@/lib/queries'

interface Result {
  id: string
  home_team: { name: string }
  away_team: { name: string }
  home_score: number
  away_score: number
  scheduled_at: string
}

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
  return results || []
}

export default async function ResultsPage() {
  let results: Result[]

  try {
    results = await loadResultsData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES' || message === 'NO_SEASON') {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          <p className="text-gray-600">
            {message === 'NO_LEAGUES' ? 'No leagues available yet.' : 'No active season.'}
          </p>
        </main>
      )
    }

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        <p className="text-red-600">Error loading results. Please try again later.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <div className="space-y-3">
        {results.length > 0 ? (
          results.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium w-2/5 text-right">
                  {match.home_team.name}
                </span>
                <span className="text-2xl font-bold mx-4">
                  {match.home_score} - {match.away_score}
                </span>
                <span className="font-medium w-2/5">{match.away_team.name}</span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                {new Date(match.scheduled_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No results yet.</p>
        )}
      </div>
    </main>
  )
}
