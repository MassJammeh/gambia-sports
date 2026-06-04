import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function TournamentBracketPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!tournament) notFound()

  const { data: rounds } = await supabase
    .from('tournament_rounds')
    .select('*')
    .eq('tournament_id', tournament.id)
    .order('round_number', { ascending: true })

  const { data: matches } = await supabase
    .from('matches')
    .select(`*, home_team:teams!home_team_id(name, slug), away_team:teams!away_team_id(name, slug)`)
    .eq('tournament_id', tournament.id)
    .not('round_id', 'is', null)
    .order('scheduled_at', { ascending: true })

  const stageLabels: Record<string, string> = {
    round_of_16: 'Round of 16',
    quarter_final: 'Quarter Finals',
    semi_final: 'Semi Finals',
    final: 'Final',
    third_place: 'Third Place',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Bracket
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {tournament.name} — Knockout Stage
          </p>
        </div>
        <Link
          href={`/tournaments/${slug}/groups`}
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          📊 Groups
        </Link>
      </div>

      {!rounds || rounds.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-black text-lg mb-2" style={{ color: '#111827' }}>Knockout stage not started</div>
          <div className="text-sm" style={{ color: '#6B7280' }}>
            The bracket will appear here once the group stage is complete.
          </div>
        </div>
      ) : (
        <div className="space-y-6 overflow-x-auto">
          {rounds.map((round) => {
            const roundMatches = matches?.filter(m => m.round_id === round.id) ?? []
            const isFinal = round.stage === 'final'

            return (
              <div key={round.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white"
                    style={{ backgroundColor: isFinal ? '#C1272D' : '#0F4A28' }}
                  >
                    {isFinal ? '🏆' : ''} {stageLabels[round.stage] ?? round.name}
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {roundMatches.length === 0 ? (
                    <div className="bg-white rounded-xl p-4 text-center text-sm col-span-full" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                      Fixtures to be determined
                    </div>
                  ) : (
                    roundMatches.map((match) => {
                      const completed = match.status === 'completed'
                      const homeWon = completed && match.home_score! > match.away_score!
                      const awayWon = completed && match.away_score! > match.home_score!

                      return (
                        <div
                          key={match.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm"
                          style={{
                            border: isFinal ? '2px solid #C1272D' : '1px solid #E5E7EB',
                          }}
                        >
                          {/* Home team */}
                          <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{
                              backgroundColor: homeWon ? '#f0fdf4' : '#fff',
                              borderBottom: '1px solid #F3F4F6',
                            }}
                          >
                            <span className="font-bold text-sm truncate" style={{ color: homeWon ? '#16A34A' : '#1F2937' }}>
                              {(match.home_team as any)?.name ?? 'TBD'}
                            </span>
                            {completed && (
                              <span className="font-black text-lg ml-2 flex-shrink-0" style={{ color: homeWon ? '#16A34A' : '#C1272D' }}>
                                {match.home_score}
                              </span>
                            )}
                          </div>

                          {/* Away team */}
                          <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{ backgroundColor: awayWon ? '#f0fdf4' : '#fff' }}
                          >
                            <span className="font-bold text-sm truncate" style={{ color: awayWon ? '#16A34A' : '#1F2937' }}>
                              {(match.away_team as any)?.name ?? 'TBD'}
                            </span>
                            {completed && (
                              <span className="font-black text-lg ml-2 flex-shrink-0" style={{ color: awayWon ? '#16A34A' : '#C1272D' }}>
                                {match.away_score}
                              </span>
                            )}
                          </div>

                          {/* Match info */}
                          <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
                            <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                              {match.scheduled_at
                                ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                                : 'TBD'}
                            </span>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: completed ? '#E8F5EE' : '#F3F4F6',
                                color: completed ? '#1A6B3A' : '#6B7280',
                              }}
                            >
                              {completed ? 'FT' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Link href={`/tournaments/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#1A6B3A' }}>
        ← Back to tournament
      </Link>
    </div>
  )
}