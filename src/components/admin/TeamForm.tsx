'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TeamForm({
  leagues,
  profile,
  team,
}: {
  leagues: any[]
  profile: any
  team?: any
}) {
  const isEdit = !!team
  const [name, setName] = useState(team?.name ?? '')
  const [slug, setSlug] = useState(team?.slug ?? '')
  const [leagueId, setLeagueId] = useState(team?.league_id ?? profile?.league_id ?? leagues[0]?.id ?? '')
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
      league_id: leagueId,
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

    router.push('/admin/teams')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5" style={{ border: '1px solid #E5E7EB' }}>
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#C1272D' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Team Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!isEdit) setSlug(generateSlug(e.target.value))
            }}
            required
            placeholder="e.g. Wallidan FC"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="e.g. wallidan-fc"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>League *</label>
        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        >
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Home Ground</label>
          <input
            type="text"
            value={homeGround}
            onChange={(e) => setHomeGround(e.target.value)}
            placeholder="e.g. Independence Stadium"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Founded Year</label>
          <input
            type="number"
            value={foundedYear}
            onChange={(e) => setFoundedYear(e.target.value)}
            placeholder="e.g. 1990"
            min={1900}
            max={2030}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Colours</label>
        <input
          type="text"
          value={colours}
          onChange={(e) => setColours(e.target.value)}
          placeholder="e.g. Green and White"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief description of the club..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
        />
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: '#111827' }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: '2px solid #E5E7EB', color: '#111827', backgroundColor: '#F9FAFB' }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/admin/teams"
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-center transition-all hover:opacity-90"
          style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: loading ? '#6B7280' : '#1A6B3A' }}
        >
          {loading ? '⏳ Saving...' : isEdit ? '✅ Save Changes' : '➕ Add Team'}
        </button>
      </div>
    </form>
  )
}