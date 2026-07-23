'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function CommunityAdminSidebar({
  community,
  profile,
  stats,
}: {
  community: any
  profile: any
  stats?: {
    teams: number
    players: number
    matches: number
    live: number
  }
}) {
  const pathname = usePathname()
  const slug = community.slug
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { href: `/community/${slug}/admin`, label: 'Dashboard', icon: '📊', exact: true },
    { href: `/community/${slug}/admin/matches`, label: 'Matches', icon: '⚽' },
    { href: `/community/${slug}/admin/fixtures/new`, label: 'New Fixture', icon: '📅' },
    { href: `/community/${slug}/admin/tournaments`, label: 'Tournaments', icon: '🏆' },
    { href: `/community/${slug}/admin/teams`, label: 'Teams', icon: '🛡️' },
    { href: `/community/${slug}/admin/players`, label: 'Players', icon: '👤' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col transition-all duration-300 flex-shrink-0"
        style={{
          width: collapsed ? '64px' : '240px',
          backgroundColor: '#0D1410',
          borderRight: '1px solid #1E2A24',
          minHeight: '100vh',
        }}
      >
        {/* Logo */}
        <div className="px-4 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #1E2A24' }}>
          {!collapsed && (
            <Link href={`/communities/${slug}`} className="flex items-center gap-2">
              <span className="text-lg">🇬🇲</span>
              <span className="font-black text-sm uppercase tracking-widest" style={{ color: '#00FF87' }}>
                GamFoot
              </span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto" style={{ color: '#4A5C54' }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Community info */}
        {!collapsed && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1E2A24' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#4A5C54' }}>
              {profile?.role?.replace('_', ' ')}
            </div>
            <div className="text-sm font-black truncate" style={{ color: '#F0F4F2' }}>
              {community.name}
            </div>
            {community.location && (
              <div className="text-xs mt-0.5 truncate" style={{ color: '#4A5C54' }}>
                📍 {community.location}
              </div>
            )}
          </div>
        )}

        {/* Live indicator */}
        {!collapsed && stats && stats.live > 0 && (
          <div className="px-4 py-2.5 flex items-center gap-2"
            style={{ backgroundColor: '#2A0A0A', borderBottom: '1px solid #FF3B3B20' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
            <span className="text-xs font-black" style={{ color: '#FF3B3B' }}>
              {stats.live} Match{stats.live > 1 ? 'es' : ''} Live
            </span>
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

        {/* Stats */}
        {!collapsed && stats && (
          <div className="px-4 py-4 space-y-2" style={{ borderTop: '1px solid #1E2A24' }}>
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#4A5C54' }}>
              Community Stats
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Teams', value: stats.teams, color: '#00FF87' },
                { label: 'Players', value: stats.players, color: '#6B8CFF' },
                { label: 'Matches', value: stats.matches, color: '#FF3B3B' },
                { label: 'Live', value: stats.live, color: '#FF3B3B' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg p-2 text-center"
                  style={{ backgroundColor: '#1A2320' }}>
                  <div className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: '#4A5C54' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom links */}
        <div className="px-2 py-4 space-y-0.5" style={{ borderTop: '1px solid #1E2A24' }}>
          <Link href={`/communities/${slug}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ color: '#4A5C54' }}>
            <span>🌐</span>
            {!collapsed && 'Public Site'}
          </Link>
          <Link href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
            style={{ color: '#4A5C54' }}>
            <span>⚙️</span>
            {!collapsed && 'Super Admin'}
          </Link>
          <form action="/api/admin/signout" method="POST">
            <button type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold"
              style={{ color: '#4A5C54' }}>
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
        <Link href={`/communities/${slug}`} className="flex items-center gap-2">
          <span>🇬🇲</span>
          <span className="font-black text-sm uppercase tracking-widest" style={{ color: '#00FF87' }}>
            GamFoot
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {stats && stats.live > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded"
              style={{ backgroundColor: '#2A0A0A' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
              <span className="text-xs font-black" style={{ color: '#FF3B3B' }}>{stats.live} Live</span>
            </div>
          )}
          <span className="text-xs font-bold" style={{ color: '#4A5C54' }}>
            {community.name}
          </span>
        </div>
      </div>
    </>
  )
}