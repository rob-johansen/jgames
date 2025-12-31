'use client'

import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { Modal } from '@/components/Modal'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const GamePage = observer(() => {
  const { game: store } = useContext(StoreContext)

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', store.onKeyDown)
    }
  }, [store])

  return (
    <div className="flex h-dvh relative">
      <div className="absolute bottom-[425px] flex gap-x-[24px] h-[269px] left-0 m-auto right-0 w-[324px]">
        <div className="flex flex-col gap-y-[8px] items-center">
          <div className="bg-phase10-cover-blue drop-shadow-lg font-quicksand h-[225px] overflow-hidden rounded-[8px] select-none text-white w-[150px]">
            <div className='flex flex-col font-bold items-center left-[8px] relative rotate-[80deg] text-[3rem] top-[45px]'>
              <span>Phase</span>
              <span className="relative top-[-32px]">10</span>
            </div>
            <div className="bg-phase10-card-red h-[10px] left-[-84px] relative rotate-[80deg] top-[-40px] w-[240px]" />
            <div className="bg-phase10-card-blue h-[10px] left-[-98px] relative rotate-[80deg] top-[-40px] w-[240px]" />
            <div className="bg-phase10-card-green h-[10px] left-[-112px] relative rotate-[80deg] top-[-40px] w-[240px]" />
            <div className="bg-phase10-card-purple h-[10px] left-[-126px] relative rotate-[80deg] top-[-40px] w-[240px]" />
          </div>
          {store.showDraw && (
            <Button
              disabled={store.state.drawPileLoading}
              loading={store.state.drawDeckLoading}
              onClick={store.onClickDrawFromDeck}
            >
              Draw
            </Button>
          )}
        </div>
        {store.topCardOnPile ? (
          <div className="flex flex-col gap-y-[8px] items-center">
            <Card
              card={store.topCardOnPile}
              inHand={false}
            />
            {store.showDraw && (
              <Button
                disabled={store.state.drawDeckLoading}
                loading={store.state.drawPileLoading}
                onClick={store.onClickDrawFromPile}
              >
                Draw
              </Button>
            )}
          </div>
        ) : (
          <div className="border border-[#aaaaaa] h-[225px] rounded-[8px] w-[150px]" />
        )}
      </div>
      <div className="absolute bottom-[60px] flex h-[225px] left-0 m-auto right-0" style={{ width: store.myCards.length * 117 }}>
        {(store.myCards).map((card, index) => {
          return (
            <Card
              card={card}
              inHand={true}
              key={card.id}
              moving={store.showMoving(card.id)}
              onClick={() => store.onClickCard(card)}
              scaling={store.scaling}
              style={{ left: index * 114 }}
            />
          )
        })}
        <div className="absolute bottom-[-48px] flex gap-x-[8px] right-[0]">
          <Button
            disabled={store.state.drawPileLoading}
            onClick={store.toggleArranging}
          >
            {store.state.arranging ? 'Stop Arranging' : 'Arrange'}
          </Button>
          <Button
            disabled={store.state.drawPileLoading}
            onClick={store.toggleDiscarding}
          >
            {store.state.discarding ? 'Cancel Discard' : 'Discard'}
          </Button>
        </div>
      </div>
      {store.state.showNotTurnModal && (
        <Modal
          onEscape={store.onEscapeNotTurnModal}
          title="It’s not your turn!"
        >
          <div className="flex justify-end">
            <Button onClick={store.onCloseNotTurnModal}>
              OK
            </Button>
          </div>
        </Modal>
      )}
      {store.state.showDrawModal && (
        <Modal
          onEscape={store.onEscapeDraw}
          title="Draw First"
        >
          You must draw before you can discard!
          <div className="flex justify-end mt-[12px]">
            <Button onClick={store.onCloseDrawModal}>
              OK
            </Button>
          </div>
        </Modal>
      )}
      {store.state.discardingCard && (
        <Modal
          className="min-w-[300px]"
          onEscape={store.onEscapeDiscardConfirm}
          title={`Discard a ${store.discardDescription}?`}
        >
          <div className="flex justify-center">
            <Card
              card={store.state.discardingCard}
              inHand={false}
              moving={false}
              onClick={() => {}}
              scaling={false}
            />
          </div>
          <div className="flex gap-x-[12px] justify-end mt-[28px]">
            <Button
              onClick={store.onCloseDiscardConfirm}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={store.onConfirmDiscard}
              loading={store.state.discardLoading}
            >
              Discard
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
})
