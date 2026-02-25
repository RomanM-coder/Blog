// contexts/SearchContext.tsx
import { createContext } from 'react'

interface SearchContextType {
  query: string
  type: 'all' | 'posts' | 'comments' //| 'categories'
  setQuery: (query: string) => void
  setType: (type: 'all' | 'posts' | 'comments') => void // | 'categories'
  clearSearch: () => void
}

export const SearchContext = createContext<SearchContextType>({
  query: '',
  type: 'all',
  setQuery: () => {},
  setType: () => {},
  clearSearch: () => {},
})
