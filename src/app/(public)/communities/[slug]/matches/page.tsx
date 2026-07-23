import { getCommunityBySlug, getMatchesByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LiveScoreBoard from '@/components/community/LiveScoreBoard'

export default async function CommunityMatchesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: matches } = await getMatchesByCommunity(community.id)

  const live = matches?.filter(m => m.status === 'live') ?? []
  const scheduled = matches?.filter(m => m.status === 'scheduled') ?? []
  const completed = matches?.filter(m => m.status === 'completed') ?? []

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white transition-colors">{community.name}</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>Matches</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Live Scores</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
        </div>
        {live.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#2A0A0A', border: '1px solid #FF3B3B30' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black" style={{ color: '#FF3B3B' }}>
              {live.length} Live Now
            </span>
          </div>
        )}
      </div>

      {/* Live matches - realtime */}
      {live.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>
              Live Now ({live.length})
            </span>
          </div>
          <LiveScoreBoard matches={live} communityId={community.id} />
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Upcoming ({scheduled.length})
            </span>
          </div>
          <div className="space-y-2">
            {scheduled.map((match) => (
              <div key={match.id} className="rounded-xl overflow-hidden"
                style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                <div className="px-5 py-3 flex items-center gap-3">
                  <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <div className="flex-shrink-0 px-4 py-2 rounded-lg text-center"
                    style={{ backgroundColor: '#1A2320', minWidth: '80px' }}>
                    <div className="text-xs font-black" style={{ color: '#6B8CFF' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : 'TBD'}
                    </div>
                    <div className="text-xs" style={{ color: '#4A5C54' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </div>
                  </div>
                  <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
                <div className="px-5 py-2 text-xs" style={{ backgroundColor: '#111916', color: '#4A5C54', borderTop: '1px solid #1F2B26' }}>
                  🏆 {(match.tournament as any)?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#4A5C54' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Results ({completed.length})
            </span>
          </div>
          <div className="space-y-2">
            {completed.slice(0, 10).map((match) => {
              const homeWon = match.home_score > match.away_score
              const awayWon = match.away_score > match.home_score
              return (
                <div key={match.id} className="rounded-xl px-5 py-3 flex items-center gap-3"
                  style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
                  <span className="flex-1 text-right text-xs font-black truncate"
                    style={{ color: homeWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <span className="flex-shrink-0 px-3 py-1.5 rounded-lg font-black text-xs text-center"
                    style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '72px' }}>
                    {match.home_score} — {match.away_score}
                  </span>
                  <span className="flex-1 text-left text-xs font-black truncate"
                    style={{ color: awayWon ? '#F0F4F2' : '#4A5C54' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {live.length === 0 && scheduled.length === 0 && completed.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">⚽</div>
          <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>No matches yet</div>
          <div className="text-xs mt-1" style={{ color: '#4A5C54' }}>Matches will appear here once scheduled</div>
        </div>
      )}

      <Link href={`/communities/${slug}`}
        className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white"
        style={{ color: '#4A5C54' }}>
        Back to {community.name}
      </Link>
    </div>
  )
}