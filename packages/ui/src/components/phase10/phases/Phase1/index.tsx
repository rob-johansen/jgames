import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { Icon, ChevronLeft, ChevronRight } from '@/components/icon'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Phase1 = observer(() => {
  const { phase1: store } = useContext(StoreContext)

  return (
    <div className="absolute border border-slate-300 shadow-phase h-fit left-0 mt-[40px] mx-auto pb-[32px] right-0 rounded-[8px] w-[728px]">
      <div className="flex gap-x-[24px]">
        <div className="border-b border-b-slate-300 border-r border-r-slate-300 flex h-[273px] items-center justify-center px-[24px] py-[20px] relative rounded-br-[8px] w-[298px]">
          <span className="absolute text-[2.25rem] text-slate-400">
            Set of 3
          </span>
          {store.state.set1.map((card, index) => {
            return (
              <Card
                card={card}
                className={`${index > 0 ? 'ml-[-100px]' : ''}`}
                inHand={false}
                key={card.id}
              />
            )
          })}
        </div>
        <div className="flex items-center">
          <button
            className={`border border-slate-400 h-[48px] px-[8px] rounded-l-[8px] ${store.state.left ? 'shadow-phaseToggleInset' : 'shadow-phaseToggle'}`}
            onMouseDown={store.onClickLeft}
          >
            <Icon className="size-[24px]" primary={`${store.state.left ? '#171717' : '#94a3b8'}`} source={ChevronLeft} />
          </button>
          <button
            className={`border border-slate-400 h-[48px] px-[8px] rounded-r-[8px]  ${store.state.left ? 'shadow-phaseToggle' : 'shadow-phaseToggleInset'}`}
            onMouseDown={store.onClickRight}
          >
            <Icon className="size-[24px]" primary={`${store.state.left ? '#94a3b8' : '#171717'}`} source={ChevronRight} />
          </button>
        </div>
        <div className="border-b border-b-slate-300 border-l border-l-slate-300 flex h-[273px] items-center justify-center px-[24px] py-[20px] relative rounded-bl-[8px] w-[298px]">
          <span className="absolute text-[2.25rem] text-slate-400">
            Set of 3
          </span>
          {store.state.set2.map((card, index) => {
            return (
              <Card
                card={card}
                className={`${index > 0 ? 'ml-[-100px]' : ''}`}
                inHand={false}
                key={card.id}
              />
            )
          })}
        </div>
      </div>
      <div className="flex gap-x-[8px] items-center justify-center mt-[32px]">
        <Button
          disabled={store.state.loading}
          onClick={store.onClickCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          loading={store.state.loading}
          onClick={store.onClickPlay}
        >
          Play
        </Button>
      </div>
    </div>
  )
})
