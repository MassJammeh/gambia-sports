import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const roleConfig: Record<string, { bg: string; color: string }> = {
  super_admin: { bg: '#FEE2E2', color: '#C1272D' },
  league_admin: { bg: '#E8F5EE', color: '#1A6B3A' },
  reporter: { bg: '#EFF6FF', color: '#1D4ED8' },
  content_editor: { bg: '#FEF3C7', color: '#D97706' },
  fan: { bg: '#F3F4F6', color: '#6B7280' },
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  if (profile?.role !== 'super_admin') {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <div className="font-black text-lg" style={{ color: '#111827' }}>Super Admin Only</div>
        <div className="text-sm mt-2" style={{ color: '#6B7280' }}>
          Only Super Admins can manage users.
        </div>
      </div>
    )
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, league:leagues(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
            Users
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
            Manage platform users and permissions
          </p>
        </div>
        <Link
            href="/admin/users/create"
            className="text-xs font-black px-4 py-2 rounded transition-all hover:opacity-90"
            style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
          >
            + Create User
          </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { role: 'super_admin', label: 'Super Admins', icon: '👑' },
          { role: 'league_admin', label: 'League Admins', icon: '🛡️' },
          { role: 'reporter', label: 'Reporters', icon: '📝' },
          { role: 'fan', label: 'Fans', icon: '👥' },
        ].map((item) => {
          const count = profiles?.filter(p => p.role === item.role).length ?? 0
          const config = roleConfig[item.role]
          return (
            <div
              key={item.role}
              className="bg-white rounded-2xl p-4 text-center shadow-sm"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-black" style={{ color: config.color }}>{count}</div>
              <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Users list */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
        <div
          className="px-5 py-3 grid grid-cols-12 text-xs font-black uppercase tracking-wide"
          style={{ backgroundColor: '#F9FAFB', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}
        >
          <div className="col-span-4">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 hidden sm:block">League</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {profiles?.map((p, index) => {
          const config = roleConfig[p.role] ?? roleConfig.fan
          return (
            <div
              key={p.id}
              className="px-5 py-4 grid grid-cols-12 items-center transition-all hover:bg-gray-50"
              style={{ borderBottom: index < profiles.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              {/* User */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                >
                  {(p.display_name ?? p.role).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate" style={{ color: '#111827' }}>
                    {p.display_name ?? '—'}
                  </div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full font-bold inline-block mt-0.5"
                    style={{ backgroundColor: p.status === 'active' ? '#E8F5EE' : '#FEE2E2', color: p.status === 'active' ? '#1A6B3A' : '#C1272D' }}
                  >
                    {p.status}
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="col-span-3">
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {p.role.replace('_', ' ')}
                </span>
              </div>

              {/* League */}
              <div className="col-span-3 hidden sm:block text-sm truncate" style={{ color: '#6B7280' }}>
                {(p as any).league?.name ?? '—'}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end">
                <Link
                  href={`/admin/users/${p.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-black"
                  style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                >
                  Edit
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}