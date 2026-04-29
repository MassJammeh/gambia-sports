import { getPlayerById } from '@/lib/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  let player

  try {
    player = await getPlayerById(params.id)
  } catch (error) {
    notFound()
  }

  if (!player) {
    notFound()
  }

  const dateOfBirth = player.date_of_birth
    ? new Date(player.date_of_birth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not available'

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
          <Link
            href={`/teams/${player.team?.slug}`}
            className="hover:text-blue-700 transition-colors"
          >
            {player.team?.name || 'Team'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{player.name}</span>
        </div>
      </nav>

      {/* Player Header Card */}
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Player Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
            <div className="flex gap-4 mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {player.position}
              </span>
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold">
                #{player.jersey_number}
              </span>
            </div>
          </div>

          {/* Team Link */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-2">Plays for</p>
            <Link
              href={`/teams/${player.team?.slug}`}
              className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              {player.team?.name || 'Unknown Team'}
            </Link>
            {player.team?.home_ground && (
              <p className="text-gray-600 mt-2">🏟️ {player.team.home_ground}</p>
            )}
          </div>
        </div>
      </div>

      {/* Player Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white text-gray-900 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Jersey Number</p>
          <p className="text-3xl font-bold text-blue-700">#{player.jersey_number}</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Position</p>
          <p className="text-3xl font-bold text-gray-900">{player.position}</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Date of Birth</p>
          <p className="text-lg font-semibold text-gray-900">{dateOfBirth}</p>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link
          href={`/teams/${player.team?.slug}`}
          className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          ← Back to {player.team?.name || 'Team'}
        </Link>
      </div>
    </main>
  )
}
