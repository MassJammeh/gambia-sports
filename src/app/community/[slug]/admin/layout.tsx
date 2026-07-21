import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CommunityAdminSidebar from '@/components/community/AdminSidebar'

export default async function CommunityAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/admin/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, community:communities(*)')
    .eq('id', user.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'
  const isCommunityAdmin = profile?.role === 'community_admin'

  if (!isSuperAdmin && !isCommunityAdmin) {
    redirect('/')
  }

  // Get community
  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!community) redirect('/')

  // Check community admin has access to this community
  if (isCommunityAdmin && (profile as any)?.community?.slug !== slug) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A0F0D' }}>
      <CommunityAdminSidebar community={community} profile={profile} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto lg:mt-0 mt-14">
        {children}
      </main>
    </div>
  )
}