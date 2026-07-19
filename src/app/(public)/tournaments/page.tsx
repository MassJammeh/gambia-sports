import { createClient } from '@/lib/supabase/server'
import { getActiveLeagues, getCurrentSeason } from '@/lib/queries'
import Link from 'next/link'

const communityLabels: Record<string, { label: string; icon: string }> = {
  serekunda_west: { label: 'Serekunda West', icon: '🏟' },
  serekunda_east: { label: 'Serekunda East', icon: '🏟' },
  manjai: { label: 'Manjai Park', icon: '🏟' },
  brikama: { label: 'Brikama Box Bar', icon: '🏟' },
  banjul: { label: 'Banjul', icon: '🏟' },
  bakau: { label: 'Bakau', icon: '🏟' },
  tallinding: { label: 'Tallinding', icon: '🏟' },
  latrikunda: { label: 'Latrikunda', icon: '🏟' },
  bundung: { label: 'Bundung', icon: '🏟' },
  sukuta: { label: 'Sukuta', icon: '🏟' },
  other: { label: 'Other', icon: '🏟' },
}

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: string; desc: string }> = {
  qualify_round: {
    label: 'Qualify Round',
    color: '#D97706',
    bg: '#FEF3C7',
    icon: '🔑',
    desc: 'New & relegated teams only',
  },
  small_cup_nawettan: {
    label: 'Small Cup Nawettan',
    color: '#0057A8',
    bg: '#EFF6FF',
    icon: '🥈',
    desc: 'Pure knockout — lose and you\'re out',
  },
  big_cup_nawettan: {
    label: 'Big Cup Nawettan',
    color: '#C1272D',
    bg: '#FEE2E2',
    icon: '🏆',
    desc: 'Group stage + knockout bracket',
  },
  league: {
    label: 'League',
    color: '#1A6B3A',
    bg: '#E8F5EE',
    icon: '📊',
    desc: 'Round robin format',
  },
  cup: {
    label: 'Cup',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: '🥇',
    desc: 'Cup competition',
  },
  friendly: {
    label: 'Friendly',
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: '🤝',
    desc: 'Friendly tournament',
  },
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  upcoming: { bg: '#E8F5EE', color: '#1A6B3A', label: '⏳ Upcoming' },
  group_stage: { bg: '#EFF6FF', color: '#1D4ED8', label: '⚽ Group Stage' },
  knockout: { bg: '#FEF3C7', color: '#D97706', label: '🔥 Knockout' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: '✅ Completed' },
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

  const ungrouped = tournaments?.filter(t => !t.community) ?? []
  const totalTournaments = tournaments?.length ?? 0

  return (
    <div className="space-y-8">

      {/* Header */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Tournaments</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {firstLeague.name} · {season.name} · Nawetans & Cup Competitions
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          🏆 {totalTournaments} Competitions
        </div>
      </div>

      {/* How Nawetans works */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #E5E7EB' }}
      >
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
        >
          <span className="text-xl">🇬🇲</span>
          <h2 className="font-black text-white text-lg">How the Nawetans Works</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ backgroundColor: '#F9FAFB' }}>
          {[
            {
              icon: '🔑',
              title: 'Qualify Round',
              color: '#D97706',
              bg: '#FEF3C7',
              points: [
                'Only new & relegated teams play',
                'Pure knockout format',
                'Winners qualify for main Nawetans',
              ],
            },
            {
              icon: '🥈',
              title: 'Small Cup Nawettan',
              color: '#0057A8',
              bg: '#EFF6FF',
              points: [
                'All qualified teams compete',
                'Pure knockout — lose once, you\'re out',
                'Like the Carabao Cup',
              ],
            },
            {
              icon: '🏆',
              title: 'Big Cup Nawettan',
              color: '#C1272D',
              bg: '#FEE2E2',
              points: [
                'Group stage then knockout',
                'Like the World Cup & Champions League',
                '0 pts in both = relegated to Qualify',
              ],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4"
              style={{ backgroundColor: item.bg, border: `1px solid ${item.color}20` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-black text-sm" style={{ color: item.color }}>{item.title}</span>
              </div>
              <ul className="space-y-1.5">
                {item.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-medium" style={{ color: '#4B5563' }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: item.color }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="px-5 py-3 flex items-center gap-2 text-xs font-bold"
          style={{ backgroundColor: '#FEF3C7', color: '#D97706', borderTop: '1px solid #FDE68A' }}
        >
          ⚠️ Teams with 0 points in both Small Cup & Big Cup are relegated back to Qualify Rounds next season
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
        <div className="space-y-10">

          {/* Grouped by community */}
          {Object.entries(grouped).map(([community, communityTournaments]) => {
            const communityInfo = communityLabels[community] ?? { label: community, icon: '🏟' }
            return (
              <div key={community}>
                {/* Community header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-black text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #0F4A28, #1A6B3A)' }}
                  >
                    {communityInfo.icon} {communityInfo.label} Mini Stadium
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                  <div className="text-xs font-bold" style={{ color: '#9CA3AF' }}>
                    {communityTournaments?.length} tournament{(communityTournaments?.length ?? 0) > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Tournament cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['qualify_round', 'small_cup_nawettan', 'big_cup_nawettan'] as const).map((type) => {
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
                          <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>
                            {typeInfo.label}
                          </div>
                          <div className="text-xs" style={{ color: '#9CA3AF' }}>Not created yet</div>
                        </div>
                      )
                    }

                    const status = statusConfig[t.status] ?? statusConfig.upcoming
                    return (
                      <Link
                        key={t.id}
                        href={`/tournaments/${t.slug}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                        style={{ border: `2px solid ${typeInfo.color}25` }}
                      >
                        {/* Type banner */}
                        <div
                          className="px-4 py-3 flex items-center justify-between"
                          style={{ backgroundColor: typeInfo.bg }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{typeInfo.icon}</span>
                            <span className="font-black text-xs uppercase tracking-wide" style={{ color: typeInfo.color }}>
                              {typeInfo.label}
                            </span>
                          </div>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: status.bg, color: status.color }}
                          >
                            {status.label}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="font-black text-base mb-1" style={{ color: '#111827' }}>
                            {t.name}
                          </div>
                          <div className="text-xs mb-3" style={{ color: '#6B7280' }}>
                            {typeInfo.desc}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {t.num_groups && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                                👥 {t.num_groups} Groups
                              </span>
                            )}
                            {t.start_date && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                                📅 {new Date(t.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                            {t.teams_advance_per_group && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                                ⬆️ Top {t.teams_advance_per_group} advance
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div
                          className="px-4 py-2.5 flex items-center justify-between"
                          style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}
                        >
                          <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>
                            {communityInfo.label}
                          </span>
                          <span className="text-xs font-black" style={{ color: typeInfo.color }}>
                            View →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Ungrouped */}
          {ungrouped.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="px-5 py-2 rounded-full font-black text-sm text-white"
                  style={{ backgroundColor: '#6B7280' }}
                >
                  🏟 Other Tournaments
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ungrouped.map((t) => {
                  const status = statusConfig[t.status] ?? statusConfig.upcoming
                  const typeInfo = typeConfig[t.tournament_type ?? 'big_cup_nawettan'] ?? typeConfig.big_cup_nawettan
                  return (
                    <Link
                      key={t.id}
                      href={`/tournaments/${t.slug}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ border: '1px solid #E5E7EB' }}
                    >
                      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: typeInfo.bg }}>
                        <span className="text-xl">{typeInfo.icon}</span>
                        <span className="font-black text-xs" style={{ color: typeInfo.color }}>{typeInfo.label}</span>
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