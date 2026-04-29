'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Team {
  id: string
  name: string
  slug: string
  home_ground: string
  founded_year: number
}

interface League {
  id: string
  name: string
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    home_ground: '',
    founded_year: new Date().getFullYear(),
    league_id: '',
  })

  // Load teams and leagues
  useEffect(() => {
    async function loadData() {
      try {
        const [leaguesRes, teamsRes] = await Promise.all([
          supabase.from('leagues').select('id,name'),
          supabase.from('teams').select('*'),
        ])

        if (leaguesRes.data) setLeagues(leaguesRes.data)
        if (teamsRes.data) setTeams(teamsRes.data)

        // Set default league
        if (leaguesRes.data && leaguesRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, league_id: leaguesRes.data[0].id }))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase.from('teams').insert([
        {
          name: formData.name,
          slug: formData.slug,
          home_ground: formData.home_ground,
          founded_year: formData.founded_year,
          league_id: formData.league_id,
        },
      ])

      if (error) throw error

      setSuccessMessage('Team added successfully!')
      setFormData({
        name: '',
        slug: '',
        home_ground: '',
        founded_year: new Date().getFullYear(),
        league_id: formData.league_id,
      })
      setShowForm(false)

      // Reload teams
      const { data } = await supabase.from('teams').select('*')
      if (data) setTeams(data)

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error adding team:', error)
      alert('Error adding team')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Teams Management</h1>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/admin" className="hover:text-blue-700 transition-colors">
            Admin
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Teams</span>
        </div>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Add Team'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-6 border border-green-200">
          ✓ {successMessage}
        </div>
      )}

      {/* Add Team Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white text-gray-900 rounded-lg shadow p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Add New Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Real Banjul"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug (URL friendly) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., real-banjul"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Home Ground *
              </label>
              <input
                type="text"
                required
                value={formData.home_ground}
                onChange={(e) =>
                  setFormData({ ...formData, home_ground: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Independence Stadium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Founded Year *
              </label>
              <input
                type="number"
                required
                value={formData.founded_year}
                onChange={(e) =>
                  setFormData({ ...formData, founded_year: parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Team'}
          </button>
        </form>
      )}

      {/* Teams Table */}
      <div className="bg-white text-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">Team Name</th>
              <th className="text-left p-4 font-semibold text-gray-900">Home Ground</th>
              <th className="text-center p-4 font-semibold text-gray-900">Founded</th>
              <th className="text-right p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{team.name}</td>
                  <td className="p-4 text-gray-700">{team.home_ground}</td>
                  <td className="p-4 text-center text-gray-700">{team.founded_year}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/teams/${team.slug}`}
                      className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No teams yet. Add your first team!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
