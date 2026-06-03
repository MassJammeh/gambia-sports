import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { calculateStandings } from '@/lib/standings'

export default async function LeagueProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Get league
  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!league) notFound()

  // Get active season
  const { data: season } = await supabase
    .from('seasons')
    .select('*')
    .eq('league_id', league.id)
    .eq('status', 'active')
    .single()

  // Get teams
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', league.id)
    .eq('status', 'active')
    .order('name')

  // Get matches and standings
  const { data: matches } = season ? await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .eq('season_id', season.id)
    .order('scheduled_at', { ascending: false }) : { data: null }

  const standings = calculateStandings((matches || []) as any)

  // Get recent results
  const recentResults = matches?.filter(m => m.status === 'completed').slice(0, 3) || []

  // Get upcoming fixtures
  const upcomingFixtures = matches?.filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 3) || []

  return (
    <div className="space-y-8">

      {/* League Hero */}
      <section
        className="relative rounded-2xl overflow-hidden py-12 px-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 60%, #2D8A50 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-white font-black text-4xl shadow-xl flex-shrink-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            {league.name.charAt(0)}
          </div>
          <div>
            <div
              className="text-xs font-black uppercase tracking-widest mb-1 px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: 'rgba(193,39,45,0.8)' }}
            >
              🇬🇲 {league.country ?? 'Gambia'} · {league.sport_type ?? 'Football'}
            </div>
            <h1 className="text-3xl font-black mt-2">{league.name}</h1>
            {season && (
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                📅 {season.name} · {season.start_date} → {season.end_date}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Teams', value: teams?.length ?? 0, color: '#1A6B3A' },
          { label: 'Matches Played', value: matches?.filter(m => m.status === 'completed').length ?? 0, color: '#C1272D' },
          { label: 'Upcoming', value: upcomingFixtures.length, color: '#0057A8' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 text-center shadow-sm"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div className="text-3xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {league.description && (
        <div
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <h2 className="text-lg font-black mb-3" style={{ color: '#111827' }}>About</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            {league.description}
          </p>
        </div>
      )}

      {/* Mini Standings */}
      {standings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
              Standings
            </h2>
            <Link href="/standings" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              Full table →
            </Link>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-white font-bold text-xs">#</th>
                  <th className="px-4 py-3 text-left text-white font-bold text-xs">Club</th>
                  <th className="px-4 py-3 text-center text-white font-bold text-xs">MP</th>
                  <th className="px-4 py-3 text-center text-white font-bold text-xs hidden sm:table-cell">GD</th>
                  <th className="px-4 py-3 text-center text-white font-bold text-xs">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.slice(0, 5).map((row, index) => (
                  <tr
                    key={row.team_id}
                    style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}
                  >
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: '#6B7280' }}>{index + 1}</td>
                    <td className="px-4 py-3 font-bold text-xs" style={{ color: '#111827' }}>{row.team_name}</td>
                    <td className="px-4 py-3 text-center text-xs" style={{ color: '#6B7280' }}>{row.played}</td>
                    <td className="px-4 py-3 text-center text-xs hidden sm:table-cell" style={{ color: row.goal_difference > 0 ? '#16A34A' : '#C1272D' }}>
                      {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-black px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#1A6B3A' }}>
                        {row.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Results + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#C1272D' }} />
              Recent Results
            </h2>
            <Link href="/results" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentResults.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No results yet
              </div>
            ) : (
              recentResults.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <span className="flex-1 text-right text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <span className="mx-3 px-3 py-1 rounded-lg text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: '#1A6B3A' }}>
                    {match.home_score} — {match.away_score}
                  </span>
                  <span className="flex-1 text-left text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              ))
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
            <Link href="/fixtures" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingFixtures.length === 0 ? (
              <div className="bg-white rounded-xl p-5 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                No upcoming fixtures
              </div>
            ) : (
              upcomingFixtures.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <span className="flex-1 text-right text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.home_team as any)?.name}
                  </span>
                  <div className="mx-3 text-center flex-shrink-0">
                    <div className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}>
                      {match.scheduled_at
                        ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : 'TBD'}
                    </div>
                  </div>
                  <span className="flex-1 text-left text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                    {(match.away_team as any)?.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
            Clubs ({teams?.length ?? 0})
          </h2>
          <Link href="/teams" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {teams?.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.slug}`}
              className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
              >
                {team.name.charAt(0)}
              </div>
              <span className="text-sm font-bold truncate" style={{ color: '#111827' }}>
                {team.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
        style={{ color: '#1A6B3A' }}
      >
        ← Back to home
      </Link>
    </div>
  )
}