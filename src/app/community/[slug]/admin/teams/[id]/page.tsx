import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityTeamForm from '@/components/community/TeamForm'

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()
  const { data: team } = await supabase.from('teams').select('*').eq('id', id).single()
  if (!team) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Edit Team</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{team.name}</p>
      </div>
      <CommunityTeamForm communityId={community.id} communitySlug={slug} team={team} />
    </div>
  )
}