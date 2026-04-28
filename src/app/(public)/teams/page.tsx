import { getTeams, getLeagues, getActiveSeason } from '@/lib/queries'
import Link from 'next/link'

export default async function TeamsPage() {
  try {
    const leagues = await getLeagues()
    if (!leagues || leagues.length === 0) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Teams</h1>
          <p className="text-gray-600">No leagues available yet.</p>
        </main>
      )
    }

    const league = leagues[0]
    const season = await getActiveSeason(league.id)
    
    if (!season) {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Teams</h1>
          <p className="text-gray-600">No active season.</p>
        </main>
      )
    }

    const teams = await getTeams(league.id)

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Teams in {league.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams && teams.length > 0 ? (
            teams.map((team) => (
              <Link key={team.id} href={`/teams/${team.slug}`}>
                <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer">
                  <h2 className="font-bold text-lg mb-1">{team.name}</h2>
                  {team.home_ground && (
                    <p className="text-sm text-gray-600">
                      Home: {team.home_ground}
                    </p>
                  )}
                  {team.founded_year && (
                    <p className="text-sm text-gray-500">
                      Founded: {team.founded_year}
                    </p>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No teams registered yet.</p>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading teams:', error)
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Teams</h1>
        <p className="text-red-600">
          Error loading teams. Please try again later.
        </p>
      </main>
    )
  }
}
