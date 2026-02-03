import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { Icon, ChevronLeft, ChevronRight } from '@/components/icon'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Hit = observer(() => {
  const { hit: store } = useContext(StoreContext)

  return (
    <div className="absolute border border-slate-300 shadow-phase h-fit left-0 mt-[70px] mx-auto right-0 rounded-[8px] w-[1000px]">
      <div className="flex h-[265px] items-center justify-center px-[24px] py-[20px] relative">
        {store.state.cards.length > 0 ? (
          <>
            {store.state.cards.map((card, index) => {
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
          </>
        ) : (
          <span className="mt-[52px] text-[1.125rem]">
            {store.player.name} has not played a phase this round...
          </span>
        )}
      </div>
      <div className="flex items-center justify-center">
        <span className="font-bold text-[1.125rem]">
          {store.player.name}
        </span>
      </div>
      <div className="flex items-center justify-center mt-[16px] pb-[20px]">
        <button
          className="border border-slate-400 h-[48px] px-[8px] rounded-l-[8px]"
          onMouseDown={store.onClickBack}
        >
          <Icon className="size-[24px]" primary="#171717" source={ChevronLeft} />
        </button>
        <button
          className="border border-slate-400 h-[48px] px-[8px] rounded-r-[8px]"
          onMouseDown={store.onClickNext}
        >
          <Icon className="size-[24px]" primary="#171717" source={ChevronRight} />
        </button>
      </div>
      <div className="absolute bottom-[20px] flex gap-x-[8px] items-center justify-center right-[20px]">
        <Button
          disabled={store.root.game.state.hitting}
          onClick={store.root.game.toggleHit}
          variant="secondary"
        >
          Close
        </Button>
        <Button
          disabled={store.state.added.length === 0}
          loading={store.root.game.state.hitting}
          onClick={store.onClickConfirm}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
})
