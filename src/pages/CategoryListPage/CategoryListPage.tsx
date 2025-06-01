import React, { useEffect, useState, useRef, useContext } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { CategoryCard } from '../../components/CategoryCard/CategoryCard.tsx'
import { useCategoryes } from './category.hook.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import useScreenSize from '../../utilita/useScreenSize.ts' 
import toast, { Toaster } from 'react-hot-toast'
import { basicUrl, basicColor } from '../../utilita/defauit.ts'
import ReactPaginate from 'react-paginate'
import {useDebounce} from '../../utilita/useDebounce.ts'
import { useTranslation } from 'react-i18next'
import {motion, AnimatePresence, spring, calcLength} from 'framer-motion'
import { shuffle } from "lodash"
import { SocketContext } from '../../context/SocketContext.tsx'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './CategoryListPage.module.css'

export const CategoryListPage: React.FC = () => {
  // mongodb://splinter:121212@127.0.0.1:27017/test?authMechanism=DEFAULT
  const [activePage, setActivePage] = useGlobalState('activePage') 
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch, setDataGetSearch] = useGlobalState('itemSearch')
  
  const categoryRef = useRef<HTMLDivElement>(null)
  const [categorySize, setCategorySize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
   
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay 
  const [categoryesCount, setCategoryesCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<ICategory>({} as ICategory)  
  const [sort, setSort] = useState('+name')
  const { t, i18n } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  // show motion  
  const [shuffleHandle, setShuffleHandle] = useState(false)     
  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<ICategory[]>([])
  const itemPerPage = 3   
  // let lastItemIndex = currentPage + itemPerPage
  
  // const socket = io(basicUrl.urlBack, { transports: ['websocket'] })
  const socket = useContext(SocketContext)
  const [message, setMessage] = useState('')  

  const {useGetCategoryList, useGetCategoryForNavBar, useGetCategoryListCount, useGetSearch, useGetCategoryListPagination, error, clearError} = useCategoryes(setCategoryesCount, setCurrentItems, sort)  

  const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

  const {width} = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)   

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 10000,
    })
  }  
  
  const handleSelectCategory = (selectCategory: ICategory) => {
    setSelectedCategory(selectCategory)            
  }

  const handleAllCategories = async () => {       
    useGetCategoryList()
  }  

  const handleShuffleCategories = async (event: React.MouseEvent<HTMLButtonElement>) => {    
    event.preventDefault()
    setShuffleHandle(true)
    await sleep(150)    
    setShuffleHandle(false)
    if (event.detail >= 2) {
      return console.log('---------clc2', event.detail)
    }        
    setCurrentItems(shuffle(currentItems))
  }

  const handleDblShuffleCategories = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setTimeout(() => console.log('timeout500'), 500)
    return
  }    

  const handleChangeSortId = async () => {
    if (sort.slice(1) === '_id') {
      if (sort.slice(0,1) === '+') setSort('-_id')
      else setSort('+_id')  
    } else setSort('+_id')
    useGetCategoryListPagination(itemPerPage, currentPage, sort) 
  }

  const handleChangeSortName = async () => {    
    if (sort.slice(1) === 'name') {
      if (sort.slice(0,1) === '+') setSort('-name')
      else setSort('+name')  
    } else setSort('+name')
    useGetCategoryListPagination(itemPerPage, currentPage, sort)     
  }  

  const showDecIncIcon = (sortParam: string) => {
    if (sortParam.slice(0,1) === '+') {
      return (
        <>
          <p>{t('catList.orderDesc')}</p>
          <ArrowDropDownIcon />
        </> 
      )
    } else {
      return (
        <>         
          <p>{t('catList.orderAsc')}</p>
          <ArrowDropUpIcon />
        </>
      )
    } 
  }

  const unfoldIcon = () => {
    return (
      <> 
        <p>-------</p>               
        <UnfoldMoreIcon />
      </>
    )
  }
  
  const showSortIcons = (sortParam: string) => {
    if (sortParam.slice(1) === 'name') {
      return showDecIncIcon(sortParam)     
    } else if (sortParam.slice(1) === '_id') {
      return showDecIncIcon(sortParam)
    }
  }

  // const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   i18n.set(event.target.value)
  // }
  let random = (Math.random()*10000)
  random = Math.trunc(random)

  function listCategory(cats: ICategory[]) {
    console.log('cats= ',cats);
    
    return (        
      <div className={styles.allCategoryList}>        
        <AnimatePresence 
        // mode='wait'
        mode ="popLayout"
        initial={false}
        >
          {cats.map((category: ICategory, i: number) => (                      
            <motion.div
              layout              
              key={`${category._id}`}
              className={styles.categoryList}
              // variants={listVariant}
              // initial={'hidden'}
              // animate={'visible'}              
              // exit={'quit'}
              // custom={i}
              // transition={{type: 'spring', duration: 0.3, mass: 0.4}}
              // animate={{opacity: 1, scale: 1}}
              // initial={{opacity: 0, scale: 0}}
              // exit={{opacity: 0, scale: 0}}
              style={{//float: "left",
                // backgroundColor: "#2196F3",
                // color: "#ffffff",
                //width: "100px",
                lineHeight: "100px",
                textAlign: "center",
                margin: "2px"}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // transition={{ duration: 0.2 }}
              transition={spring}             
            > 
              {isLoading ? <Skeleton width={categorySize.width} height={categorySize.height} key={`${category._id}`}/> : 
              <div className={styles.wrapCategotyItem} ref={categoryRef} key={`${category._id?.concat(random.toString())}`}>
                <CategoryCard                       
                  category={category}                    
                  handleSelectCategory={handleSelectCategory}
                  maxWidth={maxWidth}    
                />
              </div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>       
    )
  }

  // function useMaxWidth() {
  //   const [maxWidth, setMaxWidth] = useState(0)
  
  //   useEffect(() => {
  //     const updateMaxWidth = () => {
  //       const containerWidth = window.innerWidth // Ширина экрана
  //       if ((containerWidth < 1200)&&(containerWidth > 700)) setMaxWidth((containerWidth / 3)-33) 
  //       else if ((containerWidth < 700)&&(containerWidth > 400)) setMaxWidth(containerWidth-53)
  //       else if ((containerWidth < 2000)&&(containerWidth > 1200)) setMaxWidth((containerWidth / 3)-30)         
  //     }
  
  //     // Вызываем функцию при загрузке и изменении размера окна
  //     updateMaxWidth()
  //     window.addEventListener('resize', updateMaxWidth)
  
  //     // Очистка
  //     return () => window.removeEventListener('resize', updateMaxWidth)
  //   }, [])
  
  //   return maxWidth
  // }

  function listCategoryEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('catList.category_zero')}</h3>
    )
  } 

  const handlePageClick = async (data: { selected: number }) => {   
    const newPage = (data.selected * itemPerPage)// % categoryesCount    
    console.log('newPage', newPage);
    setCurrentPage(newPage)
    changeOptionsPage(newPage)    
  }

  const changeOptionsPage = async (skip: number, signal?: AbortSignal) => {     
    useGetCategoryListPagination(itemPerPage, skip, sort, signal)  
    // setCurrentItems(categoryes.slice(currentPage, lastItemIndex))        
    setPageCount(Math.ceil(categoryesCount / itemPerPage))
  }

  // const postsOpacity = isLoading ? 0.5 : 1
  // const pointerEvents = isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"]
  const postsOpacity = 1
  const pointerEvents = "auto" as React.CSSProperties["pointerEvents"]

  useEffect(() => {
    // let ignore = false
    // const abortController = new AbortController()
    // const signal = abortController.signal    
    // if (!ignore) {
    if (dataGetSearch === '' || dataGetSearch === undefined) {
      changeOptionsPage(currentPage) 
    } else useGetSearch(debouncedInputValue)
      // changeOptionsPage(currentPage)       
    console.log('use1----------')
    // }
    // return () => {
    //   ignore = true
    //   abortController.abort('Abort Controller')
    // }   
  }, [debouncedInputValue])

  // useEffect(() => {    
  //   changeOptionsPage(currentPage)      
  // }, []) // + categoryesCount
    
  useEffect(() => {            
    useGetCategoryListCount(itemPerPage, setPageCount)
    setActivePage(0)    
    console.log('use3----------')        
  }, [])

  interface JoinData {
    room: string,
    userId: string
  }
  
  useEffect(() => {
    if (!socket) return

    socket.on('connect', () => {
      socket.emit('joinRoom', { room: 'categories', userId } as JoinData)             
      console.log('Socket is initialized room categories')
      console.log('Socket userId=', userId)
    })
    
    socket.on('server_edit_response', (data) => {
      console.log('server_edit_response: ', data.messages)
      const translatedMessage = data.messages[i18n.language]        
      setMessage(translatedMessage)
      myToast(translatedMessage, basicColor.green)          
    }) 

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })   
    
    return () => {
      // remove Event Listener
      socket.emit('leaveRoom', { room: 'categories', userId })            
      socket.off('server_edit_response')
      socket.off('connect_error')
      socket.off('connect')               
    }
    
  }, [socket])

  useEffect(() => {   
    useGetCategoryForNavBar()
    console.log('-----------------render')
    changeOptionsPage(currentPage)          
  }, [i18n.language])

  useEffect(() => {
    const handleWindowResize = () => {
      console.log('categoryRef.current=', categoryRef.current)      
      if (categoryRef.current) {           
        const width4 = categoryRef.current.scrollWidth
        const height4 = categoryRef.current.scrollHeight
        console.log('width4=', width4, 'height4=', height4)        
        setCategorySize({ ...categorySize, width: width4, height: height4 })
      }
    }
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handleWindowResize)     
    }, 400)    

    return () => {
      if (timeoutId) clearTimeout(timeoutId)     
    }      
  }, [])
  
  useEffect(() => {
    if ((width! < 1200)&&(width! > 700)) setMaxWidth((width! / itemPerPage)-3) 
    else if ((width! < 700)&&(width! > 400)) setMaxWidth(width!-23)
    else if ((width! < 2000)&&(width! > 1200)) setMaxWidth((width! / itemPerPage)-0) 
  }, [width])
  
  console.log('pageCount=', pageCount)
  console.log('currentItems=', currentItems.length)  

  return ( 
    <>    
    <div 
      className={styles.categoryPage} 
      style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
    >                        
      <div className={styles.category}>
        <div className={styles.divAddCategory}>           
          <h2 className={styles.title}>{t('catList.header')}</h2>
          <p>{message}</p>          
          <p className={styles.countCategory}>
            {t('catList.count').concat(t('catList.category', {count: currentItems.length}))}
          </p>            
          <div style={{display: 'flex', justifyContent: 'center', margin: '10px 0'}}>             
            <button
              id='shuffleButton'               
              className={styles.shuffleButton}               
              onClick={handleShuffleCategories}
              onDoubleClick={handleDblShuffleCategories}
              disabled={shuffleHandle}
              >
              <p style={{border: '1px solid'}}>{t('catList.mix')}</p>
            </button>
            <button className={styles.deleteButton} onClick={handleAllCategories}>
            <p style={{border: '1px solid'}}>{t('catList.all')}</p>
            </button>            
            <button
              id='changeSortId' 
              className={styles.sortId} 
              onClick={handleChangeSortId}
              style={{border: '1px solid', margin: '0 3px'}}
              >
              <p style={{margin: '0 4px 0 0'}}>{t('catList.byId')}</p> 
              {(sort.slice(1) === '_id') ? showSortIcons(sort) : unfoldIcon()}
            </button>
            <button
              id='changeSortName' 
              className={styles.sortName} 
              onClick={handleChangeSortName}
              style={{border: '1px solid'}}
              >
              <p style={{margin: '0 4px 0 0'}}>{t('catList.byName')}</p> 
              {(sort.slice(1) === 'name') ? showSortIcons(sort) : unfoldIcon()}
            </button>                           
          </div>                                       
        </div>
        {(currentItems.length === 0) ? listCategoryEmpty() : listCategory(currentItems)}
        
        {/* {isLoading && <CircularProgress className={styles.postLoader} />}   */}
      </div>
      <Toaster />     
    </div>
    {categoryesCount > itemPerPage ?    
      <div className={styles.paginationContainer}>      
        <ReactPaginate
          breakLabel="..."
          nextLabel={t('catList.next')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={t('catList.prev')}
          renderOnZeroPageCount={null}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
          forcePage={Math.floor(currentPage/itemPerPage)}
        />      
      </div>
    : null}   
    </>    
  )
}