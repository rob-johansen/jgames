import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Phase5 = observer(() => {
  const { phase5: store } = useContext(StoreContext)

  return (
    <div className="absolute border border-slate-300 shadow-phase h-fit left-0 mt-[40px] mx-auto pb-[32px] right-0 rounded-[8px] w-[550px]">
      <div className="border-b border-b-slate-300 border-r border-r-slate-300 flex h-[273px] items-center justify-center px-[24px] py-[20px] relative rounded-br-[8px] w-full">
        <span className="absolute text-[2.25rem] text-slate-400">
          Run of 8
        </span>
        {store.state.run8.map((card, index) => {
          return (
            <Card
              card={card}
              className={`${index > 0 ? 'ml-[-100px]' : ''}`}
              inHand={false}
              key={card.id}
              onClick={() => store.onClickCard(card)}
            />
          )
        })}
      </div>
      <div className="flex gap-x-[8px] items-center justify-center mt-[32px]">
        <Button
          disabled={store.root.game.state.playingPhase}
          onClick={store.onClickClose}
          variant="secondary"
        >
          Close
        </Button>
        <Button
          loading={store.root.game.state.playingPhase}
          onClick={store.onClickPlay}
        >
          Play
        </Button>
      </div>
    </div>
  )
})
