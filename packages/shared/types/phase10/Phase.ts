import { Card } from './Card'

type PhaseMap = {
  1: { set3a: Card[], set3b: Card[] }
  2: { set3: Card[], run4: Card[] }
  3: { set4: Card[], run4: Card[] }
  4: { run7: Card[] }
  5: { run8: Card[] }
  6: { run9: Card[] }
  7: { set4a: Card[], set4b: Card[] }
  8: { color7: Card[] }
  9: { set5: Card[], set2: Card[] }
  10: { set5: Card[], set3: Card[] }
};

export type Phase<T extends keyof PhaseMap = keyof PhaseMap> = PhaseMap[T]
