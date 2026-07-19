import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LeaguesPage() {
  const supabase = await createClient()
  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .eq('status', 'active')
    .order('name')

  // Get season info for each league
  const leaguesWithSeasons = await Promise.all(
    (leagues ?? []).map(async (league) => {
      const { data: season } = await supabase
        .from('seasons')
        .select('*')
        .eq('league_id', league.id)
        .eq('status', 'active')
        .single()

      const { count: teamCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', league.id)
        .eq('status', 'active')

      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('season_id', season?.id ?? '')
        .eq('status', 'completed')

      return { ...league, season, teamCount, matchCount }
    })
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Leagues</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            All active football leagues on GamFoot
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          🏆 {leagues?.length ?? 0} Leagues
        </div>
      </div>

      {!leagues || leagues.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">🏆</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No active leagues</div>
        </div>
      ) : (
        <div className="space-y-4">
          {leaguesWithSeasons.map((league, index) => (
            <Link
              key={league.id}
              href={`/leagues/${league.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 group block"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div className="flex items-stretch">
                {/* Left color bar */}
                <div
                  className="w-2 flex-shrink-0"
                  style={{
                    background: index % 2 === 0
                      ? 'linear-gradient(to bottom, #1A6B3A, #0F4A28)'
                      : 'linear-gradient(to bottom, #C1272D, #7B0D1E)',
                  }}
                />

                {/* Logo */}
                <div className="flex-shrink-0 flex items-center px-5 py-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
                    style={{
                      background: index % 2 === 0
                        ? 'linear-gradient(135deg, #0F4A28, #1A6B3A)'
                        : 'linear-gradient(135deg, #7B0D1E, #C1272D)',
                    }}
                  >
                    {league.name.charAt(0)}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 py-5 pr-5 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-black text-lg truncate" style={{ color: '#111827' }}>
                        {league.name}
                      </div>
                      {league.description && (
                        <div className="text-sm mt-0.5 truncate" style={{ color: '#6B7280' }}>
                          {league.description}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#6B7280' }}>
                          🇬🇲 {league.country ?? 'Gambia'}
                        </span>
                        {league.founded_year && (
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#6B7280' }}>
                            📅 Est. {league.founded_year}
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#16A34A' }} />
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                    >
                      →
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: '#1A6B3A' }}>
                        {league.teamCount ?? 0}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black" style={{ color: '#C1272D' }}>
                        {league.matchCount ?? 0}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Matches Played</div>
                    </div>
                    {league.season && (
                      <div className="text-center">
                        <div className="text-xl font-black" style={{ color: '#0057A8' }}>
                          {league.season.name}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Current Season</div>
                      </div>
                    )}
                    <div className="ml-auto flex gap-2 items-center">
                      <Link
                        href="/standings"
                        className="px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:opacity-90"
                        style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                        
                      >
                        📊 Table
                      </Link>
                      <Link
                        href="/fixtures"
                        className="px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:opacity-90"
                        style={{ backgroundColor: '#EFF6FF', color: '#0057A8' }}
                        
                      >
                        📅 Fixtures
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* About section */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
      >
        <h2 className="font-black text-base mb-2" style={{ color: '#111827' }}>
          🇬🇲 About Gambian Football
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
          The Gambia Football Federation (GFF) governs football in The Gambia. 
          The GFF First Division is the top tier of Gambian club football, 
          while the Nawetans community tournaments are the heartbeat of grassroots football 
          across communities like Serekunda West, Serekunda East, Manjai, Brikama, and Banjul.
        </p>
      </div>
    </div>
  )
}