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
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,40,20,0.75) 50%, rgba(10,40,20,0.97) 100%), url("${url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'slideshow 18s infinite',
              animationDelay: `${i * 6}s`,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}

        {/* Flag stripe */}
        <div className="absolute top-0 left-0 right-0 flex z-20" style={{ height: '4px' }}>
          <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
          <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
          <div className="flex-1" style={{ backgroundColor: '#0057A8' }} />
          <div className="flex-1" style={{ backgroundColor: '#FFFFFF' }} />
          <div className="flex-1" style={{ backgroundColor: '#3A7D44' }} />
          <div className="flex-1" style={{ backgroundColor: '#C1272D' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            style={{ backgroundColor: 'rgba(193,39,45,0.85)' }}
          >
            🇬🇲 The Gambia's #1 Nawettan Platform
          </div>

          <h1
            className="font-black uppercase mb-4"
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A8F0C0 60%, #5BC88A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            GAM<br />FOOT
          </h1>

          <p className="text-lg sm:text-xl max-w-lg mx-auto mb-4 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            The home of Nawettan football in The Gambia
          </p>
          <p className="text-sm max-w-md mx-auto mb-10"
            style={{ color: '#5BC88A' }}>
            Live scores · Standings · Fixtures · Results · For every community
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            
              <Link
              href="/#communities"
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wide transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#C1272D', color: 'white' }}
            >
              🏟 Explore Communities
            </Link>
            <Link
              href="/admin/login"
              className="px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wide transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              🔐 Admin Login
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: communities?.length ?? 0, label: 'Communities' },
              { value: '2', label: 'Tournaments Each' },
              { value: '100%', label: 'Free to Follow' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 flex flex-col items-center gap-1">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Scroll</div>
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>↓</div>
        </div>
      </section>

      {/* COMMUNITIES */}
      <div className="space-y-10 pt-12" id="communities">

        {/* Section header */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Communities
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          <span className="text-sm font-bold" style={{ color: '#6B7280' }}>
            {communities?.length ?? 0} Active
          </span>
        </div>

        {/* Community grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities?.map((community, index) => {
            const gradients = [
              'linear-gradient(135deg, #1A6B3A, #2D8A50)',
              'linear-gradient(135deg, #C1272D, #e03040)',
              'linear-gradient(135deg, #0057A8, #1D4ED8)',
              'linear-gradient(135deg, #D97706, #F59E0B)',
              'linear-gradient(135deg, #7C3AED, #8B5CF6)',
              'linear-gradient(135deg, #0E7490, #0891B2)',
              'linear-gradient(135deg, #BE185D, #DB2777)',
              'linear-gradient(135deg, #0F4A28, #1A6B3A)',
              'linear-gradient(135deg, #92400E, #B45309)',
              'linear-gradient(135deg, #1E3A5F, #2563EB)',
            ]
            const gradient = gradients[index % gradients.length]

            return (
              <Link
                key={community.id}
                href={`/communities/${community.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
                style={{ border: '1px solid #E5E7EB' }}
              >
                {/* Banner */}
                <div
                  className="h-24 relative flex items-center px-6"
                  style={{ background: gradient }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl border-3 border-white flex items-center justify-center text-white font-black text-2xl shadow-lg"
                      style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '3px solid rgba(255,255,255,0.5)' }}
                    >
                      {community.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-black text-lg leading-tight">
                        {community.name}
                      </div>
                      <div className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        🏟 Mini Stadium
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {community.location && (
                    <div className="text-xs font-medium mb-3" style={{ color: '#6B7280' }}>
                      📍 {community.location}
                    </div>
                  )}

                  {/* Tournament badges */}
                  <div className="flex gap-2 mb-4">
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}
                    >
                      🏆 Nawettan
                    </span>
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#EFF6FF', color: '#0057A8' }}
                    >
                      🥊 Knockout
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 text-xs font-black"
                      style={{ color: '#16A34A' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#16A34A' }} />
                      Active
                    </span>
                    <span
                      className="text-xs font-black transition-all group-hover:gap-2"
                      style={{ color: '#1A6B3A' }}
                    >
                      View Community →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <div
            className="px-6 py-4"
            style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
          >
            <h2 className="font-black text-white text-lg">🇬🇲 How GamFoot Works</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ backgroundColor: '#F9FAFB' }}>
            {[
              {
                icon: '🏟',
                title: 'Choose Your Community',
                desc: 'Each mini stadium community runs its own Nawettan tournament. Pick yours to follow.',
                color: '#1A6B3A',
              },
              {
                icon: '🏆',
                title: 'Follow the Nawettan',
                desc: 'Group stage followed by knockout rounds — like the World Cup but for your community.',
                color: '#C1272D',
              },
              {
                icon: '⚡',
                title: 'Live Scores',
                desc: 'Real-time match updates, goal scorers, minutes, and standings updated live.',
                color: '#0057A8',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: item.color + '15' }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-black text-sm mb-1" style={{ color: '#111827' }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6" style={{ borderTop: '1px solid #E5E7EB' }}>
          <div className="text-sm font-black" style={{ color: '#111827' }}>GamFoot 🇬🇲</div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            The home of Nawettan football · Built with ❤️ by TechPalz
          </div>
        </div>
      </div>
    </div>
  )
}