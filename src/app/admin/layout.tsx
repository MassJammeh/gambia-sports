import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, community:communities(*)')
    .eq('id', user.id)
    .single()

  if (!profile || !['league_admin', 'super_admin', 'reporter'].includes(profile.role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F3F4F6' }}>
      <AdminSidebar profile={profile} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto lg:mt-0 mt-14">
        {children}
      </main>
    </div>
  )
}