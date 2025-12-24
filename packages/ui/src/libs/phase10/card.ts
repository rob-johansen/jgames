import { SKIP, WILD } from '@jgames/types'

export const getColor = (color: string): string => {
  if (color === 'blue') return 'bg-phase10-card-blue'
  if (color === 'green') return 'bg-phase10-card-green'
  if (color === 'purple') return 'bg-phase10-card-purple'
  if (color === 'red') return 'bg-phase10-card-red'
  return 'bg-phase10-card-black'
}

export const getCornerText = (value: number): string => {
  if (value === SKIP) return 'S'
  if (value === WILD) return 'W'
  return `${value}`
}

export const getTextColor = (color: string): string => {
  if (color === 'blue') return 'text-phase10-card-blue'
  if (color === 'green') return 'text-phase10-card-green'
  if (color === 'purple') return 'text-phase10-card-purple'
  return 'text-phase10-card-red'
}
