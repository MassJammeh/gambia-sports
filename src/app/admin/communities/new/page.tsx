import CommunityForm from '@/components/admin/CommunityForm'

export default function NewCommunityPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: '#F0F4F2' }}>New Community</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>Add a new Nawettan community</p>
      </div>
      <CommunityForm />
    </div>
  )
}