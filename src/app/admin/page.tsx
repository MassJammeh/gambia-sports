'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/admin/teams"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg mb-2">Teams</h2>
            <p className="text-gray-500 text-sm">Add and manage teams</p>
          </a>

          <a
            href="/admin/players"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg mb-2">Players</h2>
            <p className="text-gray-500 text-sm">Register and manage players</p>
          </a>

          <a
            href="/admin/matches"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg mb-2">Matches</h2>
            <p className="text-gray-500 text-sm">Enter results and schedule fixtures</p>
          </a>

          <a
            href="/admin/fixtures/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg mb-2">Schedule Fixture</h2>
            <p className="text-gray-500 text-sm">Create a new upcoming match</p>
          </a>
        </div>
      </div>
    </main>
  )
}
