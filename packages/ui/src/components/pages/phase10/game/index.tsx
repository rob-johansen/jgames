'use client'

import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

import { SKIP, WILD } from '@jgames/types'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const GamePage = observer(() => {
  const { game: store } = useContext(StoreContext)

  return (
    <div className="flex h-dvh relative">
      {/* TODO: This <div> will need to be wider when you draw a card and have 11 in your hand. */}
      <div className="absolute bottom-[50px] flex h-[225px] left-0 m-auto right-0 w-[1180px]">
        {(store.myCards).map((card, index) => {
          return (
            <div
              className="absolute bg-white border border-[#aaaaaa] bottom-0 cursor-pointer drag-card h-[225px] p-[8px] rounded-[8px] select-none drop-shadow-lg text-white w-[150px]"
              data-card-id={card.id}
              key={card.id}
              style={{ left: index * 114 }}
            >
              <div className={`${store.getCardColor(card.color)} flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full`}>
                <span className="relative text-[2.25rem] top-[-8px]">{store.getCardCornerText(card.value)}</span>
                <span className="relative text-[1.5rem] top-[-2px]">{store.getCardCornerText(card.value)}</span>
              </div>
              {card.value === SKIP || card.value === WILD ? (
                <div className="relative">
                  <div className="bg-phase10-card-red h-[24px] mt-[-2px] skew-y-[-7deg] w-full"/>
                  <div className="bg-phase10-card-blue h-[24px] mt-[5px] relative skew-y-[-7deg] w-full"/>
                  <div className="bg-phase10-card-green h-[24px] mt-[5px] relative skew-y-[-7deg] w-full"/>
                  <div className="bg-phase10-card-purple h-[24px] mt-[5px] relative skew-y-[-7deg] w-full"/>
                  <div className="absolute font-black h-fit inset-0 m-auto phase10-skip-wild-shadow skew-y-[-7deg] text-[2.875rem] text-phase10-card-black w-fit">
                    {card.value === SKIP ? 'SKIP' : 'WILD'}
                  </div>
                </div>
              ) : (
                <div className={`${store.getCardTextColor(card.color)} absolute font-bold h-fit inset-0 m-auto skew-y-[-7deg] text-[6rem] top-[-10px] w-fit`}>
                  {card.value}
                </div>
              )}
              <div className={`${store.getCardColor(card.color)} absolute bottom-[8px] flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t scale-[-1] w-[132px]`}>
                <span className="relative scale-[-1] text-[2.25rem] top-[-2px]">{store.getCardCornerText(card.value)}</span>
                <span className="relative scale-[-1] text-[1.5rem] top-[-16px]">{store.getCardCornerText(card.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
