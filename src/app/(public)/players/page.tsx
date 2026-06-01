import Link from 'next/link'
import { getActiveLeagues } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'


const positionConfig: Record<string, { bg: string }> = {
  GK: { bg: '#D97706' },
  DEF: { bg: '#1D4ED8' },
  MID: { bg: '#1A6B3A' },
  FWD: { bg: '#C1272D' },
}

const teamColors = [
  'linear-gradient(135deg, #1A6B3A, #2D8A50)',
  'linear-gradient(135deg, #C1272D, #e03040)',
  'linear-gradient(135deg, #0F4A28, #1A6B3A)',
  'linear-gradient(135deg, #0057A8, #1D4ED8)',
  'linear-gradient(135deg, #D97706, #F59E0B)',
  'linear-gradient(135deg, #7C3AED, #8B5CF6)',
]

export default async function PlayersPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>
  }

  const supabase = await createClient()

  // Get all teams
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', firstLeague.id)
    .eq('status', 'active')
    .order('name')

  // Get all players with team info
  const { data: players } = await supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, slug)')
    .eq('status', 'active')
    .order('position')

  // Group players by team
  const playersByTeam: Record<string, typeof players> = {}
  teams?.forEach((team) => {
    playersByTeam[team.id] = players?.filter((p) => (p.team as any)?.id === team.id) || []
  })

  const totalPlayers = players?.length ?? 0

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Players
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} — All Squads
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
        >
          👤 {totalPlayers} Players
        </div>
      </div>

      {!teams || teams.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>No teams found.</div>
      ) : (
        <div className="space-y-6">
          {teams.map((team, teamIndex) => {
            const squad = playersByTeam[team.id] || []
            const positionOrder = ['GK', 'DEF', 'MID', 'FWD']
            const sortedSquad = [...squad].sort((a, b) =>
              positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
            )

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: '1px solid #E5E7EB' }}
              >
                {/* Team header */}
                <div
                  className="px-6 py-4 flex items-center justify-between relative overflow-hidden"
                  style={{ background: teamColors[teamIndex % teamColors.length] }}
                >
                  {/* Background pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-xl shadow-lg"
                      style={{ background: 'rgba(0,0,0,0.2)' }}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg">{team.name}</div>
                      {team.home_ground && (
                        <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          🏟 {team.home_ground}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="relative z-10 px-3 py-1.5 rounded-full text-xs font-black"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'white' }}
                  >
                    {squad.length} Players
                  </div>
                </div>

                {/* Squad list */}
                {sortedSquad.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: '#6B7280' }}>
                    No players registered yet
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                    {sortedSquad.map((player) => {
                      const config = positionConfig[player.position] ?? { bg: '#6B7280' }
                      return (
                        <Link
                            key={player.id}
                            href={`/players/${player.id}`}
                            className="px-6 py-3.5 flex items-center gap-4 transition-all hover:bg-gray-50"
                          >
                          {/* Jersey number */}
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                            style={{ backgroundColor: config.bg }}
                          >
                            {player.jersey_number ?? '—'}
                          </div>

                          {/* Name */}
                          <div className="flex-1">
                            <div className="font-bold text-sm" style={{ color: '#111827' }}>
                              {player.name}
                            </div>
                            {player.nationality && (
                              <div className="text-xs" style={{ color: '#6B7280' }}>
                                🇬🇲 {player.nationality}
                              </div>
                            )}
                          </div>

                          {/* Position badge */}
                          <span
                            className="text-xs font-black px-3 py-1 rounded-full text-white flex-shrink-0"
                            style={{ backgroundColor: config.bg }}
                          >
                            {player.position}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}