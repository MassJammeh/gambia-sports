import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityTeamForm from '@/components/community/TeamForm'

export default async function NewTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>New Team</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
      </div>
      <CommunityTeamForm communityId={community.id} communitySlug={slug} />
    </div>
  )
}