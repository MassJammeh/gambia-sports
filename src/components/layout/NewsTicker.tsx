import { createClient } from '@/lib/supabase/server'

export default async function NewsTicker() {
  const supabase = await createClient()

  const { data: results } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), tournament:tournaments(name, community_id)')
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(8)

  const { data: liveMatches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('status', 'live')
    .limit(5)

  const { data: communities } = await supabase
    .from('communities')
    .select('name')
    .eq('status', 'active')
    .limit(5)

  const items: string[] = []

  // Live matches first
  liveMatches?.forEach((m) => {
    items.push(`🔴 LIVE: ${(m.home_team as any)?.name} ${m.home_score} — ${m.away_score} ${(m.away_team as any)?.name} (${m.minute}')`)
  })

  // Recent results
  results?.forEach((m) => {
    items.push(`⚽ FT: ${(m.home_team as any)?.name} ${m.home_score} — ${m.away_score} ${(m.away_team as any)?.name}`)
  })

  // Community news
  communities?.forEach((c) => {
    items.push(`🏟 ${c.name} Nawettan 2025 is underway`)
  })

  items.push('🇬🇲 Welcome to GamFoot — The home of Nawettan football in The Gambia')
  items.push('📱 Follow live scores for every community on GamFoot')

  if (items.length === 0) return null

  const tickerText = items.join('   •••   ')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden"
      style={{ backgroundColor: '#0F4A28', borderTop: '2px solid #C1272D', height: '36px' }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full text-xs font-black uppercase tracking-widest"
        style={{ backgroundColor: '#C1272D', color: 'white', borderRight: '2px solid rgba(255,255,255,0.2)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'white' }} />
        LIVE
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="whitespace-nowrap text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.9)', animation: 'ticker 40s linear infinite' }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>
    </div>
  )
}