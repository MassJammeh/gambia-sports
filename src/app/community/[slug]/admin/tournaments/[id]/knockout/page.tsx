import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug, getTeamsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import KnockoutFixtureForm from '@/components/community/KnockoutFixtureForm'

export default async function KnockoutManagerPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single()

  if (!tournament) notFound()

  const { data: teams } = await getTeamsByCommunity(community.id)

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id, name),
      away_team:teams!away_team_id(id, name)
    `)
    .eq('tournament_id', id)
    .order('scheduled_at', { ascending: true })

  const stageOrder = ['qualify_round', 'round_of_16', 'quarter_final', 'semi_final', 'final', 'third_place']
  const stageLabels: Record<string, string> = {
    qualify_round: 'Qualify Round',
    round_of_16: 'Round of 16',
    quarter_final: 'Quarter Finals',
    semi_final: 'Semi Finals',
    final: 'Final',
    third_place: 'Third Place',
  }

  const byStage: Record<string, typeof matches> = {}
  matches?.forEach((m) => {
    const stage = m.stage ?? 'round_of_16'
    if (!byStage[stage]) byStage[stage] = []
    byStage[stage]!.push(m)
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Knockout Manager</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{tournament.name}</p>
        </div>
        <Link href={`/community/${slug}/admin/tournaments`}
          className="text-xs font-bold" style={{ color: '#4A5C54' }}>
          Back
        </Link>
      </div>

      {/* Add new knockout fixture */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1F2B26' }}>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Schedule Knockout Fixture
          </span>
        </div>
        <div className="p-5">
          <KnockoutFixtureForm
            tournamentId={id}
            communityId={community.id}
            communitySlug={slug}
            teams={teams ?? []}
          />
        </div>
      </div>

      {/* Existing bracket */}
      <div className="space-y-5">
        {stageOrder.map((stage) => {
          const stageMatches = byStage[stage]
          if (!stageMatches || stageMatches.length === 0) return null
          const isFinal = stage === 'final'

          return (
            <div key={stage} className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#141A17', border: `1px solid ${isFinal ? '#F5A62330' : '#1F2B26'}` }}>
              <div className="px-5 py-3 flex items-center gap-2"
                style={{ borderBottom: '1px solid #1F2B26', backgroundColor: isFinal ? '#1A1500' : '#111916' }}>
                <span className="text-xs font-black uppercase tracking-widest"
                  style={{ color: isFinal ? '#F5A623' : '#8A9E96' }}>
                  {stageLabels[stage] ?? stage} ({stageMatches.length})
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
                {stageMatches.map((match) => {
                  const completed = match.status === 'completed'
                  const homeWon = completed && match.home_score > match.away_score
                  const awayWon = completed && match.away_score > match.home_score
                  return (
                    <div key={match.id} className="px-5 py-3 flex items-center gap-3">
                      <span className="flex-1 text-right text-xs font-black truncate"
                        style={{ color: homeWon ? '#00FF87' : '#8A9E96' }}>
                        {(match.home_team as any)?.name}
                      </span>
                      <Link
                        href={`/community/${slug}/admin/matches/${match.id}`}
                        className="flex-shrink-0 px-3 py-1.5 rounded font-black text-xs text-center"
                        style={{
                          backgroundColor: completed ? '#1A2320' : '#0D3320',
                          color: completed ? '#00FF87' : '#00FF87',
                          minWidth: '72px',
                        }}
                      >
                        {completed ? `${match.home_score} — ${match.away_score}` : 'Enter Result'}
                      </Link>
                      <span className="flex-1 text-left text-xs font-black truncate"
                        style={{ color: awayWon ? '#00FF87' : '#8A9E96' }}>
                        {(match.away_team as any)?.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}