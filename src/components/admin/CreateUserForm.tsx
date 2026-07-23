'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserForm({ communities }: { communities: any[] }) {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('community_admin')
  const [communityId, setCommunityId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, role, communityId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Failed to create user')
      setLoading(false)
      return
    }

    setSuccess(`✅ Invitation sent to ${email}! They will receive an email to set their password.`)
    setEmail('')
    setDisplayName('')
    setCommunityId('')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4"
      style={{ backgroundColor: '#141A17', border: '1px solid #1F2B26' }}>

      {error && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#2A0A0A', color: '#FF3B3B', border: '1px solid #FF3B3B30' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#0D3320', color: '#00FF87', border: '1px solid #00FF8730' }}>
          {success}
        </div>
      )}

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
          Email Address *
        </label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required placeholder="admin@example.com"
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
        <p className="text-xs mt-1" style={{ color: '#4A5C54' }}>
          An invitation email will be sent to this address
        </p>
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
          Display Name
        </label>
        <input
          type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. John Smith"
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        />
      </div>

      <div>
        <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
          Role *
        </label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required
          className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
          style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
        >
          <option value="community_admin">🛡️ Community Admin</option>
          <option value="reporter">📝 Reporter</option>
          <option value="super_admin">⚡ Super Admin</option>
        </select>
      </div>

      {role !== 'super_admin' && (
        <div>
          <label className="text-xs font-bold mb-1.5 block" style={{ color: '#4A5C54' }}>
            Community {role !== 'super_admin' && '*'}
          </label>
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            required={role !== 'super_admin'}
            className="w-full px-3 py-2.5 rounded-lg text-xs outline-none font-bold"
            style={{ backgroundColor: '#1A2320', color: '#F0F4F2', border: '1px solid #1F2B26' }}
          >
            <option value="">Select community...</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Info box */}
      <div className="px-4 py-3 rounded-lg text-xs"
        style={{ backgroundColor: '#1A2320', color: '#8A9E96', border: '1px solid #1F2B26' }}>
        <div className="font-black mb-1" style={{ color: '#F0F4F2' }}>What happens next:</div>
        <ol className="space-y-1 list-decimal list-inside">
          <li>User receives invitation email</li>
          <li>They click the link and set their password</li>
          <li>They can immediately login to their community portal</li>
          <li>Their role and community are pre-assigned</li>
        </ol>
      </div>

      <div className="flex gap-3 pt-2">
        <a href="/admin/users"
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide text-center"
          style={{ backgroundColor: '#1A2320', color: '#4A5C54' }}
        >
          Cancel
        </a>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-wide disabled:opacity-50"
          style={{ backgroundColor: '#00FF87', color: '#0A0F0D' }}
        >
          {loading ? '⏳ Sending...' : '📧 Send Invitation'}
        </button>
      </div>
    </form>
  )
}