import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, community:communities(*)')
    .eq('id', user!.id)
    .single()

  const [
    { count: communityCount },
    { count: teamCount },
    { count: playerCount },
    { count: matchCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from('communities').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  // Recent activity
  const { data: recentMatches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(name),
      away_team:teams!away_team_id(name),
      tournament:tournaments(name, community_id)
    `)
    .eq('status', 'completed')
    .order('updated_at', { ascending: false })
    .limit(5)

  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>
            Super Admin
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
            Platform overview · All communities
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: '#0D3320', border: '1px solid #00FF8720' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#00FF87' }} />
          <span className="text-xs font-black" style={{ color: '#00FF87' }}>Platform Live</span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Communities', value: communityCount ?? 0, icon: '🏟', color: '#00FF87', href: '/admin/communities' },
          { label: 'Teams', value: teamCount ?? 0, icon: '🛡️', color: '#6B8CFF', href: '/admin/communities' },
          { label: 'Players', value: playerCount ?? 0, icon: '👤', color: '#F5A623', href: '/admin/communities' },
          { label: 'Matches', value: matchCount ?? 0, icon: '⚽', color: '#FF3B3B', href: '/admin/communities' },
          { label: 'Users', value: userCount ?? 0, icon: '👥', color: '#8B5CF6', href: '/admin/users' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl p-4 transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Communities grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Active Communities ({communityCount ?? 0})
            </span>
          </div>
          <Link href="/admin/communities"
            className="text-xs font-black px-3 py-1.5 rounded"
            style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
          >
            Manage All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {communities?.map((community) => (
            <div
              key={community.id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
            >
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #1F2B26' }}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                >
                  {community.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs truncate" style={{ color: '#F0F4F2' }}>{community.name}</div>
                  <div className="text-xs truncate" style={{ color: '#4A5C54' }}>{community.location}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#00FF87' }} />
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#1A0A0A', color: '#FF3B3B', fontSize: '10px' }}>
                    🏆 Nawettan
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#0A0A1A', color: '#6B8CFF', fontSize: '10px' }}>
                    🥊 Knockout
                  </span>
                </div>
                <Link
                  href={`/community/${community.slug}/admin`}
                  className="text-xs font-black px-2.5 py-1 rounded transition-all hover:opacity-80"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                >
                  Portal →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent match activity */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Recent Match Activity
            </span>
          </div>
        </div>
        {!recentMatches || recentMatches.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs" style={{ color: '#4A5C54' }}>
            No matches played yet
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {recentMatches.map((match) => (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs"
                  style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '60px', textAlign: 'center' }}>
                  {match.home_score} — {match.away_score}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}