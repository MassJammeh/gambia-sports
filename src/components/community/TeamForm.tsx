'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommunityTeamForm({
  communityId,
  communitySlug,
  team,
}: {
  communityId: string
  communitySlug: string
  team?: any
}) {
  const isEdit = !!team
  const [name, setName] = useState(team?.name ?? '')
  const [slug, setSlug] = useState(team?.slug ?? '')
  const [homeGround, setHomeGround] = useState(team?.home_ground ?? '')
  const [foundedYear, setFoundedYear] = useState(team?.founded_year ?? '')
  const [colours, setColours] = useState(team?.colours ?? '')
  const [description, setDescription] = useState(team?.description ?? '')
  const [status, setStatus] = useState(team?.status ?? 'active')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
      home_ground: homeGround || null,
      founded_year: foundedYear ? Number(foundedYear) : null,
      colours: colours || null,
      description: description || null,
      status,
    }

    const { error } = isEdit
      ? await supabase.from('teams').update(payload).eq('id', team.id)
      : await supabase.from('teams').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/community/${communitySlug}/admin/teams`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>
      {error && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium" style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Team Name *</label>
          <input type="text" value={name}
            onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
            required placeholder="e.g. Wallidan FC"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Slug *</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            required placeholder="e.g. wallidan-fc"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Home Ground</label>
          <input type="text" value={homeGround} onChange={(e) => setHomeGround(e.target.value)}
            placeholder="e.g. Serekunda West Mini Stadium"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Founded Year</label>
          <input type="number" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)}
            placeholder="e.g. 2005" min={1900} max={2030}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Colours</label>
        <input type="text" value={colours} onChange={(e) => setColours(e.target.value)}
          placeholder="e.g. Green and White"
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={2} placeholder="Brief description..."
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      {isEdit && (
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <a href={`/community/${communitySlug}/admin/teams`}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
          style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
        >
          Cancel
        </a>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Team'}
        </button>
      </div>
    </form>
  )
}