import Link from 'next/link'
import { getActiveLeagues, getCurrentSeason, getRecentResults, getUpcomingFixtures } from '@/lib/queries'

export default async function HomePage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]
  const { data: season } = firstLeague ? await getCurrentSeason(firstLeague.id) : { data: null }
  const { data: recentResults } = season ? await getRecentResults(season.id, 4) : { data: null }
  const { data: upcomingFixtures } = season ? await getUpcomingFixtures(season.id, 4) : { data: null }

  return (
    <div>
      {/* ═══════════════════════════════════════
          HERO — Full screen cinematic
      ═══════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-white text-center"
        style={{
          minHeight: '100vh',
          marginTop: '-2rem',
          marginLeft: 'calc(-50vw + 50%)',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Sliding background images */}
        {[
          'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1600',
          'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1600',
          'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1600',
        ].map((url, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(
                to bottom,
                rgba(0,0,0,0.15) 0%,
                rgba(10,40,20,0.7) 50%,
                rgba(10,40,20,0.95) 100%
              ), url("${url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: `slideshow 18s infinite`,
              animationDelay: `${i * 6}s`,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}

        {/* Gambia flag top stripe */}
        <div className="absolute top-0 left-0 right-0 flex z-20" style={{ height: '4px' }}>
          <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
          <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
          <div className="flex-1" style={{ backgroundColor: '#0057A8' }} />
          <div className="flex-1" style={{ backgroundColor: '#FFFFFF' }} />
          <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
          <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            style={{ backgroundColor: 'rgba(193,39,45,0.85)', backdropFilter: 'blur(10px)' }}
          >
            🇬🇲 The Gambia's #1 Football Platform
          </div>

          {/* Main title */}
          <h1
            className="font-black uppercase mb-4"
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A8F0C0 60%, #5BC88A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            GAM<br />FOOT
          </h1>

          {/* Tagline */}
          <p
            className="text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Live scores · Standings · Fixtures · Results<br />
            <span style={{ color: '#5BC88A' }}>For every league. Every community. Every match.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link
              href="/standings"
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wide transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#C1272D', color: 'white' }}
            >
              📊 Live Standings
            </Link>
            <Link
              href="/fixtures"
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wide transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
            >
              📅 Fixtures
            </Link>
            <Link
              href="/tournaments"
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wide transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
            >
              🏆 Nawetans
            </Link>
          </div>

          {/* Slide dots */}
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-full transition-all"
                style={{ width: i === 0 ? '24px' : '8px', height: '8px', backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 flex flex-col items-center gap-1">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Scroll</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>↓</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTENT BELOW HERO
      ═══════════════════════════════════════ */}
      <div className="space-y-12 pt-12">

        {/* ── LIVE SECTION HEADER ── */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C1272D' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#C1272D' }}>Live Season</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          {firstLeague && (
            <span className="text-xs font-bold" style={{ color: '#6B7280' }}>
              {firstLeague.name} · {season?.name}
            </span>
          )}
        </div>

        {/* ── RESULTS + FIXTURES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Results */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#C1272D' }} />
                <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
                  Recent Results
                </h2>
              </div>
              <Link href="/results" className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
                All Results →
              </Link>
            </div>

            <div className="space-y-2">
              {!recentResults || recentResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                  No results yet
                </div>
              ) : (
                recentResults.map((match) => {
                  const homeScore = match.home_score ?? 0
                  const awayScore = match.away_score ?? 0
                  const homeWon = homeScore > awayScore
                  const awayWon = awayScore > homeScore
                  return (
                    <div key={match.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 transition-all hover:shadow-md"
                      style={{ border: '1px solid #E5E7EB' }}>
                      <span className="flex-1 text-right text-sm font-black truncate"
                        style={{ color: homeWon ? '#111827' : '#9CA3AF' }}>
                        {(match.home_team as any)?.name}
                      </span>
                      <div className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-black text-white text-center"
                        style={{ backgroundColor: '#1A6B3A', minWidth: '72px' }}>
                        {homeScore} — {awayScore}
                      </div>
                      <span className="flex-1 text-left text-sm font-black truncate"
                        style={{ color: awayWon ? '#111827' : '#9CA3AF' }}>
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
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#1A6B3A' }} />
                <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
                  Upcoming Fixtures
                </h2>
              </div>
              <Link href="/fixtures" className="text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}>
                All Fixtures →
              </Link>
            </div>

            <div className="space-y-2">
              {!upcomingFixtures || upcomingFixtures.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                  No upcoming fixtures
                </div>
              ) : (
                upcomingFixtures.map((match) => (
                  <div key={match.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 transition-all hover:shadow-md"
                    style={{ border: '1px solid #E5E7EB' }}>
                    <span className="flex-1 text-right text-sm font-black truncate" style={{ color: '#111827' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <div className="flex-shrink-0 text-center px-3 py-2 rounded-xl"
                      style={{ backgroundColor: '#F3F4F6', minWidth: '72px' }}>
                      <div className="text-xs font-black" style={{ color: '#1A6B3A' }}>
                        {match.scheduled_at
                          ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : 'TBD'}
                      </div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        {match.scheduled_at
                          ? new Date(match.scheduled_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                          : ''}
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

        {/* ── QUICK NAVIGATION ── */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>Explore</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: '/standings', icon: '📊', label: 'Standings', color: '#1A6B3A', bg: '#E8F5EE' },
              { href: '/fixtures', icon: '📅', label: 'Fixtures', color: '#0057A8', bg: '#EFF6FF' },
              { href: '/results', icon: '✅', label: 'Results', color: '#C1272D', bg: '#FEE2E2' },
              { href: '/teams', icon: '🛡️', label: 'Teams', color: '#0F4A28', bg: '#E8F5EE' },
              { href: '/players', icon: '👤', label: 'Players', color: '#7C3AED', bg: '#F5F3FF' },
              { href: '/tournaments', icon: '🏆', label: 'Nawetans', color: '#D97706', bg: '#FEF3C7' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
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

        {/* ── ACTIVE LEAGUES ── */}
        {leagues && leagues.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>Active Leagues</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leagues.map((league) => (
                <div key={league.id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: '#1A6B3A' }} />
                  <div className="px-6 py-5 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md"
                      style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
                    >
                      {league.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-base truncate" style={{ color: '#111827' }}>{league.name}</div>
                      {league.description && (
                        <div className="text-sm mt-0.5 truncate" style={{ color: '#6B7280' }}>{league.description}</div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#16A34A' }} />
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#16A34A' }}>Active</span>
                        {season && (
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>· {season.name}</span>
                        )}
                      </div>
                    </div>
                    <Link href="/standings"
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#1A6B3A' }}
                    >
                      Table →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABOUT GAMFOOT ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F4A28 0%, #1A6B3A 100%)' }}
        >
          <div className="px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-white">
              <div className="text-3xl font-black uppercase tracking-tight mb-2">🇬🇲 GamFoot</div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                The home of Gambian football. Built to bring every league, every Nawetans community, and every match result to fans across The Gambia — and the world.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Link href="/standings"
                  className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all hover:opacity-90"
                  style={{ backgroundColor: '#C1272D', color: 'white' }}
                >
                  View Standings
                </Link>
                <Link href="/tournaments"
                  className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide transition-all hover:opacity-90"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  Nawetans 🏆
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {[
                { value: leagues?.length ?? 0, label: 'Leagues' },
                { value: '10+', label: 'Communities' },
                { value: '3', label: 'Tournaments' },
                { value: '100%', label: 'Free' },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 py-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center py-6" style={{ borderTop: '1px solid #E5E7EB' }}>
          <div className="text-sm font-black" style={{ color: '#111827' }}>GamFoot 🇬🇲</div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            The home of Gambian football · Built with ❤️ by TechPalz
          </div>
        </div>

      </div>
    </div>
  )
}