import { beforeEach, describe, expect, it } from 'vitest'

import { validatePhase2 } from '@/index'
import { WILD } from '@jgames/types'
import type { Card, Phase } from '@jgames/types'

describe('validatePhase2', () => {
  const phase: Phase<2> = {
    set3: [
      { value: 3 } as Card,
      { value: 3 } as Card,
      { value: 3 } as Card,
    ],
    run4: []
  }

  describe('when the run starts with a WILD card', () => {
    beforeEach(() => {
      phase.run4[0] = { value: WILD } as Card
    })

    describe('when the next three cards are 1,2,3', () => {
      beforeEach(() => {
        phase.run4[1] = { value: 1 } as Card
        phase.run4[2] = { value: 2 } as Card
        phase.run4[3] = { value: 3 } as Card
      })

      it('should throw (because 0 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the next three cards are 2,3,4', () => {
      beforeEach(() => {
        phase.run4[1] = { value: 2 } as Card
        phase.run4[2] = { value: 3 } as Card
        phase.run4[3] = { value: 4 } as Card
      })

      it('should not throw (because 1 is a valid starting card)', () => {
        expect(() => validatePhase2(phase)).not.to.throw()
      })
    })

    describe('when the next three cards are 11,12,WILD', () => {
      beforeEach(() => {
        phase.run4[1] = { value: 11 } as Card
        phase.run4[2] = { value: 12 } as Card
        phase.run4[3] = { value: WILD } as Card
      })

      it('should throw (because 10 is not a valid starting card for a run of 4)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })
  })

  describe('when the run starts with two WILD cards', () => {
    beforeEach(() => {
      phase.run4[0] = { value: WILD } as Card
      phase.run4[1] = { value: WILD } as Card
    })

    describe('when the next two cards are 1,2', () => {
      beforeEach(() => {
        phase.run4[2] = { value: 1 } as Card
        phase.run4[3] = { value: 2 } as Card
      })

      it('should throw (because -1 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the next two cards are 2,3', () => {
      beforeEach(() => {
        phase.run4[2] = { value: 2 } as Card
        phase.run4[3] = { value: 3 } as Card
      })

      it('should throw (because 0 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the next two cards are 3,4', () => {
      beforeEach(() => {
        phase.run4[2] = { value: 3 } as Card
        phase.run4[3] = { value: 4 } as Card
      })

      it('should not throw (because 1 is a valid starting card)', () => {
        expect(() => validatePhase2(phase)).not.to.throw()
      })
    })

    describe('when the next two cards are 12,WILD', () => {
      beforeEach(() => {
        phase.run4[2] = { value: 12 } as Card
        phase.run4[3] = { value: WILD } as Card
      })

      it('should throw (because 10 is not a valid starting card for a run of 4)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })
  })

  describe('when the run starts with three WILD cards', () => {
    beforeEach(() => {
      phase.run4[0] = { value: WILD } as Card
      phase.run4[1] = { value: WILD } as Card
      phase.run4[2] = { value: WILD } as Card
    })

    describe('when the last card is 1', () => {
      beforeEach(() => {
        phase.run4[3] = { value: 1 } as Card
      })

      it('should throw (because -2 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the last card is 2', () => {
      beforeEach(() => {
        phase.run4[3] = { value: 2 } as Card
      })

      it('should throw (because -1 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the last card is 3', () => {
      beforeEach(() => {
        phase.run4[3] = { value: 3 } as Card
      })

      it('should throw (because 0 is not a valid starting card)', () => {
        expect(() => validatePhase2(phase)).to.throw()
      })
    })

    describe('when the last card is 4', () => {
      beforeEach(() => {
        phase.run4[3] = { value: 4 } as Card
      })

      it('should not throw (because 1 is a valid starting card)', () => {
        expect(() => validatePhase2(phase)).not.to.throw()
      })
    })
  })

  describe('when the run is all WILDs', () => {
    beforeEach(() => {
      phase.run4[0] = { value: WILD } as Card
      phase.run4[1] = { value: WILD } as Card
      phase.run4[2] = { value: WILD } as Card
      phase.run4[3] = { value: WILD } as Card
    })

    it('should throw (because your implementation of Phase 10 doesn’t support a run of all WILDs)', () => {
      expect(() => validatePhase2(phase)).to.throw('A run must have more than just WILD cards.')
    })
  })

  describe('when the run starts with a non-WILD card', () => {
    beforeEach(() => {
      phase.run4[0] = { value: 1 } as Card
    })

    describe('when the second card is a WILD card', () => {
      beforeEach(() => {
        phase.run4[1] = { value: WILD } as Card
      })

      describe('when the last two cards do not form a valid run', () => {
        beforeEach(() => {
          phase.run4[2] = { value: 4 } as Card
          phase.run4[3] = { value: 3 } as Card
        })

        it('should throw', () => {
          expect(() => validatePhase2(phase)).to.throw()
        })
      })

      describe('when the last two cards form a valid run', () => {
        beforeEach(() => {
          phase.run4[2] = { value: 3 } as Card
          phase.run4[3] = { value: 4 } as Card
        })

        it('should not throw', () => {
          expect(() => validatePhase2(phase)).not.to.throw()
        })
      })
    })

    describe('when the second and third cards are WILD', () => {
      beforeEach(() => {
        phase.run4[1] = { value: WILD } as Card
        phase.run4[2] = { value: WILD } as Card
      })

      describe('when the last card does not form a valid run', () => {
        beforeEach(() => {
          phase.run4[3] = { value: 3 } as Card
        })

        it('should throw', () => {
          expect(() => validatePhase2(phase)).to.throw()
        })
      })

      describe('when the last card forms a valid run', () => {
        beforeEach(() => {
          phase.run4[3] = { value: 4 } as Card
        })

        it('should not throw', () => {
          expect(() => validatePhase2(phase)).not.to.throw()
        })
      })
    })

    describe('when the second and fourth cards are WILD', () => {
      beforeEach(() => {
        phase.run4[1] = { value: WILD } as Card
        phase.run4[3] = { value: WILD } as Card
      })

      describe('when the third card does not form a valid run', () => {
        beforeEach(() => {
          phase.run4[2] = { value: 9 } as Card
        })

        it('should throw', () => {
          expect(() => validatePhase2(phase)).to.throw()
        })
      })

      describe('when the third card forms a valid run', () => {
        beforeEach(() => {
          phase.run4[2] = { value: 3 } as Card
        })

        it('should not throw', () => {
          expect(() => validatePhase2(phase)).not.to.throw()
        })
      })
    })

    describe('when the third and fourth cards are WILD', () => {
      beforeEach(() => {
        phase.run4[2] = { value: WILD } as Card
        phase.run4[3] = { value: WILD } as Card
      })

      describe('when the second card does not form a valid run', () => {
        beforeEach(() => {
          phase.run4[1] = { value: 9 } as Card
        })

        it('should throw', () => {
          expect(() => validatePhase2(phase)).to.throw()
        })
      })

      describe('when the second card forms a valid run', () => {
        beforeEach(() => {
          phase.run4[1] = { value: 2 } as Card
        })

        it('should not throw', () => {
          expect(() => validatePhase2(phase)).not.to.throw()
        })
      })

      describe('when the first and second cards are too high', () => {
        beforeEach(() => {
          phase.run4[0] = { value: 10 } as Card
          phase.run4[1] = { value: 11 } as Card
        })

        it('should throw', () => {
          expect(() => validatePhase2(phase)).to.throw()
        })
      })
    })
  })
})
