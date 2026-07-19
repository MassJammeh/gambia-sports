import { createClient } from '@/lib/supabase/server'
import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import Link from 'next/link'

const communityLabels: Record<string, string> = {
  serekunda_west: '🏟 Serekunda West',
  serekunda_east: '🏟 Serekunda East',
  manjai: '🏟 Manjai Park',
  brikama: '🏟 Brikama Box Bar',
  banjul: '🏟 Banjul',
  bakau: '🏟 Bakau',
  tallinding: '🏟 Tallinding',
  latrikunda: '🏟 Latrikunda',
  bundung: '🏟 Bundung',
  sukuta: '🏟 Sukuta',
  other: '🏟 Other',
}

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  qualify_round: { label: 'Qualify Round', color: '#D97706', bg: '#FEF3C7', icon: '🔑' },
  small_cup: { label: 'Small Cup', color: '#0057A8', bg: '#EFF6FF', icon: '🥈' },
  big_cup: { label: 'Big Cup', color: '#C1272D', bg: '#FEE2E2', icon: '🏆' },
  league: { label: 'League', color: '#1A6B3A', bg: '#E8F5EE', icon: '📊' },
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#E8F5EE', color: '#1A6B3A', label: 'Upcoming' },
  group_stage: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Group Stage' },
  knockout: { bg: '#FEF3C7', color: '#D97706', label: 'Knockout' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
}

export default async function TournamentsPage() {
  const { data: leagues } = await getActiveLeagues()
  const firstLeague = leagues?.[0]
  if (!firstLeague) return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active leagues found.</div>

  const { data: season } = await getCurrentSeason(firstLeague.id)
  if (!season) return <div className="text-center py-20" style={{ color: '#6B7280' }}>No active season found.</div>

  const supabase = await createClient()
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('season_id', season.id)
    .order('community')
    .order('tournament_type')

  // Group by community
  const grouped: Record<string, typeof tournaments> = {}
  tournaments?.forEach((t) => {
    const key = t.community ?? 'other'
    if (!grouped[key]) grouped[key] = []
    grouped[key]!.push(t)
  })

  // Also get ungrouped (no community set)
  const ungrouped = tournaments?.filter(t => !t.community) ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Tournaments
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          {firstLeague.name} — {season.name} · Nawetans & Cup Competitions
        </p>
      </div>

      {/* Nawetans explanation */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)', color: 'white' }}
      >
        <div className="font-black text-lg mb-2">🇬🇲 How the Nawetans Works</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          {[
            { icon: '🔑', title: 'Qualify Round', desc: 'New & relegated teams compete. Winners enter the main Nawetans.' },
            { icon: '🥈', title: 'Small Cup', desc: 'Pure knockout format. Lose once and you\'re out — like the Carabao Cup.' },
            { icon: '🏆', title: 'Big Cup', desc: 'Group stage then knockout. Like the World Cup & Champions League.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-xl mb-1">{item.icon} <span className="font-black text-sm">{item.title}</span></div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
          ⚠️ Teams with 0 points in both Small Cup & Big Cup are relegated back to Qualify Rounds next season.
        </div>
      </div>

      {!tournaments || tournaments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-5xl mb-4">🏆</div>
          <div className="font-black text-lg mb-2" style={{ color: '#111827' }}>No tournaments yet</div>
          <div className="text-sm" style={{ color: '#6B7280' }}>
            Tournaments will appear here once created by the admin.
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grouped by community */}
          {Object.entries(grouped).map(([community, communityTournaments]) => (
            <div key={community}>
              {/* Community header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="px-4 py-2 rounded-full font-black text-sm text-white"
                  style={{ backgroundColor: '#0F4A28' }}
                >
                  {communityLabels[community] ?? '🏟 ' + community}
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Show in order: qualify_round, small_cup, big_cup */}
                {(['qualify_round', 'small_cup', 'big_cup', 'league'] as const).map((type) => {
                  const t = communityTournaments?.find(t => t.tournament_type === type)
                  const typeInfo = typeConfig[type]

                  if (!t) {
                    return (
                      <div
                        key={type}
                        className="rounded-2xl p-5 text-center"
                        style={{ border: '2px dashed #E5E7EB', backgroundColor: '#F9FAFB' }}
                      >
                        <div className="text-3xl mb-2 opacity-30">{typeInfo.icon}</div>
                        <div className="text-xs font-black uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                          {typeInfo.label}
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Not created yet</div>
                      </div>
                    )
                  }

                  const status = statusConfig[t.status] ?? statusConfig.upcoming
                  return (
                    <Link
                      key={t.id}
                      href={`/tournaments/${t.slug}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ border: `2px solid ${typeInfo.color}30` }}
                    >
                      {/* Type banner */}
                      <div
                        className="px-4 py-3 flex items-center gap-2"
                        style={{ backgroundColor: typeInfo.bg }}
                      >
                        <span className="text-xl">{typeInfo.icon}</span>
                        <span className="font-black text-sm" style={{ color: typeInfo.color }}>
                          {typeInfo.label}
                        </span>
                        <span
                          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="font-black text-base mb-2" style={{ color: '#111827' }}>
                          {t.name}
                        </div>
                        {t.description && (
                          <p className="text-xs mb-3 line-clamp-2" style={{ color: '#6B7280' }}>
                            {t.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {t.num_groups && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                              {t.num_groups} Groups
                            </span>
                          )}
                          {t.start_date && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                              📅 {new Date(t.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Ungrouped tournaments */}
          {ungrouped.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 rounded-full font-black text-sm text-white" style={{ backgroundColor: '#6B7280' }}>
                  🏟 Other Tournaments
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ungrouped.map((t) => {
                  const status = statusConfig[t.status] ?? statusConfig.upcoming
                  const typeInfo = typeConfig[t.tournament_type ?? 'big_cup'] ?? typeConfig.big_cup
                  return (
                    <Link
                      key={t.id}
                      href={`/tournaments/${t.slug}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ border: '1px solid #E5E7EB' }}
                    >
                      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: typeInfo.bg }}>
                        <span className="text-xl">{typeInfo.icon}</span>
                        <span className="font-black text-sm" style={{ color: typeInfo.color }}>{typeInfo.label}</span>
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="font-black text-base" style={{ color: '#111827' }}>{t.name}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}