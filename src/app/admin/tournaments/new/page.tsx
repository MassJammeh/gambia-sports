import { createClient } from '@/lib/supabase/server'
import TournamentForm from '@/components/admin/TournamentForm'

export default async function NewTournamentPage() {
  const supabase = await createClient()
  const { data: seasons } = await supabase
    .from('seasons')
    .select('*, league:leagues(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          New Tournament
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          Create a new competition
        </p>
      </div>
      <TournamentForm seasons={seasons ?? []} />
    </div>
  )
}