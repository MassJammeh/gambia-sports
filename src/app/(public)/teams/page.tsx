import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TeamsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]

  if (!firstLeague) {
    return <div className="text-center py-20 text-gray-500">No active leagues found.</div>
  }

  const { data: season } = await getCurrentSeason(firstLeague.id)

  if (!season) {
    return <div className="text-center py-20 text-gray-500">No active season found.</div>
  }

  const supabase = await createClient()
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', firstLeague.id)
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Teams</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {firstLeague.name} — {season.name}
        </p>
      </div>

      {!teams || teams.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#6B7280' }}>
          No teams found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4"
              style={{ border: '1px solid #E5E7EB' }}
            >
              {/* Logo placeholder */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: '#1A6B3A' }}
              >
                {team.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#1F2937' }}>
                  {team.name}
                </div>
                {team.home_ground && (
                  <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    🏟 {team.home_ground}
                  </div>
                )}
                {team.founded_year && (
                  <div className="text-xs" style={{ color: '#6B7280' }}>
                    Est. {team.founded_year}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}