import { getCommunityBySlug } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { color: string; bg: string }> = {
  GK: { color: '#F5A623', bg: '#2A1A00' },
  DEF: { color: '#6B8CFF', bg: '#0A0A2A' },
  MID: { color: '#00FF87', bg: '#0D3320' },
  FWD: { color: '#FF3B3B', bg: '#2A0A0A' },
}

export default async function CommunityPlayersPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('community_id', community.id)
    .eq('status', 'active')
    .order('name')

  const { data: players } = await supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, slug)')
    .eq('community_id', community.id)
    .eq('status', 'active')
    .order('position')

  const playersByTeam: Record<string, typeof players> = {}
  teams?.forEach((team) => {
    playersByTeam[team.id] = players?.filter(p => (p.team as any)?.id === team.id) || []
  })

  const positionOrder = ['GK', 'DEF', 'MID', 'FWD']
  const totalPlayers = players?.length ?? 0

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white transition-colors">{community.name}</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>Players</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Players</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name} · All registered squads</p>
        </div>
        <div className="text-xs font-black px-3 py-1.5 rounded" style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
          👤 {totalPlayers} Players
        </div>
      </div>

      {/* Position key */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(positionConfig).map(([pos, config]) => (
          <div key={pos} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black"
            style={{ backgroundColor: config.bg, color: config.color }}>
            {pos}
          </div>
        ))}
      </div>

      {!teams || teams.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">👤</div>
          <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>No players registered yet</div>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => {
            const squad = playersByTeam[team.id] || []
            const sortedSquad = [...squad].sort(
              (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
            )

            return (
              <div key={team.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                {/* Team header */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#1A2320', borderBottom: '1px solid #1F2B26' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center font-black text-sm"
                      style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                      {team.name.charAt(0)}
                    </div>
                    <span className="font-black text-sm" style={{ color: '#F0F4F2' }}>{team.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>
                    {squad.length} players
                  </span>
                </div>

                {sortedSquad.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>
                    No players registered yet
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
                    {sortedSquad.map((player) => {
                      const config = positionConfig[player.position] ?? { color: '#4A5C54', bg: '#1A2320' }
                      return (
                        <div key={player.id} className="px-5 py-3 flex items-center gap-4 transition-all hover:bg-white/5">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center font-black text-xs flex-shrink-0"
                            style={{ backgroundColor: config.bg, color: config.color }}
                          >
                            {player.jersey_number ?? '—'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-xs" style={{ color: '#F0F4F2' }}>{player.name}</div>
                            {player.nationality && (
                              <div className="text-xs" style={{ color: '#4A5C54' }}>🇬🇲 {player.nationality}</div>
                            )}
                          </div>
                          <span
                            className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0"
                            style={{ backgroundColor: config.bg, color: config.color }}
                          >
                            {player.position}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Back */}
      <Link href={`/communities/${slug}`} className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white" style={{ color: '#4A5C54' }}>
        ← Back to {community.name}
      </Link>
    </div>
  )
}