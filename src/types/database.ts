// Database type definitions for Gambia Sports Platform

export interface League {
  id: string
  name: string
  country: string
  created_at: string
}

export interface Season {
  id: string
  league_id: string
  name: string
  year: number
  status: 'active' | 'inactive'
  created_at: string
}

export interface Team {
  id: string
  league_id: string
  name: string
  slug: string
  home_ground: string
  founded_year: number
  logo_url?: string
  created_at: string
  players?: Player[]
}

export interface Player {
  id: string
  team_id: string
  name: string
  position: string
  jersey_number: number
  date_of_birth?: string
  created_at: string
  team?: Team
}

export interface Match {
  id: string
  season_id: string
  home_team_id: string
  away_team_id: string
  home_score?: number
  away_score?: number
  scheduled_at: string
  venue?: string
  status: 'scheduled' | 'live' | 'completed'
  created_at: string
  home_team?: Team
  away_team?: Team
}

export interface Profile {
  id: string
  user_id: string
  role: 'admin' | 'viewer'
  created_at: string
}

// Helper types for API responses and components
export interface StandingsRow {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface GroupedMatches {
  date: string
  matches: Match[]
}
