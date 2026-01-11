import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'

import { Button } from '@/components/button/Button'
import { Card } from '@/components/phase10/Card'
import { SKIP } from '@jgames/types'
import { SkippedStore } from './Store'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Skipped = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new SkippedStore(root))

  return (
    <div className="flex gap-x-[48px] items-center">
      <div className="rotate-90">
        <Card
          arranging={false}
          card={{ color: '', value: SKIP }}
          inHand={false}
          onClick={() => {}}
          scaling={false}
        />
      </div>
      {store.root.game.myTurn && (
        <Button
          loading={store.state.loading}
          onClick={store.onClickDiscard}
        >
          Discard
        </Button>
      )}
    </div>
  )
})
