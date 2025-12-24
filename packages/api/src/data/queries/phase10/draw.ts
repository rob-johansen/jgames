import { query } from '@/data/db'

export const drawFromPile = async (gameId: string, turnId: string): Promise<boolean> => {
  const sql = `
    UPDATE phase10.games
    SET pile = pile - 0
    WHERE id = $1
    AND turn = $2
  `

  const result = await query(sql, [gameId, turnId])
  return result.rowCount === 1
}
