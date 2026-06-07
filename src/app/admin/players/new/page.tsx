import { createClient } from '@/lib/supabase/server'
import PlayerForm from '@/components/admin/PlayerForm'

export default async function NewPlayerPage() {
  const supabase = await createClient()
  const { data: teams } = await supabase
    .from('teams').select('*').eq('status', 'active').order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>New Player</h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>Register a new player</p>
      </div>
      <PlayerForm teams={teams ?? []} />
    </div>
  )
}