import { observer } from 'mobx-react-lite'
import { Fragment, useContext, useState } from 'react'

import { Icon, Ban, Plus } from '@/components/icon'
import { StatusStore } from './Store'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Status = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new StatusStore(root))

  return (
    <div className="absolute left-[20px] top-[20px] z-50">
      <button
        className="bg-[#6a0dad] flex items-center justify-center relative rounded-full size-[36px] z-40"
        onClick={() => store.setOpen(!store.state.open)}
      >
        <Icon className={`duration-200 ${store.state.open && 'rotate-[135deg]'} size-[24px] transition-transform`} source={Plus} />
      </button>
      {store.state.open && (
        <div className="bg-white border border-[#6a0dad] grid grid-cols-[1fr_2fr_2fr_2fr_2fr] items-center left-[16px] px-[12px] py-[8px] relative rounded-[5px] top-[-16px] z-30">
          <span className="font-bold">&nbsp;</span>
          <span className="font-bold pr-[16px]">Name</span>
          <span className="font-bold pr-[8px] text-center">Phase</span>
          <span className="font-bold text-center">Points</span>
          <span className="font-bold text-center">Hand</span>
          {store.players.map((player) => {
            return (
              <Fragment key={player.id}>
                <span className="flex relative size-[12px] transform translate-x-[5px]">
                  {store.isPlayerTurn(player) && (
                    <>
                      <span className="absolute animate-ping bg-[#6a0dad] h-full inline-flex opacity-50 rounded-full w-full"></span>
                      <span className="bg-[#6a0dad] inline-flex relative rounded-full size-[12px]"></span>
                    </>
                  )}
                  {player.skipped && (
                    <Icon className="relative top-[-2px]" source={Ban} />
                  )}
                </span>
                <span className="pr-[16px]">{player.name}</span>
                <span className="pr-[8px] text-center">{player.phase}</span>
                <span className="pr-[8px] text-center">{player.points}</span>
                <span className="text-center">{store.hand(player)}</span>
              </Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
})
