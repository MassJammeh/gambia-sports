import { getActiveLeagues, getCurrentSeason, getMatchesBySeason } from '@/lib/queries'
import { calculateStandings } from '@/lib/standings'
import Link from 'next/link'

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
  const promotionZone = 2
  const relegationZone = 2

  function getZoneBorder(index: number) {
    if (index < promotionZone) return '#16A34A'
    if (index >= total - relegationZone) return '#C1272D'
    return 'transparent'
  }

  function getZoneBg(index: number) {
    if (index < promotionZone) return '#F0FDF4'
    if (index >= total - relegationZone) return '#FFF5F5'
    return index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Standings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} · {season.name}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#5BC88A' }} />
          Live Table
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">📊</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No matches played yet</div>
          <div className="text-sm mt-1" style={{ color: '#6B7280' }}>Standings will appear once matches are completed</div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-2xl overflow-hidden shadow-md" style={{ border: '1px solid #E5E7EB' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}>
                    <th className="px-4 py-4 text-left text-white font-black text-xs uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-4 text-left text-white font-black text-xs uppercase tracking-wider">Club</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider">MP</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden sm:table-cell">W</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden sm:table-cell">D</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden sm:table-cell">L</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden md:table-cell">GF</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden md:table-cell">GA</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider hidden sm:table-cell">GD</th>
                    <th className="px-4 py-4 text-center text-white font-black text-xs uppercase tracking-wider">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr
                      key={row.team_id}
                      className="transition-all hover:brightness-95"
                      style={{
                        backgroundColor: getZoneBg(index),
                        borderLeft: `4px solid ${getZoneBorder(index)}`,
                      }}
                    >
                      {/* Position */}
                      <td className="px-4 py-4">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                          style={{
                            backgroundColor: index < promotionZone
                              ? '#16A34A'
                              : index >= total - relegationZone
                                ? '#C1272D'
                                : '#E5E7EB',
                            color: index < promotionZone || index >= total - relegationZone
                              ? 'white'
                              : '#6B7280',
                          }}
                        >
                          {index + 1}
                        </div>
                      </td>

                      {/* Club */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                          >
                            {row.team_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-sm" style={{ color: '#111827' }}>
                              {row.team_name}
                            </div>
                            {index < promotionZone && (
                              <div className="text-xs font-bold" style={{ color: '#16A34A' }}>Promotion Zone</div>
                            )}
                            {index >= total - relegationZone && (
                              <div className="text-xs font-bold" style={{ color: '#C1272D' }}>Relegation Zone</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center font-bold text-sm" style={{ color: '#6B7280' }}>{row.played}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden sm:table-cell" style={{ color: '#16A34A' }}>{row.won}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden sm:table-cell" style={{ color: '#6B7280' }}>{row.drawn}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden sm:table-cell" style={{ color: '#C1272D' }}>{row.lost}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden md:table-cell" style={{ color: '#1F2937' }}>{row.goals_for}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden md:table-cell" style={{ color: '#1F2937' }}>{row.goals_against}</td>
                      <td className="px-4 py-4 text-center font-bold text-sm hidden sm:table-cell"
                        style={{ color: row.goal_difference > 0 ? '#16A34A' : row.goal_difference < 0 ? '#C1272D' : '#6B7280' }}>
                        {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto shadow-md"
                          style={{ backgroundColor: '#1A6B3A' }}
                        >
                          {row.points}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend + quick links */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-xs font-bold" style={{ color: '#6B7280' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#16A34A' }} />
                Promotion Zone (Top {promotionZone})
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C1272D' }} />
                Relegation Zone (Bottom {relegationZone})
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/fixtures"
                className="px-4 py-2 rounded-xl text-xs font-black transition-all hover:opacity-90"
                style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
              >
                📅 Fixtures
              </Link>
              <Link href="/results"
                className="px-4 py-2 rounded-xl text-xs font-black transition-all hover:opacity-90"
                style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}
              >
                ✅ Results
              </Link>
            </div>
          </div>

          {/* Season info */}
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <div className="text-2xl">ℹ️</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>
              <span className="font-black" style={{ color: '#111827' }}>{season.name}</span> ·
              Season runs from {new Date(season.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} to {new Date(season.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
              Top {promotionZone} teams promoted · Bottom {relegationZone} teams relegated.
            </div>
          </div>
        </>
      )}
    </div>
  )
}