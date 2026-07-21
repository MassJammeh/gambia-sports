import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CommunityForm from '@/components/admin/CommunityForm'
import Link from 'next/link'

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: community } = await supabase.from('communities').select('*').eq('id', id).single()
  if (!community) notFound()

  // Get admins for this community
  const { data: admins } = await supabase
    .from('profiles')
    .select('*')
    .eq('community_id', id)
    .eq('role', 'community_admin')

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>{community.name}</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Edit community settings</p>
        </div>
        <Link
          href={`/community/${community.slug}/admin`}
          className="text-xs font-black px-4 py-2 rounded"
          style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
        >
          Community Portal →
        </Link>
      </div>

      <CommunityForm community={community} />

      {/* Admins */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1F2B26' }}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Community Admins ({admins?.length ?? 0})
            </span>
          </div>
          <Link href="/admin/users/invite" className="text-xs font-bold" style={{ color: '#00FF87' }}>
            + Invite Admin
          </Link>
        </div>
        {!admins || admins.length === 0 ? (
          <div className="px-5 py-6 text-center text-xs" style={{ color: '#4A5C54' }}>
            No admins assigned yet
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
            {admins.map((admin) => (
              <div key={admin.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                  {(admin.display_name ?? 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-black text-xs" style={{ color: '#F0F4F2' }}>
                    {admin.display_name ?? 'Admin'}
                  </div>
                  <div className="text-xs" style={{ color: '#4A5C54' }}>Community Admin</div>
                </div>
                <Link href={`/admin/users/${admin.id}`}
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}