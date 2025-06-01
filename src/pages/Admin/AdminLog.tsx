import React, { useState, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useAdminLog } from './adminLog.hook.ts'
import { basicUrl, basicColor } from "../../utilita/defauit.ts"
import { AdminLogCard } from '../../components/AdminLogCard/AdminLogCard.tsx'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Skeleton from 'react-loading-skeleton'
import {useDebounce} from '../../utilita/useDebounce.ts'
import { IAdminLog } from '../../utilita/modelAdminLog.ts'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminLog.module.css'

export const AdminLog: React.FC = () => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch, setDataGetSearch] = useGlobalState('itemSearch')    
  const [adminCount, setAdminCount] = useState<number>(0)  
    
  // вычисления для Skeletona  
  const adminRef = useRef<HTMLDivElement>(null)
  const [adminSize, setAdminSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })  

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<IAdminLog[]>([])
  const itemPerPage = 7

  const { t, i18n } = useTranslation()
  const {width} = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay  
  const [sortState, setSortState] = useState<{ [key: string]: 'asc'|'desc'|'none' }>({
    adminId: 'none',
    what: 'none',
    time: 'none',
  })

  const [activeSort, setActiveSort] = useState(0)

  let random = (Math.random()*10000)
  random = Math.trunc(random)  

  const showButton = (nameButton: string) => {
    if (sortState[nameButton] === 'desc') return <ArrowDropDownIcon/>
    if (sortState[nameButton] === 'asc') return <ArrowDropUpIcon/>
    if (sortState[nameButton] === 'none') return ''
  }

  const arrayButton = [
    <>AdminId {showButton('adminId')}</>,
    <>What {showButton('what')}</>,
    <>Time {showButton('time')}</>   
  ]

  const {useGetAdminLog, useAdminLogGetSearch, useGetAdminLogSort, admins, error, clearError} = useAdminLog(setAdminCount, dataGetSearch)   

  const sortFields = ['adminId', 'what', 'time']

  const handleSort = async (index: number) => {
    try {
      // Проверяем, что индекс корректен
      if (index < 0 || index >= sortFields.length) {
        throw new Error('Invalid index')
      }
      setActiveSort(index)

      // Получаем поле по индексу
      const field = sortFields[index]
      const newsort = toggleSort(field)

      console.log('newsort=', newsort)

      await useGetAdminLogSort(newsort)
    } catch (err) {
      console.error('Ошибка:', err)
      myToast(error, basicColor.red)
      clearError()
    }
  }

  const toggleSort = (field: keyof typeof sortState): { 
    sortField: string|number, 
    sortOrder: 'asc'|'desc'|'none' 
  } => {
    const currentOrder = sortState[field]
    const nextOrder = getNextOrder(currentOrder)
  
    setSortState((prev) => ({ ...prev, [field]: nextOrder }))
  
    return { sortField: field, sortOrder: nextOrder }
  }
  
  const getNextOrder = (currentOrder: 'asc'|'desc'|'none'): 'asc'|'desc'|'none' => {
    if (currentOrder === 'none') return 'asc'
    if (currentOrder === 'asc') return 'desc'
    return 'none'
  }   

  const ActiveLine = () => {
    return (
      <motion.div
        initial={{ color: '#000' }}
        animate={{ color: 'rgb(255, 0, 0)' }}
        exit={{ color: '#000' }}
        transition={{ duration: 0.25 }}
        layoutId='activeSort'                
        style={{
          width: `calc(70%)`,
          height: '2px',
          position: 'absolute',
          bottom: '0px',
          left: `5px`,
          backgroundColor: 'red'
        }}
      />
    )
  }   

  function listAdmin(adminList: IAdminLog[]) {
    console.log('adminList= ', adminList)
    
    return (        
      <ul className={styles.adminList}>        
          {adminList.map((admin: IAdminLog, i: number) => (
          <>                      
            <div                          
              key={`${admin._id}`}
              className={styles.singleAdmin}                                      
            > 
              {isLoading ? <Skeleton width={adminSize.width} height={adminSize.height} 
              // key={`${user._id}`}
              /> : <>
              <p className={styles.singleNumber}>{i + 1}</p> 
              <div ref={adminRef} className={styles.adminWrapper} 
              // key={`${user._id?.concat(random.toString())}`}
              >
                <AdminLogCard                       
                  admin={admin}                 
                  maxWidth={maxWidth}                       
                />
              </div>
              </>}
            </div>
          </>
          ))}        
      </ul>       
    )
  }

  function listAdminEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('adminLog.admin_zero')}</h3>
    )
  }
  
  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 10000,
    })
  } 

  const handlePageClick = (data: { selected: number }) => {
    console.log('data.selected', data.selected)    
    const newPage = (data.selected * itemPerPage) % admins.length
    console.log('newPage', newPage)    
    setCurrentPage(newPage)
  }  

  useEffect(() => {
    useAdminLogGetSearch(debouncedInputValue)             
    console.log('use1----------')   
  }, [debouncedInputValue])

  useEffect(() => {   
    useAdminLogGetSearch('')   
  }, [])  

  useEffect(() => {
    // useGetSearch(debouncedInputValue)    
    const lastItemIndex = currentPage + itemPerPage   
    setCurrentItems(admins.slice(currentPage, lastItemIndex)) 
    setPageCount(Math.ceil(admins.length / itemPerPage))
  }, [admins, currentPage])

  useEffect(() => {    
    const handleWindowResize = () => {     
      console.log('adminRef.current', adminRef.current)
      if (adminRef.current) {
        console.log('adminLog--useEffect')      
            
        const width4 = adminRef.current.scrollWidth
        const height4 = adminRef.current.scrollHeight
        setAdminSize({ ...adminSize, width: width4, height: height4 })
      }
    }
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handleWindowResize)     
    }, 300)    

    return () => {
      if (timeoutId) clearTimeout(timeoutId)     
    }      
  }, [dataGetSearch])  

  useEffect(() => {   
    setMaxWidth(width!)   
  }, [width])

  return (
    <>
    <div className={styles.adminLogs}>      
      <div>
        <h2 className={styles.title}>{t('adminLog.header')}</h2>         
        <div style={{display: 'flex', justifyContent: 'center', margin: '10px 0', textAlign: 'center', alignItems: 'center'}}>
          <div className={styles.containerButton}>           
            <>
            {arrayButton.map((item, index) => (              
              <button 
                className={styles.addButton}                
                key={index} 
                onClick={() => handleSort(index)}               
              >
                {item}                           
                {(activeSort === index) && <ActiveLine />}               
              </button>
            ))}          
            </>                      
          </div>
        </div>
        {(currentItems.length === 0) ? listAdminEmpty() : listAdmin(currentItems)}
      </div>  
      <Toaster />
    </div>
    {adminCount > itemPerPage ?
      <div className={styles.paginationContainer}>   
        <ReactPaginate
          breakLabel="..."
          nextLabel={t('adminLog.next')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={t('adminLog.prev')}
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