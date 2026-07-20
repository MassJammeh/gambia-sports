// ============================================
// CORE TYPES
// ============================================

export type Role = 'super_admin' | 'community_admin' | 'reporter' | 'fan'

export interface Profile {
  id: string
  role: Role
  community_id: string | null
  is_global: boolean
  display_name: string | null
  avatar_url: string | null
  status: string
  created_at: string
  updated_at: string
}

// ============================================
// COMMUNITY
// ============================================

export interface Community {
  id: string
  name: string
  slug: string
  description: string | null
  location: string | null
  logo_url: string | null
  cover_image_url: string | null
  contact_email: string | null
  contact_phone: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// ============================================
// TEAM
// ============================================

export interface Team {
  id: string
  community_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  home_ground: string | null
  founded_year: number | null
  colours: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  community?: Community
}

// ============================================
// PLAYER
// ============================================

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface Player {
  id: string
  team_id: string | null
  community_id: string
  name: string
  slug: string
  position: Position
  jersey_number: number | null
  date_of_birth: string | null
  nationality: string | null
  photo_url: string | null
  biography: string | null
  status: 'active' | 'inactive' | 'retired'
  created_at: string
  updated_at: string
  team?: Team
}

// ============================================
// TOURNAMENT
// ============================================

export type TournamentType = 'nawettan' | 'knockout'
export type TournamentStatus =
  | 'upcoming'
  | 'qualify_round'
  | 'small_cup'
  | 'group_stage'
  | 'knockout'
  | 'completed'

export interface Tournament {
  id: string
  community_id: string
  name: string
  slug: string
  type: TournamentType
  season_year: number
  description: string | null
  status: TournamentStatus
  num_groups: number | null
  teams_per_group: number | null
  teams_advance_per_group: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  community?: Community
}

// ============================================
// TOURNAMENT GROUP
// ============================================

export interface TournamentGroup {
  id: string
  tournament_id: string
  name: string
  slug: string
  created_at: string
  tournament?: Tournament
  teams?: Team[]
}

// ============================================
// MATCH
// ============================================

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled'
export type MatchStage =
  | 'qualify_round'
  | 'group'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'final'
  | 'third_place'

export interface Match {
  id: string
  tournament_id: string
  community_id: string
  group_id: string | null
  home_team_id: string
  away_team_id: string
  scheduled_at: string | null
  venue: string | null
  status: MatchStatus
  home_score: number
  away_score: number
  minute: number
  stage: MatchStage | null
  notes: string | null
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
  tournament?: Tournament
}

// ============================================
// MATCH EVENT
// ============================================

export type EventType =
  | 'goal'
  | 'own_goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution_in'
  | 'substitution_out'
  | 'penalty_scored'
  | 'penalty_missed'

export interface MatchEvent {
  id: string
  match_id: string
  team_id: string
  player_id: string | null
  event_type: EventType
  minute: number
  notes: string | null
  created_at: string
  player?: Player
  team?: Team
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
// UTILITY
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}