'use client'

import { KeyboardEvent, useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/button/Button'
import { GamePage } from '@/components/pages/phase10/game'
import { Phases } from '@/components/phase10/modals/Phases'
import { Results } from '@/components/phase10/modals/Results'
import { StoreContext } from '@/stores/phase10/StoreContext'
import { TextField } from '@/components/text-field/TextField'
import { Toast } from '@/components/Toast'

export const Home = observer(() => {
  const root = useContext(StoreContext)
  const store = root.home
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInput.current?.focus()
    root.sounds.init()
  }, [root.sounds])

  return (
    <div className="font-quicksand">
      <button
        className="absolute enabled:hover:text-[#6a0dad] font-bold font-quicksand right-[30px] text-[2rem] top-[20px] z-50"
        disabled={!store.state.hasGame}
        onClick={() => store.togglePhases(true)}
      >
        Phase 10
      </button>
      {store.state.hasGame ? (
        <>
          {store.gameOver ? (
            <Results />
          ) : (
            <>
              <GamePage />
              {store.state.showPhases && (
                <Phases onEscape={store.togglePhases} />
              )}
            </>
          )}
        </>
      ) : (
        <div className="absolute h-[150px] inset-0 m-auto w-[300px]">
          {store.state.waiting ? (
            <>
              <h2 className="font-bold font-quicksand right-[30px] text-[1.5rem]">
                Waiting
              </h2>
              {store.state.players.map((player) => {
                return (
                  <div className="my-[4px]" key={player}>
                    {player}
                  </div>
                )
              })}
              {store.state.first && (
                <Button
                  className="mt-[24px]"
                  loading={store.state.loading}
                  onClick={store.onClickStartGame}
                >
                  Start Game
                </Button>
              )}
            </>
          ) : (
            <>
              <TextField
                error={store.state.nameError}
                id="name"
                label="Name"
                onChange={(event) => store.onChangeName(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>): void => {
                  if (event.key === 'Enter') {
                    nameInput.current?.blur()
                    store.onClickJoin()
                  }
                }}
                ref={nameInput}
                value={store.state.name}
              />
              <Button
                loading={store.state.loading}
                onClick={store.onClickJoin}
              >
                Join
              </Button>
            </>
          )}
        </div>
      )}
      <Toast />
    </div>
  )
})
