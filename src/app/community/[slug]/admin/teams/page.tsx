import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityAdminTeamsPage({
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
    .order('name')

  const active = teams?.filter(t => t.status === 'active') ?? []
  const inactive = teams?.filter(t => t.status === 'inactive') ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Teams</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name} · {active.length} active clubs</p>
        </div>
        <Link
          href={`/community/${slug}/admin/teams/new`}
          className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          + New Team
        </Link>
      </div>

      {/* Active */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Active ({active.length})
          </span>
        </div>
        {active.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs" style={{ color: '#4A5C54' }}>No teams yet</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {active.map((team) => (
              <div key={team.id} className="px-5 py-4 flex items-center gap-4 transition-all hover:bg-white/5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                >
                  {team.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{team.name}</div>
                  <div className="flex gap-3 mt-0.5">
                    {team.home_ground && <span className="text-xs" style={{ color: '#4A5C54' }}>🏟 {team.home_ground}</span>}
                    {team.colours && <span className="text-xs" style={{ color: '#4A5C54' }}>🎨 {team.colours}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/community/${slug}/admin/teams/${team.id}`}
                    className="text-xs font-black px-3 py-1.5 rounded transition-all hover:opacity-80"
                    style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive */}
      {inactive.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#4A5C54' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4A5C54' }}>
              Inactive ({inactive.length})
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {inactive.map((team) => (
              <div key={team.id} className="px-5 py-4 flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}>
                  {team.name.charAt(0)}
                </div>
                <div className="flex-1 font-black text-sm" style={{ color: '#4A5C54' }}>{team.name}</div>
                <Link href={`/community/${slug}/admin/teams/${team.id}`}
                  className="text-xs font-black px-3 py-1.5 rounded"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}>
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