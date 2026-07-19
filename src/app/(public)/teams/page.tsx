import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const teamGradients = [
  'linear-gradient(135deg, #1A6B3A, #2D8A50)',
  'linear-gradient(135deg, #C1272D, #e03040)',
  'linear-gradient(135deg, #0F4A28, #1A6B3A)',
  'linear-gradient(135deg, #0057A8, #1D4ED8)',
  'linear-gradient(135deg, #D97706, #F59E0B)',
  'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  'linear-gradient(135deg, #0E7490, #0891B2)',
  'linear-gradient(135deg, #BE185D, #DB2777)',
]

export default async function TeamsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)
  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', firstLeague.id)
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Teams</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} {season ? `· ${season.name}` : ''}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          🛡️ {teams?.length ?? 0} Clubs
        </div>
      </div>

      {!teams || teams.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-4xl mb-3">🛡️</div>
          <div className="font-black text-lg" style={{ color: '#111827' }}>No teams registered</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team, index) => (
            <Link
              key={team.id}
              href={`/teams/${team.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
              style={{ border: '1px solid #E5E7EB' }}
            >
              {/* Banner */}
              <div
                className="h-20 relative flex items-end justify-between px-5 pb-0"
                style={{ background: teamGradients[index % teamGradients.length] }}
              >
                {/* Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                {/* Jersey number badge */}
                <div
                  className="absolute top-3 right-4 text-xs font-black px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.8)' }}
                >
                  {firstLeague.name.split(' ').map((w: string) => w[0]).join('')}
                </div>
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-white font-black text-2xl shadow-xl relative z-10 translate-y-8"
                  style={{ background: teamGradients[index % teamGradients.length] }}
                >
                  {team.name.charAt(0)}
                </div>
              </div>

              {/* Content */}
              <div className="pt-12 pb-5 px-5">
                <div className="font-black text-lg" style={{ color: '#111827' }}>
                  {team.name}
                </div>

                <div className="space-y-1 mt-2">
                  {team.home_ground && (
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                      <span>🏟</span> {team.home_ground}
                    </div>
                  )}
                  {team.founded_year && (
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                      <span>📅</span> Est. {team.founded_year}
                    </div>
                  )}
                  {team.colours && (
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                      <span>🎨</span> {team.colours}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span
                    className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                  >
                    ● Active
                  </span>
                  <span
                    className="text-xs font-black group-hover:gap-2 transition-all"
                    style={{ color: '#1A6B3A' }}
                  >
                    View Squad →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}