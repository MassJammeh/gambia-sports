'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Team {
  id: string
  name: string
}

interface Season {
  id: string
  name: string
}

export default function NewFixturePage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [season, setSeason] = useState<Season | null>(null)
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Get teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name')
        .order('name')

      if (teamsError) throw teamsError
      setTeams(teamsData || [])

      // Get active season
      const { data: leaguesData } = await supabase
        .from('leagues')
        .select('id')
        .limit(1)

      if (leaguesData && leaguesData.length > 0) {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id, name')
          .eq('league_id', leaguesData[0].id)
          .eq('status', 'active')
          .single()

        if (seasonData) {
          setSeason(seasonData)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error loading data')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateFixture(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (!season) {
        throw new Error('No active season found')
      }

      if (formData.homeTeam === formData.awayTeam) {
        throw new Error('Home and away teams must be different')
      }

      const { error } = await supabase.from('matches').insert({
        season_id: season.id,
        home_team_id: formData.homeTeam,
        away_team_id: formData.awayTeam,
        scheduled_at: `${formData.date}T${formData.time}:00`,
        venue: formData.venue,
        status: 'scheduled',
      })

      if (error) throw error
      router.push('/admin/matches')
    } catch (err: any) {
      setError(err.message || 'Error creating fixture')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Schedule New Fixture</h1>
        <p>Loading...</p>
      </main>
    )
  }

  if (!season) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Schedule New Fixture</h1>
        <p className="text-red-600">
          No active season found. Please create a season first.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Schedule New Fixture</h1>

      <form onSubmit={handleCreateFixture} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Home Team *</label>
          <select
            value={formData.homeTeam}
            onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select home team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Away Team *</label>
          <select
            value={formData.awayTeam}
            onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select away team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time *</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            type="text"
            placeholder="e.g., National Stadium"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Fixture'}
        </button>
      </form>
    </main>
  )
}
