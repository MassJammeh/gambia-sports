import { getMatchById } from '@/lib/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMatchStatusBadge, formatDateTime } from '@/lib/utils'

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  let match

  try {
    match = await getMatchById(params.id)
  } catch (error) {
    notFound()
  }

  if (!match) {
    notFound()
  }

  const { fullDate, time } = formatDateTime(match.scheduled_at)
  const statusBadge = getMatchStatusBadge(match)
  const isCompleted = match.status === 'completed'

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Match</span>
        </div>
      </nav>

      {/* Status Badge */}
      <div className="flex justify-center mb-6">
        <span
          className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${statusBadge.color}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Main Match Card */}
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 mb-8">
        {/* Match Header */}
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-4">{fullDate}</p>

          {/* Teams and Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 text-right">
              <Link
                href={`/teams/${match.home_team?.slug}`}
                className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-blue-700 transition-colors block mb-2"
              >
                {match.home_team?.name || 'Home Team'}
              </Link>
            </div>

            {/* Score or Time */}
            <div className="flex-none px-4">
              {isCompleted ? (
                <div className="text-center">
                  <p className="text-5xl md:text-6xl font-bold text-gray-900">
                    {match.home_score} - {match.away_score}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Final Score</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-500">vs</p>
                  <p className="text-sm text-gray-500 mt-2">{time}</p>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-left">
              <Link
                href={`/teams/${match.away_team?.slug}`}
                className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-blue-700 transition-colors block mb-2"
              >
                {match.away_team?.name || 'Away Team'}
              </Link>
            </div>
          </div>
        </div>

        {/* Match Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Date</p>
            <p className="text-lg font-semibold text-gray-900">{fullDate}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Kick-off Time</p>
            <p className="text-lg font-semibold text-gray-900">{time}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Venue</p>
            <p className="text-lg font-semibold text-gray-900">
              {match.venue || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Match Result/Status Summary */}
      {isCompleted && (
        <div className="bg-green-50 text-gray-900 rounded-lg border border-green-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Match Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="font-bold text-lg mb-2">
                <Link
                  href={`/teams/${match.home_team?.slug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {match.home_team?.name}
                </Link>
              </p>
              <p className="text-4xl font-bold text-gray-900">{match.home_score}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg mb-2">
                <Link
                  href={`/teams/${match.away_team?.slug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {match.away_team?.name}
                </Link>
              </p>
              <p className="text-4xl font-bold text-gray-900">{match.away_score}</p>
            </div>
          </div>
          {(match.home_score || 0) > (match.away_score || 0) && (
            <p className="text-center mt-6 text-lg font-semibold text-green-700">
              ✓ {match.home_team?.name} won!
            </p>
          )}
          {(match.away_score || 0) > (match.home_score || 0) && (
            <p className="text-center mt-6 text-lg font-semibold text-green-700">
              ✓ {match.away_team?.name} won!
            </p>
          )}
          {match.home_score === match.away_score && (
            <p className="text-center mt-6 text-lg font-semibold text-blue-700">
              ◆ Match was a draw
            </p>
          )}
        </div>
      )}

      {!isCompleted && (
        <div className="bg-blue-50 text-gray-900 rounded-lg border border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Fixture Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Home Team</p>
              <p className="font-bold text-lg text-gray-900">
                <Link
                  href={`/teams/${match.home_team?.slug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {match.home_team?.name}
                </Link>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">vs</p>
              <p className="text-2xl font-bold text-gray-400">vs</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Away Team</p>
              <p className="font-bold text-lg text-gray-900">
                <Link
                  href={`/teams/${match.away_team?.slug}`}
                  className="hover:text-blue-700 transition-colors"
                >
                  {match.away_team?.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back Links */}
      <div className="flex gap-4 justify-center">
        <Link
          href="/matches"
          className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          ← All Matches
        </Link>
        <Link
          href={isCompleted ? '/results' : '/fixtures'}
          className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          {isCompleted ? 'All Results →' : 'All Fixtures →'}
        </Link>
      </div>
    </main>
  )
}
