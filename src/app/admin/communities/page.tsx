import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminCommunitiesPage() {
  const supabase = await createClient()

  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .order('name')

  // Get stats for each community
  const communitiesWithStats = await Promise.all(
    (communities ?? []).map(async (c) => {
      const [
        { count: teamCount },
        { count: playerCount },
        { count: matchCount },
        { count: adminCount },
      ] = await Promise.all([
        supabase.from('teams').select('*', { count: 'exact', head: true }).eq('community_id', c.id),
        supabase.from('players').select('*', { count: 'exact', head: true }).eq('community_id', c.id),
        supabase.from('matches').select('*', { count: 'exact', head: true }).eq('community_id', c.id),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('community_id', c.id).eq('role', 'community_admin'),
      ])
      return { ...c, teamCount, playerCount, matchCount, adminCount }
    })
  )

  const active = communitiesWithStats.filter(c => c.status === 'active')
  const inactive = communitiesWithStats.filter(c => c.status === 'inactive')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>Communities</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
            {active.length} active · {inactive.length} inactive
          </p>
        </div>
        <Link
          href="/admin/communities/new"
          className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          + New Community
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Communities', value: communities?.length ?? 0, color: '#00FF87' },
          { label: 'Total Teams', value: communitiesWithStats.reduce((a, c) => a + (c.teamCount ?? 0), 0), color: '#6B8CFF' },
          { label: 'Total Players', value: communitiesWithStats.reduce((a, c) => a + (c.playerCount ?? 0), 0), color: '#F5A623' },
          { label: 'Total Matches', value: communitiesWithStats.reduce((a, c) => a + (c.matchCount ?? 0), 0), color: '#FF3B3B' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active communities */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Active ({active.length})
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
          {active.map((community) => (
            <div key={community.id} className="px-5 py-4 flex items-center gap-4 transition-all hover:bg-white/5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
              >
                {community.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{community.name}</div>
                <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
                  {community.location}
                </div>
                <div className="flex gap-3 mt-1.5">
                  {[
                    { label: 'Teams', value: community.teamCount ?? 0 },
                    { label: 'Players', value: community.playerCount ?? 0 },
                    { label: 'Matches', value: community.matchCount ?? 0 },
                    { label: 'Admins', value: community.adminCount ?? 0 },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-1">
                      <span className="text-xs font-black" style={{ color: '#00FF87' }}>{stat.value}</span>
                      <span className="text-xs" style={{ color: '#4A5C54' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/community/${community.slug}/admin`}
                  className="text-xs font-black px-3 py-1.5 rounded"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
                >
                  Portal →
                </Link>
                <Link
                  href={`/admin/communities/${community.id}`}
                  className="text-xs font-black px-3 py-1.5 rounded"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive communities */}
      {inactive.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#4A5C54' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>
              Inactive ({inactive.length})
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {inactive.map((community) => (
              <div key={community.id} className="px-5 py-4 flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}>
                  {community.name.charAt(0)}
                </div>
                <div className="flex-1 font-black text-sm" style={{ color: '#4A5C54' }}>{community.name}</div>
                <Link href={`/admin/communities/${community.id}`}
                  className="text-xs font-black px-3 py-1.5 rounded"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}