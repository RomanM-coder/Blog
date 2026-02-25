import { createContext } from 'react'

interface AuthContextType {
  token: string | null
  userId: string | null
  role: string | null
  login: (token: string, userId: string, role: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  role: null,
  login: (_token: string, _userId: string, _role: string) => {},
  logout: () => {},
})
