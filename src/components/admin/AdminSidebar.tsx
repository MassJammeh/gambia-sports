'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/communities', label: 'Communities', icon: '🏟' },
  { href: '/admin/matches', label: 'Matches', icon: '⚽' },
  { href: '/admin/fixtures/new', label: 'New Fixture', icon: '📅' },
  { href: '/admin/teams', label: 'Teams', icon: '🛡️' },
  { href: '/admin/players', label: 'Players', icon: '👤' },
  { href: '/admin/tournaments', label: 'Tournaments', icon: '🏆' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
]

export default function AdminSidebar({ profile }: { profile: any }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? '72px' : '240px',
          backgroundColor: '#0F4A28',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg">🇬🇲</span>
              <span className="text-white font-black uppercase tracking-widest text-sm">GamFoot</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white opacity-60 hover:opacity-100 transition-all ml-auto"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {profile.role.replace('_', ' ')}
            </div>
            <div className="text-sm font-semibold text-white mt-0.5 truncate">
              {profile.display_name ?? 'Admin'}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  borderLeft: isActive ? '3px solid #C1272D' : '3px solid transparent',
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-2 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <form action="/api/admin/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <span className="text-lg">🚪</span>
              {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#0F4A28', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span>🇬🇲</span>
          <span className="text-white font-black uppercase tracking-widest text-sm">GamFoot Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
            {profile.role.replace('_', ' ')}
          </span>
        </div>
      </div>
    </>
  )
}