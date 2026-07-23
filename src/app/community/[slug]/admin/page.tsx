import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug, getTournamentsByCommunity, getRecentResults, getUpcomingFixtures } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityAdminDashboard({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const [
  { data: tournaments },
  { data: recentResults },
  { data: upcomingFixtures },
  { count: teamCount },
  { count: playerCount },
  { count: matchCount },
  { data: liveMatches },
  { count: scheduledCount },
  { count: tournamentCount },
] = await Promise.all([
  getTournamentsByCommunity(community.id),
  getRecentResults(community.id, 5),
  getUpcomingFixtures(community.id, 5),
  supabase.from('teams').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'active'),
  supabase.from('players').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'active'),
  supabase.from('matches').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'completed'),
  supabase.from('matches').select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)').eq('community_id', community.id).eq('status', 'live'),
  supabase.from('matches').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'scheduled'),
  supabase.from('tournaments').select('*', { count: 'exact', head: true }).eq('community_id', community.id),
])

  const nawettan = tournaments?.find(t => t.type === 'nawettan')
  const knockout = tournaments?.find(t => t.type === 'knockout')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>{community.name}</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Community Admin Dashboard</p>
        </div>
        <Link
          href={`/communities/${slug}`}
          className="text-xs font-bold px-3 py-1.5 rounded transition-all hover:opacity-80"
          style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
        >
          View Public Site →
        </Link>
      </div>

      {/* Live alert */}
      {liveMatches && liveMatches.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #FF3B3B50', backgroundColor: '#1A0A0A' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #FF3B3B30' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>
              {liveMatches.length} Match{liveMatches.length > 1 ? 'es' : ''} Live Now
            </span>
          </div>
          {liveMatches.map((match: any) => (
            <div key={match.id} className="px-5 py-3 flex items-center gap-3">
              <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                {match.home_team?.name}
              </span>
              <Link
                href={`/community/${slug}/admin/matches/${match.id}`}
                className="flex-shrink-0 px-4 py-1.5 rounded font-black text-sm"
                style={{ backgroundColor: '#FF3B3B', color: 'white', minWidth: '80px', textAlign: 'center' }}
              >
                {match.home_score} — {match.away_score}
              </Link>
              <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                {match.away_team?.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Teams', value: teamCount ?? 0, icon: '🛡️', color: '#00FF87', href: `/community/${slug}/admin/teams` },
          { label: 'Players', value: playerCount ?? 0, icon: '👤', color: '#6B8CFF', href: `/community/${slug}/admin/players` },
          { label: 'Matches Played', value: matchCount ?? 0, icon: '⚽', color: '#FF3B3B', href: `/community/${slug}/admin/matches` },
          { label: 'Upcoming', value: upcomingFixtures?.length ?? 0, icon: '📅', color: '#F5A623', href: `/community/${slug}/admin/fixtures/new` },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl p-4 transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#4A5C54' }}>Quick Actions</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: `/community/${slug}/admin/matches`, label: 'Enter Result', icon: '⚽', color: '#FF3B3B' },
            { href: `/community/${slug}/admin/fixtures/new`, label: 'New Fixture', icon: '📅', color: '#00FF87' },
            { href: `/community/${slug}/admin/teams`, label: 'Teams', icon: '🛡️', color: '#6B8CFF' },
            { href: `/community/${slug}/admin/players`, label: 'Players', icon: '👤', color: '#F5A623' },
            { href: `/community/${slug}/admin/tournaments`, label: 'Tournaments', icon: '🏆', color: '#00FF87' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-xl p-4 text-center transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-xs font-black uppercase tracking-wide" style={{ color: action.color }}>{action.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Stats */}
          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#4A5C54' }}>
              Community Overview
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Tournaments', value: tournamentCount ?? 0, color: '#F5A623', icon: '🏆' },
                { label: 'Scheduled', value: scheduledCount ?? 0, color: '#6B8CFF', icon: '📅' },
                { label: 'Teams', value: teamCount ?? 0, color: '#00FF87', icon: '🛡️' },
                { label: 'Players', value: playerCount ?? 0, color: '#FF3B3B', icon: '👤' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#F5A623' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
                Community News & Activity
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
              {/* Live matches */}
              {liveMatches && liveMatches.length > 0 && liveMatches.map((match: any) => (
                <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: '#FF3B3B' }} />
                  <div className="flex-1 text-xs font-bold" style={{ color: '#F0F4F2' }}>
                    🔴 LIVE: {match.home_team?.name} {match.home_score} — {match.away_score} {match.away_team?.name}
                  </div>
                  <span className="text-xs font-black" style={{ color: '#FF3B3B' }}>{match.minute}'</span>
                </div>
              ))}
              {/* Recent results */}
              {recentResults && recentResults.length > 0 ? recentResults.slice(0, 3).map((match) => (
                <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-base flex-shrink-0">⚽</span>
                  <div className="flex-1 text-xs" style={{ color: '#8A9E96' }}>
                    FT: {(match.home_team as any)?.name} {match.home_score} — {match.away_score} {(match.away_team as any)?.name}
                  </div>
                </div>
              )) : (
                <div className="px-5 py-4 text-xs" style={{ color: '#4A5C54' }}>
                  No recent activity. Schedule your first fixture!
                </div>
              )}
              {/* Upcoming */}
              {upcomingFixtures && upcomingFixtures.length > 0 && (
                <div className="px-5 py-3 flex items-center gap-3">
                  <span className="text-base flex-shrink-0">📅</span>
                  <div className="flex-1 text-xs" style={{ color: '#8A9E96' }}>
                    Next match: {(upcomingFixtures[0].home_team as any)?.name} vs {(upcomingFixtures[0].away_team as any)?.name}
                    {upcomingFixtures[0].scheduled_at && ` · ${new Date(upcomingFixtures[0].scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Tournaments status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { tournament: nawettan, icon: '🏆', label: 'Nawettan', color: '#FF3B3B' },
          { tournament: knockout, icon: '🥊', label: 'Knockout', color: '#6B8CFF' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="flex items-center gap-2 mb-3">
              <span>{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: item.color }}>{item.label}</span>
            </div>
            {item.tournament ? (
              <>
                <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>{item.tournament.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded font-black" style={{ backgroundColor: '#1A2320', color: '#00FF87' }}>
                    {item.tournament.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Link
                    href={`/community/${slug}/admin/tournaments`}
                    className="text-xs font-bold"
                    style={{ color: '#4A5C54' }}
                  >
                    Manage →
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-xs" style={{ color: '#4A5C54' }}>Not created yet</div>
            )}
          </div>
        ))}
      </div>

      {/* Results + Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Recent Results</span>
            </div>
            <Link href={`/community/${slug}/admin/matches`} className="text-xs font-bold" style={{ color: '#4A5C54' }}>All →</Link>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {!recentResults || recentResults.length === 0 ? (
              <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No results yet</div>
            ) : recentResults.map((match) => (
              <Link key={match.id} href={`/community/${slug}/admin/matches/${match.id}`}
                className="px-5 py-3 flex items-center gap-3 transition-all hover:bg-white/5">
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '60px', textAlign: 'center' }}>
                  {match.home_score} — {match.away_score}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.away_team as any)?.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>Upcoming Fixtures</span>
            </div>
            <Link href={`/community/${slug}/admin/fixtures/new`} className="text-xs font-bold" style={{ color: '#00FF87' }}>+ New</Link>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {!upcomingFixtures || upcomingFixtures.length === 0 ? (
              <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No upcoming fixtures</div>
            ) : upcomingFixtures.map((match) => (
              <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#0D3320', color: '#00FF87', minWidth: '60px', textAlign: 'center' }}>
                  {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.away_team as any)?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}