import { useGlobalState } from '../../useGlobalState'
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext.ts'
import { SearchContext } from '../../context/SearchContext.ts'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { InputWithClearButton } from './InputWithClearButton.tsx'
import { SortButton } from './SortButton.tsx'
import { useNavBar } from './NavBar.hook.ts'
import { SubMenu } from '../SubMenu/SubMenu.tsx'
import { SubMenuMore } from '../SubMenuMore/SubMenuMore.tsx'
import { MenuItem } from './MenuIten.tsx'
import { MenuItemHamburger } from './MenuItemHamburger.tsx'
import x from '../../assets/static/x.svg'
import hamburger3 from '../../assets/static/hamburger3.svg'
import chevrons_right_white from '../../assets/static/chevrons-right-white.svg'
import styles from './NavBar.module.css'

interface userData {
  token: string
  userId: string
  role: string
}

interface NavBarProps {
  setMenuItemRef: (index: number, el: HTMLLIElement | null) => void
  isOpenHamburger: boolean
  setIsOpenHamburger: React.Dispatch<React.SetStateAction<boolean>>
  setIsNavBarHamburgerAnimationComplete: React.Dispatch<
    React.SetStateAction<boolean>
  >
  isNavBarVisible: boolean
}

export const NavBar: React.FC<NavBarProps> = ({
  setMenuItemRef,
  isOpenHamburger,
  setIsOpenHamburger,
  setIsNavBarHamburgerAnimationComplete,
  isNavBarVisible,
}) => {
  console.log('🔷 NavBar РЕНДЕР, isMenuVisible =', isNavBarVisible)

  const [isAuthenticated] = useGlobalState('isAuthenticated')
  const [isAdmin] = useGlobalState('isAdmin')
  const { useGetCategoryForNavBar, categoryList } = useNavBar()
  const [activePage, setActivePage] = useGlobalState('activePage') // страницы главного уровня
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage') // подменю - подстраницы
  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть список(подменю) категорий
  const isClickRedCrossRef = useRef(false)
  const motionElemRef = useRef<HTMLDivElement>(null)
  const motionElemMoreRef = useRef<HTMLDivElement>(null)
  const motionElemHamburgerRef = useRef<HTMLDivElement>(null)
  const [enHovered, setEnHovered] = useState(false)
  const [ruHovered, setRuHovered] = useState(false)

  const auth = useContext(AuthContext)

  let token: string = ''
  if (localStorage.getItem('userData')) {
    const data: userData = JSON.parse(localStorage.getItem('userData')!)
    if (data && data.token) {
      token = data.token
    }
  }
  // const renderCount = useRef(0)

  const search = useContext(SearchContext)
  const { t, i18n } = useTranslation()
  const history = useNavigate()
  const { width } = useScreenSize() // перерасчет ширин элементов

  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [positionMore, setPositionMore] = useState({ top: 0, left: 0 })
  const moreButtonRef = useRef<HTMLDivElement>(null)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const redCrossRef = useRef<HTMLDivElement>(null)

  const [showRedLine, setShowRedLine] = useState(false)
  const [isNewPage, setIsNewPage] = useState(false)

  const routeMap = {
    '/auth': () => import('../../pages/AuthPage/AuthPage.tsx'),
    '/about': () => import('../../pages/AboutPage.tsx'),

    '/': () => import('../../pages/CategoryListPage/CategoryListPage.tsx'),
    '/publicationPost': () =>
      import('../../pages/PostPublished/PostPublication.tsx'),
    '/userProfile': () => import('../../pages/ProfilePage/ProfilePage.tsx'),

    '/admin': () => import('../../pages/Admin/AdminCategory/AdminCategory.tsx'),
    '/admin/posts': () => import('../../pages/Admin/AdminPost/AdminPost.tsx'),
    '/admin/users': () => import('../../pages/Admin/AdminUser/AdminUser.tsx'),
    '/admin/log': () => import('../../pages/Admin/AdminLog/AdminLog.tsx'),
  } as const // 👈 as const делает ключи литеральными типами

  type RoutePaths = keyof typeof routeMap
  console.log('🔍 NavBar render, isAdmin:', isAdmin, 'type:', typeof isAdmin)

  interface ObjectKeys {
    [index: string]: string
  }
  interface ObjectLocales {
    [index: string]: ObjectKeys
  }

  const locales: ObjectLocales = {
    en: { title: 'En' },
    ru: { title: 'Ru' },
  }

  const ulVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      // clipPath: "inset(0% 0% 0% 0% round 10px)",
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.25,
        delayChildren: 0.15,
        staggerChildren: 0.05,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      // clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.15,
        when: 'afterChildren',
        staggerDirection: -1,
        staggerChildren: 0.03,
      },
    },
  }

  const logoutHandler: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    setActivePage(2) // Презентация(Exit)
    auth.logout()
    history('/')
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    console.log('i18n.language=', i18n.language)
    console.log('handleSearch')
    search.setQuery(query)
  }

  // клик на главном элементе меню кроме posts
  const handleMainClick = (index: number) => {
    setActivePage(index)
    setActiveSubPage('')
    setIsOpen(false)
    setIsOpenHamburger(false)
    search.setQuery('')
  }

  // клик на главном элементе меню posts
  const toggleDropdownParent = (index: number) => {
    console.log('toggleDropdownParent')
    requestAnimationFrame(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const delta = isOpenHamburger ? 115 : 50
        setPosition({
          top: rect.bottom, // + window.scrollY,
          left: rect.left + window.scrollX - delta,
        })
      }
    })
    setActivePage(index)
    // setIsOpen(!isOpen)
    setIsOpen((prev) => !prev)
    console.log('toggleDropdownParent')
  }

  // клик на главном элементе меню "ещё"
  const toggleDropdownMore = () => {
    requestAnimationFrame(() => {
      if (moreButtonRef.current) {
        const rect = moreButtonRef.current.getBoundingClientRect()

        setPositionMore({
          top: rect.bottom, // + window.scrollY,
          left: rect.left + window.scrollX - 30,
        })
      }
    })
    setIsMoreOpen((prev) => !prev)
    setIsOpen(false)
    console.log('toggleDropdownMore-2')
  }

  const createNavItem_unAuth = (
    to: RoutePaths,
    text: string,
    queue: number,
  ) => {
    return (
      <motion.div
        className={styles.elemMainMenu}
        onClick={() => handleMainClick(queue)}
        onMouseEnter={routeMap[to]}
        onTouchStart={routeMap[to]}
        whileTap={{ scale: 0.95 }}
      >
        <NavLink to={to}>{t(text)}</NavLink>
      </motion.div>
    )
  }

  const createNavItemExit_unAuth = (
    to: string,
    text: string,
    queue: number,
  ) => {
    return (
      <motion.div
        className={styles.elemMainMenu}
        onClick={() => handleMainClick(queue)}
        whileTap={{ scale: 0.95 }}
      >
        <NavLink to={to}>{t(text)}</NavLink>
      </motion.div>
    )
  }

  const allNavItems_unAuth = useMemo(
    (): Array<{ id: string; element: React.ReactNode }> => [
      {
        id: 'auth',
        element: createNavItem_unAuth('/auth', t('navBar.auth'), 0),
      },
      {
        id: 'about',
        element: createNavItem_unAuth('/about', t('navBar.about'), 1),
      },
      {
        id: 'exit',
        element: createNavItemExit_unAuth(
          '/',
          t('navBar.landing').concat(' (').concat(t('navBar.exit')).concat(')'),
          2,
        ),
      },
    ],
    [t],
  )

  // 1. Создаём элементы как функции, чтобы переиспользовать
  const createNavItem_isAuth = (
    to: RoutePaths,
    text: string,
    queue: number,
  ) => {
    return (
      <motion.div
        key={`nav-${to}`}
        className={styles.elemMainMenu}
        onClick={() => handleMainClick(queue)}
        onMouseEnter={routeMap[to]}
        onTouchStart={routeMap[to]}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <NavLink
          to={to}
          end
          className={activePage === 0 ? 'no-click navLink' : 'navLink'}
        >
          {text}
        </NavLink>
      </motion.div>
    )
  }

  const itemMenuPosts_isAuth = (text: string, queue: number) => {
    return (
      <div key={`menu-${queue}`} className={styles.menuMainPosts}>
        <motion.div
          ref={triggerRef}
          className={styles.namePosts}
          onClick={() => toggleDropdownParent(1)}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          {text}
        </motion.div>
      </div>
    )
  }

  const itemMenuMore_isAuth = () => {
    return (
      <div key={`more-isAuth`} className={styles.menuMainPosts}>
        <motion.div
          ref={moreButtonRef}
          className={styles.namePosts}
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={toggleDropdownMore}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <img
            src={chevrons_right_white}
            width={24}
            height={24}
            alt="arrow"
            loading="lazy"
          />
        </motion.div>
        {/* Подменю More*/}
      </div>
    )
  }

  const itemMenuExit_isAuth = () => {
    return (
      <div className={styles.elemMainMenu}>
        <a href={'/'} onClick={logoutHandler}>
          {t('navBar.exit')}
        </a>
      </div>
    )
  }

  // 2. Все возможные элементы
  const allNavItems_isAuth = useMemo(
    (): Array<{ id: string; element: React.ReactNode }> => [
      {
        id: 'categories',
        element: createNavItem_isAuth('/', t('navBar.home'), 0),
      },
      { id: 'posts', element: itemMenuPosts_isAuth(t('navBar.posts'), 1) },
      {
        id: 'more',
        element: itemMenuMore_isAuth(),
      },
      {
        id: 'about',
        element: createNavItem_isAuth('/about', t('navBar.about'), 2),
      },
      {
        id: 'posting',
        element: createNavItem_isAuth(
          '/publicationPost',
          t('navBar.posting'),
          3,
        ),
      },
      {
        id: 'profile',
        element: createNavItem_isAuth(
          '/userProfile',
          t('navBar.userProfile'),
          4,
        ),
      },
      { id: 'exit', element: itemMenuExit_isAuth() },
    ],
    [t],
  )

  const createNavItem_isAdmin = (
    to: RoutePaths,
    text: string,
    queue: number,
  ) => {
    console.log('routeMap-admin-nav:', routeMap[to])
    return (
      <motion.div
        key={`admin-nav-${to}`}
        className={styles.elemMainMenu}
        onClick={() => handleMainClick(queue)}
        onMouseEnter={routeMap[to]}
        onTouchStart={routeMap[to]}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <NavLink
          to={to}
          end
          className={activePage === 0 ? 'no-click navLink' : 'navLink'}
        >
          {text}
        </NavLink>
      </motion.div>
    )
  }

  const itemMenuPosts_isAdmin = (text: string, queue: number) => {
    return (
      <div key={`admin-menu-${queue}`} className={styles.menuMainPosts}>
        <motion.div
          ref={triggerRef}
          className={styles.namePosts}
          onClick={() => toggleDropdownParent(1)}
          onMouseEnter={routeMap['/admin/posts']}
          onTouchStart={routeMap['/admin/posts']}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          {text}
        </motion.div>
      </div>
    )
  }

  const itemMenuMore_isAdmin = () => {
    return (
      <div key={`admin-more`} className={styles.menuMainPosts}>
        <motion.div
          ref={moreButtonRef}
          className={styles.namePosts}
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={toggleDropdownMore}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <img
            src={chevrons_right_white}
            width={24}
            height={24}
            alt="arrow"
            loading="lazy"
          />
        </motion.div>
        {/* Подменю More*/}
      </div>
    )
  }

  const allNavItems_isAdmin = useMemo(
    (): Array<{ id: string; element: React.ReactNode }> => [
      {
        id: 'categories',
        element: createNavItem_isAdmin('/admin', t('navBar.home'), 0),
      },
      {
        id: 'posts',
        element: itemMenuPosts_isAdmin(t('navBar.posts'), 1),
      },
      {
        id: 'more',
        element: itemMenuMore_isAdmin(),
      },
      {
        id: 'about',
        element: createNavItem_isAuth('/about', t('navBar.about'), 2),
      },

      {
        id: 'adminLog',
        element: createNavItem_isAdmin('/admin/log', t('navBar.adminLog'), 3),
      },
      {
        id: 'users',
        element: createNavItem_isAdmin('/admin/users', t('navBar.users'), 4),
      },

      { id: 'exit', element: itemMenuExit_isAuth() },
    ],
    [t],
  )

  const hiddenIds = new Set(['about', 'posting', 'profile'])
  const hiddenWithMoreIds = new Set(['more'])
  const hiddenAdminIds = new Set(['about', 'adminLog', 'users'])
  const hiddenAdminWithMoreIds = new Set(['more'])

  const getVisibleAndHiddenItems = useMemo((): {
    visibleItems_v: { nameId: string[]; items: React.ReactNode[] }
    hiddenItems_v: { nameId: string[]; items: React.ReactNode[] }
  } => {
    if (isAuthenticated) {
      if (!isAdmin) {
        // для public
        if (!width)
          return {
            visibleItems_v: { nameId: [], items: [] },
            hiddenItems_v: { nameId: [], items: [] },
          }
        else if (width < 1200 && width > 768) {
          // Планшеты: все кроме about, posting/logs и profile/users
          return {
            visibleItems_v: {
              nameId: allNavItems_isAuth
                .filter((item) => !hiddenIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAuth
                .filter((item) => !hiddenIds.has(item.id))
                .map((item) => item.element),
            },
            hiddenItems_v: {
              nameId: allNavItems_isAuth
                .filter((item) => hiddenIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAuth
                .filter((item) => hiddenIds.has(item.id))
                .map((item) => item.element),
            },
          }
        } else {
          // Десктоп: все элементы без more
          return {
            visibleItems_v: {
              nameId: allNavItems_isAuth
                .filter((item) => !hiddenWithMoreIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAuth
                .filter((item) => !hiddenWithMoreIds.has(item.id))
                .map((item) => item.element),
            },
            hiddenItems_v: { nameId: [], items: [] },
          }
        }
      } else {
        // для админа
        if (!width)
          return {
            visibleItems_v: { nameId: [], items: [] },
            hiddenItems_v: { nameId: [], items: [] },
          }
        else if (width < 1200 && width > 768) {
          // Планшеты: все кроме about, posting, users
          return {
            visibleItems_v: {
              nameId: allNavItems_isAdmin
                .filter((item) => !hiddenAdminIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAdmin
                .filter((item) => !hiddenAdminIds.has(item.id))
                .map((item) => item.element),
            },
            hiddenItems_v: {
              nameId: allNavItems_isAdmin
                .filter((item) => hiddenAdminIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAdmin
                .filter((item) => hiddenAdminIds.has(item.id))
                .map((item) => item.element),
            },
          }
        } else {
          // Десктоп: все элементы без more
          return {
            visibleItems_v: {
              nameId: allNavItems_isAdmin
                .filter((item) => !hiddenAdminWithMoreIds.has(item.id))
                .map((item) => item.id),
              items: allNavItems_isAdmin
                .filter((item) => !hiddenAdminWithMoreIds.has(item.id))
                .map((item) => item.element),
            },
            hiddenItems_v: { nameId: [], items: [] },
          }
        }
      }
    }
    return {
      visibleItems_v: {
        nameId: allNavItems_unAuth.map((item) => item.id),
        items: allNavItems_unAuth.map((item) => item.element),
      },
      hiddenItems_v: { nameId: [], items: [] },
    }
  }, [width, isAuthenticated, allNavItems_isAuth, allNavItems_unAuth])

  const getKey = (): string => {
    if (isAuthenticated && !isAdmin) return 'isAuth'
    if (isAuthenticated && isAdmin) return 'isAdm'
    return 'unAuth'
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      if (localStorage.getItem('userData')) {
        const data: userData = JSON.parse(localStorage.getItem('userData')!)
        if (data && data.token) {
          await useGetCategoryForNavBar()
        }
      }
    }

    load()
  }, [i18n.language, token])

  useEffect(() => {
    if (width! > 769) setIsOpenHamburger(false)
    //console.log('width=', width)
  }, [width])

  // Закрываем dropdown more при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreButtonRef.current &&
        !moreButtonRef.current.contains(e.target as Node) &&
        motionElemMoreRef.current &&
        !motionElemMoreRef.current.contains(e.target as Node)
      ) {
        setIsMoreOpen(false)
      }
    }

    if (isMoreOpen) {
      document.addEventListener('click', handleClickOutside, true)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isMoreOpen])

  // Закрываем dropdown posts при клике вне
  useEffect(() => {
    const handleClickPostsOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        motionElemRef.current &&
        !motionElemRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickPostsOutside, true)
    }

    return () => {
      document.removeEventListener('click', handleClickPostsOutside, true)
    }
  }, [isOpen])

  // Закрываем hamburger при клике вне
  useEffect(() => {
    const handleClickHamburgerOutside = (e: MouseEvent) => {
      const target = e.target as Node

      // Проверяем, что меню открыто
      if (!isOpenHamburger) return

      // Проверяем, не кликнули ли мы на саму кнопку или крестик
      const isClickOnButton = redCrossRef.current?.contains(target)
      const parentButton = (target as Element).closest(
        'button.' + styles.hamburger,
      )

      // Если клик на кнопку hamburger или крестик - игнорируем
      if (isClickOnButton || parentButton) {
        return
      }

      // Только два защищенных элемента (крестик обрабатывается отдельно):

      // Проверяем, кликнули ли мы на dropdown содержимое
      const clickedInsideHamburger =
        motionElemHamburgerRef.current?.contains(target)
      // Проверяем, кликнули ли мы на dropdownPosts содержимое
      const clickedInsidePosts = motionElemRef.current?.contains(target)

      // проверяем, не кликнули ли мы на ссылку внутри dropdown
      const clickedOnLink = (target as Element).closest('a, [role="link"]')
      const isLinkInsideDropdown =
        clickedOnLink &&
        (motionElemHamburgerRef.current?.contains(clickedOnLink) ||
          motionElemRef.current?.contains(clickedOnLink))

      // Если клик внутри любого защищенного элемента - не закрываем
      if (
        clickedInsideHamburger ||
        clickedInsidePosts ||
        isLinkInsideDropdown
      ) {
        return
      }

      // Клик вне всех защищенных элементов - закрываем
      setIsOpenHamburger(false)
    }

    if (isOpenHamburger) {
      document.addEventListener('click', handleClickHamburgerOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickHamburgerOutside)
    }
  }, [isOpenHamburger])

  // useEffect(() => {
  //   renderCount.current += 1
  //   console.log(`🔄 Navbar render #${renderCount.current} at ${Date.now()}`)
  // }, [])

  useEffect(() => {
    if (isNavBarVisible) {
      setShowRedLine(false) // Сначала скрываем

      const timer = setTimeout(() => {
        setShowRedLine(true)
        setIsNewPage(true)
      }, 200)

      const timer2 = setTimeout(() => setIsNewPage(false), 500)

      return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
      }
    } else {
      setShowRedLine(false)
    }
  }, [location.pathname, isNavBarVisible])

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navWrapper}>
        <Link to={isAdmin ? '/admin' : '/'} className={styles.brandLogo}>
          {width! < 1068 ? (
            <span className={styles.bleskTeksta}>
              {t('navBar.minSiteTitle')}
            </span>
          ) : (
            <span
              className={styles.bleskTeksta}
              style={{
                letterSpacing: i18n.language === 'ru' ? '-2px' : '1px',
              }}
            >
              {t('navBar.siteTitle')}
            </span>
          )}
        </Link>
        <div className={styles.searchString}>
          {isAuthenticated && (
            <>
              <InputWithClearButton
                activePage={activePage}
                activeSubPage={activeSubPage}
                handleSearch={handleSearch}
              />
              <SortButton />
            </>
          )}
          <div className={styles.enRu}>
            {Object.keys(locales).map((locale: string, index) => {
              const isActive = i18n.language === locale
              return (
                <React.Fragment key={`locale-${index}`}>
                  {showRedLine &&
                    Object.keys(locales).indexOf(i18n.language) === index && (
                      <>
                        {/* Линия для новой страницы (появление) */}
                        {isNewPage && (
                          <motion.div
                            key="line-appear"
                            className={styles.redLine}
                            initial={{
                              scaleX: 0,
                              left: index === 0 ? '10%' : '60%',
                              width: '30%',
                            }}
                            animate={{
                              scaleX: 1,
                              left: index === 0 ? '10%' : '60%',
                              width: '30%',
                            }}
                            exit={{ scaleX: 0 }}
                            transition={{
                              scaleX: {
                                type: 'spring',
                                stiffness: 500,
                                damping: 20,
                              },
                              duration: 0.3,
                            }}
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              height: '2px',
                              backgroundColor: 'red',
                              transformOrigin: 'center',
                            }}
                          />
                        )}

                        {/* Линия для смены языка (движение) */}
                        {!isNewPage && (
                          <motion.div
                            layoutId="line-move"
                            className={styles.redLine}
                            initial={false}
                            animate={{
                              left: index === 0 ? '10%' : '60%',
                              width: '30%',
                            }}
                            transition={{
                              layout: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 25,
                              },
                              // left: {
                              //   type: 'spring',
                              //   stiffness: 300,
                              //   damping: 25,
                              // },
                            }}
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              height: '2px',
                              backgroundColor: 'red',
                            }}
                          />
                        )}
                      </>
                    )}

                  <button
                    key={locale}
                    type="submit"
                    className={styles.buttonLocale}
                    onClick={() => {
                      i18n.changeLanguage(locale)
                      search.setQuery('')
                    }}
                    onMouseEnter={() => {
                      if (!isActive) {
                        // hover только для неактивных кнопок
                        if (locale === 'ru') {
                          setRuHovered(true)
                        } else {
                          setEnHovered(true)
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setRuHovered(false)
                      setEnHovered(false)
                    }}
                    style={{
                      fontWeight: i18n.language === locale ? '600' : 'normal',
                      cursor: locale === i18n.language ? 'default' : 'pointer',
                      color: isActive
                        ? 'white' // активная всегда белая
                        : (locale === 'ru' && ruHovered) ||
                            (locale === 'en' && enHovered)
                          ? 'rgb(211, 211, 211)' // hover для неактивных
                          : 'white', // обычное состояние
                    }}
                    disabled={locale === i18n.language}
                  >
                    {locales[locale].title}
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>
        {/* единое меню для десктопа и мобильников*/}
        <AnimatePresence mode="wait">
          {isOpenHamburger && width! <= 768 ? (
            <motion.div
              key="mobileMenu"
              ref={motionElemHamburgerRef}
              className={styles.mobileMenu}
              initial="closed"
              animate={isOpenHamburger ? 'open' : 'closed'}
              exit="closed"
              variants={ulVariants}
            >
              <ul className={styles.navLinksVertical}>
                {getVisibleAndHiddenItems.visibleItems_v.items.map(
                  (item, index) => (
                    <MenuItemHamburger
                      key={`vertical-${index}`}
                      item={item}
                      index={index}
                      activePage={activePage}
                      width={width}
                      getKey={getKey()}
                      itemlength={
                        getVisibleAndHiddenItems.visibleItems_v.items.length
                      }
                      isVertical={true} // вертикальное расположение
                      setMenuItemRef={setMenuItemRef}
                      setIsNavBarHamburgerAnimationComplete={
                        setIsNavBarHamburgerAnimationComplete
                      }
                    />
                  ),
                )}
              </ul>
            </motion.div>
          ) : !isOpenHamburger && width! > 768 ? (
            <div className={styles.menuContainer}>
              <ul className={styles.navLinks}>
                {getVisibleAndHiddenItems.visibleItems_v.items.map(
                  (item, index) => (
                    <MenuItem
                      key={`horizontal-${index}`}
                      item={item}
                      index={index}
                      activePage={activePage}
                      width={width}
                      getKey={getKey()}
                      itemlength={
                        getVisibleAndHiddenItems.visibleItems_v.items.length
                      }
                      setMenuItemRef={setMenuItemRef}
                    />
                  ),
                )}
              </ul>
            </div>
          ) : null}
        </AnimatePresence>
        {/* Гамбургер-меню для мобильников */}
        <button
          className={styles.hamburger}
          onClick={() => {
            if (isOpenHamburger) {
              console.log('setIsClickRedCross(true)')
              isClickRedCrossRef.current = true
              if (isOpen) {
                // Если подменю открыто, сначала закрываем его
                setIsOpen(false)
              } else {
                // Если подменю уже закрыто, закрываем основное меню
                setIsOpenHamburger(false)
              }
            } else {
              // Если меню закрыто, открываем его
              setIsNavBarHamburgerAnimationComplete(false)
              setIsOpenHamburger(true)
              isClickRedCrossRef.current = false
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <AnimatePresence mode="wait">
            {isOpenHamburger ? (
              <motion.div
                key="closeIcon"
                ref={redCrossRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <img src={x} width={24} height={24} loading="lazy" />
              </motion.div>
            ) : (
              <motion.div
                key="menuIcon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <img src={hamburger3} width={24} height={24} loading="lazy" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      {/* белая линия внизу меню */}
      <div
        style={{ width: '100%', height: '2px', backgroundColor: 'white' }}
      ></div>
      <AnimatePresence>
        {isOpen && (
          <SubMenu
            isOpenHamburger={isOpenHamburger}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            motionElemRef={motionElemRef}
            isClickRedCrossRef={isClickRedCrossRef}
            setIsOpenHamburger={setIsOpenHamburger}
            categoryList={categoryList}
            activeSubPage={activeSubPage}
            setActiveSubPage={setActiveSubPage}
            setActivePage={setActivePage}
            position={position}
          />
        )}
      </AnimatePresence>

      {/* DropdownMore меню */}
      <AnimatePresence>
        {isMoreOpen && (
          <SubMenuMore
            isMoreOpen={isMoreOpen}
            setIsMoreOpen={setIsMoreOpen}
            motionElemMoreRef={motionElemMoreRef}
            hiddenItems={getVisibleAndHiddenItems.hiddenItems_v.items}
            activePage={activePage}
            setActivePage={setActivePage}
            positionMore={positionMore}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>
    </nav>
  )
}
