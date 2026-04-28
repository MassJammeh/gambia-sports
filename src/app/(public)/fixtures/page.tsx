import { getFixtures, getActiveSeason, getLeagues } from '@/lib/queries'

interface Fixture {
  id: string
  home_team: { name: string }
  away_team: { name: string }
  scheduled_at: string
  venue: string
}

async function loadFixturesData() {
  const leagues = await getLeagues()
  if (!leagues || leagues.length === 0) {
    throw new Error('NO_LEAGUES')
  }

  const season = await getActiveSeason(leagues[0].id)
  if (!season) {
    throw new Error('NO_SEASON')
  }

  const fixtures = await getFixtures(season.id)
  return fixtures || []
}

export default async function FixturesPage() {
  let fixtures: Fixture[]

  try {
    fixtures = await loadFixturesData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES' || message === 'NO_SEASON') {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upcoming Fixtures</h1>
          <p className="text-gray-600">
            {message === 'NO_LEAGUES' ? 'No leagues available yet.' : 'No active season.'}
          </p>
        </main>
      )
    }

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Fixtures</h1>
        <p className="text-red-600">Error loading fixtures. Please try again later.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Fixtures</h1>
      <div className="space-y-3">
        {fixtures.length > 0 ? (
          fixtures.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <span className="font-medium w-2/5 text-right">
                {match.home_team.name}
              </span>
              <div className="text-center text-sm text-gray-500 mx-4 w-1/5">
                <div>{new Date(match.scheduled_at).toLocaleDateString()}</div>
                <div>
                  {new Date(match.scheduled_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-xs mt-1">{match.venue || 'TBA'}</div>
              </div>
              <span className="font-medium w-2/5">{match.away_team.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No upcoming fixtures.</p>
        )}
      </div>
    </main>
  )
}
