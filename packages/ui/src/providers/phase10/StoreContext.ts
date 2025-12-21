import { createContext } from 'react'

import type { RootStore } from '@/providers/phase10/RootStore'

export const StoreContext = createContext<RootStore>({} as RootStore)
