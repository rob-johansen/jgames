import type { Game, Player, Result } from '@jgames/types'

/*
  Returns `true` if one or more players is on phase 11, and exactly one of those
  players has the lowest score. Note: this function assumes that the current
  round is over (i.e. any player has discarded their last card).
 */
export const isGameOver = (game: Game): boolean => {
  const candidates: Player[] = []

  for (const player of game.players) {
    if (player.phase === 11) {
      candidates.push(player)
    }
  }

  if (candidates.length === 0) return false
  if (candidates.length === 1) return true

  const points: Set<number> = new Set()

  for (const player of candidates) {
    points.add(player.points)
  }

  return points.size !== 1
}

/*
  Sets the results on `game`, when the game is known to be over.
 */
export const setResults = (game: Game) => {
  const results: Result[] = []

  for (const player of game.players) {
    results.push({
      name: player.name,
      phase: player.phase,
      points: player.points,
      rank: 0,
    })
  }

  results.sort((a, b) => {
    // Sort by phase (higher comes first).
    if (a.phase > b.phase) return -1
    if (a.phase < b.phase) return 1

    // The phases were equal, so we sort by points (lower comes first).
    return a.points - b.points
  })

  for (let i = 0; i < results.length; i++) {
    const prevPlayer = results[i - 1]
    const thisPlayer = results[i]

    if (i === 0) {
      thisPlayer.rank = 1
      continue
    }

    if (thisPlayer.phase === prevPlayer.phase && thisPlayer.points === prevPlayer.points) {
      thisPlayer.rank = prevPlayer.rank
    } else {
      thisPlayer.rank = prevPlayer.rank + 1
    }
  }

  game.results = results
}
