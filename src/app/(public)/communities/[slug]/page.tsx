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
    getRecentResults(community.id, 4),
    getUpcomingFixtures(community.id, 4),
    getTeamsByCommunity(community.id),
  ])

  const nawettan = tournaments?.find(t => t.type === 'nawettan')
  const knockout = tournaments?.find(t => t.type === 'knockout')

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    upcoming: { label: '⏳ Upcoming', color: '#D97706', bg: '#FEF3C7' },
    qualify_round: { label: '🔑 Qualify Round', color: '#7C3AED', bg: '#F5F3FF' },
    small_cup: { label: '🥈 Small Cup', color: '#0057A8', bg: '#EFF6FF' },
    group_stage: { label: '⚽ Group Stage', color: '#1D4ED8', bg: '#EFF6FF' },
    knockout: { label: '🔥 Knockout', color: '#D97706', bg: '#FEF3C7' },
    completed: { label: '✅ Completed', color: '#6B7280', bg: '#F3F4F6' },
  }

  return (
    <div className="space-y-8">

      {/* Community Hero */}
      <section
        className="relative rounded-2xl overflow-hidden py-12 px-8 text-white"
        style={{ background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 60%, #2D8A50 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-xs font-bold hover:underline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ← All Communities
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-white font-black text-4xl shadow-xl flex-shrink-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              {community.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black">{community.name}</h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {community.location && <span>📍 {community.location}</span>}
                <span>🏟 Mini Stadium</span>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-xs font-black px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(193,39,45,0.8)' }}>
                  🏆 Nawettan
                </span>
                <span className="text-xs font-black px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,87,168,0.8)' }}>
                  🥊 Knockout
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nawettan */}
        {nawettan ? (
          <Link
            href={`/communities/${slug}/nawettan`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            style={{ border: '2px solid #C1272D20' }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: '#FEE2E2' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="font-black text-sm" style={{ color: '#C1272D' }}>Nawettan</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: statusConfig[nawettan.status]?.bg ?? '#F3F4F6',
                  color: statusConfig[nawettan.status]?.color ?? '#6B7280',
                }}
              >
                {statusConfig[nawettan.status]?.label ?? nawettan.status}
              </span>
            </div>
            <div className="p-5">
              <div className="font-black text-lg mb-1" style={{ color: '#111827' }}>{nawettan.name}</div>
              <div className="text-sm mb-4" style={{ color: '#6B7280' }}>
                Group stage + knockout bracket · Like the World Cup
              </div>
              <div className="flex flex-wrap gap-2">
                {nawettan.num_groups && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    👥 {nawettan.num_groups} Groups
                  </span>
                )}
                {nawettan.season_year && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    📅 Season {nawettan.season_year}
                  </span>
                )}
              </div>
              <div className="mt-4 text-xs font-black" style={{ color: '#C1272D' }}>
                View Tournament →
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '2px dashed #E5E7EB' }}>
            <div className="text-4xl mb-3 opacity-30">🏆</div>
            <div className="font-black text-sm" style={{ color: '#9CA3AF' }}>Nawettan — Not created yet</div>
          </div>
        )}

        {/* Knockout */}
        {knockout ? (
          <Link
            href={`/communities/${slug}/knockout`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            style={{ border: '2px solid #0057A820' }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥊</span>
                <span className="font-black text-sm" style={{ color: '#0057A8' }}>Knockout</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: statusConfig[knockout.status]?.bg ?? '#F3F4F6',
                  color: statusConfig[knockout.status]?.color ?? '#6B7280',
                }}
              >
                {statusConfig[knockout.status]?.label ?? knockout.status}
              </span>
            </div>
            <div className="p-5">
              <div className="font-black text-lg mb-1" style={{ color: '#111827' }}>{knockout.name}</div>
              <div className="text-sm mb-4" style={{ color: '#6B7280' }}>
                Pure knockout — lose once and you're out
              </div>
              <div className="flex flex-wrap gap-2">
                {knockout.season_year && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    📅 Season {knockout.season_year}
                  </span>
                )}
              </div>
              <div className="mt-4 text-xs font-black" style={{ color: '#0057A8' }}>
                View Tournament →
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm" style={{ border: '2px dashed #E5E7EB' }}>
            <div className="text-4xl mb-3 opacity-30">🥊</div>
            <div className="font-black text-sm" style={{ color: '#9CA3AF' }}>Knockout — Not created yet</div>
          </div>
        )}
      </div>

      {/* Recent Results + Upcoming Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#C1272D' }} />
              Recent Results
            </h2>
          </div>
          <div className="space-y-2">
            {!recentResults || recentResults.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No results yet
              </div>
            ) : (
              recentResults.map((match) => {
                const homeWon = match.home_score > match.away_score
                const awayWon = match.away_score > match.home_score
                return (
                  <div key={match.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="flex-1 text-right text-sm font-black truncate" style={{ color: homeWon ? '#111827' : '#9CA3AF' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <span className="mx-3 px-3 py-1.5 rounded-lg text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: '#1A6B3A' }}>
                      {match.home_score} — {match.away_score}
                    </span>
                    <span className="flex-1 text-left text-sm font-black truncate" style={{ color: awayWon ? '#111827' : '#9CA3AF' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
              Upcoming Fixtures
            </h2>
          </div>
          <div className="space-y-2">
            {!upcomingFixtures || upcomingFixtures.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No upcoming fixtures
              </div>
            ) : (
              upcomingFixtures.map((match) => (
                <div key={match.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                  <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#111827' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <div className="mx-3 text-center flex-shrink-0 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5EE' }}>
                    <div className="text-xs font-black" style={{ color: '#1A6B3A' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : 'TBD'}
                    </div>
                  </div>
                  <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#111827' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
            Teams ({teams?.length ?? 0})
          </h2>
          <Link
            href={`/communities/${slug}/teams`}
            className="text-xs font-black px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
          >
            All Teams →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {teams?.slice(0, 8).map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
              >
                {team.name.charAt(0)}
              </div>
              <span className="text-xs font-bold truncate" style={{ color: '#111827' }}>
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: `/communities/${slug}/nawettan`, icon: '🏆', label: 'Nawettan', color: '#C1272D', bg: '#FEE2E2' },
          { href: `/communities/${slug}/knockout`, icon: '🥊', label: 'Knockout', color: '#0057A8', bg: '#EFF6FF' },
          { href: `/communities/${slug}/teams`, icon: '🛡️', label: 'Teams', color: '#1A6B3A', bg: '#E8F5EE' },
          { href: `/communities/${slug}/players`, icon: '👤', label: 'Players', color: '#7C3AED', bg: '#F5F3FF' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: item.bg, border: `1px solid ${item.color}20` }}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-xs font-black uppercase tracking-wide" style={{ color: item.color }}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}