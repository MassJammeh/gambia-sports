'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommunityTournamentForm({
  communityId,
  communitySlug,
  teams,
  tournament,
  groups,
}: {
  communityId: string
  communitySlug: string
  teams: any[]
  tournament?: any
  groups?: any[]
}) {
  const isEdit = !!tournament
  const [name, setName] = useState(tournament?.name ?? '')
  const [slug, setSlug] = useState(tournament?.slug ?? '')
  const [type, setType] = useState(tournament?.type ?? 'nawettan')
  const [seasonYear, setSeasonYear] = useState(tournament?.season_year ?? new Date().getFullYear())
  const [status, setStatus] = useState(tournament?.status ?? 'upcoming')
  const [numGroups, setNumGroups] = useState(tournament?.num_groups ?? 2)
  const [teamsAdvance, setTeamsAdvance] = useState(tournament?.teams_advance_per_group ?? 2)
  const [startDate, setStartDate] = useState(tournament?.start_date ?? '')
  const [endDate, setEndDate] = useState(tournament?.end_date ?? '')
  const [description, setDescription] = useState(tournament?.description ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Group management
  const [newGroupName, setNewGroupName] = useState('')
  const [addingGroup, setAddingGroup] = useState(false)

  const router = useRouter()

  function generateSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const payload = {
      name,
      slug: slug || generateSlug(name),
      community_id: communityId,
      type,
      season_year: Number(seasonYear),
      status,
      num_groups: type === 'nawettan' ? Number(numGroups) : null,
      teams_advance_per_group: type === 'nawettan' ? Number(teamsAdvance) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      description: description || null,
    }

    const { error } = isEdit
      ? await supabase.from('tournaments').update(payload).eq('id', tournament.id)
      : await supabase.from('tournaments').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/community/${communitySlug}/admin/tournaments`)
    router.refresh()
  }

  async function handleAddGroup() {
    if (!newGroupName || !tournament) return
    setAddingGroup(true)
    const supabase = createClient()
    await supabase.from('tournament_groups').insert({
      tournament_id: tournament.id,
      name: newGroupName,
      slug: generateSlug(newGroupName),
    })
    setNewGroupName('')
    setAddingGroup(false)
    router.refresh()
  }

  async function handleDeleteGroup(groupId: string) {
    const supabase = createClient()
    await supabase.from('tournament_groups').delete().eq('id', groupId)
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
        {error && (
          <div className="px-4 py-3 rounded-lg text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Name *</label>
            <input type="text" value={name}
              onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
              required placeholder="e.g. Serekunda West Nawettan 2025"
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            >
              <option value="nawettan">🏆 Nawettan</option>
              <option value="knockout">🥊 Knockout</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Season Year</label>
            <input type="number" value={seasonYear} onChange={(e) => setSeasonYear(e.target.value)}
              min={2020} max={2030}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="qualify_round">Qualify Round</option>
              <option value="group_stage">Group Stage</option>
              <option value="knockout">Knockout</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {type === 'nawettan' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Number of Groups</label>
              <input type="number" value={numGroups} onChange={(e) => setNumGroups(e.target.value)}
                min={1} max={8}
                className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Teams Advancing Per Group</label>
              <input type="number" value={teamsAdvance} onChange={(e) => setTeamsAdvance(e.target.value)}
                min={1} max={4}
                className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
                style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <a href={`/community/${communitySlug}/admin/tournaments`}
            className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
            style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
          >
            Cancel
          </a>
          <button type="submit" disabled={loading}
            className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
            style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Tournament'}
          </button>
        </div>
      </form>

      {/* Group management (edit only) */}
      {isEdit && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1F2B26' }}>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#6B8CFF' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A9E96' }}>
              Groups ({groups?.length ?? 0})
            </span>
          </div>

          {/* Existing groups */}
          {groups && groups.length > 0 && (
            <div className="divide-y" style={{ borderColor: '#1F2B26' }}>
              {groups.map((group: any) => (
                <div key={group.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-black text-xs" style={{ color: '#F0F4F2' }}>{group.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>
                      {(group.group_teams as any[]).length} teams assigned
                    </div>
                  </div>
                  <button onClick={() => handleDeleteGroup(group.id)}
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add group */}
          <div className="px-5 py-4 flex gap-3" style={{ borderTop: groups && groups.length > 0 ? '1px solid #1F2B26' : 'none' }}>
            <input
              type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Group A"
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none font-bold"
              style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
            />
            <button onClick={handleAddGroup} disabled={addingGroup || !newGroupName}
              className="px-4 py-2 rounded-lg font-black text-xs disabled:opacity-50"
              style={{ backgroundColor: '#0D3320', color: '#00FF87' }}
            >
              {addingGroup ? '...' : '+ Add Group'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}