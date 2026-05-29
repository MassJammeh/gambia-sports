import { getActiveLeagues, getCurrentSeason, getMatchesBySeason } from '@/lib/queries'
import { calculateStandings } from '@/lib/standings'

export default async function StandingsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return (
      <div className="text-center py-20" style={{ color: '#6B7280' }}>
        No active leagues found.
      </div>
    )
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return (
      <div className="text-center py-20" style={{ color: '#6B7280' }}>
        No active season found.
      </div>
    )
  }

  const { data: matches } = await getMatchesBySeason(season.id)
  const standings = calculateStandings((matches || []) as any)
  const total = standings.length

  // Zone definitions
  const promotionZone = 2 // top 2 promoted
  const relegationZone = 2 // bottom 2 relegated

  function getZoneStyle(index: number) {
    if (index < promotionZone) return { borderLeft: '4px solid #16A34A', backgroundColor: '#f0fdf4' }
    if (index >= total - relegationZone) return { borderLeft: '4px solid #C1272D', backgroundColor: '#fff5f5' }
    return { borderLeft: '4px solid transparent', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Standings
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} — {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
        >
          ● Live Table
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No matches played yet.
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden shadow-md" style={{ border: '1px solid #E5E7EB' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}>
                  <th className="px-4 py-4 text-left text-white font-bold text-xs uppercase tracking-wider w-8">#</th>
                  <th className="px-4 py-4 text-left text-white font-bold text-xs uppercase tracking-wider">Club</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">MP</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">W</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">D</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">L</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">GF</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">GA</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">GD</th>
                  <th className="px-4 py-4 text-center text-white font-bold text-xs uppercase tracking-wider">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, index) => (
                  <tr
                    key={row.team_id}
                    style={getZoneStyle(index)}
                    className="transition-all hover:brightness-95"
                  >
                    <td className="px-4 py-4">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                        style={{
                          backgroundColor: index < promotionZone ? '#16A34A' : index >= total - relegationZone ? '#C1272D' : '#E5E7EB',
                          color: index < promotionZone || index >= total - relegationZone ? 'white' : '#6B7280',
                        }}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                        >
                          {row.team_name.charAt(0)}
                        </div>
                        <span className="font-bold" style={{ color: '#111827' }}>
                          {row.team_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#6B7280' }}>{row.played}</td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#16A34A' }}>{row.won}</td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#6B7280' }}>{row.drawn}</td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#C1272D' }}>{row.lost}</td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#1F2937' }}>{row.goals_for}</td>
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#1F2937' }}>{row.goals_against}</td>
                    <td className="px-4 py-4 text-center font-bold" style={{ color: row.goal_difference > 0 ? '#16A34A' : row.goal_difference < 0 ? '#C1272D' : '#6B7280' }}>
                      {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black mx-auto"
                        style={{ backgroundColor: '#1A6B3A', color: 'white' }}
                      >
                        {row.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Zone Legend */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold" style={{ color: '#6B7280' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#16A34A' }} />
              Promotion Zone
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C1272D' }} />
              Relegation Zone
            </div>
          </div>
        </>
      )}
    </div>
  )
}