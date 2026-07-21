import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityPlayerForm from '@/components/community/PlayerForm'

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()
  const { data: player } = await supabase.from('players').select('*').eq('id', id).single()
  if (!player) notFound()

  const { data: teams } = await supabase
    .from('teams').select('*').eq('community_id', community.id).eq('status', 'active').order('name')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Edit Player</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{player.name}</p>
      </div>
      <CommunityPlayerForm communityId={community.id} communitySlug={slug} teams={teams ?? []} player={player} />
    </div>
  )
}