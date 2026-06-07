import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PlayerForm from '@/components/admin/PlayerForm'

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: player } = await supabase.from('players').select('*').eq('id', id).single()
  if (!player) notFound()
  const { data: teams } = await supabase.from('teams').select('*').eq('status', 'active').order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>Edit Player</h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>{player.name}</p>
      </div>
      <PlayerForm teams={teams ?? []} player={player} />
    </div>
  )
}