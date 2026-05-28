import { getActiveLeagues, getCurrentSeason, getFixtures } from '@/lib/queries'

export default async function FixturesPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20 text-gray-500">No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return <div className="text-center py-20 text-gray-500">No active season found.</div>
  }

  const { data: fixtures } = await getFixtures(season.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Fixtures</h1>
        <p className="text-gray-500 text-sm mt-1">
          {firstLeague.name} — {season.name}
        </p>
      </div>

      {!fixtures || fixtures.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No upcoming fixtures.</div>
      ) : (
        <div className="space-y-3">
          {fixtures.map((match) => (
            <div
              key={match.id}
              className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex-1 text-right font-semibold text-gray-800">
                {(match.home_team as any)?.name}
              </div>
              <div className="mx-6 text-center">
                <div className="text-xs text-gray-400 mb-1">
                  {match.scheduled_at
                    ? new Date(match.scheduled_at).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'TBD'}
                </div>
                <div className="bg-gray-100 text-gray-600 text-sm font-bold px-4 py-1 rounded-full">
                  vs
                </div>
                {match.venue && (
                  <div className="text-xs text-gray-400 mt-1">{match.venue}</div>
                )}
              </div>
              <div className="flex-1 text-left font-semibold text-gray-800">
                {(match.away_team as any)?.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}