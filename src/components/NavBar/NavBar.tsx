import { useGlobalState } from '../../useGlobalState'
import { useContext, useEffect, useState, useRef } from "react"
import { createPortal } from 'react-dom'
import { AuthContext } from "../../context/AuthContext"
import {NavLink, useNavigate} from "react-router-dom"
import {motion, AnimatePresence, Variants} from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../utilita/useScreenSize.ts' 
import SearchIcon from '@mui/icons-material/Search'
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import { InputWithClearButton } from './InputWithClearButton.tsx'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { MenuItem } from './MenuIten.tsx'
import styles from './NavBar.module.css'

export const NavBar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useGlobalState('isAuthenticated') 
  const [isAdmin, setIsAdmin] = useGlobalState('isAdmin')
  const [itemSearch, setItemSearch] = useGlobalState('itemSearch')   
  const [categoryList, setCategoryList] = useGlobalState('categoryList') // для NavBar Link
  const [activePage, setActivePage] = useGlobalState('activePage') // страницы главного уровня
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage') // подменю - подстраницы
  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть список(подменю) категорий
  // const [isClickRedCross, setIsClickRedCross] = useState(false)
  const isClickRedCrossRef = useRef(false)  
  const motionElemRef = useRef(null) 
  const [isOpenHamburger, setIsOpenHamburger] = useState(false)
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false)
  const [widthActiveLine, setWidthActiveLine] = useState(0)      
  const auth = useContext(AuthContext)
  const { t, i18n } = useTranslation()  
  const history = useNavigate()
  const {width} = useScreenSize() // перерасчет ширин элементов

  interface ObjectKeys {
    [index: string]: string
  }
  interface ObjectLocales {
    [index: string]: ObjectKeys
  }

  const locales: ObjectLocales = {
    en: {title:'En'},
    ru: {title:'Ru'}
  }

  const ulVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      // clipPath: "inset(0% 0% 0% 0% round 10px)",                          
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      // clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
        when: "afterChildren",
        staggerDirection: -1,
        staggerChildren: 0.06
      }
    }
  }

  const ulVariants2: Variants = {
    dropdownOpen: {      
      clipPath: "inset(0% 0% 0% 0% round 8px)",                    
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    dropdownClose: {     
      clipPath: "inset(10% 50% 90% 50% round 8px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
        when: "afterChildren",
        staggerDirection: -1,
        staggerChildren: 0.06
      }
    }
  } 

  const itemVariants2: Variants = {
    dropdownOpen: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 24 }
      //transition: {stiffness: 300, damping: 24, duration: 0.3}
    },
    dropdownClose: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      transition: { duration: 0.2 }
    }
  }

  const logoutHandler: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    auth.logout()
    history('/')
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim()
    if (query !== '') {
      // Проверяем, соответствует ли ввод текущему языку
      if (i18n.language === 'ru' && !/[а-яёА-ЯЁ0-9]/i.test(query)) {       
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)
        return
      }
      if (i18n.language === 'en' && !/[a-zA-Z0-9]/i.test(query)) {      
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)
        return
      }    
    }   
    console.log('handleSearch')    
    setItemSearch(query)    
  }  

  const handleMainClick = (event: React.MouseEvent<HTMLLIElement> , index: number) => {
    event.preventDefault()
    console.log('handleMainClick')

    setActivePage(index)
    setActiveSubPage('')
    setIsOpen(false)   
    if (isOpenHamburger) setIsOpenHamburger(false)        
    setItemSearch('')       
  }
  // клик на главном элементе меню posts
  const toggleDropdownParent = (event: React.MouseEvent<HTMLAnchorElement>|React.MouseEvent<HTMLDivElement>, index: number) => {
    // event.preventDefault()
    console.log('toggleDropdownParent')
   
    setActivePage(index)
    setIsOpen(!isOpen)
    console.log('toggleDropdownParent')                 
  }
  // клик на элементах подменю
  const toggleDropdown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // event.preventDefault()          
    const nameCat = event.currentTarget.textContent
    console.log('toggleChild')
    if (nameCat !== activeSubPage) {              
      if (nameCat) {     
        setActiveSubPage(nameCat)
        setIsOpen(false)
        if (isOpenHamburger) setIsOpenHamburger(false)              
      }     
    }       
  } 
  
  const unAuth = [
    <motion.li
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 0)}     
      whileTap={{ scale: 0.95 }}
    >
      <NavLink to={'/auth'}>{t('navBar.auth')}</NavLink>
    </motion.li>,    

    <motion.li
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 1)}     
      whileTap={{ scale: 0.95 }}
    >
      <NavLink to={'/about'}>{t('navBar.about')}</NavLink>
    </motion.li>,

    <motion.li
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 2)}     
      whileTap={{ scale: 0.95 }}
    >
      <NavLink to={'/'}>{t('navBar.landing').concat(' (').concat(t('navBar.exit')).concat(')')}</NavLink>
    </motion.li>,

    // <li className={styles.elemMainMenu}>
    //   <a href={'/'} onClick={logoutHandler}>{t('navBar.exit')}</a>
    // </li>       
  ]  

  const isAuth = [
    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 0)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}  
    >
      <NavLink 
        to={'/'}
        end 
        className={(activePage === 0) ? 'no-click navLink' : 'navLink'}
      >{t('navBar.home')}
      </NavLink>
    </motion.li>,

    <li className={styles.menuMainPosts}>           
      <motion.div 
        className={styles.namePosts}
        onClick={(event) => toggleDropdownParent(event, 1)}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.25 }}        
      >
        {t('navBar.posts')}
      </motion.div> 
      {/* Подменю */}     
      <AnimatePresence>
      {isOpen && <motion.div        
        className={styles.postDropdown}        
        key={`postDropdown-${isOpenHamburger}`}
        ref={motionElemRef}// для клика вне области списка        
        // exit={{ opacity: 0, y: 20 }}
        // transition={{ duration: 0.3 }}
        initial="dropdownClose"
        animate={isOpen ? "dropdownOpen" : "dropdownClose"}
        // animate="dropdownOpen"
        exit="dropdownClose" 
        variants={ulVariants2}
        onAnimationComplete={(definition) => {
          // console.log('Animation completed:', definition)          
          // console.log('isClickRedCross:', isClickRedCrossRef.current)         
          if (definition === "dropdownClose" && isClickRedCrossRef.current) {
            // После закрытия подменю закрываем основное меню           
            setIsOpenHamburger(false)
          }
        }}                 
      >      
        <ul className={styles.dropdownContent}>
          {categoryList?.length && categoryList.map((category) => (
            <motion.li 
              key={`${category._id}`} 
              aria-checked={activeSubPage === category.name}
              className={styles.menuSub}                                          
              // initial="dropdownClose"
              // animate={isOpen ? "dropdownOpen" : "dropdownClose"}             
              // exit="dropdownClose"
              variants={itemVariants2}              
            >           
              <NavLink 
                to={`/posts/${category._id}`}                   
                onClick={toggleDropdown}
              >
                {category.name}
              </NavLink>              
            </motion.li>           
          ))}              
        </ul>               
      </motion.div>
      }
      </AnimatePresence>      
    </li>,

    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 2)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <NavLink 
        to={'/about'}
        className={(activePage === 2) ? 'no-click navLink' : 'navLink'}        
      >{t('navBar.about')}
      </NavLink>
    </motion.li>,

    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 3)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <NavLink to="/adminlogin">Admin</NavLink>
    </motion.li>,

    <li className={styles.elemMainMenu}>
      <a href={'/'} onClick={logoutHandler}>{t('navBar.exit')}</a>
    </li>  
  ]

  const isAdm = [
    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 0)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <NavLink 
        to={'/admin'}
        end 
        className={(activePage === 0) ? 'no-click navLink' : 'navLink'}
      >{t('navBar.home')}
      </NavLink>
    </motion.li>,

    <li className={styles.menuMainPosts}>
      <motion.div 
        className={styles.namePosts} 
        onClick={(event) => toggleDropdownParent(event, 1)}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        {t('navBar.posts')}
      </motion.div>
      <AnimatePresence>
      {/* Подменю */}           
      {isOpen && <motion.div 
        className={styles.postDropdown}          
        key='postDropdown'
        ref={motionElemRef}// для клика вне области списка       
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}  
      >       
        <ul className={styles.dropdownContent}>
          {categoryList?.length && categoryList.map((category) => (
            <li 
              key={`${category._id}`} 
              aria-checked={activeSubPage === category.name}
              className={styles.menuSub}                
            >
              <NavLink 
                to={`/admin/posts/${category._id}`}                   
                onClick={toggleDropdown}                  
              >
                {category.name}
              </NavLink>
            </li>
          ))}              
        </ul>               
      </motion.div>
      }
      </AnimatePresence>
    </li>,

    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 2)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <NavLink 
        to={'/admin/users'}
        end 
        className={(activePage === 2) ? 'no-click navLink' : 'navLink'}
      >{t('navBar.users')}
      </NavLink>
    </motion.li>,

    <motion.li 
    className={styles.elemMainMenu}
    onClick={(event) => handleMainClick(event, 3)}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.25 }}
    >
    <NavLink 
      to={'/admin/logs'}
      end 
      className={(activePage === 3) ? 'no-click navLink' : 'navLink'}
    >{t('navBar.logs')}
    </NavLink>
    </motion.li>,

    <motion.li 
      className={styles.elemMainMenu}
      onClick={(event) => handleMainClick(event, 4)}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <NavLink 
        to={'/about'}
        className={(activePage === 4) ? 'no-click navLink' : 'navLink'}
      >{t('navBar.about')}
      </NavLink>
    </motion.li>,

    <li className={styles.elemMainMenu}>
      <a href={'/'} onClick={logoutHandler}>{t('navBar.exit')}</a>
    </li>  
  ]
  
  const getNavItems = (): React.ReactNode[] => {
    if (isAuthenticated && !isAdmin) return isAuth
    if (isAuthenticated && isAdmin) return isAdm
    return unAuth
  }  

  const getKey = (): string => {
    if (isAuthenticated && !isAdmin) return 'isAuth'
    if (isAuthenticated && isAdmin) return 'isAdm'
    return 'unAuth'
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 2000,
    })
  }  
  
  useEffect(() => {    
    i18n.changeLanguage('en')   
  }, []) 

  useEffect(() => {
    if (width! > 769) setIsOpenHamburger(false)
    if (width! > 1200) setWidthActiveLine(40)
    if ((width! <= 1200) && (width! > 992)) setWidthActiveLine(20)
    if ((width! <= 992) && (width! > 768)) setWidthActiveLine(14)
    if (width! < 768) setWidthActiveLine(40) 
  }, [width]) 

  useEffect(() => {
    setIsClearButtonVisible(itemSearch.trim() !== '')
  }, [itemSearch]) 

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navWrapper}>
        {(width! < 1050) ? 
          <span className={styles.bleskTeksta}>{t('navBar.minSiteTitle')}</span> : 
          <span className={styles.bleskTeksta}>{t('navBar.siteTitle')}</span>}        
        <div className={styles.searchCategory}>
          {isAuthenticated && <InputWithClearButton
            activePage={activePage}
            activeSubPage={activeSubPage}
            handleSearch={handleSearch}
          />}
          <div className={styles.enRu}>
            {(Object.keys(locales)).map((locale) => (
              <button
                key={locale} 
                type='submit'
                className={styles.buttonLocale} 
                onClick={() => {
                  i18n.changeLanguage(locale)                   
                  setActiveSubPage('')
                  setItemSearch('')
                }}
                style={{
                  fontWeight: i18n.language === locale ? '600' : 'normal'
                }}
                disabled={locale === i18n.language}
              >
                {locales[locale].title}
              </button>
            ))}
          </div>  
        </div>        
        {/* единое меню для десктопа и мобильников*/}        
        <AnimatePresence mode='wait'>
          {isOpenHamburger && width! <= 768 ? (
            <motion.div
              key="mobileMenu"
              className={styles.mobileMenu}
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // exit={{ opacity: 0, x: -20 }}
              // transition={{ duration: 0.3 }}
              initial="closed"
              animate={isOpenHamburger ? "open" : "closed"}              
              exit="closed"
              variants={ulVariants}                             
            >
              <ul className={styles.navLinksVertical}>
                {getNavItems().map((item, index) => (
                  <MenuItem
                    key={index}
                    item={item}
                    index={index}
                    activePage={activePage}
                    widthActiveLine={widthActiveLine}
                    width={width}
                    getKey={getKey()}
                    isVertical={true} // вертикальное расположение                  
                  />
                ))}
              </ul>
            </motion.div>
          ) : !isOpenHamburger && width! > 768  ? (
            <div className={styles.menuContainer}>
              <ul className={styles.navLinks}>
                {getNavItems().map((item, index) => (
                  <MenuItem
                    key={index}
                    item={item}
                    index={index}
                    activePage={activePage}
                    widthActiveLine={widthActiveLine}
                    width={width}
                    getKey={getKey()}                                                            
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </AnimatePresence>
        {/* Гамбургер-меню для мобильников */}
        {/* <button 
          className={styles.hamburger} 
          onClick={() => {         
            setIsOpenHamburger(!isOpenHamburger)
            setIsOpen(false)                  
          }}
        >          
          <MenuIcon style={{fill: 'white'}} />  
        </button>  */}
        <button
          className={styles.hamburger}
          onClick={() => {         
            // setIsOpenHamburger(!isOpenHamburger)            
            // setIsOpen(false)            
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
              setIsOpenHamburger(true)
              isClickRedCrossRef.current = false
            }                  
          }}
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <AnimatePresence mode="wait">
            {isOpenHamburger ? (
              <motion.div
                key="closeIcon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CloseIcon style={{ fill: "red", width: "29px", height: "29px" }} />
              </motion.div>
            ) : (
              <motion.div
                key="menuIcon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <MenuIcon style={{ fill: "white", width: "29px", height: "25px" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        {/* <button 
          className={styles.toggleHamburger + ` ${styles.toggleX}` + `${(isOpenHamburger === true) ? ' '+ styles.active : ''}`}
          onClick={() => {         
            setIsOpenHamburger(!isOpenHamburger)
            setIsOpen(false)                  
          }}
        >
          <span>toggle menu</span>
        </button>       */}
      </div>      
      <Toaster />
    </nav>
  )
}


{/* Затемнение фона */}
// {isMenuOpen && <div className="backdrop" onClick={() => setIsMenuOpen(false)} />}
// </div>


 {/* Горизонтальное меню для десктопа */}       
//  <div className={`${styles.menuContainer} ${styles.menuDesktop}`}>        
//  <ul className={styles.navLinks}>         
//    {getNavItems().map((item, index) => (
//      <MenuItem
//        key={index}
//        item={item}
//        index={index}
//        activePage={activePage}
//        widthActiveLine={widthActiveLine}
//        width={width}
//        getKey={getKey()}                
//      />             
//    ))}         
//  </ul>
// </div>        
// {/* Гамбургер-меню для мобильников */}
// <button className={styles.hamburger} onClick={() => {         
//  setIsOpenHamburger(!isOpenHamburger)
//  setIsOpen(false)                  
// }}>
//  <MenuIcon style={{fill: 'white'}}/>
// </button>
// {/* Вертикальное меню для мобильников */} 
// <AnimatePresence>      
// {isOpenHamburger && <motion.div 
//  key='mainVerticalMenu'
//  className={styles.mobileMenu}
//  initial={{ opacity: 0, x: -20 }}          
//  animate={{ opacity: 1, x: 0 }}
//  exit={{ opacity: 0, x: -20 }}
//  transition={{ duration: 0.3 }}
// >
//  <ul className={styles.navLinksVertical}>         
//    {getNavItems().map((item, index) => (
//      <MenuItem
//        key={index}
//        item={item}
//        index={index}
//        activePage={activePage}
//        widthActiveLine={widthActiveLine}
//        width={width}
//        getKey={getKey()}
//        isVertical={width! <= 768}                
//      />             
//    ))}
//  </ul>
// </motion.div>}
// </AnimatePresence> 


{/* <div className={styles.containerSearch}>
  <div className={styles.searchIcon}>              
    <SearchIcon />
  </div>
  <motion.input
    type="text"
    className={styles.searchInput}              
    placeholder={
      (activePage === 0) ? t('catList.searchInput') : 
      (activePage === 1) ? t('postPage.searchInput') :  
      (activeSubPage !== '') ? t('singlePostPage.searchInput') :
      (activePage === 2) ? t('adminUser.searchInput') :
      t('adminLog.searchInput')
    }
    lang={i18n.language}              
    value={itemSearch}              
    onChange={handleSearch}             
    transition={{ duration: 0.2 }}
  /> */}
  // {/* Крестик */}
//   <AnimatePresence>
//   {isClearButtonVisible && (
//     <motion.button
//       className={styles.clearButton}
//       onClick={handleClearClick}
//       style={{
//         position: 'absolute',
//         right: '0.5rem',
//         top: '10%',
//         transform: 'translateY(-50%)',
//         background: 'transparent',
//         border: 'none',
//         cursor: 'pointer',
//         color: 'white'
//       }}
//       initial={{ opacity: 0, rotate: 0, x: -50 }}
//       animate={{ opacity: 1, rotate: 90, x: 0 }}
//       exit={{ opacity: 0, rotate: 0, x: -50 }}
//       transition={{ duration: 0.3 }}
//     >
//       ✕ {/* Крестик */}
//     </motion.button>
//   )}
//   </AnimatePresence>   
// </div>}