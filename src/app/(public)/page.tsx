import { getCommunities } from '@/lib/queries'
import Link from 'next/link'

export default async function HomePage() {
  const { data: communities } = await getCommunities()

  return (
    <div>
      {/* HERO */}
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
        {[
          'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1600',
          'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1600',
          'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1600',
        ].map((url, i) => (
          <div key={i} className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(5,12,8,0.85) 60%, rgba(10,15,13,1) 100%), url("${url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'slideshow 18s infinite',
            animationDelay: `${i * 6}s`,
            opacity: i === 0 ? 1 : 0,
          }} />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00C96830' }}
          >
            🇬🇲 The Gambia's #1 Nawettan Platform
          </div>

          <h1
            className="font-black uppercase mb-4"
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: '#F0F4F2',
            }}
          >
            GAM<br />
            <span style={{ color: '#00FF87' }}>FOOT</span>
          </h1>

          <p className="text-base sm:text-lg max-w-lg mx-auto mb-2 leading-relaxed" style={{ color: '#8A9E96' }}>
            The home of Nawettan football in The Gambia
          </p>
          <p className="text-sm max-w-md mx-auto mb-10" style={{ color: '#4A5C54' }}>
            Live scores · Standings · Fixtures · Results · For every community
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link
              href="/#communities"
              className="px-7 py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
            >
              Explore Communities
            </Link>
            <Link
              href="/admin/login"
              className="px-7 py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: 'transparent', color: '#8A9E96', border: '1px solid #1F2B26' }}
            >
              Admin Login
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { value: communities?.length ?? 0, label: 'Communities' },
              { value: '2', label: 'Tournaments Each' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: '#00FF87' }}>{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#4A5C54' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div style={{ color: '#4A5C54', fontSize: '1.2rem' }}>↓</div>
        </div>
      </section>

      {/* COMMUNITIES */}
      <div className="space-y-8 pt-12" id="communities">

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: '#F0F4F2' }}>
            Communities
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: '#1F2B26' }} />
          <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>
            {communities?.length ?? 0} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities?.map((community) => (
            <Link
              key={community.id}
              href={`/communities/${community.slug}`}
              className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] group"
              style={{ backgroundColor: '#1A2420', border: '1px solid #243029' }}
            >
              <div className="px-5 py-4 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ backgroundColor: '#0F3D25', color: '#00FF87', border: '1px solid #00C96830' }}
                >
                  {community.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm" style={{ color: '#F0F4F2' }}>{community.name}</div>
                  {community.location && (
                    <div className="text-xs mt-0.5 truncate" style={{ color: '#4A5C54' }}>
                      📍 {community.location}
                    </div>
                  )}
                </div>
                <span className="text-xs font-black opacity-0 group-hover:opacity-100 transition-all" style={{ color: '#00FF87' }}>
                  →
                </span>
              </div>
              <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid #243029' }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#1A0A0A', color: '#FF3B3B' }}>
                  🏆 Nawettan
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#0A0A1A', color: '#6B8CFF' }}>
                  🥊 Knockout
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00FF87' }} />
                  <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>Active</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1A2420', border: '1px solid #243029' }}>
          <div className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#4A5C54' }}>
            How GamFoot Works
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏟', title: 'Choose Community', desc: 'Each mini stadium runs its own Nawettan. Pick yours to follow live.', color: '#00FF87' },
              { icon: '🏆', title: 'Follow Nawettan', desc: 'Group stage then knockout rounds — like the World Cup for your community.', color: '#FF3B3B' },
              { icon: '⚡', title: 'Live Updates', desc: 'Real-time scores, goal scorers, minutes and standings updated live.', color: '#F5A623' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-black text-sm mb-1" style={{ color: item.color }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#4A5C54' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6" style={{ borderTop: '1px solid #243029' }}>
          <div className="text-sm font-black" style={{ color: '#4A5C54' }}>
            GamFoot 🇬🇲 · Built by TechPalz
          </div>
        </div>
      </div>
    </div>
  )
}