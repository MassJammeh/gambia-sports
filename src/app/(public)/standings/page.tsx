import { getActiveLeagues, getCurrentSeason, getMatchesBySeason } from '@/lib/queries'
import { calculateStandings } from '@/lib/standings'

export default async function StandingsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return (
      <div className="text-center py-20 text-gray-500">
        No active leagues found.
      </div>
    )
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return (
      <div className="text-center py-20 text-gray-500">
        No active season found.
      </div>
    )
  }

  const { data: matches } = await getMatchesBySeason(season.id)
  const standings = calculateStandings((matches || []) as any)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Standings</h1>
        <p className="text-gray-500 text-sm mt-1">
          {firstLeague.name} — {season.name}
        </p>
      </div>

      {standings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No matches played yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">D</th>
                <th className="px-4 py-3 text-center">L</th>
                <th className="px-4 py-3 text-center">GF</th>
                <th className="px-4 py-3 text-center">GA</th>
                <th className="px-4 py-3 text-center">GD</th>
                <th className="px-4 py-3 text-center font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr
                  key={row.team_id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {row.team_name}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.played}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.won}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.drawn}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.lost}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.goals_for}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.goals_against}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.goal_difference}</td>
                  <td className="px-4 py-3 text-center font-bold text-green-700">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}