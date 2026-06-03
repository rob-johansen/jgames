import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'

import { Button } from '@/components/button/Button'
import { Modal } from '@/components/Modal'
import { RoundEndedStore } from './Store'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const RoundEnded = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new RoundEndedStore(root))

  return (
    <Modal title={`${store.roundEndedBy} went out!`}>
      <div className="flex flex-col gap-y-[4px]">
        {store.players.map((player) => {
          return (
            <div className="grid grid-cols-5" key={player.id}>
              <span className="col-span-1 font-bold">{player.name}:</span>
              <span className="col-span-4 max-w-[80px] tabular-nums text-right">{store.getRoundPoints(player)} points</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end mt-[20px]">
        <Button onClick={store.onClickClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
})
