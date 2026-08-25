import { observer } from 'mobx-react-lite'
import { Fragment, useContext, useState } from 'react'

import { Button } from '@/components/button/Button'
import { Icon, Bronze, Gold, Participation, Silver } from '@/components/icon'
import { Modal } from '@/components/Modal'
import { ResultsStore } from './Store'
import { StoreContext } from '@/providers/phase10/StoreContext'

export const Results = observer(() => {
  const root = useContext(StoreContext)
  const [store] = useState(() => new ResultsStore(root))
  const rank = store.rank

  return (
    <Modal
      className="flex flex-col items-center min-w-[182px]"
      title={store.title}
    >
      <div className="flex">
        <div>
          {rank === 1 && <Icon source={Gold} />}
          {rank === 2 && <Icon source={Silver} />}
          {rank === 3 && <Icon source={Bronze} />}
          {rank > 3 && <Icon source={Participation} />}
        </div>
        <div className="pl-[16px]">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr]">
            <span className="font-bold pr-[16px]">Rank</span>
            <span className="font-bold pr-[8px]">Name</span>
            <span className="font-bold pr-[8px] text-center">Phase</span>
            <span className="font-bold text-center">Points</span>
            {store.results.map((result) => {
              return (
                <Fragment key={`${result.rank}-${result.name}`}>
                  <span className="pr-[16px]">{result.rank}</span>
                  <span className="pr-[8px]">{result.name}</span>
                  <span className="pr-[8px] text-center">{result.phase < 10 ? result.phase : 10}</span>
                  <span className=" text-center">{result.points}</span>
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-[12px] justify-end mt-[20px]">
        <Button
          onClick={() => window.location.href = '/'}
          variant="secondary"
        >
          Quit
        </Button>
        <Button onClick={() => window.location.reload()}>
          Play Again
        </Button>
      </div>
    </Modal>
  )
})
