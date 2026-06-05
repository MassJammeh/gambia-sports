'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MatchResultForm({
  match,
  isSuperAdmin,
}: {
  match: any
  isSuperAdmin: boolean
}) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0)
  const [reason, setReason] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const homeName = match.home_team?.name
  const awayName = match.away_team?.name
  const isEdit = match.status === 'completed'

  async function handleConfirm() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (isEdit && isSuperAdmin) {
      // Write to audit log first
      await supabase.from('match_audit').insert({
        match_id: match.id,
        changed_by: (await supabase.auth.getUser()).data.user!.id,
        old_home_score: match.home_score,
        old_away_score: match.away_score,
        new_home_score: homeScore,
        new_away_score: awayScore,
        reason: reason || null,
      })
    }

    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'completed',
      })
      .eq('id', match.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/matches')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6" style={{ border: '1px solid #E5E7EB' }}>
      <h2 className="text-lg font-black" style={{ color: '#111827' }}>
        {isEdit ? 'Correct Score' : 'Enter Final Score'}
      </h2>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Score inputs */}
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Home score */}
        <div className="text-center">
          <div className="text-sm font-bold mb-2 truncate" style={{ color: '#6B7280' }}>{homeName}</div>
          <input
            type="number"
            min={0}
            max={99}
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
            className="w-full text-center text-4xl font-black py-4 rounded-2xl outline-none transition-all"
            style={{
              border: '3px solid #1A6B3A',
              color: '#1A6B3A',
              backgroundColor: '#F0FDF4',
            }}
          />
        </div>

        {/* Divider */}
        <div className="text-center text-3xl font-black" style={{ color: '#E5E7EB' }}>—</div>

        {/* Away score */}
        <div className="text-center">
          <div className="text-sm font-bold mb-2 truncate" style={{ color: '#6B7280' }}>{awayName}</div>
          <input
            type="number"
            min={0}
            max={99}
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
            className="w-full text-center text-4xl font-black py-4 rounded-2xl outline-none transition-all"
            style={{
              border: '3px solid #C1272D',
              color: '#C1272D',
              backgroundColor: '#FFF5F5',
            }}
          />
        </div>
      </div>

      {/* Reason (super admin edit only) */}
      {isEdit && isSuperAdmin && (
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>
            Reason for correction (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Score was entered incorrectly"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827' }}
          />
        </div>
      )}

      {/* Confirmation step */}
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#1A6B3A' }}
        >
          {isEdit ? '✏️ Review Changes' : '⚽ Review Result'}
        </button>
      ) : (
        <div className="space-y-3">
          {/* Confirmation dialog */}
          <div
            className="px-5 py-4 rounded-2xl text-center"
            style={{ backgroundColor: '#E8F5EE', border: '2px solid #1A6B3A' }}
          >
            <div className="text-sm font-bold mb-1" style={{ color: '#6B7280' }}>
              Confirm {isEdit ? 'score correction' : 'result'}:
            </div>
            <div className="text-2xl font-black" style={{ color: '#111827' }}>
              {homeName} {homeScore} — {awayScore} {awayName}
            </div>
            {isEdit && reason && (
              <div className="text-xs mt-2" style={{ color: '#6B7280' }}>Reason: {reason}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
            >
              ← Go Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: loading ? '#6B7280' : '#C1272D' }}
            >
              {loading ? '⏳ Saving...' : '✅ Confirm'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}