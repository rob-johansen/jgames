import { observer } from 'mobx-react-lite'
import { twMerge } from 'tailwind-merge'
import type { HTMLProps } from 'react'

import { getColor, getCornerText, getTextColor } from '@/libs/phase10/card'
import { Icon, ChevronLeft, ChevronRight } from '@/components/icon'
import { SKIP, WILD } from '@jgames/types'
import type { Card as CardType } from '@jgames/types'

type Props = HTMLProps<HTMLDivElement> & {
  arranging?: boolean
  card: CardType
  hiding?: boolean
  inHand: boolean
  onClick?: (card: CardType) => void
  scaling?: boolean
}

export const Card = observer((props: Props) => {
  const { arranging, card, className, hiding, inHand, onClick, scaling, style } = props

  if (hiding) {
    return (
      <div
        className={twMerge(`${inHand ? 'absolute bottom-0' : 'relative'} bg-phase10-cover-blue drop-shadow-lg font-quicksand h-[225px] overflow-hidden rounded-[8px] select-none text-white w-[150px]`, className)}
        style={style}
      >
        <div className='flex flex-col font-bold items-center left-[8px] relative rotate-[80deg] text-[3rem] top-[45px]'>
          <span>Phase</span>
          <span className="relative top-[-32px]">10</span>
        </div>
        <div className="bg-phase10-card-red h-[10px] left-[-84px] relative rotate-[80deg] top-[-40px] w-[240px]" />
        <div className="bg-phase10-card-blue h-[10px] left-[-98px] relative rotate-[80deg] top-[-40px] w-[240px]" />
        <div className="bg-phase10-card-green h-[10px] left-[-112px] relative rotate-[80deg] top-[-40px] w-[240px]" />
        <div className="bg-phase10-card-purple h-[10px] left-[-126px] relative rotate-[80deg] top-[-40px] w-[240px]" />
      </div>
    )
  }

  return (
    <div
      className={twMerge(`${inHand ? 'absolute bottom-0' : 'relative'} bg-white border border-[#aaaaaa] drop-shadow-lg h-[225px] p-[8px] rounded-[8px] select-none text-white w-[150px] ${scaling && 'cursor-pointer hover:scale-110'}`, className)}
      onClick={() => {
        if (onClick) onClick(card)
      }}
      style={style}
    >
      <div className={`${getColor(card.color)} flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full`}>
        <span className="relative text-[2.25rem] top-[-8px]">{getCornerText(card.value)}</span>
        <span className="relative text-[1.5rem] top-[-2px]">{getCornerText(card.value)}</span>
      </div>
      {card.value === SKIP || card.value === WILD ? (
        <div className="relative">
          <div className="bg-phase10-card-red h-[24px] mt-[-2px] skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-blue h-[24px] mt-[5px] relative skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-green h-[24px] mt-[5px] relative skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-purple h-[24px] mt-[5px] relative skew-y-[-7deg] w-full" />
          <div className="absolute font-black h-fit inset-0 m-auto phase10-skip-wild-shadow skew-y-[-7deg] text-[2.875rem] text-phase10-card-black w-fit">
            {card.value === SKIP ? 'SKIP' : 'WILD'}
          </div>
        </div>
      ) : (
        <div className={`${getTextColor(card.color)} absolute font-bold h-fit inset-0 m-auto skew-y-[-7deg] text-[6rem] top-[-10px] w-fit`}>
          {card.value}
        </div>
      )}
      <div className={`${getColor(card.color)} absolute bottom-[8px] flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t scale-[-1] w-[132px]`}>
        <span className="relative scale-[-1] text-[2.25rem] top-[-2px]">{getCornerText(card.value)}</span>
        <span className="relative scale-[-1] text-[1.5rem] top-[-16px]">{getCornerText(card.value)}</span>
      </div>
      {arranging && (
        <div className="absolute bg-white flex border border-slate-400 h-[36px] items-center left-[0] rounded-[6px] top-[94px] w-[36px]">
          <Icon primary="#475569" source={ChevronLeft} />
          <Icon primary="#475569" source={ChevronRight} />
        </div>
      )}
    </div>
  )
})
