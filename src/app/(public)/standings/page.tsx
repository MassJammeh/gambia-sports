import { getStandings, getActiveSeason, getLeagues } from '@/lib/queries'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  slug: string
  logo_url: string | null
}

interface Match {
  home_team: Team
  away_team: Team
  home_score: number
  away_score: number
}

interface StandingsRow {
  team: Team
  p: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  pts: number
}

function calculateStandings(matches: Match[]): StandingsRow[] {
  const table: Record<string, StandingsRow> = {}

  for (const match of matches) {
    const { home_team, away_team, home_score, away_score } = match

    if (!table[home_team.id])
      table[home_team.id] = {
        team: home_team,
        p: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        pts: 0,
      }
    if (!table[away_team.id])
      table[away_team.id] = {
        team: away_team,
        p: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        pts: 0,
      }

    table[home_team.id].p++
    table[away_team.id].p++
    table[home_team.id].gf += home_score
    table[home_team.id].ga += away_score
    table[away_team.id].gf += away_score
    table[away_team.id].ga += home_score

    if (home_score > away_score) {
      table[home_team.id].w++
      table[home_team.id].pts += 3
      table[away_team.id].l++
    } else if (home_score < away_score) {
      table[away_team.id].w++
      table[away_team.id].pts += 3
      table[home_team.id].l++
    } else {
      table[home_team.id].d++
      table[home_team.id].pts += 1
      table[away_team.id].d++
      table[away_team.id].pts += 1
    }
  }

  return Object.values(table).sort(
    (a, b) =>
      b.pts - a.pts ||
      (b.gf - b.ga) - (a.gf - a.ga) ||
      b.gf - a.gf
  )
}

async function loadStandingsData() {
  const leagues = await getLeagues()
  if (!leagues || leagues.length === 0) {
    throw new Error('NO_LEAGUES')
  }

  const league = leagues[0]
  const season = await getActiveSeason(league.id)
  if (!season) {
    throw new Error('NO_SEASON')
  }

  const matches = await getStandings(season.id)
  const standings = calculateStandings(matches || [])
  return { standings, league, season }
}

export default async function StandingsPage() {
  let data

  try {
    data = await loadStandingsData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">League Standings</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">No leagues available yet</p>
            <Link href="/" className="text-blue-700 font-semibold hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </main>
      )
    }

    if (message === 'NO_SEASON') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">League Standings</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">No active season to display standings</p>
            <Link href="/" className="text-blue-700 font-semibold hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </main>
      )
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">League Standings</h1>
        <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center">
          <p className="text-red-600 text-lg mb-4">Error loading standings. Please try again later.</p>
          <Link href="/" className="text-blue-700 font-semibold hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const { standings, league, season } = data

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Standings</span>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">League Standings</h1>
        <p className="text-lg text-gray-600">{league.name} • {season.name}</p>
      </div>

      {/* Standings Table */}
      <div className="bg-white text-gray-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-4 text-left font-semibold">#</th>
                <th className="p-4 text-left font-semibold">Team</th>
                <th className="p-4 text-center font-semibold">P</th>
                <th className="p-4 text-center font-semibold">W</th>
                <th className="p-4 text-center font-semibold">D</th>
                <th className="p-4 text-center font-semibold">L</th>
                <th className="p-4 text-center font-semibold">GF</th>
                <th className="p-4 text-center font-semibold">GA</th>
                <th className="p-4 text-center font-semibold">GD</th>
                <th className="p-4 text-center font-semibold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings && standings.length > 0 ? (
                standings.map((row, i) => {
                  const position = i + 1
                  const isTopThree = position <= 3
                  const isBottom = position > standings.length - 2
                  const borderClass = isTopThree
                    ? 'border-l-4 border-l-green-500'
                    : isBottom
                      ? 'border-l-4 border-l-red-500'
                      : ''

                  return (
                    <tr
                      key={row.team.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${borderClass}`}
                    >
                      <td className="p-4 font-bold text-gray-900">{position}</td>
                      <td className="p-4">
                        <Link
                          href={`/teams/${row.team.slug}`}
                          className="font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                        >
                          {row.team.name}
                        </Link>
                      </td>
                      <td className="p-4 text-center text-gray-700">{row.p}</td>
                      <td className="p-4 text-center text-gray-700">{row.w}</td>
                      <td className="p-4 text-center text-gray-700">{row.d}</td>
                      <td className="p-4 text-center text-gray-700">{row.l}</td>
                      <td className="p-4 text-center text-gray-700">{row.gf}</td>
                      <td className="p-4 text-center text-gray-700">{row.ga}</td>
                      <td className="p-4 text-center text-gray-700">
                        <span className={row.gf - row.ga > 0 ? 'text-green-600' : row.gf - row.ga < 0 ? 'text-red-600' : ''}>
                          {row.gf - row.ga > 0 && '+'}
                          {row.gf - row.ga}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-gray-900">{row.pts}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    No standings data yet. Complete some matches to see the standings!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      {standings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Promotion places (top 3)</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Relegation places (last 2)</span>
          </div>
        </div>
      )}
    </main>
  )
}