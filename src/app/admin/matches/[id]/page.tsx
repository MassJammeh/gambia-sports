'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Match {
  id: string
  home_team: { name: string }
  away_team: { name: string }
  home_score: number
  away_score: number
  status: string
}

export default function EnterResultPage({
  params,
}: {
  params: { id: string }
}) {
  const [match, setMatch] = useState<Match | null>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadMatch() {
      try {
        const { data, error: fetchError } = await supabase
          .from('matches')
          .select(
            '*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)'
          )
          .eq('id', params.id)
          .single()

        if (fetchError) throw fetchError
        setMatch(data)
        setHomeScore(data.home_score || 0)
        setAwayScore(data.away_score || 0)
      } catch (err: any) {
        setError(err.message || 'Failed to load match')
      } finally {
        setLoading(false)
      }
    }

    loadMatch()
  }, [params.id, supabase])

  async function saveResult() {
    if (!match) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('matches')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          status: 'completed',
        })
        .eq('id', params.id)

      if (error) throw error
      router.push('/admin/matches')
    } catch (err: any) {
      setError(err.message || 'Failed to save result')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Enter Match Result</h1>
        <p>Loading...</p>
      </main>
    )
  }

  if (error || !match) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Error</h1>
        <p className="text-red-600 mb-4">{error || 'Match not found'}</p>
        <Link href="/admin/matches" className="text-blue-600 hover:underline">
          Back to Matches
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <Link href="/admin/matches" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Matches
      </Link>
      <h1 className="text-xl font-bold mb-6">Enter Match Result</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6 text-center">
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">Home</p>
            <p className="font-bold">{match.home_team.name}</p>
          </div>
          <span className="text-gray-400 mx-4">vs</span>
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">Away</p>
            <p className="font-bold">{match.away_team.name}</p>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Home Score</label>
            <input
              type="number"
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              className="w-full border-2 border-gray-300 text-center text-4xl p-3 rounded font-bold focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-2xl font-bold pb-4">-</span>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Away Score</label>
            <input
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              className="w-full border-2 border-gray-300 text-center text-4xl p-3 rounded font-bold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={saveResult}
          disabled={saving}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Result'}
        </button>
      </div>
    </main>
  )
}
