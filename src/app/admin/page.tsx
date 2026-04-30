'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalTeams: number
  totalPlayers: number
  matchesPlayed: number
  upcomingFixtures: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalTeams: 0,
    totalPlayers: 0,
    matchesPlayed: 0,
    upcomingFixtures: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      try {
        // Get leagues and seasons
        const leaguesRes = await supabase.from('leagues').select('id').limit(1).single()
        if (leaguesRes.error) throw leaguesRes.error
        const leagueId = leaguesRes.data?.id

        const seasonsRes = await supabase
          .from('seasons')
          .select('id')
          .eq('league_id', leagueId)
          .limit(1)
          .single()
        const seasonId = seasonsRes.data?.id

        // Fetch stats in parallel
        const [teamsRes, playersRes, matchesRes, fixturesRes] = await Promise.all([
          supabase.from('teams').select('id', { count: 'exact' }).eq('league_id', leagueId),
          supabase.from('players').select('id', { count: 'exact' }),
          supabase.from('matches').select('id', { count: 'exact' }).eq('season_id', seasonId).eq('status', 'completed'),
          supabase.from('matches').select('id', { count: 'exact' }).eq('season_id', seasonId).eq('status', 'scheduled'),
        ])

        setStats({
          totalTeams: teamsRes.count || 0,
          totalPlayers: playersRes.count || 0,
          matchesPlayed: matchesRes.count || 0,
          upcomingFixtures: fixturesRes.count || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [supabase])

  async function handleLogout() {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <span className="text-gray-900 font-semibold">Admin Dashboard</span>
        </div>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white text-gray-900 rounded-lg shadow p-6 border-l-4 border-l-blue-700">
          <p className="text-sm text-gray-500 font-semibold mb-2">TOTAL TEAMS</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTeams}</p>
          <p className="text-xs text-gray-400 mt-2">in the league</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow p-6 border-l-4 border-l-green-700">
          <p className="text-sm text-gray-500 font-semibold mb-2">TOTAL PLAYERS</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
          <p className="text-xs text-gray-400 mt-2">registered</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow p-6 border-l-4 border-l-purple-700">
          <p className="text-sm text-gray-500 font-semibold mb-2">MATCHES PLAYED</p>
          <p className="text-3xl font-bold text-gray-900">{stats.matchesPlayed}</p>
          <p className="text-xs text-gray-400 mt-2">completed</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow p-6 border-l-4 border-l-orange-700">
          <p className="text-sm text-gray-500 font-semibold mb-2">UPCOMING</p>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingFixtures}</p>
          <p className="text-xs text-gray-400 mt-2">fixtures</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/teams"
            className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <h3 className="font-bold text-xl mb-2">⚽ Teams</h3>
            <p className="text-gray-600 text-sm mb-4">Add, edit, and manage teams in the league</p>
            <p className="text-blue-700 font-semibold">Manage Teams →</p>
          </Link>

          <Link
            href="/admin/players"
            className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <h3 className="font-bold text-xl mb-2">👥 Players</h3>
            <p className="text-gray-600 text-sm mb-4">Register and manage player information</p>
            <p className="text-blue-700 font-semibold">Manage Players →</p>
          </Link>

          <Link
            href="/admin/matches"
            className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <h3 className="font-bold text-xl mb-2">📋 Matches</h3>
            <p className="text-gray-600 text-sm mb-4">Enter results, schedule fixtures, and manage matches</p>
            <p className="text-blue-700 font-semibold">Manage Matches →</p>
          </Link>

          <Link
            href="/admin/fixtures/new"
            className="bg-white text-gray-900 rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all border border-gray-200"
          >
            <h3 className="font-bold text-xl mb-2">📅 New Fixture</h3>
            <p className="text-gray-600 text-sm mb-4">Schedule a new upcoming match</p>
            <p className="text-blue-700 font-semibold">Schedule Fixture →</p>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="text-center pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
        >
          ← Back to Public Platform
        </Link>
      </div>
    </main>
  )
}
