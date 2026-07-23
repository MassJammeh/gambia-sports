'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LiveScoreBoard({
  matches: initialMatches,
  communityId,
}: {
  matches: any[]
  communityId: string
}) {
  const [matches, setMatches] = useState(initialMatches)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`live-scores-${communityId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'matches',
        filter: `community_id=eq.${communityId}`,
      }, (payload) => {
        setMatches(prev =>
          prev.map(m => m.id === payload.new.id
            ? { ...m, ...payload.new }
            : m
          ).filter(m => m.status === 'live')
        )
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [communityId])

  if (matches.length === 0) return null

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div key={match.id}
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#141A17', border: '2px solid #FF3B3B40' }}
        >
          {/* Live header */}
          <div className="px-5 py-2 flex items-center justify-between"
            style={{ backgroundColor: '#2A0A0A', borderBottom: '1px solid #FF3B3B20' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FF3B3B' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#FF3B3B' }}>
                Live
              </span>
            </div>
            <span className="text-xs font-black" style={{ color: '#FF3B3B' }}>
              {match.minute}'
            </span>
          </div>

          {/* Score */}
          <div className="px-5 py-5 flex items-center gap-4">
            <div className="flex-1 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto mb-2"
                style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
              >
                {match.home_team?.name?.charAt(0)}
              </div>
              <div className="font-black text-sm truncate" style={{ color: '#F0F4F2' }}>
                {match.home_team?.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Home</div>
            </div>

            <div className="flex-shrink-0 text-center">
              <div
                className="px-6 py-3 rounded-xl font-black text-3xl"
                style={{ backgroundColor: '#1A0A0A', color: '#FF3B3B', minWidth: '100px' }}
              >
                {match.home_score} — {match.away_score}
              </div>
            </div>

            <div className="flex-1 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mx-auto mb-2"
                style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}
              >
                {match.away_team?.name?.charAt(0)}
              </div>
              <div className="font-black text-sm truncate" style={{ color: '#F0F4F2' }}>
                {match.away_team?.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Away</div>
            </div>
          </div>

          {/* Tournament */}
          <div className="px-5 py-2 text-xs" style={{ backgroundColor: '#111916', borderTop: '1px solid #1F2B26', color: '#4A5C54' }}>
            🏆 {match.tournament?.name}
          </div>
        </div>
      ))}
    </div>
  )
}