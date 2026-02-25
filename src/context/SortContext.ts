// contexts/SortContext.tsx
import { createContext } from 'react'

interface SortContextType {
  sortType: 'fresh' | 'popular' | 'month' | 'year' | 'all'
  setSortType: (type: 'fresh' | 'popular' | 'month' | 'year' | 'all') => void
  clearSortType: () => void
}

export const SortContext = createContext<SortContextType>({
  sortType: 'all',
  setSortType: () => {},
  clearSortType: () => {},
})
