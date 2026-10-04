'use client'

import type { ReactNode } from 'react'

import { RootStore } from '@/stores/phase10/RootStore'
import { StoreContext } from '@/stores/phase10/StoreContext'

type StoreProps = {
  children: ReactNode
}

let store: RootStore | null = null

export const StoreProvider = ({children}: StoreProps) => {
  if (store === null) {
    store = new RootStore()
  }

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}
