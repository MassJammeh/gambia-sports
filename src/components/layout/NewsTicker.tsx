import { createClient } from '@/lib/supabase/server'

export default async function NewsTicker() {
  const supabase = await createClient()

  // Get recent results
  const { data: results } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(5)

  // Get upcoming fixtures
  const { data: fixtures } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const items: string[] = []

  // Add results
  results?.forEach((m) => {
    const home = (m.home_team as any)?.name
    const away = (m.away_team as any)?.name
    items.push(`⚽ FT: ${home} ${m.home_score} — ${m.away_score} ${away}`)
  })

  // Add fixtures
  fixtures?.forEach((m) => {
    const home = (m.home_team as any)?.name
    const away = (m.away_team as any)?.name
    const date = m.scheduled_at
      ? new Date(m.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      : 'TBD'
    items.push(`📅 ${home} vs ${away} — ${date}`)
  })

  // Add static items
  items.push('🏆 GFF First Division 2024/25 Season is underway')
  items.push('🇬🇲 Welcome to GamFoot — The home of Gambian football')
  items.push('📱 Follow all live scores and standings on GamFoot')

  if (items.length === 0) return null

  const tickerText = items.join('   •••   ')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center overflow-hidden"
      style={{
        backgroundColor: '#0F4A28',
        borderTop: '2px solid #C1272D',
        height: '36px',
      }}
    >
      {/* LIVE label */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full text-xs font-black uppercase tracking-widest"
        style={{
          backgroundColor: '#C1272D',
          color: 'white',
          borderRight: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: 'white' }}
        />
        LIVE
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden">
        <div
          className="whitespace-nowrap text-xs font-medium"
          style={{
            color: 'rgba(255,255,255,0.9)',
            animation: 'ticker 40s linear infinite',
          }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>
      
    </div>
  )
}