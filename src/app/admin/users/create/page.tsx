import { createClient } from '@/lib/supabase/server'
import CreateUserForm from '@/components/admin/CreateUserForm'

export default async function CreateUserPage() {
  const supabase = await createClient()
  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>Create Admin User</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
          Invite a new admin to manage a community
        </p>
      </div>
      <CreateUserForm communities={communities ?? []} />
    </div>
  )
}