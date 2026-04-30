import { getFixtures, getActiveSeason, getLeagues } from '@/lib/queries'
import Link from 'next/link'
import { groupMatchesByDate, formatDateTime } from '@/lib/utils'
import { Match } from '@/types/database'

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
  return { fixtures: fixtures || [], league: leagues[0], season }
}

export default async function FixturesPage() {
  let data

  try {
    data = await loadFixturesData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Upcoming Fixtures</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600">No leagues available yet</p>
          </div>
        </main>
      )
    }

    if (message === 'NO_SEASON') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Upcoming Fixtures</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600">No active season</p>
          </div>
        </main>
      )
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Fixtures</h1>
        <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
          <p className="text-red-600 text-lg">Error loading fixtures. Please try again later.</p>
        </div>
      </main>
    )
  }

  const { fixtures, league, season } = data
  const groupedFixtures = groupMatchesByDate(fixtures)

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Fixtures</span>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Fixtures</h1>
        <p className="text-lg text-gray-600">{league.name} • {season.name}</p>
      </div>

      {/* Fixtures Grouped by Date */}
      <div className="space-y-8">
        {groupedFixtures.length > 0 ? (
          groupedFixtures.map((group) => (
            <section key={group.date}>
              {/* Date Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-700">
                {group.date}
              </h2>

              {/* Fixtures for this date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.matches.map((match: Match) => {
                  const { time } = formatDateTime(match.scheduled_at)
                  return (
                    <Link
                      key={match.id}
                      href={`/matches/${match.id}`}
                      className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-102 transition-all border border-gray-200"
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Home Team */}
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 block">
                            {match.home_team?.name || 'Home Team'}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="text-center px-4">
                          <p className="text-lg font-bold text-gray-600">vs</p>
                          <p className="text-sm text-gray-500 font-semibold mt-1">
                            {time}
                          </p>
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 text-right">
                          <span className="font-semibold text-gray-900 block">
                            {match.away_team?.name || 'Away Team'}
                          </span>
                        </div>
                      </div>

                      {/* Venue */}
                      {match.venue && (
                        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                          📍 {match.venue}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="bg-white text-gray-900 rounded-lg shadow p-12 text-center">
            <p className="text-lg text-gray-600 mb-2">No upcoming fixtures</p>
            <p className="text-sm text-gray-500">Check back soon for new fixtures!</p>
          </div>
        )}
      </div>
    </main>
  )
}
