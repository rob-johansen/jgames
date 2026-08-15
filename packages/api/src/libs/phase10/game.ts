import type { Game, Player } from '@jgames/types'

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
