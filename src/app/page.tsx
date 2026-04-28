import { getLeagues, getActiveSeason, getResults, getFixtures } from '@/lib/queries'
import Link from 'next/link'

export default async function HomePage() {
  try {
    const leagues = await getLeagues()

    if (!leagues || leagues.length === 0) {
      return (
        <main className="max-w-4xl mx-auto p-4">
          <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 text-center">
            <h1 className="text-3xl font-bold">Welcome to Gambia Sports</h1>
            <p className="text-blue-200 mt-1">No leagues set up yet</p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">
              Get started by creating a league and adding teams in the admin panel.
            </p>
            <Link
              href="/admin/login"
              className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
            >
              Go to Admin
            </Link>
          </div>
        </main>
      )
    }

    const league = leagues[0]
    const season = await getActiveSeason(league.id)

    if (!season) {
      return (
        <main className="max-w-4xl mx-auto p-4">
          <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 text-center">
            <h1 className="text-3xl font-bold">{league.name}</h1>
            <p className="text-blue-200 mt-1">No active season</p>
          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">
              The league needs an active season to display matches.
            </p>
            <Link
              href="/admin/login"
              className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
            >
              Go to Admin
            </Link>
          </div>
        </main>
      )
    }

    const results = await getResults(season.id)
    const fixtures = await getFixtures(season.id)

    return (
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <p className="text-blue-200 mt-1">{season.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Results */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Latest Results</h2>
              <Link
                href="/results"
                className="text-blue-700 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {results && results.length > 0 ? (
                results.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg shadow p-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm w-2/5 text-right">
                        {match.home_team.name}
                      </span>
                      <span className="text-lg font-bold mx-3">
                        {match.home_score} - {match.away_score}
                      </span>
                      <span className="font-medium text-sm w-2/5">
                        {match.away_team.name}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No results yet</p>
              )}
            </div>
          </section>

          {/* Upcoming Fixtures */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
              <Link
                href="/fixtures"
                className="text-blue-700 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {fixtures && fixtures.length > 0 ? (
                fixtures.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg shadow p-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {match.home_team.name}
                      </span>
                      <div className="text-center text-xs text-gray-500 mx-2">
                        <div>
                          {new Date(match.scheduled_at).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(match.scheduled_at).toLocaleTimeString(
                            [],
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-sm">
                        {match.away_team.name}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No fixtures scheduled</p>
              )}
            </div>
          </section>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Link
            href="/standings"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md"
          >
            <p className="font-bold">Standings</p>
          </Link>
          <Link
            href="/teams"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md"
          >
            <p className="font-bold">Teams</p>
          </Link>
          <Link
            href="/results"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md"
          >
            <p className="font-bold">Results</p>
          </Link>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading home page:', error)
    return (
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold">Gambia Sports Platform</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600 mb-4">
            Error loading data. Please try again later.
          </p>
          <Link
            href="/admin/login"
            className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
          >
            Go to Admin
          </Link>
        </div>
      </main>
    )
  }
}