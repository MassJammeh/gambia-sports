import { getResults, getActiveSeason, getLeagues } from '@/lib/queries'

export default async function ResultsPage() {
  try {
    const leagues = await getLeagues()
    if (!leagues || leagues.length === 0) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          <p className="text-gray-600">No leagues available yet.</p>
        </main>
      )
    }

    const season = await getActiveSeason(leagues[0].id)
    if (!season) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          <p className="text-gray-600">No active season.</p>
        </main>
      )
    }

    const results = await getResults(season.id)

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        <div className="space-y-3">
          {results && results.length > 0 ? (
            results.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium w-2/5 text-right">
                    {match.home_team.name}
                  </span>
                  <span className="text-2xl font-bold mx-4">
                    {match.home_score} - {match.away_score}
                  </span>
                  <span className="font-medium w-2/5">
                    {match.away_team.name}
                  </span>
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
  } catch (error) {
    console.error('Error loading results:', error)
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        <p className="text-red-600">
          Error loading results. Please try again later.
        </p>
      </main>
    )
  }
}
