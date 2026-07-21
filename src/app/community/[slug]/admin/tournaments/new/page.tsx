import { getCommunityBySlug, getTeamsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityTournamentForm from '@/components/community/TournamentForm'

export default async function NewTournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const { data: teams } = await getTeamsByCommunity(community.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>New Tournament</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
      </div>
      <CommunityTournamentForm communityId={community.id} communitySlug={slug} teams={teams ?? []} />
    </div>
  )
}