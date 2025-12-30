import type { Player } from '@jgames/types'

export const getNextTurn = (currentTurn: string, players: Player[]): string | undefined => {
  const map: Map<number, string> = new Map()
  let next = 0

  for (const player of players) {
    map.set(player.number, player.id)
    if (currentTurn === player.id) {
      next = player.number === players.length ? 1 : player.number + 1
    }
  }

  return map.get(next)
}
