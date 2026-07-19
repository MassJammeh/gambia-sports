import { createClient } from '@/lib/supabase/server'
import InviteUserForm from '@/components/admin/InviteUserForm'

export default async function InviteUserPage() {
  const supabase = await createClient()
  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Invite User
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          Send an invitation to join the platform
        </p>
      </div>
      <InviteUserForm leagues={leagues ?? []} />
    </div>
  )
}