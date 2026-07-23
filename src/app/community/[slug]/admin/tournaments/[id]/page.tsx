import { createClient } from '@/lib/supabase/server'
import { getCommunityBySlug, getTeamsByCommunity } from '@/lib/queries'
import { notFound, redirect } from 'next/navigation'
import CommunityTournamentForm from '@/components/community/TournamentForm'
import GroupTeamManager from '@/components/community/GroupTeamManager'
import Link from 'next/link'

export default async function ManageTournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>
  searchParams: Promise<{ status?: string }>
}) {
  const { slug, id } = await params
  const { status: newStatus } = await searchParams

  const { data: community } = await getCommunityBySlug(slug)
  if (!community) notFound()

  const supabase = await createClient()

  // Update status if provided
  if (newStatus) {
    await supabase.from('tournaments').update({ status: newStatus }).eq('id', id)
    redirect(`/community/${slug}/admin/tournaments`)
  }

  const { data: tournament } = await supabase.from('tournaments').select('*').eq('id', id).single()
  if (!tournament) notFound()

  const { data: teams } = await getTeamsByCommunity(community.id)

  const { data: groups } = await supabase
    .from('tournament_groups')
    .select(`
      *,
      group_teams(
        id,
        team_id,
        team:teams(id, name)
      )
    `)
    .eq('tournament_id', id)
    .order('name')

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#F0F4F2' }}>Manage Tournament</h1>
          <p className="text-xs mt-0.5" style={{ color: '#4A5C54' }}>{tournament.name}</p>
        </div>
        <Link href={`/community/${slug}/admin/tournaments`}
          className="text-xs font-bold" style={{ color: '#4A5C54' }}>
          Back
        </Link>
      </div>

      {/* Tournament form */}
      <CommunityTournamentForm
        communityId={community.id}
        communitySlug={slug}
        teams={teams ?? []}
        tournament={tournament}
        groups={groups ?? []}
      />
          {/* Knockout Manager Link */}
              {tournament.type === 'knockout' && (
                <Link
                  href={`/community/${slug}/admin/tournaments/${id}/knockout`}
                  className="flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0D3320', border: '1px solid #00FF8720' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥊</span>
                    <div>
                      <div className="font-black text-sm" style={{ color: '#00FF87' }}>Knockout Bracket Manager</div>
                      <div className="text-xs" style={{ color: '#4A5C54' }}>Schedule fixtures by stage</div>
                    </div>
                  </div>
                  <span style={{ color: '#00FF87' }}>→</span>
                </Link>
              )}
      {/* Group team assignment */}
      {groups && groups.length > 0 && (
        <GroupTeamManager
          groups={groups}
          teams={teams ?? []}
          tournamentId={id}
        />
      )}
    </div>
  )
}