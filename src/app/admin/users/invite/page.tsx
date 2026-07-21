import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InviteUserPage() {
  const supabase = await createClient()
  const { data: leagues } = await supabase
    .from('communities')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>Invite User</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Send an invitation to join the platform</p>
      </div>
      <div className="rounded-xl p-6" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        <p className="text-sm mb-4" style={{ color: '#8A9E96' }}>
          To invite a user, go to <strong style={{ color: '#00FF87' }}>Supabase → Authentication → Users → Invite User</strong> and enter their email.
        </p>
        <p className="text-sm mb-4" style={{ color: '#8A9E96' }}>
          After they accept, update their role in the Users section.
        </p>
        <Link href="/admin/users" className="text-xs font-black px-4 py-2 rounded inline-block"
          style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
          Back to Users
        </Link>
      </div>
    </div>
  )
}
