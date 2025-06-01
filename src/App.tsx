import { useGlobalState } from './useGlobalState'
import { useEffect, useState, memo, ReactNode } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { SocketContext, socket } from './context/SocketContext'
import { NavBar } from './components/NavBar/NavBar'
import { Footer } from './components/Footer/Footer'
import { useRoutes } from './routes'
import { useAuth } from './pages/AuthPage/auth.hook'
import { CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

interface AnimatedPageProps {
  children: ReactNode;
}

// Компонент для обертывания страниц
const AnimatedPage = memo(({ children }: AnimatedPageProps) => {
  const location = useLocation() // Получаем текущий маршрут

  return (
    <AnimatePresence mode="wait" key={location.pathname}>
      <motion.div
        key={location.pathname} // Ключ изменяется при переходе на новый маршрут
        initial={{ opacity: 0, x: -100 }} // Начальное состояние анимации
        // initial={false}
        animate={{ opacity: 1, x: 0 }} // Конечное состояние анимации
        exit={{ opacity: 0, x: 100 }} // Анимация при исчезновении
        transition={{ duration: 0.5 }} // Длительность анимации        
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
})

const App: React.FC = () => {  
  const [itemSearch, setItemSearch] = useGlobalState('itemSearch')  
  const [isMenuVisible, setIsMenuVisible] = useState(true) // Состояние видимости меню
  const [lastScrollY, setLastScrollY] = useState(0) // Предыдущая позиция скролла 

  const {login, logout, token, userId, ready} = useAuth()
  // setIsAuthenticated(!!token)  
  
  const routes = useRoutes(
    // {dataGetSearch: catSearch}
  ) 
 
  const getSearch = (query: string) => {
    setItemSearch(query)
  }  

  if (userId) {
    if (!ready) {
      return (
        <div style={{position: 'relative'}}>
          <CircularProgress style={{position: 'absolute', left: '50%', bottom: '-300px'}} />
        </div>
      )
    }
  }

  useEffect(()=> {}, [itemSearch])

  // useEffect(()=> {
  //   setIsAuthenticated(!!token)
  // }, [token])

  // const postsOpacity = isLoading ? 0.5 : 1
  // const pointerEvents = isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]
  // const postsOpacity = 1
  // const pointerEvents = "auto" as React.CSSProperties["pointerEvents"]
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Если движемся вниз и меню видимо — скрываем его
      if (currentScrollY > lastScrollY && currentScrollY > 60 && isMenuVisible) {
        setIsMenuVisible(false)
      }

      // Если движемся вверх и меню не видимо — показываем его
      if (currentScrollY < lastScrollY && !isMenuVisible) {
        setIsMenuVisible(true)
      }
      console.log('currentScrollY=', currentScrollY)
      
      setLastScrollY(currentScrollY) // Обновляем предыдущую позицию скролла
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    lastScrollY//, isMenuVisible
  ])

  return (
    <AuthContext.Provider value={{ token, userId, login, logout}}>     
      <BrowserRouter>
        <div className='Glob' style={{
          // opacity: postsOpacity, 
          // pointerEvents: pointerEvents, 
          // position: 'relative',
          // overflow: 'hidden auto'
          }}
          // initial={{opacity: 0}}
          // animate={{opacity: 1}}
          // transition={{ duration: 1 }}
          >
          <motion.div
            key='header_nav' 
            className={ lastScrollY > 60 ? 'navBarWrapper header_scrolled' : 'navBarWrapper' }
            initial={{ transform: isMenuVisible ? 'translateY(-100px) translateZ(0px)' : 'none' }}
            animate={{ transform: isMenuVisible ? 'none' : 'translateY(-100px) translateZ(0px)' }}
            transition={{ duration: 0.4 }} 
            style={{ transform: isMenuVisible ? 'none' : 'translateY(-100px) translateZ(0px)' }}
          > 
            <NavBar />
          </motion.div>
          <SocketContext.Provider value={socket}>
            <AnimatedPage> 
              {routes}
            </AnimatedPage> 
          </SocketContext.Provider>       
          <Footer /> 
        </div>
      </BrowserRouter>      
    </AuthContext.Provider>
  )
}

export default App