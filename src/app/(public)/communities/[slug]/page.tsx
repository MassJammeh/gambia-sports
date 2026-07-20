import { getCommunityBySlug, getTournamentsByCommunity, getRecentResults, getUpcomingFixtures, getTeamsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [
    { data: tournaments },
    { data: recentResults },
    { data: upcomingFixtures },
    { data: teams },
  ] = await Promise.all([
    getTournamentsByCommunity(community.id),
    getRecentResults(community.id, 5),
    getUpcomingFixtures(community.id, 5),
    getTeamsByCommunity(community.id),
  ])

  const nawettan = tournaments?.find(t => t.type === 'nawettan')
  const knockout = tournaments?.find(t => t.type === 'knockout')

  const statusLabels: Record<string, { label: string; color: string }> = {
    upcoming: { label: 'Upcoming', color: '#F5A623' },
    qualify_round: { label: 'Qualify Round', color: '#8B5CF6' },
    group_stage: { label: 'Group Stage', color: '#6B8CFF' },
    knockout: { label: 'Knockout', color: '#FF3B3B' },
    completed: { label: 'Completed', color: '#4A5C54' },
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>{community.name}</span>
      </div>

      {/* Community Header */}
      <div className="rounded-xl p-6 flex items-center gap-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl flex-shrink-0"
          style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00C96820' }}
        >
          {community.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>{community.name}</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: '#4A5C54' }}>
            {community.location && <span>📍 {community.location}</span>}
            <span>🏟 Mini Stadium</span>
          </div>
        </div>
        <Link href="/" className="text-xs font-bold hover:underline" style={{ color: '#4A5C54' }}>
          ← All Communities
        </Link>
      </div>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { tournament: nawettan, type: 'nawettan', icon: '🏆', label: 'Nawettan', desc: 'Group stage + knockout', color: '#FF3B3B', href: `/communities/${slug}/nawettan` },
          { tournament: knockout, type: 'knockout', icon: '🥊', label: 'Knockout', desc: 'Pure knockout format', color: '#6B8CFF', href: `/communities/${slug}/knockout` },
        ].map((item) => (
          item.tournament ? (
            <Link
              key={item.type}
              href={item.href}
              className="rounded-xl overflow-hidden transition-all hover:scale-[1.01] group"
              style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
            >
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-black text-sm" style={{ color: item.color }}>{item.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: statusLabels[item.tournament.status]?.color ?? '#4A5C54' }}>
                  {statusLabels[item.tournament.status]?.label ?? item.tournament.status}
                </span>
              </div>
              <div className="px-5 py-4">
                <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>{item.tournament.name}</div>
                <div className="text-xs mb-3" style={{ color: '#4A5C54' }}>{item.desc}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tournament.num_groups && (
                      <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: '#1A2320', color: '#8A9E96' }}>
                        {item.tournament.num_groups} Groups
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: '#1A2320', color: '#8A9E96' }}>
                      {item.tournament.season_year}
                    </span>
                  </div>
                  <span className="text-xs font-black opacity-0 group-hover:opacity-100 transition-all" style={{ color: item.color }}>
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={item.type}
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: '#141A17', border: '1px dashed #1F2B26' }}
            >
              <div className="text-3xl mb-2 opacity-20">{item.icon}</div>
              <div className="text-xs font-bold" style={{ color: '#4A5C54' }}>{item.label} — Not created yet</div>
            </div>
          )
        ))}
      </div>

      {/* Results + Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Results */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Recent Results</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {!recentResults || recentResults.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs" style={{ color: '#4A5C54' }}>No results yet</div>
            ) : recentResults.map((match) => {
              const homeWon = match.home_score > match.away_score
              const awayWon = match.away_score > match.home_score
              return (
                <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="flex-1 text-right text-xs font-black truncate" style={{ color: homeWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '64px', textAlign: 'center' }}>
                    {match.home_score} — {match.away_score}
                  </span>
                  <span className="flex-1 text-left text-xs font-black truncate" style={{ color: awayWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Upcoming Fixtures</span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {!upcomingFixtures || upcomingFixtures.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs" style={{ color: '#4A5C54' }}>No upcoming fixtures</div>
            ) : upcomingFixtures.map((match) => (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#0D3320', color: '#00FF87', minWidth: '64px', textAlign: 'center' }}>
                  {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Teams ({teams?.length ?? 0})</span>
          </div>
          <Link href={`/communities/${slug}/teams`} className="text-xs font-bold" style={{ color: '#4A5C54' }}>
            All Teams →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px" style={{ backgroundColor: '#1F2B26' }}>
          {teams?.slice(0, 8).map((team) => (
            <div key={team.id} className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: '#141A17' }}>
              <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                {team.name.charAt(0)}
              </div>
              <span className="text-xs font-bold truncate" style={{ color: '#8A9E96' }}>{team.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { href: `/communities/${slug}/nawettan`, icon: '🏆', label: 'Nawettan', color: '#FF3B3B' },
          { href: `/communities/${slug}/knockout`, icon: '🥊', label: 'Knockout', color: '#6B8CFF' },
          { href: `/communities/${slug}/teams`, icon: '🛡️', label: 'Teams', color: '#00FF87' },
          { href: `/communities/${slug}/players`, icon: '👤', label: 'Players', color: '#F5A623' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="rounded-xl py-4 text-center transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
          >
            <div className="text-2xl mb-1.5">{item.icon}</div>
            <div className="text-xs font-black uppercase tracking-wide" style={{ color: item.color }}>{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}