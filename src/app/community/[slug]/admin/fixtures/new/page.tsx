import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug, getTournamentsByCommunity } from '@/lib/queries'
import { notFound } from 'next/navigation'
import CommunityFixtureForm from '@/components/community/FixtureForm'

export default async function NewFixturePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('community_id', community.id)
    .eq('status', 'active')
    .order('name')

  const { data: tournaments } = await getTournamentsByCommunity(community.id)

  // Get groups for each tournament
  const tournamentsWithGroups = await Promise.all(
    (tournaments ?? []).map(async (t) => {
      const { data: groups } = await supabase
        .from('tournament_groups')
        .select('*')
        .eq('tournament_id', t.id)
        .order('name')
      return { ...t, groups: groups ?? [] }
    })
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Schedule Fixture</h1>
        <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{community.name}</p>
      </div>
      <CommunityFixtureForm
        teams={teams ?? []}
        tournaments={tournamentsWithGroups}
        communityId={community.id}
        communitySlug={slug}
      />
    </div>
  )
}