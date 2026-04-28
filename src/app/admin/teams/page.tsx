'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  slug: string
  league_id: string
  home_ground: string
  founded_year: number
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    home_ground: '',
    founded_year: new Date().getFullYear(),
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTeam(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const leagues = await supabase.from('leagues').select('id').limit(1)
      if (!leagues.data || leagues.data.length === 0) {
        throw new Error('No league found. Please create a league first.')
      }

      const { error } = await supabase.from('teams').insert({
        ...formData,
        league_id: leagues.data[0].id,
      })

      if (error) throw error

      setFormData({
        name: '',
        slug: '',
        home_ground: '',
        founded_year: new Date().getFullYear(),
      })
      setShowForm(false)
      await loadTeams()
    } catch (error: any) {
      console.error('Error adding team:', error)
      alert(error.message || 'Error adding team')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Teams</h1>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800"
        >
          {showForm ? 'Cancel' : 'Add Team'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTeam} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Add New Team</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Banjul United"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g., banjul-united"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Home Ground</label>
              <input
                type="text"
                value={formData.home_ground}
                onChange={(e) =>
                  setFormData({ ...formData, home_ground: e.target.value })
                }
                placeholder="e.g., National Stadium"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Founded Year</label>
              <input
                type="number"
                value={formData.founded_year}
                onChange={(e) =>
                  setFormData({ ...formData, founded_year: Number(e.target.value) })
                }
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Team'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">Team Name</th>
              <th className="p-4 text-left">Home Ground</th>
              <th className="p-4 text-left">Founded</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{team.name}</td>
                <td className="p-4">{team.home_ground || '-'}</td>
                <td className="p-4">{team.founded_year || '-'}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/players?team_id=${team.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Manage Players
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teams.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No teams found. Create one to get started.
          </div>
        )}
      </div>
    </main>
  )
}
