import { Match, StandingRow } from '@/types'

export function calculateStandings(matches: Match[]): StandingRow[] {
  const table: Record<string, StandingRow> = {}

  // Only use completed matches
  const completed = matches.filter((m) => m.status === 'completed')

  for (const match of completed) {
    const { home_team_id, away_team_id, home_score, away_score } = match

    if (home_score === undefined || away_score === undefined) continue
    if (!match.home_team || !match.away_team) continue

    // Init home team row if not exists
    if (!table[home_team_id]) {
      table[home_team_id] = initRow(
        home_team_id,
        match.home_team.name,
        match.home_team.logo_url
      )
    }

    // Init away team row if not exists
    if (!table[away_team_id]) {
      table[away_team_id] = initRow(
        away_team_id,
        match.away_team.name,
        match.away_team.logo_url
      )
    }

    const home = table[home_team_id]
    const away = table[away_team_id]

    // Update played
    home.played++
    away.played++

    // Update goals
    home.goals_for += home_score!
    home.goals_against += away_score!
    away.goals_for += away_score!
    away.goals_against += home_score!

    // Determine result
    if (home_score! > away_score!) {
      // Home win
      home.won++
      home.points += 3
      away.lost++
    } else if (home_score! < away_score!) {
      // Away win
      away.won++
      away.points += 3
      home.lost++
    } else {
      // Draw
      home.drawn++
      away.drawn++
      home.points++
      away.points++
    }
  }

  // Calculate goal difference and sort
  return Object.values(table)
    .map((row) => ({
      ...row,
      goal_difference: row.goals_for - row.goals_against,
    }))
    .sort((a, b) => {
      // Sort by: points → goal difference → goals for → name
      if (b.points !== a.points) return b.points - a.points
      if (b.goal_difference !== a.goal_difference)
        return b.goal_difference - a.goal_difference
      if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for
      return a.team_name.localeCompare(b.team_name)
    })
}

function initRow(
  team_id: string,
  team_name: string,
  team_logo: string | null
): StandingRow {
  return {
    team_id,
    team_name,
    team_logo,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    goal_difference: 0,
    points: 0,
  }
}