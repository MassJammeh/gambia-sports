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
  const season = await getActiveSeason(league.id).catch(() => null)

  const teams = await getTeams(league.id)
  return { teams: teams || [], league }
}

export default async function TeamsPage() {
  let data

  try {
    data = await loadTeamsData()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'

    if (message === 'NO_LEAGUES') {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Teams</h1>
          <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">No leagues available yet</p>
            <Link href="/" className="text-blue-700 font-semibold hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </main>
      )
    }

    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Teams</h1>
        <div className="bg-white text-gray-900 rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
          <p className="text-red-600 text-lg mb-4">Error loading teams. Please try again later.</p>
          <Link href="/" className="text-blue-700 font-semibold hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const { teams, league } = data

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Teams</span>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Teams in {league.name}</h1>
        <p className="text-lg text-gray-600">Browse all participating teams</p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length > 0 ? (
          teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.slug}`}>
              <div className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-gray-200 h-full flex flex-col">
                <h2 className="font-bold text-xl mb-4 text-gray-900">{team.name}</h2>
                
                <div className="space-y-3 mb-4 flex-1">
                  {team.home_ground && (
                    <div>
                      <p className="text-sm text-gray-500">Home Ground</p>
                      <p className="text-gray-900 font-semibold">🏟️ {team.home_ground}</p>
                    </div>
                  )}
                  
                  {team.founded_year && (
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="text-gray-900 font-semibold">{team.founded_year}</p>
                    </div>
                  )}
                </div>

                <button className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                  View Squad →
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white text-gray-900 rounded-lg shadow p-12 text-center">
              <p className="text-lg text-gray-600">No teams registered yet</p>
              <p className="text-sm text-gray-500 mt-2">Teams will appear here as they join the league</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
