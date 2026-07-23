import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CommunityAdminSidebar from '@/components/community/AdminSidebar'
import InactivityLogout from '@/components/admin/InactivityLogout'

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

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!community) redirect('/')

  if (isCommunityAdmin && (profile as any)?.community?.slug !== slug) {
    redirect('/')
  }

  // Get stats for sidebar
  const [
    { count: teamCount },
    { count: playerCount },
    { count: matchCount },
    { count: liveCount },
  ] = await Promise.all([
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'active'),
    supabase.from('players').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'active'),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'completed'),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('community_id', community.id).eq('status', 'live'),
  ])

  const stats = {
    teams: teamCount ?? 0,
    players: playerCount ?? 0,
    matches: matchCount ?? 0,
    live: liveCount ?? 0,
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A0F0D' }}>
      <InactivityLogout />
      <CommunityAdminSidebar community={community} profile={profile} stats={stats} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto lg:mt-0 mt-14">
        {children}
      </main>
    </div>
  )
}