import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

import { Card } from '@/components/phase10/Card'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Hit = observer(() => {
  const { hit: store } = useContext(StoreContext)

  return (
    <div className="absolute border border-slate-300 shadow-phase h-fit left-0 mt-[80px] mx-auto right-0 rounded-[8px] w-[950px]">
      <div className="flex items-center justify-center px-[24px] py-[20px] relative">
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
      </div>
    </div>
  )
})
