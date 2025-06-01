import {useState, useCallback, useEffect} from "react"
import { useGlobalState } from '../../useGlobalState' 

interface userData {
  token: string,
  userId: string
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin, setIsAdmin] = useGlobalState('isAdmin')   
  const [token, setToken] = useState<any>(null)  
  const [userId, setUserId] = useState<any>(null)  
  const [ready, setReady] = useState(false)  
  
  const login = useCallback((jwtToken: string, id: string) => {
    setToken(jwtToken)
    setUserId(id)
    setIsAuthenticated(true)    
    console.log("jwtToken", jwtToken);
    
    localStorage.setItem('userData', JSON.stringify({
      userId: id, token: jwtToken}))
    setReady(true)  
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    localStorage.removeItem('userData')    
  }, [])  

  useEffect(() => {
    // перезагрузка программы без logout()
    if (localStorage.getItem('userData')) {   
      const data: userData = JSON.parse(localStorage.getItem('userData')!)
      if (data && data.token) {
        login(data.token, data.userId)
      }
      console.log('Effect')        
      setReady(true)            
    }   
  }, [login])

  return {login, logout, token, userId, ready}
} 