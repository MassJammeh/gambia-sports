'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'

interface Player {
  id: string
  name: string
  position: string
  jersey_number: number
  team_id: string
}

interface Team {
  id: string
  name: string
}

function AdminPlayersContent() {
  const searchParams = useSearchParams()
  const teamId = searchParams.get('team_id')
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(teamId || '')
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    jersey_number: '',
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam) {
      loadPlayers()
    }
  }, [selectedTeam])

  async function loadTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name')

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPlayers() {
    if (!selectedTeam) return
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', selectedTeam)
        .order('jersey_number')

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error loading players:', error)
    }
  }

  async function handleAddPlayer(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedTeam) {
      alert('Please select a team')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('players').insert({
        name: formData.name,
        position: formData.position,
        jersey_number: formData.jersey_number ? Number(formData.jersey_number) : null,
        team_id: selectedTeam,
      })

      if (error) throw error

      setFormData({
        name: '',
        position: '',
        jersey_number: '',
      })
      setShowForm(false)
      await loadPlayers()
    } catch (error: any) {
      console.error('Error adding player:', error)
      alert(error.message || 'Error adding player')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Players</h1>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Players</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800"
        >
          {showForm ? 'Cancel' : 'Add Player'}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Team</label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a team...</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && selectedTeam && (
        <form onSubmit={handleAddPlayer} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Add New Player</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Player Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Mohamed Jaiteh"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="e.g., Midfielder"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jersey Number</label>
              <input
                type="number"
                value={formData.jersey_number}
                onChange={(e) =>
                  setFormData({ ...formData, jersey_number: e.target.value })
                }
                placeholder="e.g., 7"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      )}

      {selectedTeam && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Position</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold text-blue-800">
                    {player.jersey_number || '-'}
                  </td>
                  <td className="p-4 font-medium">{player.name}</td>
                  <td className="p-4">{player.position || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {players.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No players found. Add one to get started.
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default function AdminPlayersPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-6">Loading...</div>}>
      <AdminPlayersContent />
    </Suspense>
  )
}
