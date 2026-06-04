import { createClient } from '@/lib/supabase/server'
import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import Link from 'next/link'

const formatLabels: Record<string, string> = {
  nawetans: '🏆 Nawetans',
  league: '📊 League',
  cup: '🥇 Cup',
  friendly: '🤝 Friendly',
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#E8F5EE', color: '#1A6B3A', label: 'Upcoming' },
  group_stage: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Group Stage' },
  knockout: { bg: '#FEF3C7', color: '#D97706', label: 'Knockout' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
}

export default async function TournamentsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]
  if (!firstLeague) return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>

  const { data: season } = await getCurrentSeason(firstLeague.id)
  if (!season) return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active season found.</div>

  const supabase = await createClient()
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('season_id', season.id)
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Tournaments
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} — {season.name}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
        >
          🏆 {tournaments?.length ?? 0} Competitions
        </div>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center shadow-sm"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-black text-lg mb-2" style={{ color: '#111827' }}>No tournaments yet</div>
          <div className="text-sm" style={{ color: '#6B7280' }}>
            Tournaments for this season will appear here once created.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tournaments.map((tournament) => {
            const status = statusColors[tournament.status] ?? statusColors.upcoming
            return (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ border: '1px solid #E5E7EB' }}
              >
                {/* Banner */}
                <div
                  className="h-20 flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <span className="relative z-10 text-4xl">🏆</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="font-black text-base" style={{ color: '#111827' }}>
                      {tournament.name}
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {tournament.description && (
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: '#6B7280' }}>
                      {tournament.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                    >
                      {formatLabels[tournament.format] ?? tournament.format}
                    </span>
                    {tournament.num_groups && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                      >
                        {tournament.num_groups} Groups
                      </span>
                    )}
                    {tournament.start_date && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                      >
                        📅 {new Date(tournament.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}