import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditUserForm from '@/components/admin/EditUserForm'

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, league:leagues(name)')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Edit User
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          {profile.display_name ?? profile.role}
        </p>
      </div>
      <EditUserForm profile={profile} leagues={leagues ?? []} />
    </div>
  )
}