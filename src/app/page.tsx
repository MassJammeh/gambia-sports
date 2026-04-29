import { getLeagues, getActiveSeason, getResults, getFixtures, getStandings, getTeams } from '@/lib/queries'
import Link from 'next/link'
import { Team, Match } from '@/types/database'

interface StandingsData {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

async function loadPageData() {
  const leagues = await getLeagues()
  if (!leagues || leagues.length === 0) {
    throw new Error('NO_LEAGUES')
  }

  const league = leagues[0]
  const season = await getActiveSeason(league.id)
  if (!season) {
    throw new Error('NO_SEASON')
  }

  const [results, fixtures, matches, teams] = await Promise.all([
    getResults(season.id).catch(() => []),
    getFixtures(season.id).catch(() => []),
    getStandings(season.id).catch(() => []),
    getTeams(league.id).catch(() => [])
  ])

  return { league, season, results, fixtures, matches, teams }
}

function calculateStandings(matches: any[], teams: any[]): StandingsData[] {
  const standingsMap = new Map<string, any>()

  teams.forEach((team: any) => {
    standingsMap.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    })
  })

  matches.forEach((match: any) => {
    const homeTeamId = match.home_team_id
    const awayTeamId = match.away_team_id

    const homeStats = standingsMap.get(homeTeamId)
    const awayStats = standingsMap.get(awayTeamId)

    if (homeStats) {
      homeStats.played++
      homeStats.goalsFor += match.home_score || 0
      homeStats.goalsAgainst += match.away_score || 0

      if (match.home_score > match.away_score) homeStats.won++
      else if (match.home_score === match.away_score) homeStats.drawn++
      else homeStats.lost++
    }

    if (awayStats) {
      awayStats.played++
      awayStats.goalsFor += match.away_score || 0
      awayStats.goalsAgainst += match.home_score || 0

      if (match.away_score > match.home_score) awayStats.won++
      else if (match.away_score === match.home_score) awayStats.drawn++
      else awayStats.lost++
    }
  })

  return Array.from(standingsMap.values())
    .map((row: any) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.won * 3 + row.drawn,
    }))
    .sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points
      return b.goalDifference - a.goalDifference
    })
    .map((row: any, index: number) => ({ ...row, position: index + 1 }))
}

export default async function HomePage() {
  let data

  try {
    data = await loadPageData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-12 mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Gambia Sports</h1>
            <p className="text-xl text-blue-100">No leagues set up yet</p>
          </div>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Get started by creating a league and adding teams in the admin panel.
            </p>
            <Link
              href="/admin/login"
              className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </main>
      )
    }

    if (message === 'NO_SEASON') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-12 mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Gambia Sports</h1>
            <p className="text-xl text-blue-100">No active season</p>
          </div>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              The league needs an active season to display matches.
            </p>
            <Link
              href="/admin/login"
              className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </main>
      )
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-12 mb-8 text-center">
          <h1 className="text-4xl font-bold">Gambia Sports Platform</h1>
        </div>
        <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
          <p className="text-red-600 text-lg mb-6">Error loading data. Please try again later.</p>
          <Link
            href="/"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition-colors"
          >
            Refresh Page
          </Link>
        </div>
      </main>
    )
  }

  const { league, season, results, fixtures, matches, teams } = data
  const standings = calculateStandings(matches || [], teams || [])
  const topTeams = standings.slice(0, 5)

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-8 md:p-12 mb-8 text-center shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{league.name}</h1>
        <p className="text-lg md:text-xl text-blue-100">{season.name}</p>
      </div>

      {/* Results and Fixtures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Latest Results */}
        <section className="bg-white text-gray-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Latest Results</h2>
            <Link href="/results" className="text-blue-700 font-semibold hover:text-blue-800 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {results && results.length > 0 ? (
              results.slice(0, 5).map((match: Match) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex-1 text-right pr-4">
                    <p className="font-semibold text-gray-900">{match.home_team?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(match.scheduled_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {match.home_score} - {match.away_score}
                    </p>
                  </div>
                  <div className="flex-1 text-left pl-4">
                    <p className="font-semibold text-gray-900">{match.away_team?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No results yet</p>
            )}
          </div>
        </section>

        {/* Upcoming Fixtures */}
        <section className="bg-white text-gray-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Next Fixtures</h2>
            <Link href="/fixtures" className="text-blue-700 font-semibold hover:text-blue-800 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {fixtures && fixtures.length > 0 ? (
              fixtures.slice(0, 5).map((match: Match) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex-1 text-right pr-4">
                    <p className="font-semibold text-gray-900">{match.home_team?.name || 'N/A'}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="text-xs text-gray-600 font-medium">
                      {new Date(match.scheduled_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(match.scheduled_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex-1 text-left pl-4">
                    <p className="font-semibold text-gray-900">{match.away_team?.name || 'N/A'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No upcoming fixtures</p>
            )}
          </div>
        </section>
      </div>

      {/* Mini Standings */}
      <section className="bg-white text-gray-900 rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Top Teams</h2>
          <Link href="/standings" className="text-blue-700 font-semibold hover:text-blue-800 transition-colors">
            View full standings →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-900">Pos</th>
                <th className="text-left p-3 font-semibold text-gray-900">Team</th>
                <th className="text-center p-3 font-semibold text-gray-900">P</th>
                <th className="text-center p-3 font-semibold text-gray-900">W</th>
                <th className="text-center p-3 font-semibold text-gray-900">D</th>
                <th className="text-center p-3 font-semibold text-gray-900">L</th>
                <th className="text-center p-3 font-semibold text-gray-900">GD</th>
                <th className="text-center p-3 font-semibold text-gray-900">Pts</th>
              </tr>
            </thead>
            <tbody>
              {topTeams.length > 0 ? (
                topTeams.map((row: StandingsData) => (
                  <tr
                    key={row.team.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      row.position === 1
                        ? 'border-l-4 border-l-green-500'
                        : row.position === 2
                          ? 'border-l-4 border-l-green-500'
                          : row.position === 3
                            ? 'border-l-4 border-l-green-500'
                            : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-gray-900">{row.position}</td>
                    <td className="p-3">
                      <Link
                        href={`/teams/${row.team.slug}`}
                        className="font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                      >
                        {row.team.name}
                      </Link>
                    </td>
                    <td className="p-3 text-center text-gray-700">{row.played}</td>
                    <td className="p-3 text-center text-gray-700">{row.won}</td>
                    <td className="p-3 text-center text-gray-700">{row.drawn}</td>
                    <td className="p-3 text-center text-gray-700">{row.lost}</td>
                    <td className="p-3 text-center text-gray-700">
                      {row.goalDifference > 0 && '+'}
                      {row.goalDifference}
                    </td>
                    <td className="p-3 text-center font-bold text-gray-900">{row.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No standings data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/standings', label: 'Standings', icon: '📊' },
            { href: '/fixtures', label: 'Fixtures', icon: '📅' },
            { href: '/results', label: 'Results', icon: '✅' },
            { href: '/teams', label: 'Teams', icon: '⚽' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white text-gray-900 rounded-lg shadow p-4 text-center hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
            >
              <div className="text-3xl mb-2">{link.icon}</div>
              <p className="font-semibold text-gray-900">{link.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}