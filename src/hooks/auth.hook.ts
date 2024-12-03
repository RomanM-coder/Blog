import {useState, useCallback, useEffect} from "react"

interface userData {
  token: string,
  userId: string
}

export const useAuth = () => {
  const [token, setToken] = useState<any>(null)  
  const [userId, setUserId] = useState<any>(null)  
  const [ready, setReady] = useState(false)  
  
  const login = useCallback((jwtToken: string, id: string) => {
    setToken(jwtToken)
    setUserId(id)
    console.log("jwtToken", jwtToken);
    
    localStorage.setItem('userData', JSON.stringify({
      userId: id, token: jwtToken}))
    setReady(true)  
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
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