import { getStandings, getActiveSeason, getLeagues } from '@/lib/queries'

interface StandingsRow {
  team: { id: string; name: string; slug: string; logo_url: string | null }
  p: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  pts: number
}

function calculateStandings(matches: any[]): StandingsRow[] {
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

export default async function StandingsPage() {
  try {
    const leagues = await getLeagues()
    if (!leagues || leagues.length === 0) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">League Standings</h1>
          <p className="text-gray-600">No leagues available yet.</p>
        </main>
      )
    }

    const league = leagues[0]
    const season = await getActiveSeason(league.id)
    if (!season) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">League Standings</h1>
          <p className="text-gray-600">No active season.</p>
        </main>
      )
    }

    const matches = await getStandings(season.id)
    const standings = calculateStandings(matches || [])

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">League Standings</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2">P</th>
                <th className="p-2">W</th>
                <th className="p-2">D</th>
                <th className="p-2">L</th>
                <th className="p-2">GD</th>
                <th className="p-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings && standings.length > 0 ? (
                standings.map((row, i) => (
                  <tr
                    key={row.team.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-2 font-bold text-blue-800">{i + 1}</td>
                    <td className="p-2 font-medium">
                      <a
                        href={`/teams/${row.team.slug}`}
                        className="hover:text-blue-700"
                      >
                        {row.team.name}
                      </a>
                    </td>
                    <td className="p-2 text-center">{row.p}</td>
                    <td className="p-2 text-center">{row.w}</td>
                    <td className="p-2 text-center">{row.d}</td>
                    <td className="p-2 text-center">{row.l}</td>
                    <td className="p-2 text-center">{row.gf - row.ga}</td>
                    <td className="p-2 text-center font-bold">{row.pts}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    No completed matches yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading standings:', error)
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">League Standings</h1>
        <p className="text-red-600">Error loading standings. Please try again later.</p>
      </main>
    )
  }
}