import { getActiveLeagues } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'

const positionColors: Record<string, string> = {
  GK: '#D97706',
  DEF: '#1D4ED8',
  MID: '#2D8A50',
  FWD: '#C1272D',
}

export default async function PlayersPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20 text-gray-500">No active leagues found.</div>
  }

  const supabase = await createClient()
  const { data: players } = await supabase
    .from('players')
    .select('*, team:teams!team_id(name, slug)')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Players</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {firstLeague.name}
        </p>
      </div>

      {!players || players.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No players found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#1A6B3A' }}>
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">#</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Position</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Team</th>
                <th className="px-4 py-3 text-left text-white font-semibold">Nationality</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}
                >
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>
                    {player.jersey_number ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1F2937' }}>
                    {player.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded text-white"
                      style={{ backgroundColor: positionColors[player.position] ?? '#6B7280' }}
                    >
                      {player.position}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>
                    {(player.team as any)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>
                    {player.nationality ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}