import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, community:communities(name)')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>Edit User</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{profile.display_name ?? profile.role}</p>
      </div>
      <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <div>
          <div className="text-xs font-bold mb-1" style={{ color: '#4A5C54' }}>Role</div>
          <div className="text-sm font-black" style={{ color: '#00FF87' }}>{profile.role?.replace('_', ' ')}</div>
        </div>
        <div>
          <div className="text-xs font-bold mb-1" style={{ color: '#4A5C54' }}>Community</div>
          <div className="text-sm font-black" style={{ color: '#F0F4F2' }}>
            {(profile.community as any)?.name ?? 'None (Platform-wide)'}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold mb-1" style={{ color: '#4A5C54' }}>Status</div>
          <div className="text-sm font-black" style={{ color: profile.status === 'active' ? '#00FF87' : '#FF3B3B' }}>
            {profile.status}
          </div>
        </div>
        <p className="text-xs" style={{ color: '#4A5C54' }}>
          To change role or community, update directly in Supabase SQL Editor or the profiles table.
        </p>
        <Link href="/admin/users" className="text-xs font-black px-4 py-2 rounded inline-block"
          style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
          Back to Users
        </Link>
      </div>
    </div>
  )
}
