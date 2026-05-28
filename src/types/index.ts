// ============================================
// CORE DATABASE TYPES
// ============================================

export type Role = 'super_admin' | 'league_admin' | 'reporter' | 'public'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  created_at: string
  updated_at: string
}

// ============================================
// LEAGUE & SEASON
// ============================================

export interface League {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Season {
  id: string
  league_id: string
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
  updated_at: string
  league?: League
}

// ============================================
// TEAM & PLAYER
// ============================================

export interface Team {
  id: string
  league_id: string
  name: string
  slug: string
  logo_url: string | null
  home_ground: string | null
  founded_year: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  league?: League
}

export interface Player {
  id: string
  team_id: string
  name: string
  position: string | null
  jersey_number: number | null
  date_of_birth: string | null
  nationality: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  team?: Team
}

// ============================================
// MATCH
// ============================================

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled'

export interface Match {
  id: string
  season_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  venue: string | null
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  matchday: number | null
  notes: string | null
  created_at: string
  updated_at: string
  season?: Season
  home_team?: Team
  away_team?: Team
}

// ============================================
// STANDINGS
// ============================================

export interface StandingRow {
  team_id: string
  team_name: string
  team_logo: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

// ============================================
// TOURNAMENT
// ============================================

export type TournamentFormat = 'league' | 'knockout' | 'group_knockout' | 'nawetan'

export interface Tournament {
  id: string
  season_id: string
  name: string
  format: TournamentFormat
  description: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  season?: Season
}

export interface TournamentGroup {
  id: string
  tournament_id: string
  name: string
  created_at: string
  tournament?: Tournament
}

// ============================================
// SHARED / UTILITY TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}