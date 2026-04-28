import { getTeams, getLeagues, getActiveSeason } from '@/lib/queries'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  slug: string
  home_ground: string
  founded_year: number
}

async function loadTeamsData() {
  const leagues = await getLeagues()
  if (!leagues || leagues.length === 0) {
    throw new Error('NO_LEAGUES')
  }

  const league = leagues[0]
  const season = await getActiveSeason(league.id)

  if (!season) {
    throw new Error('NO_SEASON')
  }

  const teams = await getTeams(league.id)
  return teams || []
}

export default async function TeamsPage() {
  let teams: Team[]

  try {
    teams = await loadTeamsData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES' || message === 'NO_SEASON') {
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Teams</h1>
          <p className="text-gray-600">
            {message === 'NO_LEAGUES' ? 'No leagues available yet.' : 'No active season.'}
          </p>
        </main>
      )
    }

    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Teams</h1>
        <p className="text-red-600">Error loading teams. Please try again later.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.length > 0 ? (
          teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.slug}`}>
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer">
                <h2 className="font-bold text-lg mb-1">{team.name}</h2>
                {team.home_ground && (
                  <p className="text-sm text-gray-600">Home: {team.home_ground}</p>
                )}
                {team.founded_year && (
                  <p className="text-sm text-gray-500">Founded: {team.founded_year}</p>
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
}
