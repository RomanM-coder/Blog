import { useGlobalState } from './useGlobalState'
import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { SocketContext, socket } from './context/SocketContext'
import { SearchContext } from './context/SearchContext'
import { SortContext } from './context/SortContext'
import { NavBar } from './components/NavBar/NavBar'
import { Footer } from './components/Footer/Footer'
import AppRoutes from './routes'
import { useAuth } from './pages/AuthPage/auth.hook'
import { useAxiosMonitor } from './utilita/useAxiosMonitor.hook'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { ActiveLine } from './components/NavBar/ActiveLine'
import { LoadingSpinner } from './pages/LoadingSpinner/LoadingSpinner'
import useScreenSize from './utilita/useScreenSize'
import './App.css'

const App: React.FC = () => {
  useAxiosMonitor()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | 'posts' | 'comments'>('all')
  const [sortType, setSortType] = useState<
    'fresh' | 'popular' | 'month' | 'year' | 'all'
  >('all')
  const { login, logout, token, userId, ready, role } = useAuth()

  const clearSearch = () => {
    setQuery('')
  }
  const clearSortType = () => {
    setSortType('all')
  }

  if (userId) {
    if (!ready) {
      return <LoadingSpinner />
    }
  }

  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    console.log(`🔄 App.tsx render #${renderCount.current} at ${Date.now()}`)
  }, [])

  const [isAuthenticated] = useGlobalState('isAuthenticated')
  const [activePage] = useGlobalState('activePage')
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(window.scrollY)
  // const tickingRef = useRef(false)
  const isMenuVisibleRef = useRef(true)
  const lastScrollYRef = useRef(window.scrollY)
  const { width } = useScreenSize() // перерасчет ширин элементов

  const lastTimestampRef = useRef(0) // отдельный ref для времени
  const rafIdRef = useRef<number>()

  // const menuItemsRefs = useRef<Record<number, HTMLDivElement>>({})
  const [isNavBarAnimationComplete, setIsNavBarAnimationComplete] =
    useState(true)
  const [
    isNavBarHamburgerAnimationComplete,
    setIsNavBarHamburgerAnimationComplete,
  ] = useState(false)
  const [isOpenHamburger, setIsOpenHamburger] = useState(false)
  const menuItemsRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  const setMenuItemRef = (index: number, el: HTMLLIElement | null) => {
    if (el) {
      menuItemsRefs.current.set(index, el)
    } else {
      menuItemsRefs.current.delete(index)
    }
  }

  // первонач версия
  useEffect(() => {
    const handleScroll = () => {
      if (isAuthenticated) {
        if (rafIdRef.current) return // убрано - в PostPage не работает
        // if (scrollTop + clientHeight >= scrollHeight - 100)

        rafIdRef.current = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (Date.now() - lastTimestampRef.current < 50) {
            rafIdRef.current = undefined
            return
          }
          lastTimestampRef.current = Date.now()

          // if (Date.now() - lastTimestampRef.current < 16) {
          //   // 16ms = 60fps
          //   rafIdRef.current = undefined
          //   return
          // }

          // Если движемся вниз и меню видимо — скрываем его
          if (
            currentScrollY > lastScrollYRef.current &&
            currentScrollY > 60 &&
            isMenuVisibleRef.current
          ) {
            setIsMenuVisible(false)
            isMenuVisibleRef.current = false
          }
          // Если движемся вверх и меню не видимо — показываем его
          else if (
            currentScrollY < lastScrollYRef.current &&
            !isMenuVisibleRef.current
          ) {
            setIsMenuVisible(true)
            isMenuVisibleRef.current = true
          }
          // setLastScrollY(currentScrollY)
          lastScrollYRef.current = currentScrollY
          rafIdRef.current = undefined
        })
      } else {
        const currentScrollY = window.scrollY

        // if (Date.now() - lastTimestampRef.current < 16) return
        // lastTimestampRef.current = Date.now()

        // Если движемся вниз и меню видимо — скрываем его
        if (
          currentScrollY > lastScrollY &&
          currentScrollY > 60 &&
          isMenuVisible
        ) {
          setIsMenuVisible(false)
        }

        // Если движемся вверх и меню не видимо — показываем его
        else if (currentScrollY < lastScrollY && !isMenuVisible) {
          setIsMenuVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [lastScrollY, isMenuVisible])

  const visibleActiveLine =
    width! < 768
      ? isOpenHamburger && isNavBarHamburgerAnimationComplete
      : isMenuVisible && isNavBarAnimationComplete

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, login, logout, role }}>
        <SearchContext.Provider
          value={{
            query,
            type,
            setQuery,
            setType,
            clearSearch,
          }}
        >
          <SortContext.Provider
            value={{
              sortType,
              setSortType,
              clearSortType,
            }}
          >
            <div className="Glob">
              <div className="top-section-navbar"></div>
              <div className="content-body">
                <ActiveLine
                  activePage={activePage}
                  menuItemsRefs={menuItemsRefs}
                  isVisible={visibleActiveLine} // Передаем видимость NavBar
                  isOpenHamburger={isOpenHamburger}
                  width={width!}
                />
                <motion.div
                  key="header_nav"
                  // className={`navBarWrapper ${
                  //   (isAuthenticated ? lastScrollYRef.current : lastScrollY) >
                  //     60 && 'header_scrolled'
                  // }`}
                  className="navBarWrapper"
                  initial={{
                    transform: (
                      isAuthenticated ? isMenuVisibleRef.current : isMenuVisible
                    )
                      ? 'translateY(-100px) translateZ(0px)'
                      : 'none',
                  }}
                  animate={{
                    transform: (
                      isAuthenticated ? isMenuVisibleRef.current : isMenuVisible
                    )
                      ? 'none'
                      : 'translateY(-100px) translateZ(0px)',
                  }}
                  transition={{ duration: 0.4 }}
                  onAnimationStart={() => setIsNavBarAnimationComplete(false)}
                  onAnimationComplete={() => setIsNavBarAnimationComplete(true)}
                  style={{
                    transform: (
                      isAuthenticated ? isMenuVisibleRef.current : isMenuVisible
                    )
                      ? 'none'
                      : 'translateY(-100px) translateZ(0px)',
                  }}
                >
                  <NavBar
                    setMenuItemRef={setMenuItemRef}
                    isOpenHamburger={isOpenHamburger}
                    setIsOpenHamburger={setIsOpenHamburger}
                    setIsNavBarHamburgerAnimationComplete={
                      setIsNavBarHamburgerAnimationComplete
                    }
                    isNavBarVisible={isMenuVisible}
                  />
                </motion.div>
                {/* </div> */}
                <SocketContext.Provider value={socket}>
                  <AppRoutes />
                </SocketContext.Provider>
                <Footer />
              </div>
              <Toaster />
            </div>
          </SortContext.Provider>
        </SearchContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App
