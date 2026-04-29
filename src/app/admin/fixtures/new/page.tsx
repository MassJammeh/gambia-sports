'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Team {
  id: string
  name: string
}

interface Season {
  id: string
  name: string
}

export default function ScheduleFixturePage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    home_team_id: '',
    away_team_id: '',
    season_id: '',
    scheduled_at: '',
    venue: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [teamsRes, seasonsRes] = await Promise.all([
          supabase.from('teams').select('id,name').order('name'),
          supabase.from('seasons').select('id,name'),
        ])

        if (teamsRes.data) setTeams(teamsRes.data)
        if (seasonsRes.data) {
          setSeasons(seasonsRes.data)
          if (seasonsRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, season_id: seasonsRes.data[0].id }))
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Validation
    if (formData.home_team_id === formData.away_team_id) {
      setError('Home team and away team cannot be the same')
      setSubmitting(false)
      return
    }

    if (!formData.scheduled_at) {
      setError('Please select a date and time')
      setSubmitting(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from('matches').insert([
        {
          home_team_id: formData.home_team_id,
          away_team_id: formData.away_team_id,
          season_id: formData.season_id,
          scheduled_at: formData.scheduled_at,
          venue: formData.venue || null,
          status: 'scheduled',
        },
      ])

      if (insertError) throw insertError

      router.push('/admin/matches')
    } catch (err: any) {
      console.error('Error creating fixture:', err)
      setError(err.message || 'Failed to create fixture')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Schedule Fixture</h1>
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <div className="flex gap-2 text-gray-600">
          <Link href="/admin" className="hover:text-blue-700 transition-colors">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/matches" className="hover:text-blue-700 transition-colors">
            Matches
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Schedule Fixture</span>
        </div>
      </nav>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule a New Fixture</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 rounded-lg p-4 mb-6 border border-red-200">
          ✕ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white text-gray-900 rounded-lg shadow p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Home Team */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Home Team *
            </label>
            <select
              required
              value={formData.home_team_id}
              onChange={(e) =>
                setFormData({ ...formData, home_team_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select home team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Away Team */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Away Team *
            </label>
            <select
              required
              value={formData.away_team_id}
              onChange={(e) =>
                setFormData({ ...formData, away_team_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select away team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Season *
            </label>
            <select
              required
              value={formData.season_id}
              onChange={(e) =>
                setFormData({ ...formData, season_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduled_at}
              onChange={(e) =>
                setFormData({ ...formData, scheduled_at: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Venue */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="e.g., Independence Stadium"
            />
          </div>
        </div>

        {/* Warning if same teams */}
        {formData.home_team_id && formData.away_team_id && formData.home_team_id === formData.away_team_id && (
          <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 mb-6 border border-yellow-200">
            ⚠ Home team and away team are the same. Please select different teams.
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || (formData.home_team_id === formData.away_team_id && formData.home_team_id !== '')}
            className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Scheduling...' : 'Schedule Fixture'}
          </button>
          <Link
            href="/admin/matches"
            className="bg-gray-400 text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}
