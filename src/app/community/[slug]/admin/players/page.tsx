import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { color: string; bg: string }> = {
  GK: { color: '#F5A623', bg: '#2A1A00' },
  DEF: { color: '#6B8CFF', bg: '#0A0A2A' },
  MID: { color: '#00FF87', bg: '#0D3320' },
  FWD: { color: '#FF3B3B', bg: '#2A0A0A' },
}

export default async function CommunityAdminPlayersPage({
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
    .select('*, team:teams!team_id(id, name)')
    .eq('community_id', community.id)
    .order('name')

  const active = players?.filter(p => p.status === 'active') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Players</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
            {community.name} · {active.length} registered players
          </p>
        </div>
        <Link
          href={`/community/${slug}/admin/players/new`}
          className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          + New Player
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Active Players ({active.length})
          </span>
        </div>
        {active.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs" style={{ color: '#4A5C54' }}>No players yet</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {active.map((player) => {
              const config = positionConfig[player.position] ?? { color: '#4A5C54', bg: '#1A2320' }
              return (
                <div key={player.id} className="px-5 py-3 flex items-center gap-4 transition-all hover:bg-white/5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {player.jersey_number ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs" style={{ color: '#F0F4F2' }}>{player.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
                      {(player.team as any)?.name ?? 'Unassigned'}
                    </div>
                  </div>
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {player.position}
                  </span>
                  <Link
                    href={`/community/${slug}/admin/players/${player.id}`}
                    className="text-xs font-black px-3 py-1.5 rounded flex-shrink-0"
                    style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                  >
                    Edit
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}