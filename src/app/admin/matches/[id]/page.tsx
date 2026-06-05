import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MatchResultForm from '@/components/admin/MatchResultForm'

export default async function MatchResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: match } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(id, name),
      away_team:teams!away_team_id(id, name),
      season:seasons(name, league:leagues(name))
    `)
    .eq('id', id)
    .single()

  if (!match) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const isSuperAdmin = profile?.role === 'super_admin'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          {match.status === 'completed' ? 'Edit Score' : 'Enter Result'}
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          {(match.season as any)?.name} · {(match.season as any)?.league?.name}
        </p>
      </div>

      {/* Match card */}
      <div
        className="bg-white rounded-2xl p-6 shadow-sm"
        style={{ border: '1px solid #E5E7EB' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-2 shadow-md"
              style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
            >
              {(match.home_team as any)?.name?.charAt(0)}
            </div>
            <div className="font-black text-lg" style={{ color: '#111827' }}>
              {(match.home_team as any)?.name}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: '#6B7280' }}>Home</div>
          </div>

          <div className="text-center flex-shrink-0">
            <div className="text-2xl font-black" style={{ color: '#6B7280' }}>VS</div>
            {match.scheduled_at && (
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {new Date(match.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-2 shadow-md"
              style={{ background: 'linear-gradient(135deg, #C1272D, #e03040)' }}
            >
              {(match.away_team as any)?.name?.charAt(0)}
            </div>
            <div className="font-black text-lg" style={{ color: '#111827' }}>
              {(match.away_team as any)?.name}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: '#6B7280' }}>Away</div>
          </div>
        </div>
      </div>

      <MatchResultForm match={match} isSuperAdmin={isSuperAdmin} />
    </div>
  )
}