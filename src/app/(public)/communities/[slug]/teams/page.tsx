import { getCommunityBySlug, getTeamsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityTeamsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: teams } = await getTeamsByCommunity(community.id)

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white transition-colors">{community.name}</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>Teams</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Teams</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name} · {teams?.length ?? 0} registered clubs</p>
        </div>
        <div className="text-xs font-black px-3 py-1.5 rounded" style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
          🛡️ {teams?.length ?? 0} Clubs
        </div>
      </div>

      {!teams || teams.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">🛡️</div>
          <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>No teams registered yet</div>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="px-5 py-4 flex items-center gap-4 transition-all hover:bg-white/5"
              style={{ borderBottom: index < teams.length - 1 ? '1px solid #1F2B26' : 'none' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0"
                style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00C96815' }}
              >
                {team.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{team.name}</div>
                <div className="flex flex-wrap gap-3 mt-0.5">
                  {team.home_ground && (
                    <span className="text-xs" style={{ color: '#4A5C54' }}>🏟 {team.home_ground}</span>
                  )}
                  {team.founded_year && (
                    <span className="text-xs" style={{ color: '#4A5C54' }}>📅 Est. {team.founded_year}</span>
                  )}
                  {team.colours && (
                    <span className="text-xs" style={{ color: '#4A5C54' }}>🎨 {team.colours}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back */}
      <Link href={`/communities/${slug}`} className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white" style={{ color: '#4A5C54' }}>
        ← Back to {community.name}
      </Link>
    </div>
  )
}