import { getCommunityBySlug, getTournamentsByCommunity, getMatchesByTournament } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function KnockoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: tournaments } = await getTournamentsByCommunity(community.id)
  const knockout = tournaments?.find(t => t.type === 'knockout')

  if (!knockout) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
          <Link href="/" className="hover:text-white">Home</Link>
          <span>›</span>
          <Link href={`/communities/${slug}`} className="hover:text-white">{community.name}</Link>
          <span>›</span>
          <span style={{ color: '#8A9E96' }}>Knockout</span>
        </div>
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">🥊</div>
          <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>Knockout Not Started</div>
          <div className="text-xs" style={{ color: '#4A5C54' }}>The Knockout tournament for {community.name} has not been created yet.</div>
        </div>
      </div>
    )
  }

  const { data: matches } = await getMatchesByTournament(knockout.id)
  const completedMatches = matches?.filter(m => m.status === 'completed') ?? []
  const upcomingMatches = matches?.filter(m => m.status === 'scheduled') ?? []
  const liveMatches = matches?.filter(m => m.status === 'live') ?? []

  const stageLabels: Record<string, string> = {
    qualify_round: 'Qualify Round',
    round_of_16: 'Round of 16',
    quarter_final: 'Quarter Finals',
    semi_final: 'Semi Finals',
    final: 'Final',
    third_place: 'Third Place',
  }

  // Group matches by stage
  const byStage: Record<string, typeof matches> = {}
  matches?.forEach((m) => {
    const stage = m.stage ?? 'round_of_16'
    if (!byStage[stage]) byStage[stage] = []
    byStage[stage]!.push(m)
  })

  const stageOrder = ['qualify_round', 'round_of_16', 'quarter_final', 'semi_final', 'final', 'third_place']

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#4A5C54' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/communities/${slug}`} className="hover:text-white transition-colors">{community.name}</Link>
        <span>›</span>
        <span style={{ color: '#8A9E96' }}>Knockout</span>
      </div>

      {/* Header */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🥊</span>
          <div className="flex-1">
            <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>{knockout.name}</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Pure knockout — lose once and you're out · Like the FA Cup</p>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded" style={{ backgroundColor: '#1A2320', color: '#6B8CFF' }}>
            {knockout.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#4A5C54' }}>
          {knockout.season_year && <span>📅 Season {knockout.season_year}</span>}
          {knockout.start_date && <span>🗓 {new Date(knockout.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Played', value: completedMatches.length, color: '#FF3B3B' },
          { label: 'Live', value: liveMatches.length, color: '#FF3B3B' },
          { label: 'Upcoming', value: upcomingMatches.length, color: '#6B8CFF' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
            <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Live */}
      {liveMatches.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #FF3B3B' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #FF3B3B30' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>Live Now</span>
          </div>
          {liveMatches.map((match) => (
            <div key={match.id} className="px-5 py-4 flex items-center gap-3">
              <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                {(match.home_team as any)?.name}
              </span>
              <div className="flex-shrink-0 text-center px-4 py-2 rounded font-black text-sm" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', minWidth: '80px' }}>
                {match.home_score} — {match.away_score}
                <div className="text-xs mt-0.5">{match.minute}'</div>
              </div>
              <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                {(match.away_team as any)?.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bracket by stage */}
      {matches && matches.length > 0 ? (
        <div className="space-y-6">
          {stageOrder.map((stage) => {
            const stageMatches = byStage[stage]
            if (!stageMatches || stageMatches.length === 0) return null
            const isFinal = stage === 'final'

            return (
              <div key={stage}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-4 rounded-full" style={{ backgroundColor: isFinal ? '#F5A623' : '#6B8CFF' }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: isFinal ? '#F5A623' : '#8A9E96' }}>
                    {stageLabels[stage] ?? stage}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#1F2B26' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stageMatches.map((match) => {
                    const completed = match.status === 'completed'
                    const homeWon = completed && match.home_score > match.away_score
                    const awayWon = completed && match.away_score > match.home_score

                    return (
                      <div
                        key={match.id}
                        className="rounded-xl overflow-hidden"
                        style={{
                          backgroundColor: '#141A17',
                          border: isFinal ? '1px solid #F5A62330' : '1px solid #1F2B26',
                        }}
                      >
                        {/* Home */}
                        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
                          <span className="text-sm font-black truncate" style={{ color: homeWon ? '#00FF87' : completed ? '#4A5C54' : '#F0F4F2' }}>
                            {(match.home_team as any)?.name ?? 'TBD'}
                          </span>
                          {completed && (
                            <span className="font-black text-lg ml-3 flex-shrink-0" style={{ color: homeWon ? '#00FF87' : '#FF3B3B' }}>
                              {match.home_score}
                            </span>
                          )}
                        </div>
                        {/* Away */}
                        <div className="px-4 py-3 flex items-center justify-between">
                          <span className="text-sm font-black truncate" style={{ color: awayWon ? '#00FF87' : completed ? '#4A5C54' : '#F0F4F2' }}>
                            {(match.away_team as any)?.name ?? 'TBD'}
                          </span>
                          {completed && (
                            <span className="font-black text-lg ml-3 flex-shrink-0" style={{ color: awayWon ? '#00FF87' : '#FF3B3B' }}>
                              {match.away_score}
                            </span>
                          )}
                        </div>
                        {/* Footer */}
                        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#1A2320', borderTop: '1px solid #1F2B26' }}>
                          <span className="text-xs" style={{ color: '#4A5C54' }}>
                            {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD'}
                          </span>
                          <span className="text-xs font-black" style={{ color: completed ? '#00FF87' : '#4A5C54' }}>
                            {completed ? 'FT' : match.status === 'live' ? `${match.minute}'` : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl p-10 text-center" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="text-4xl mb-3 opacity-20">🥊</div>
          <div className="font-black text-sm mb-1" style={{ color: '#F0F4F2' }}>Bracket not yet available</div>
          <div className="text-xs" style={{ color: '#4A5C54' }}>Fixtures will appear once the knockout stage begins.</div>
        </div>
      )}

      {/* Back */}
      <Link href={`/communities/${slug}`} className="inline-flex items-center gap-2 text-xs font-bold transition-colors hover:text-white" style={{ color: '#4A5C54' }}>
        ← Back to {community.name}
      </Link>
    </div>
  )
}