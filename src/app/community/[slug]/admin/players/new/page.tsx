import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityPlayerForm from '@/components/community/PlayerForm'

export default async function NewPlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()
  const { data: teams } = await supabase
    .from('teams').select('*').eq('community_id', community.id).eq('status', 'active').order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>New Player</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
      </div>
      <CommunityPlayerForm communityId={community.id} communitySlug={slug} teams={teams ?? []} />
    </div>
  )
}