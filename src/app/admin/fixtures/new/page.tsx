import { createClient } from '@/lib/supabase/server'
import NewFixtureForm from '@/components/admin/NewFixtureForm'

export default async function NewFixturePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'

  // Get seasons
  let seasonsQuery = supabase
    .from('seasons')
    .select('*, league:leagues(id, name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (!isSuperAdmin && profile?.league_id) {
    seasonsQuery = seasonsQuery.eq('league_id', profile.league_id)
  }

  const { data: seasons } = await seasonsQuery

  // Get teams
  let teamsQuery = supabase
    .from('teams')
    .select('*, league:leagues(name)')
    .eq('status', 'active')
    .order('name')

  if (!isSuperAdmin && profile?.league_id) {
    teamsQuery = teamsQuery.eq('league_id', profile.league_id)
  }

  const { data: teams } = await teamsQuery

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Schedule Fixture
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          Create a new match fixture
        </p>
      </div>

      <NewFixtureForm seasons={seasons ?? []} teams={teams ?? []} />
    </div>
  )
}