'use client'

import type { ReactNode } from 'react'

import { RootStore } from '@/providers/phase10/RootStore'
import { StoreContext } from '@/providers/phase10/StoreContext'

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
