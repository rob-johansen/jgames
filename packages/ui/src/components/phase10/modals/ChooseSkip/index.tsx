import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { ChooseSkipStore } from './Store'
import { Error } from '@/components/Error'
import { Modal } from '@/components/Modal'
import { RadioButton } from '@/components/RadioButton'
import { SKIP } from '@jgames/types'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const ChooseSkip = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new ChooseSkipStore(root))

  return (
    <Modal
      onEscape={store.onEscape}
      title="Whom would you like to skip?"
    >
      <div className="flex justify-center">
        <Card
          card={{ color: '', value: SKIP }}
          inHand={false}
          moving={false}
          onClick={() => {}}
          scaling={false}
        />
        <div className="flex items-center h-[225px] ml-[20px]">
          <div>
            {store.players.map((player, index) => {
              return (
                <RadioButton
                  checked={store.state.checked === player.id}
                  className={`${index > 0 && 'mt-[20px]'}`}
                  error={store.state.error}
                  key={player.id}
                  label={player.name}
                  name="skip"
                  onChange={() => store.onChange(player.id)}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-x-[12px] justify-end mt-[20px]">
        <Error className={`${store.state.error ? 'visible' : 'invisible'}`}>
          Please choose a player
        </Error>
        <Button
          disabled={store.root.game.state.discardLoading}
          onClick={() => store.onEscape(false)}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          loading={store.root.game.state.discardLoading}
          onClick={store.onClickSkip}
        >
          Skip
        </Button>
      </div>
    </Modal>
  )
})
