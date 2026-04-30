import { getTeamBySlug } from '@/lib/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Player {
  id: string
  name: string
  position: string
  jersey_number: number
  date_of_birth: string
}

interface TeamData {
  id: string
  name: string
  slug: string
  home_ground: string
  founded_year: number
  players: Player[]
}

export default async function TeamPage({
  params,
}: {
  params: { slug: string }
}) {
  let team: TeamData

  try {
    team = await getTeamBySlug(params.slug)

    if (!team) {
      notFound()
    }
  } catch (error) {
    console.error('Error loading team:', error)
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/teams" className="hover:text-blue-700 transition-colors">
            Teams
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{team.name}</span>
        </div>
      </nav>

      {/* Team Header Card */}
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
            <div className="space-y-2 text-gray-600">
              {team.home_ground && (
                <p className="flex items-center gap-2">
                  <span>🏟️</span>
                  <span>{team.home_ground}</span>
                </p>
              )}
              {team.founded_year && (
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Founded in {team.founded_year}</span>
                </p>
              )}
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 rounded-lg p-6 text-center">
            <p className="text-sm font-semibold mb-1">Total Squad Size</p>
            <p className="text-3xl font-bold">{team.players?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Squad Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Squad</h2>

        {team.players && team.players.length > 0 ? (
          <div className="bg-white text-gray-900 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-4 text-center font-semibold">#</th>
                    <th className="p-4 text-left font-semibold">Player Name</th>
                    <th className="p-4 text-left font-semibold">Position</th>
                    <th className="p-4 text-left font-semibold">Date of Birth</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player: Player) => (
                    <tr
                      key={player.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-center font-bold text-blue-700">
                        #{player.jersey_number || '-'}
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        <Link
                          href={`/players/${player.id}`}
                          className="hover:text-blue-700 transition-colors"
                        >
                          {player.name}
                        </Link>
                      </td>
                      <td className="p-4 text-gray-700">{player.position || '-'}</td>
                      <td className="p-4 text-gray-700">
                        {player.date_of_birth
                          ? new Date(player.date_of_birth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/players/${player.id}`}
                          className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white text-gray-900 rounded-lg shadow p-12 text-center">
            <p className="text-lg text-gray-600 mb-2">No players registered yet</p>
            <p className="text-sm text-gray-500">
              Players will appear here as they join the squad
            </p>
          </div>
        )}
      </section>

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/teams"
          className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          ← Back to Teams
        </Link>
      </div>
    </main>
  )
}
