import { createContext, useContext } from 'react'
import type { Inbound } from '@/lib/xray.js'

export const InboundContext = createContext<React.MutableRefObject<Inbound | null>>({
  current: null,
})

export const useInbound = () => useContext(InboundContext)
