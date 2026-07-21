import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CommunityAdminMatchesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id, name),
      away_team:teams!away_team_id(id, name),
      tournament:tournaments(name, type)
    `)
    .eq('community_id', community.id)
    .order('scheduled_at', { ascending: false })

  const live = matches?.filter(m => m.status === 'live') ?? []
  const scheduled = matches?.filter(m => m.status === 'scheduled') ?? []
  const completed = matches?.filter(m => m.status === 'completed') ?? []
  const postponed = matches?.filter(m => m.status === 'postponed') ?? []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Matches</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Enter results · Update live scores</p>
        </div>
        <Link
          href={`/community/${slug}/admin/fixtures/new`}
          className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          + New Fixture
        </Link>
      </div>

      {/* Live matches */}
      {live.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #FF3B3B50', backgroundColor: '#1A0A0A' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #FF3B3B30' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>
              Live ({live.length})
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#2A1010' }}>
            {live.map((match) => (
              <Link
                key={match.id}
                href={`/community/${slug}/admin/matches/${match.id}`}
                className="px-5 py-4 flex items-center gap-3 transition-all hover:bg-white/5"
              >
                <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.home_team as any)?.name}
                </span>
                <div className="flex-shrink-0 text-center px-4 py-2 rounded font-black text-sm" style={{ backgroundColor: '#FF3B3B', color: 'white', minWidth: '80px' }}>
                  {match.home_score} — {match.away_score}
                  <div className="text-xs mt-0.5">{match.minute}'</div>
                </div>
                <span className="flex-1 text-left text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
                  {(match.away_team as any)?.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#00FF87' }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Scheduled ({scheduled.length})
          </span>
        </div>
        {scheduled.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-xs mb-2" style={{ color: '#4A5C54' }}>No scheduled matches</div>
            <Link href={`/community/${slug}/admin/fixtures/new`} className="text-xs font-black" style={{ color: '#00FF87' }}>
              + Schedule a fixture
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {scheduled.map((match) => (
              <Link
                key={match.id}
                href={`/community/${slug}/admin/matches/${match.id}`}
                className="px-5 py-4 flex items-center gap-3 transition-all hover:bg-white/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm" style={{ color: '#F0F4F2' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}>vs</span>
                    <span className="font-black text-sm" style={{ color: '#F0F4F2' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: '#4A5C54' }}>
                      📅 {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD'}
                    </span>
                    <span className="text-xs" style={{ color: '#4A5C54' }}>
                      🏆 {(match.tournament as any)?.name}
                    </span>
                  </div>
                </div>
                <span
                  className="flex-shrink-0 text-xs font-black px-3 py-1.5 rounded transition-all"
                  style={{ backgroundColor: '#FF3B3B', color: 'white' }}
                >
                  Enter Result →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#4A5C54' }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
            Completed ({completed.length})
          </span>
        </div>
        {completed.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>No completed matches yet</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {completed.map((match) => (
              <Link
                key={match.id}
                href={`/community/${slug}/admin/matches/${match.id}`}
                className="px-5 py-3 flex items-center gap-3 transition-all hover:bg-white/5"
              >
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#1A2320', color: '#00FF87', minWidth: '64px', textAlign: 'center' }}>
                  {match.home_score} — {match.away_score}
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.away_team as any)?.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Postponed */}
      {postponed.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #F5A62330' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#F5A623' }}>
              Postponed ({postponed.length})
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {postponed.map((match) => (
              <Link
                key={match.id}
                href={`/community/${slug}/admin/matches/${match.id}`}
                className="px-5 py-3 flex items-center gap-3 transition-all hover:bg-white/5"
              >
                <span className="flex-1 text-right text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.home_team as any)?.name}
                </span>
                <span className="flex-shrink-0 px-3 py-1 rounded font-black text-xs" style={{ backgroundColor: '#1A1500', color: '#F5A623', minWidth: '64px', textAlign: 'center' }}>
                  PPD
                </span>
                <span className="flex-1 text-left text-xs font-black truncate" style={{ color: '#8A9E96' }}>
                  {(match.away_team as any)?.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}