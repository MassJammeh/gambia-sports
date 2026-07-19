import { getActiveLeagues } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const positionConfig: Record<string, { bg: string; color: string; label: string }> = {
  GK: { bg: '#D97706', color: '#FEF3C7', label: 'Goalkeeper' },
  DEF: { bg: '#1D4ED8', color: '#EFF6FF', label: 'Defender' },
  MID: { bg: '#1A6B3A', color: '#E8F5EE', label: 'Midfielder' },
  FWD: { bg: '#C1272D', color: '#FEE2E2', label: 'Forward' },
}

const teamGradients = [
  'linear-gradient(135deg, #1A6B3A, #2D8A50)',
  'linear-gradient(135deg, #C1272D, #e03040)',
  'linear-gradient(135deg, #0F4A28, #1A6B3A)',
  'linear-gradient(135deg, #0057A8, #1D4ED8)',
  'linear-gradient(135deg, #D97706, #F59E0B)',
  'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  'linear-gradient(135deg, #0E7490, #0891B2)',
  'linear-gradient(135deg, #BE185D, #DB2777)',
]

export default async function PlayersPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>
  }

  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', firstLeague.id)
    .eq('status', 'active')
    .order('name')

  const { data: players } = await supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, slug)')
    .eq('status', 'active')
    .order('position')

  const playersByTeam: Record<string, typeof players> = {}
  teams?.forEach((team) => {
    playersByTeam[team.id] = players?.filter((p) => (p.team as any)?.id === team.id) || []
  })

  const totalPlayers = players?.length ?? 0
  const positionOrder = ['GK', 'DEF', 'MID', 'FWD']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Players</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} · All Registered Squads
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          👤 {totalPlayers} Players
        </div>
      </div>

      {/* Position key */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(positionConfig).map(([pos, config]) => (
          <div
            key={pos}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ backgroundColor: config.color, color: config.bg }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.bg }} />
            {pos} — {config.label}
          </div>
        ))}
      </div>

      {!teams || teams.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">👤</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No players registered</div>
        </div>
      ) : (
        <div className="space-y-6">
          {teams.map((team, teamIndex) => {
            const squad = playersByTeam[team.id] || []
            const sortedSquad = [...squad].sort(
              (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
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
                  style={{ background: teamGradients[teamIndex % teamGradients.length] }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-white flex items-center justify-center text-white font-black text-xl shadow-lg"
                      style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                    >
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg">{team.name}</div>
                      {team.home_ground && (
                        <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          🏟 {team.home_ground}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-black"
                      style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'white' }}
                    >
                      {squad.length} Players
                    </div>
                    <Link
                      href={`/teams/${team.slug}`}
                      className="px-3 py-1.5 rounded-full text-xs font-black transition-all hover:opacity-90"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    >
                      Team Page →
                    </Link>
                  </div>
                </div>

                {/* Squad */}
                {sortedSquad.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: '#6B7280' }}>
                    No players registered yet
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                    {sortedSquad.map((player) => {
                      const config = positionConfig[player.position] ?? { bg: '#6B7280', color: '#F3F4F6', label: player.position }
                      return (
                        <Link
                          key={player.id}
                          href={`/players/${player.id}`}
                          className="px-6 py-3.5 flex items-center gap-4 transition-all hover:bg-gray-50 group"
                        >
                          {/* Jersey */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: config.bg }}
                          >
                            {player.jersey_number ?? '—'}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-sm group-hover:text-green-700 transition-colors" style={{ color: '#111827' }}>
                              {player.name}
                            </div>
                            {player.nationality && (
                              <div className="text-xs" style={{ color: '#6B7280' }}>
                                🇬🇲 {player.nationality}
                              </div>
                            )}
                          </div>

                          {/* Position */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className="text-xs font-black px-3 py-1 rounded-full text-white"
                              style={{ backgroundColor: config.bg }}
                            >
                              {player.position}
                            </span>
                            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-all" style={{ color: '#1A6B3A' }}>
                              →
                            </span>
                          </div>
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