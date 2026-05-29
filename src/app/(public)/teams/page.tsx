import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'

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

  const colors = [
    'linear-gradient(135deg, #1A6B3A, #2D8A50)',
    'linear-gradient(135deg, #C1272D, #e03040)',
    'linear-gradient(135deg, #0F4A28, #1A6B3A)',
    'linear-gradient(135deg, #0057A8, #1D4ED8)',
    'linear-gradient(135deg, #D97706, #F59E0B)',
    'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Teams
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            {firstLeague.name} {season ? `— ${season.name}` : ''}
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
        >
          🛡️ {teams?.length ?? 0} Clubs
        </div>
      </div>

      {!teams || teams.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>No teams found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ border: '1px solid #E5E7EB' }}
            >
              {/* Card top banner */}
              <div
                className="h-16 flex items-center justify-center relative"
                style={{ background: colors[index % colors.length] }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div
                  className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-2xl shadow-lg absolute -bottom-7"
                  style={{ background: colors[index % colors.length] }}
                >
                  {team.name.charAt(0)}
                </div>
              </div>

              {/* Card body */}
              <div className="pt-10 pb-5 px-5 text-center">
                <div className="font-black text-base" style={{ color: '#111827' }}>
                  {team.name}
                </div>

                <div className="flex items-center justify-center gap-4 mt-3">
                  {team.home_ground && (
                    <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
                      🏟 {team.home_ground}
                    </div>
                  )}
                  {team.founded_year && (
                    <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
                      📅 Est. {team.founded_year}
                    </div>
                  )}
                </div>

                {team.colours && (
                  <div className="text-xs mt-1 font-medium" style={{ color: '#6B7280' }}>
                    🎨 {team.colours}
                  </div>
                )}

                <div className="mt-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                  >
                    ● Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}