import { createClient } from '@/lib/supabase/server'

export default async function NewsTicker() {
  try {
    const supabase = await createClient()

    const [
      { data: liveMatches },
      { data: recentResults },
      { data: communities },
    ] = await Promise.all([
      supabase
        .from('matches')
        .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
        .eq('status', 'live')
        .limit(5),
      supabase
        .from('matches')
        .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(8),
      supabase
        .from('communities')
        .select('name')
        .eq('status', 'active')
        .limit(10),
    ])

    const items: string[] = []

    liveMatches?.forEach((m) => {
      items.push(`🔴 LIVE · ${(m.home_team as any)?.name} ${m.home_score} — ${m.away_score} ${(m.away_team as any)?.name} · ${m.minute}'`)
    })

    recentResults?.forEach((m) => {
      items.push(`⚽ FT · ${(m.home_team as any)?.name} ${m.home_score} — ${m.away_score} ${(m.away_team as any)?.name}`)
    })

    communities?.forEach((c) => {
      items.push(`🏟 ${c.name} Nawettan 2025 is underway`)
    })

    items.push('🇬🇲 Welcome to GamFoot — The home of Nawettan football in The Gambia')
    items.push('⚡ Live scores updated in real-time across all communities')
    items.push('🏆 Follow your community — Nawettan 2025 season is live')

    if (items.length === 0) return null

    const tickerText = items.join('     ·     ')

    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden"
        style={{
          backgroundColor: '#0A0F0D',
          borderTop: '1px solid #1F2B26',
          height: '38px',
        }}
      >
        {/* LIVE badge */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 h-full"
          style={{
            backgroundColor: '#FF3B3B',
            borderRight: '1px solid #FF3B3B50',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
          <span
            className="text-xs font-black uppercase tracking-widest text-white"
            style={{ letterSpacing: '0.15em' }}
          >
            LIVE
          </span>
        </div>

        {/* Ticker text */}
        <div className="flex-1 overflow-hidden px-2">
          <div
            className="whitespace-nowrap inline-block"
            style={{
              animation: 'ticker 60s linear infinite',
              fontSize: '12px',
              fontWeight: '700',
              color: '#8A9E96',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: '#00FF87' }}>◆</span>
            &nbsp;&nbsp;
            {tickerText}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ color: '#00FF87' }}>◆</span>
            &nbsp;&nbsp;
            {tickerText}
          </div>
        </div>

        {/* GamFoot brand */}
        <div
          className="flex-shrink-0 px-4 h-full flex items-center"
          style={{ borderLeft: '1px solid #1F2B26' }}
        >
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: '#00FF87', letterSpacing: '0.1em' }}
          >
            GamFoot
          </span>
        </div>
      </div>
    )
  } catch {
    return null
  }
}