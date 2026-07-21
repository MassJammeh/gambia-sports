'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommunityForm({ community }: { community?: any }) {
  const isEdit = !!community
  const [name, setName] = useState(community?.name ?? '')
  const [slug, setSlug] = useState(community?.slug ?? '')
  const [description, setDescription] = useState(community?.description ?? '')
  const [location, setLocation] = useState(community?.location ?? '')
  const [contactEmail, setContactEmail] = useState(community?.contact_email ?? '')
  const [contactPhone, setContactPhone] = useState(community?.contact_phone ?? '')
  const [status, setStatus] = useState(community?.status ?? 'active')
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
      description: description || null,
      location: location || null,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
      status,
    }

    const { error } = isEdit
      ? await supabase.from('communities').update(payload).eq('id', community.id)
      : await supabase.from('communities').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/communities')
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
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Community Name *</label>
          <input type="text" value={name}
            onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }}
            required placeholder="e.g. Serekunda West"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Slug *</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            required placeholder="e.g. serekunda-west"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Serekunda West, Kanifing"
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={2} placeholder="Brief description of the community..."
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none resize-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Contact Email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
            placeholder="admin@community.gm"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>Contact Phone</label>
          <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+220 XXX XXXX"
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          />
        </div>
      </div>

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

      <div className="flex gap-3 pt-2">
        <a href="/admin/communities"
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
          style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
        >
          Cancel
        </a>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Community'}
        </button>
      </div>
    </form>
  )
}