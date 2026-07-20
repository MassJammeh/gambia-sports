import { createClient } from '@/lib/supabase/server'

// ============================================
// COMMUNITIES
// ============================================

export async function getCommunities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('status', 'active')
    .order('name')
  return { data, error: error?.message || null }
}

export async function getCommunityBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()
  return { data, error: error?.message || null }
}

// ============================================
// TEAMS
// ============================================

export async function getTeamsByCommunity(communityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('community_id', communityId)
    .eq('status', 'active')
    .order('name')
  return { data, error: error?.message || null }
}

export async function getTeamBySlug(communityId: string, slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*, community:communities(*)')
    .eq('community_id', communityId)
    .eq('slug', slug)
    .single()
  return { data, error: error?.message || null }
}

// ============================================
// TOURNAMENTS
// ============================================

export async function getTournamentsByCommunity(communityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('community_id', communityId)
    .order('season_year', { ascending: false })
  return { data, error: error?.message || null }
}

export async function getTournamentBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, community:communities(*)')
    .eq('slug', slug)
    .single()
  return { data, error: error?.message || null }
}

// ============================================
// MATCHES
// ============================================

export async function getMatchesByTournament(tournamentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('tournament_id', tournamentId)
    .order('scheduled_at', { ascending: true })
  return { data, error: error?.message || null }
}

export async function getMatchesByCommunity(communityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      tournament:tournaments(*)
    `)
    .eq('community_id', communityId)
    .order('scheduled_at', { ascending: false })
  return { data, error: error?.message || null }
}

export async function getRecentResults(communityId: string, limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      tournament:tournaments(name, type)
    `)
    .eq('community_id', communityId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(limit)
  return { data, error: error?.message || null }
}

export async function getUpcomingFixtures(communityId: string, limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      tournament:tournaments(name, type)
    `)
    .eq('community_id', communityId)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(limit)
  return { data, error: error?.message || null }
}

export async function getLiveMatches(communityId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      tournament:tournaments(name, type)
    `)
    .eq('community_id', communityId)
    .eq('status', 'live')
    .order('scheduled_at', { ascending: true })
  return { data, error: error?.message || null }
}

// ============================================
// STANDINGS CALCULATOR
// ============================================

export function calculateStandings(matches: any[]): any[] {
  const table: Record<string, any> = {}

  const completed = matches.filter((m) => m.status === 'completed')

  for (const match of completed) {
    const { home_team_id, away_team_id, home_score, away_score } = match
    if (home_score === undefined || away_score === undefined) continue
    if (!match.home_team || !match.away_team) continue

    if (!table[home_team_id]) {
      table[home_team_id] = {
        team_id: home_team_id,
        team_name: match.home_team.name,
        team_logo: match.home_team.logo_url,
        played: 0, won: 0, drawn: 0, lost: 0,
        goals_for: 0, goals_against: 0,
        goal_difference: 0, points: 0,
      }
    }

    if (!table[away_team_id]) {
      table[away_team_id] = {
        team_id: away_team_id,
        team_name: match.away_team.name,
        team_logo: match.away_team.logo_url,
        played: 0, won: 0, drawn: 0, lost: 0,
        goals_for: 0, goals_against: 0,
        goal_difference: 0, points: 0,
      }
    }

    const home = table[home_team_id]
    const away = table[away_team_id]

    home.played++
    away.played++
    home.goals_for += home_score
    home.goals_against += away_score
    away.goals_for += away_score
    away.goals_against += home_score

    if (home_score > away_score) {
      home.won++
      home.points += 3
      away.lost++
    } else if (away_score > home_score) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points++
      away.points++
    }
  }

  return Object.values(table)
    .map((row) => ({ ...row, goal_difference: row.goals_for - row.goals_against }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference
      if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for
      return a.team_name.localeCompare(b.team_name)
    })
}