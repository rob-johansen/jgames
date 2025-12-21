'use client'

import { KeyboardEvent, useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'

import { Button } from '@/components/button/Button'
import { GamePage } from '@/components/pages/phase10/game'
import { StoreContext } from '@/providers/phase10/StoreContext'
import { TextField } from '@/components/text-field/TextField'
import { Toast } from '@/components/toast/Toast'

export const Home = observer(() => {
  const { home: store } = useContext(StoreContext)
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInput.current?.focus()
  }, [])

  return (
    <div className="font-quicksand">
      <h1 className="absolute font-bold font-quicksand right-[30px] text-[2rem] top-[20px]">
        Phase 10
      </h1>
      {store.state.hasGame ? (
        <GamePage />
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
