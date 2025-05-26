'use client'

import { observer } from 'mobx-react-lite'
import type React from 'react'

import { ViewModel } from './ViewModel'
import type { Game } from '@jgames/types'
import { SKIP, WILD } from '@jgames/types'

type Props = {
  game: Game
  userId: string
  ws: WebSocket
}

type ViewProps = {
  vm: ViewModel
}

export const GamePage = ({ game, userId, ws }: Props): React.JSX.Element => {
  return (
    <View vm={new ViewModel(game, userId, ws)} />
  )
}

const View = observer(({ vm }: ViewProps): React.JSX.Element => {
  return (
    <div className="flex h-screen relative">
      <div className="absolute bottom-[50px] flex h-[225px] left-0 m-auto right-0 w-[1180px]">
        {(vm.myCards).map((card, index) => {
          return (
            <div
              className="absolute bg-white border border-[#aaaaaa] bottom-0 cursor-pointer h-[225px] p-[8px] rounded-[8px] select-none drop-shadow-lg text-white w-[150px]"
              key={card.id}
              style={{ left: index * 114 }}
            >
              <div className={`${vm.getCardColor(card.color)} flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full`}>
                <span className="relative text-[2.25rem] top-[-8px]">{vm.getCardCornerText(card.value)}</span>
                <span className="relative text-[1.5rem] top-[-2px]">{vm.getCardCornerText(card.value)}</span>
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
                <div className={`${vm.getCardTextColor(card.color)} absolute font-bold h-fit inset-0 m-auto skew-y-[-7deg] text-[6rem] top-[-10px] w-fit`}>
                  {card.value}
                </div>
              )}
              <div className={`${vm.getCardColor(card.color)} absolute bottom-[8px] flex font-bold font-quicksand h-[50px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t scale-[-1] w-[132px]`}>
                <span className="relative scale-[-1] text-[2.25rem] top-[-2px]">{vm.getCardCornerText(card.value)}</span>
                <span className="relative scale-[-1] text-[1.5rem] top-[-16px]">{vm.getCardCornerText(card.value)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
