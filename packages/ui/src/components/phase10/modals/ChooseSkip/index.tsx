import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'

import { ChooseSkipStore } from './Store'
import { Modal } from '@/components/Modal'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const ChooseSkip = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new ChooseSkipStore(root))

  return (
    <Modal
      onEscape={store.onEscape}
      title="Whom would you like to skip?"
    >
      {store.players.map((player) => {
        return (
          <div key={player.id}>
            {player.name}
          </div>
        )
      })}
    </Modal>
  )
})
