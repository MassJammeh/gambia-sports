import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TeamForm from '@/components/admin/TeamForm'

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  const { data: team } = await supabase.from('teams').select('*').eq('id', id).single()
  if (!team) notFound()

  const { data: leagues } = await supabase.from('leagues').select('*').eq('status', 'active').order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>Edit Team</h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>{team.name}</p>
      </div>
      <TeamForm leagues={leagues ?? []} profile={profile} team={team} />
    </div>
  )
}