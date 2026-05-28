import Link from 'next/link'
import { getActiveLeagues } from '@/lib/queries'

export default async function HomePage() {
  const { data: leagues } = await getActiveLeagues()

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-green-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-green-800 mb-3">
          🇬🇲 Gambia Sports
        </h1>
        <p className="text-gray-600 text-lg">
          Live standings, fixtures and results for Gambian football leagues
        </p>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/standings', label: '📊 Standings', desc: 'League table' },
            { href: '/fixtures', label: '📅 Fixtures', desc: 'Upcoming matches' },
            { href: '/results', label: '✅ Results', desc: 'Completed matches' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-400 transition-all"
            >
              <div className="text-lg font-semibold text-green-700">
                {item.label}
              </div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Leagues */}
      {leagues && leagues.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Active Leagues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <div className="font-semibold text-gray-800">{league.name}</div>
                {league.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {league.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}