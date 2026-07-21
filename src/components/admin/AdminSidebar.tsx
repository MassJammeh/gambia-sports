'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/communities', label: 'Communities', icon: '🏟' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
]

export default function AdminSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col transition-all duration-300 flex-shrink-0"
        style={{
          width: collapsed ? '64px' : '220px',
          backgroundColor: '#0D1410',
          borderRight: '1px solid #1E2A24',
          minHeight: '100vh',
        }}
      >
        {/* Logo */}
        <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1E2A24' }}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg">🇬🇲</span>
              <span className="font-black text-sm uppercase tracking-widest" style={{ color: '#00FF87' }}>GamFoot</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto" style={{ color: '#4A5C54' }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Role */}
        {!collapsed && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1E2A24' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#4A5C54' }}>
              Super Admin
            </div>
            <div className="text-xs font-black truncate" style={{ color: '#F0F4F2' }}>
              {profile?.display_name ?? profile?.role ?? 'Admin'}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? '#0D3320' : 'transparent',
                  color: isActive ? '#00FF87' : '#4A5C54',
                  borderLeft: isActive ? '2px solid #00FF87' : '2px solid transparent',
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-xs font-bold">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-2 py-4 space-y-0.5" style={{ borderTop: '1px solid #1E2A24' }}>
          <Link href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ color: '#4A5C54' }}
          >
            <span>🌐</span>
            {!collapsed && 'Public Site'}
          </Link>
          <form action="/api/admin/signout" method="POST">
            <button type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
              style={{ color: '#4A5C54' }}
            >
              <span>🚪</span>
              {!collapsed && 'Sign Out'}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#0D1410', borderBottom: '1px solid #1E2A24' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span>🇬🇲</span>
          <span className="font-black text-sm uppercase tracking-widest" style={{ color: '#00FF87' }}>GamFoot</span>
        </Link>
        <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>Super Admin</span>
      </div>
    </>
  )
}