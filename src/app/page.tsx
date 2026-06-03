import Link from 'next/link'
import { getActiveLeagues, getCurrentSeason, getRecentResults, getUpcomingFixtures } from '@/lib/queries'

export default async function HomePage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]
  const { data: season } = firstLeague ? await getCurrentSeason(firstLeague.id) : { data: null }
  const { data: recentResults } = season ? await getRecentResults(season.id, 3) : { data: null }
  const { data: upcomingFixtures } = season ? await getUpcomingFixtures(season.id, 3) : { data: null }

  return (
    <div>
      {/* FULL SCREEN HERO - outside normal container */}
     {/* HERO IMAGE SLIDER */}
<section
  className="relative flex flex-col items-center justify-center text-white text-center"
  style={{
    minHeight: '92vh',
    marginTop: '-2rem',
    marginLeft: 'calc(-50vw + 50%)',
    width: '100vw',
    overflow: 'hidden',
  }}
>
  {/* Slides */}
  {[
    {
      url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80',
      caption: 'The home of Gambian football',
    },
    {
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
      caption: 'Live scores, standings & more',
    },
    {
  url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
  caption: 'Live scores, standings & more',
},
  ].map((slide, i) => (
    <div
      key={i}
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(15,74,40,0.8) 60%, rgba(15,74,40,1) 100%), url("${slide.url}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: `slideshow 18s infinite`,
        animationDelay: `${i * 6}s`,
        opacity: i === 0 ? 1 : 0,
      }}
    />
  ))}

  {/* Gambia flag stripe */}
  <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
    <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
    <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
    <div className="flex-1" style={{ backgroundColor: '#0057A8' }} />
    <div className="flex-1" style={{ backgroundColor: '#FFFFFF' }} />
    <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
    <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-3xl mx-auto px-6">
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
      style={{ backgroundColor: 'rgba(193,39,45,0.9)', color: 'white' }}
    >
      🇬🇲 The Gambia's #1 Football Platform
    </div>

    <h1
      className="font-black uppercase tracking-tight mb-4"
      style={{
        fontSize: 'clamp(3.5rem, 10vw, 7rem)',
        lineHeight: 1,
        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
        background: 'linear-gradient(180deg, #ffffff 0%, #a8f0c0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      GamFoot
    </h1>

    <p
      className="text-lg sm:text-xl mb-8 max-w-lg mx-auto"
      style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
    >
      Live standings, fixtures, results & player stats for Gambian football
    </p>

    <div className="flex flex-wrap gap-3 justify-center">
      <Link
        href="/standings"
        className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all hover:scale-105 shadow-lg"
        style={{ backgroundColor: '#C1272D', color: 'white' }}
      >
        📊 View Standings
      </Link>
      <Link
        href="/fixtures"
        className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}
      >
        📅 Fixtures
      </Link>
      <Link
        href="/results"
        className="px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}
      >
        ✅ Results
      </Link>
    </div>

    {/* Slide dots */}
    <div className="flex gap-2 justify-center mt-10">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.4)' }}
        />
      ))}
    </div>
  </div>

  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.5rem' }}>↓</div>
  </div>

</section>

      {/* REST OF CONTENT */}
      <div className="space-y-10 pt-10">

        {/* RECENT RESULTS + UPCOMING FIXTURES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Results */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#111827' }}>
                <span
                  className="w-1 h-6 rounded-full inline-block"
                  style={{ backgroundColor: '#C1272D' }}
                />
                Recent Results
              </h2>
              <Link href="/results" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {!recentResults || recentResults.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                  No results yet
                </div>
              ) : (
                recentResults.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl px-5 py-3.5 flex items-center justify-between transition-all hover:shadow-md"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <span className="flex-1 text-right text-sm font-bold" style={{ color: '#1F2937' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <span
                      className="mx-4 px-4 py-1.5 rounded-lg text-sm font-black text-white"
                      style={{ backgroundColor: '#1A6B3A', minWidth: '64px', textAlign: 'center' }}
                    >
                      {match.home_score} — {match.away_score}
                    </span>
                    <span className="flex-1 text-left text-sm font-bold" style={{ color: '#1F2937' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Upcoming Fixtures */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#111827' }}>
                <span
                  className="w-1 h-6 rounded-full inline-block"
                  style={{ backgroundColor: '#1A6B3A' }}
                />
                Upcoming Fixtures
              </h2>
              <Link href="/fixtures" className="text-sm font-semibold" style={{ color: '#1A6B3A' }}>
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {!upcomingFixtures || upcomingFixtures.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-sm" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                  No upcoming fixtures
                </div>
              ) : (
                upcomingFixtures.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl px-5 py-3.5 flex items-center justify-between transition-all hover:shadow-md"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <span className="flex-1 text-right text-sm font-bold" style={{ color: '#1F2937' }}>
                      {(match.home_team as any)?.name}
                    </span>
                    <div className="mx-4 text-center">
                      <div
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A', minWidth: '64px' }}
                      >
                        {match.scheduled_at
                          ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                          : 'TBD'}
                      </div>
                    </div>
                    <span className="flex-1 text-left text-sm font-bold" style={{ color: '#1F2937' }}>
                      {(match.away_team as any)?.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* EXPLORE CARDS */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
            Explore
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: '/standings', icon: '📊', label: 'Standings', desc: 'League table', color: '#1A6B3A' },
              { href: '/fixtures', icon: '📅', label: 'Fixtures', desc: 'Upcoming matches', color: '#0F4A28' },
              { href: '/results', icon: '✅', label: 'Results', desc: 'Match results', color: '#C1272D' },
              { href: '/teams', icon: '🛡️', label: 'Teams', desc: 'All clubs', color: '#2D8A50' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-black text-sm uppercase tracking-wide" style={{ color: item.color }}>{item.label}</div>
                <div className="text-xs mt-1" style={{ color: '#6B7280' }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ACTIVE LEAGUES */}
        {leagues && leagues.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#111827' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ backgroundColor: '#1A6B3A' }} />
              Active Leagues
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leagues.map((league) => (
                <Link
                    key={league.id}
                    href={`/leagues/${league.slug}`}
                    className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
                  >
                    {league.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-base" style={{ color: '#111827' }}>{league.name}</div>
                    {league.description && (
                      <div className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{league.description}</div>
                    )}
                    <div className="mt-2">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                      >
                        ● Active
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer
          className="rounded-2xl p-8 text-center mt-8"
          style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)', color: 'rgba(255,255,255,0.7)' }}
        >
          <div className="text-2xl font-black text-white mb-1">GamFoot</div>
          <div className="text-sm">The home of Gambian football 🇬🇲</div>
          <div className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Built with ❤️ by TechPalz
          </div>
        </footer>

      </div>
    </div>
  )
}