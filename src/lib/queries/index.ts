import { createClient } from '@/lib/supabase/server'

export async function getActiveLeagues() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('status', 'active')
    .order('name')
  return { data, error: error?.message || null }
}

export async function getCurrentSeason(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('seasons')
    .select('*, league:leagues(*)')
    .eq('league_id', leagueId)
    .eq('status', 'active')
    .single()
  return { data, error: error?.message || null }
}

export async function getMatchesBySeason(seasonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      season:seasons(*)
    `)
    .eq('season_id', seasonId)
    .order('scheduled_at', { ascending: true })
  return { data, error: error?.message || null }
}

export async function getFixtures(seasonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('season_id', seasonId)
    .in('status', ['scheduled', 'postponed'])
    .order('scheduled_at', { ascending: true })
  return { data, error: error?.message || null }
}

export async function getResults(seasonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('season_id', seasonId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
  return { data, error: error?.message || null }
}

export async function getUpcomingFixtures(seasonId: string, limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('season_id', seasonId)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(limit)
  return { data, error: error?.message || null }
}

export async function getRecentResults(seasonId: string, limit = 5) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq('season_id', seasonId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
    .limit(limit)
  return { data, error: error?.message || null }
}

export async function getTeamsBySeason(seasonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', seasonId)
    .eq('status', 'active')
    .order('name')
  return { data, error: error?.message || null }
}

export async function getAllSeasons(leagueId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('league_id', leagueId)
    .order('start_date', { ascending: false })
  return { data, error: error?.message || null }
}

export async function getTournamentsBySeason(seasonId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('season_id', seasonId)
    .eq('status', 'active')
    .order('name')
  return { data, error: error?.message || null }
}