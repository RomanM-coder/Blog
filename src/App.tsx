import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { useState } from 'react'
import { NavBar } from './components/NavBar/NavBar'
import { Footer } from './components/Footer/Footer'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { CircularProgress } from '@mui/material'
import './App.css'

function App() {
  const {login, logout, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const [isLoading, setIsloading] = useState(false) 

  const watchForLoader = (childLoader: boolean) => {
    setIsloading(childLoader)    
  }
  const routes = useRoutes(isAuthenticated, isLoading, watchForLoader)
    
  if (userId) {
    if (!ready) {
      return (
        <div style={{position: 'relative'}}>
          <CircularProgress style={{position: 'absolute', left: '50%', bottom: '-300px'}} />
        </div>
      )
    }
  }

  const postsOpacity = isLoading ? 0.5 : 1
  const pointerEvents = isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated }}>
      <BrowserRouter>
        <div className='Glob' style={{opacity: postsOpacity, pointerEvents: pointerEvents}}>
          {isAuthenticated && <NavBar />}              
          {routes}        
          {isAuthenticated && <Footer year={new Date().getFullYear()} />} 
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
