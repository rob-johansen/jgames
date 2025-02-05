'use client'

import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import type React from 'react'

import { Button } from '@/components/button/Button'
import { TextField } from '@/components/text-field/TextField'
import { ViewModel } from './ViewModel'

type Props = {
  vm: ViewModel
}

export const Home = (): React.JSX.Element => {
  return (
    <View vm={new ViewModel()} />
  )
}

const View = observer(({ vm }: Props): React.JSX.Element => {
  const nameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInput.current?.focus()
  }, [])

  return (
    <div>
      <h1 className="absolute font-bold font-quicksand right-[30px] text-[2rem] top-[20px]">
        Phase 10
      </h1>
      <div className="absolute h-[90px] inset-0 m-auto w-[300px]">
        {vm.state.waiting ? (
          <>
            <h2 className="font-bold font-quicksand right-[30px] text-[1.5rem]">
              Waiting
            </h2>
            {vm.state.players.map((player) => {
              return (
                <div className="my-[4px]" key={player}>
                  {player}
                </div>
              )
            })}
            {vm.state.first && (
              <Button
                className="mt-[12px]"
              >
                Start Game
              </Button>
            )}
          </>
        ) : (
          <>
            <TextField
              error={vm.state.nameError}
              id="name"
              label="Name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => vm.onChangeName(event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>): void => {
                if (event.key === 'Enter') {
                  nameInput.current?.blur()
                  vm.onClickJoin()
                }
              }}
              ref={nameInput}
              value={vm.state.name}
            />
            <Button
              loading={vm.state.loading}
              onClick={vm.onClickJoin}
            >
              Join
            </Button>
          </>
        )}
      </div>
    </div>
  )
})
