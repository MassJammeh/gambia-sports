import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const positionConfig: Record<string, { bg: string; label: string }> = {
  GK: { bg: '#D97706', label: 'Goalkeeper' },
  DEF: { bg: '#1D4ED8', label: 'Defender' },
  MID: { bg: '#1A6B3A', label: 'Midfielder' },
  FWD: { bg: '#C1272D', label: 'Forward' },
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get player with team info
  const { data: player } = await supabase
    .from('players')
    .select('*, team:teams!team_id(id, name, slug, league_id, logo_url)')
    .eq('id', id)
    .single()

  if (!player) notFound()

  const config = positionConfig[player.position] ?? { bg: '#6B7280', label: player.position }
  const team = player.team as any

  return (
    <div className="space-y-8">

      {/* Player Hero */}
      <section
        className="relative rounded-2xl overflow-hidden py-12 px-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${config.bg}dd 0%, ${config.bg}99 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex items-center gap-6">
          {/* Jersey number */}
          <div
            className="w-24 h-24 rounded-2xl border-4 border-white flex items-center justify-center font-black text-5xl shadow-xl flex-shrink-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            {player.jersey_number ?? '?'}
          </div>

          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {config.label}
            </div>
            <h1 className="text-3xl font-black">{player.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {team && (
                <Link
                  href={`/teams/${team.slug}`}
                  className="hover:text-white transition-colors font-semibold"
                >
                  🛡️ {team.name}
                </Link>
              )}
              {player.nationality && <span>🇬🇲 {player.nationality}</span>}
              {player.date_of_birth && (
                <span>
                  📅 {new Date(player.date_of_birth).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Jersey', value: `#${player.jersey_number ?? '—'}`, color: config.bg },
          { label: 'Position', value: player.position, color: config.bg },
          { label: 'Nationality', value: player.nationality ?? '—', color: '#1A6B3A' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 text-center shadow-sm"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div className="text-xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: '#6B7280' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Biography */}
      {player.biography && (
        <div
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <h2 className="text-lg font-black mb-3" style={{ color: '#111827' }}>Biography</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            {player.biography}
          </p>
        </div>
      )}

      {/* Team card */}
      {team && (
        <div
          className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          style={{ border: '1px solid #E5E7EB' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md"
            style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
          >
            {team.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-black text-base" style={{ color: '#111827' }}>{team.name}</div>
            <div className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Current Club</div>
          </div>
          <Link
            href={`/teams/${team.slug}`}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#1A6B3A' }}
          >
            View Team →
          </Link>
        </div>
      )}

      {/* Back link */}
      <Link
        href="/players"
        className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
        style={{ color: '#1A6B3A' }}
      >
        ← Back to all players
      </Link>
    </div>
  )
}