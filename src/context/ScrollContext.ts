import { createContext } from 'react'

export const ScrollContext = createContext({
  isMenuVisible: true,
  lastScrollYRef: { current: 0 },
})
