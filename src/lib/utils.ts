import { Match, GroupedMatches } from '@/types/database'

export function groupMatchesByDate(matches: Match[]): GroupedMatches[] {
  const groups: Map<string, Match[]> = new Map()

  matches.forEach((match) => {
    const date = new Date(match.scheduled_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(match)
  })

  return Array.from(groups.entries()).map(([date, matchList]) => ({
    date,
    matches: matchList,
  }))
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    fullDate: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
}

export function getMatchStatusBadge(match: Match) {
  if (match.status === 'scheduled') {
    return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' }
  }
  if (match.status === 'live') {
    return { label: 'Live', color: 'bg-red-100 text-red-800' }
  }
  return { label: 'Completed', color: 'bg-green-100 text-green-800' }
}

export function calculateGoalDifference(goalsFor: number, goalsAgainst: number): string {
  const diff = goalsFor - goalsAgainst
  return diff > 0 ? `+${diff}` : `${diff}`
}
