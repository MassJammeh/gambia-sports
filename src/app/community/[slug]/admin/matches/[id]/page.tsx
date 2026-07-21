import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import MatchAdminForm from '@/components/community/MatchAdminForm'

export default async function MatchAdminPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: match } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id, name),
      away_team:teams!away_team_id(id, name),
      tournament:tournaments(id, name, type)
    `)
    .eq('id', id)
    .single()

  if (!match) notFound()

  // Get players for both teams
  const { data: homePlayers } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', match.home_team_id)
    .eq('status', 'active')
    .order('position')

  const { data: awayPlayers } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', match.away_team_id)
    .eq('status', 'active')
    .order('position')

  // Get match events
  const { data: events } = await supabase
    .from('match_events')
    .select('*, player:players(name, jersey_number)')
    .eq('match_id', id)
    .order('minute', { ascending: true })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>
          {match.status === 'completed' ? 'Edit Score' : match.status === 'live' ? 'Live Score' : 'Enter Result'}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
          {(match.tournament as any)?.name}
        </p>
      </div>

      {/* Match card */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-2"
              style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
              {(match.home_team as any)?.name?.charAt(0)}
            </div>
            <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{(match.home_team as any)?.name}</div>
            <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Home</div>
          </div>
          <div className="text-center flex-shrink-0">
            {match.status === 'live' ? (
              <div className="px-4 py-2 rounded-xl font-black text-xl" style={{ backgroundColor: '#FF3B3B', color: 'white', minWidth: '80px' }}>
                {match.home_score} — {match.away_score}
                <div className="text-xs mt-0.5">{match.minute}'</div>
              </div>
            ) : match.status === 'completed' ? (
              <div className="px-4 py-2 rounded-xl font-black text-xl" style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '80px' }}>
                {match.home_score} — {match.away_score}
              </div>
            ) : (
              <div className="font-black text-lg" style={{ color: '#4A5C54' }}>VS</div>
            )}
            {match.scheduled_at && (
              <div className="text-xs mt-1" style={{ color: '#4A5C54' }}>
                {new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>
          <div className="flex-1 text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-2"
              style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
              {(match.away_team as any)?.name?.charAt(0)}
            </div>
            <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{(match.away_team as any)?.name}</div>
            <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Away</div>
          </div>
        </div>
      </div>

      <MatchAdminForm
        match={match}
        homePlayers={homePlayers ?? []}
        awayPlayers={awayPlayers ?? []}
        events={events ?? []}
        communitySlug={slug}
      />
    </div>
  )
}