import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getLeagues() {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
  if (error) throw error
  return data
}

export async function getActiveSeason(leagueId: string) {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('league_id', leagueId)
    .eq('status', 'active')
    .single()
  if (error) throw error
  return data
}

export async function getStandings(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug,logo_url), away_team:teams!away_team_id(id,name,slug,logo_url)')
    .eq('season_id', seasonId)
    .eq('status', 'completed')
  if (error) throw error
  return data
}

export async function getFixtures(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug), away_team:teams!away_team_id(id,name,slug)')
    .eq('season_id', seasonId)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getResults(seasonId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(id,name,slug), away_team:teams!away_team_id(id,name,slug)')
    .eq('season_id', seasonId)
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getTeamBySlug(slug: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*, players(*)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getTeams(leagueId: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('league_id', leagueId)
  if (error) throw error
  return data
}

export async function getTeamById(teamId: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*, players(*)')
    .eq('id', teamId)
    .single()
  if (error) throw error
  return data
}

export async function getPlayerById(playerId: string) {
  const { data, error } = await supabase
    .from('players')
    .select('*, team:teams(*)')
    .eq('id', playerId)
    .single()
  if (error) throw error
  return data
}

export async function getMatchById(matchId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .eq('id', matchId)
    .single()
  if (error) throw error
  return data
}

export async function getAdminStats(leagueId: string, seasonId: string) {
  try {
    const [teamsRes, playersRes, matchesRes, fixturesRes] = await Promise.all([
      supabase.from('teams').select('id').eq('league_id', leagueId),
      supabase.from('players').select('id').eq('team_id', leagueId),
      supabase.from('matches').select('id').eq('season_id', seasonId).eq('status', 'completed'),
      supabase.from('matches').select('id').eq('season_id', seasonId).eq('status', 'scheduled')
    ])
    
    return {
      totalTeams: teamsRes.data?.length || 0,
      totalPlayers: playersRes.data?.length || 0,
      matchesPlayed: matchesRes.data?.length || 0,
      upcomingFixtures: fixturesRes.data?.length || 0
    }
  } catch (error) {
    throw error
  }
}