'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function GroupTeamManager({
  groups,
  teams,
  tournamentId,
}: {
  groups: any[]
  teams: any[]
  tournamentId: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function assignTeam(groupId: string, teamId: string) {
    setLoading(`assign-${groupId}-${teamId}`)
    const supabase = createClient()
    await supabase.from('group_teams').insert({ group_id: groupId, team_id: teamId })
    setLoading(null)
    router.refresh()
  }

  async function removeTeam(groupTeamId: string) {
    setLoading(`remove-${groupTeamId}`)
    const supabase = createClient()
    await supabase.from('group_teams').delete().eq('id', groupTeamId)
    setLoading(null)
    router.refresh()
  }

  // Get all assigned team IDs across all groups
  const assignedTeamIds = groups.flatMap(g =>
    (g.group_teams as any[]).map((gt: any) => gt.team_id)
  )

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
      <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#F5A623' }} />
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
          Group Team Assignment
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Unassigned teams */}
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: '#4A5C54' }}>
            Unassigned Teams ({teams.filter(t => !assignedTeamIds.includes(t.id)).length})
          </div>
          <div className="flex flex-wrap gap-2">
            {teams.filter(t => !assignedTeamIds.includes(t.id)).map((team) => (
              <div key={team.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#1A2320', border: '1px solid #1F2B26' }}>
                <span className="text-xs font-black" style={{ color: '#8A9E96' }}>{team.name}</span>
              </div>
            ))}
            {teams.filter(t => !assignedTeamIds.includes(t.id)).length === 0 && (
              <span className="text-xs" style={{ color: '#4A5C54' }}>All teams assigned ✓</span>
            )}
          </div>
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => {
            const assignedTeams = (group.group_teams as any[])
            const unassignedTeams = teams.filter(t => !assignedTeamIds.includes(t.id))

            return (
              <div key={group.id} className="rounded-xl overflow-hidden"
                style={{ backgroundColor: '#1A2320', border: '1px solid #1F2B26' }}>
                {/* Group header */}
                <div className="px-4 py-2.5 font-black text-xs uppercase tracking-widest"
                  style={{ backgroundColor: '#0D3320', color: '#00FF87', borderBottom: '1px solid #1F2B26' }}>
                  {group.name} ({assignedTeams.length} teams)
                </div>

                {/* Assigned teams */}
                <div className="p-3 space-y-1.5">
                  {assignedTeams.length === 0 ? (
                    <div className="text-xs py-2 text-center" style={{ color: '#4A5C54' }}>No teams yet</div>
                  ) : (
                    assignedTeams.map((gt: any) => (
                      <div key={gt.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ backgroundColor: '#141A17' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center font-black text-xs"
                            style={{ backgroundColor: '#0D3320', color: '#00FF87' }}>
                            {gt.team?.name?.charAt(0)}
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#F0F4F2' }}>{gt.team?.name}</span>
                        </div>
                        <button
                          onClick={() => removeTeam(gt.id)}
                          disabled={loading === `remove-${gt.id}`}
                          className="text-xs font-bold px-2 py-0.5 rounded disabled:opacity-50"
                          style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}
                        >
                          {loading === `remove-${gt.id}` ? '...' : '✕'}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add team dropdown */}
                {unassignedTeams.length > 0 && (
                  <div className="px-3 pb-3">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          assignTeam(group.id, e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none font-bold"
                      style={{ backgroundColor: '#141A17', color: '#4A5C54', border: '1px solid #1F2B26' }}
                    >
                      <option value="">+ Add team to {group.name}</option>
                      {unassignedTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}