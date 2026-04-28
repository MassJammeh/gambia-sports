import { getTeamBySlug } from '@/lib/queries'

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
      return (
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <p className="text-gray-600">The team you're looking for doesn't exist.</p>
        </main>
      )
    }
  } catch (error) {
    console.error('Error loading team:', error)
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">Error loading team. Please try again later.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
        {team.home_ground && (
          <p className="text-gray-600 mb-2">Home: {team.home_ground}</p>
        )}
        {team.founded_year && (
          <p className="text-gray-600">Founded: {team.founded_year}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Squad</h2>
      {team.players && team.players.length > 0 ? (
        <div className="space-y-2">
          {team.players.map((player: Player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg p-4 flex items-center gap-4 shadow hover:shadow-md"
            >
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                {player.jersey_number ?? '-'}
              </span>
              <div className="flex-1">
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-500">
                  {player.position || 'Position TBA'}
                </p>
              </div>
              {player.date_of_birth && (
                <p className="text-sm text-gray-400">
                  DOB: {new Date(player.date_of_birth).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No players registered yet.</p>
      )}
    </main>
  )
}
