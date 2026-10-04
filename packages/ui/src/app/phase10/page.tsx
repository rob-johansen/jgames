import type React from 'react'

import { Home } from '@/components/pages/phase10/home'
import { StoreProvider } from '@/stores/phase10/StoreProvider'

export default function Phase10(): React.JSX.Element {
  return (
    <StoreProvider>
      <Home />
    </StoreProvider>
  )
}
