import React, { useEffect, useState, useRef, useContext } from 'react'
import { useGlobalState, getGlobalStateValue } from '../../useGlobalState.ts'
import { AdminCategoryCard } from '../../components/AdminCategoryCard/AdminCategoryCard.tsx'
import { AddEditCategoryForm } from './AddEditCategoryForm/AddEditCategoryForm.tsx'
import { DeleteForm } from './DeleteForm/DeleteForm.tsx'
import { useAdminCategoryes } from './adminCategory.hook.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from '../../utilita/modelComment.ts'
import { IUser } from '../../utilita/modelUser.ts'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { ICategoryForm } from '../../utilita/modelCategoryForm.ts'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import AddIcon from '@mui/icons-material/Add' 
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import ReactPaginate from 'react-paginate'
import {useDebounce} from '../../utilita/useDebounce.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.tsx'
import Skeleton from 'react-loading-skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminCategory.module.css'

interface IAdminCategoryProps {
  dataGetSearch: string
}

export const AdminCategory: React.FC = (
  // {dataGetSearch}
) => {
  // mongodb://splinter:121212@127.0.0.1:27017/test?authMechanism=DEFAULT
  const [activePage, setActivePage] = useGlobalState('activePage') 
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch, setDataGetSearch] = useGlobalState('itemSearch')  
  // вычисления для Skeletona
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [headerSize, setHeaderSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const countRef = useRef<HTMLParagraphElement>(null)
  const [countSize, setCountSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)
  const [buttonSize, setButtonSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 }) 
  const categoryRef = useRef<HTMLDivElement>(null)
  const [categorySize, setCategorySize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  //-------------------  
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay 
  const [categoryesCount, setCategoryesCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<any>()  
  const [sort, setSort] = useState('+name')
  const { t, i18n } = useTranslation()

  const {width} = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  
  const userId = JSON.parse(localStorage.getItem('userData')!).userId  
  // show forms and mode  
  const [showAddEditForm, setShowAddEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [mode, setMode] = useState<'add'|'edit'|undefined>(undefined)       
  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<ICategory[]>([])
  const itemPerPage = 3   
  // let lastItemIndex = currentPage + itemPerPage
  
  const [message, setMessage] = useState('')
  const socket = useContext(SocketContext)  

  const {useGetCategoryList, useGetCategoryForNavBar, useGetCategoryListCount, useGetSearch, useGetCategoryListPagination, useAddNewCategory, useGetFieldTranslation, extendedSelectCategory,
  setExtendedSelectCategory, useEditCategory, useDeleteCategory, error, clearError} = useAdminCategoryes(setCategoryesCount, setCurrentItems)  

  const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))  

  const addCategory = async (newCategory: FormData) => {    
    setShowAddEditForm(false)
    console.log('page Cat formData', newCategory)
    
    try {
      await useAddNewCategory(newCategory)
      await useGetCategoryListCount(itemPerPage, setPageCount)
      await useGetCategoryListPagination(itemPerPage, currentPage, sort)
      myToast(t('adminCatList.toast.categoryAdd'), basicColor.green)        
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()      
    }   
  }  

  const editCategory = async (updateCatagory: FormData) => {    
    setShowAddEditForm(false)
    try {
      await useEditCategory(updateCatagory)      
      await useGetCategoryListPagination(itemPerPage, currentPage, sort)      
      myToast(t('adminCatList.toast.categoryUpdated'), basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()        
    }        
  }    

  const deleteCategory = async (item: ICategory|IPost|IComment|IUser, adminId: string) => {    
    setShowDeleteForm(false)
    try {
      const category = item as ICategory
      if (category as ICategory) {      
        await useDeleteCategory(category, adminId)
        await useGetCategoryListCount(itemPerPage, setPageCount)
        await useGetCategoryListPagination(itemPerPage, currentPage, sort)        
        myToast(t('adminCatList.toast.categoryDeleted'), basicColor.green)
      }                     
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }    
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

  const handleAddEditFormHide = () => {
    setShowAddEditForm(false)
  }

  const handleAddEditFormShow = () => {
    setShowAddEditForm(true)
  }

  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }
  
  const handleSelectCategory = (selectCategory: ICategory) => {
    useGetFieldTranslation(selectCategory)
    setSelectedCategory(selectCategory)            
  }  

  const handleAllCategories = () => {       
    useGetCategoryList()
  }     

  const handleChangeSortId = () => {
    if (sort.slice(1) === '_id') {
      if (sort.slice(0,1) === '+') setSort('-_id')
      else setSort('+_id')  
    } else setSort('+_id')
    useGetCategoryListPagination(itemPerPage, currentPage, sort) 
  }

  const handleChangeSortName = () => {    
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
        <AnimatePresence>        
          {cats.map((category: ICategory, i: number) => (                      
            <motion.div                          
              key={`${category._id}`}              
              style={{lineHeight: "100px", textAlign: "center", margin:"2px"}}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
            > 
              {isLoading ? <Skeleton width={categorySize.width} height={categorySize.height} key={`${category._id}`}/> : 
              <div ref={categoryRef} key={`${category._id?.concat(random.toString())}`}>
                <AdminCategoryCard                       
                  category={category}                                      
                  handleSelectCategory={handleSelectCategory}
                  setMode={setMode} 
                  handleAddEditFormShow={handleAddEditFormShow}
                  handleDeleteFormShow={handleDeleteFormShow}
                  maxWidth={maxWidth}                       
                />
              </div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>       
    )
  }

  function listCategoryEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('catList.category_zero')}</h3>
    )
  } 

  const handlePageClick = (data: { selected: number }) => {   
    const newPage = (data.selected * itemPerPage)// % categoryesCount    
    console.log('newPage', newPage);
    setCurrentPage(newPage)
    changeOptionsPage(newPage)    
  }

  const changeOptionsPage = (skip: number, signal?: AbortSignal) => {     
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
    if (dataGetSearch === '') {
      // changeOptionsPage(currentPage) 
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
  
  useEffect(() => {    
    socket.on('connect', () => { 
      console.log('Connection socket');
           
      socket.emit('joinRoom', { room: 'categories', userId })

      socket.on('server_edit_response', (data) => {
        console.log('server_edit_response: ', data.messages)
        const translatedMessage = data.messages[i18n.language]        
        setMessage(translatedMessage)
        myToast(translatedMessage, basicColor.green)          
      })

      // socket.on('server_response', (data) => {
      //   console.log('server_response--------------------: ', data.message)
      //   const translatedMessage = data.message       
      //   setMessage(translatedMessage)
      //   myToast(translatedMessage, basicColor.green)          
      // })

      socket.on('connect_error', (err) => {
        console.error('Connection error:', err)
    })
    })
    return () => {
      // remove Event Listener
      socket.emit('leaveRoom', { room:'categories', userId })      
      socket.off()
      // socket.disconnect()     
    }
  }, [socket, message])

  useEffect(() => {   
    useGetCategoryForNavBar()
    console.log('-----------------render')
    changeOptionsPage(currentPage)          
  }, [i18n.language])

  useEffect(() => {
    const handleWindowResize = () => {
      if (headerRef.current && countRef.current && buttonRef.current && categoryRef.current) {  
        const width1 = headerRef.current.scrollWidth
        const height1 = headerRef.current.scrollHeight
        setHeaderSize({ ...headerSize, width: width1, height: height1 })
           
        const width2 = countRef.current.scrollWidth
        const height2 = countRef.current.scrollHeight
        setCountSize({ ...countSize, width: width2, height: height2 })
            
        const width3 = buttonRef.current.scrollWidth
        const height3 = buttonRef.current.scrollHeight
        setButtonSize({ ...buttonSize, width: width3, height: height3 })
           
        const width4 = categoryRef.current.scrollWidth
        const height4 = categoryRef.current.scrollHeight
        setCategorySize({ ...categorySize, width: width4, height: height4 })
      }
    }
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handleWindowResize)     
    }, 300)    

    return () => {
      if (timeoutId) clearTimeout(timeoutId)     
    }      
  }, [])

  useEffect(() => {
    if ((width! < 1200)&&(width! > 700)) setMaxWidth((width! / itemPerPage)-3) 
    else if ((width! < 700)&&(width! > 400)) setMaxWidth(width!-23)
    else if ((width! < 2000)&&(width! > 1200)) setMaxWidth((width! / itemPerPage)-0) 
  }, [width])

  // useEffect(() => {   
             
  // }, [extendedSelectCategory.name])  
  
  console.log('pageCount=', pageCount)
  console.log('currentItems=', currentItems.length)  

  return ( 
    <>    
    <div 
      className={styles.categoryPage} 
      style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
    >      
      {showAddEditForm && <AddEditCategoryForm 
        handleAddEditFormHide={handleAddEditFormHide}
        mode={mode}
        extendedSelectCategory={extendedSelectCategory}
        setExtendedSelectCategory={setExtendedSelectCategory}
        addCategory={addCategory}
        editCategory={editCategory}         
      />}     
      {showDeleteForm && <DeleteForm 
        type={'category'}
        handleDeleteFormHide={handleDeleteFormHide}
        selectedItem={selectedCategory}
        onDelete={deleteCategory}          
      />}                            
      <>       
        <div className={styles.category}>
          <div className={styles.divAddCategory}>           
            {isLoading ? <Skeleton width={headerSize.width} height={headerSize.height} style={{margin: '10px 0'}} /> : <h2 ref={headerRef} className={styles.title}>{t('catList.header')}</h2>}
            <p>{message}</p>
            {isLoading ? <Skeleton width={countSize.width} height={countSize.height} style={{marginBottom: '10px'}} /> : 
            <p ref={countRef} className={styles.countCategory}>
              {t('catList.count').concat(t('catList.category', {count: currentItems.length}))}
            </p>}                                    
            {isLoading ? <Skeleton width={buttonSize.width} height={buttonSize.height} /> : 
            <div ref={buttonRef} style={{display: 'flex', justifyContent: 'center', margin: '10px 0'}}>            
              <button 
                className={styles.deleteButton} 
                onClick={() => {
                  handleAddEditFormShow()
                  setMode('add')
                }}>
                  <AddIcon  style={{fontSize: '2rem'}}/>
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
            </div>}                                       
          </div>
          {(currentItems.length === 0) ? listCategoryEmpty() : listCategory(currentItems)}
          
          {/* {isLoading && <CircularProgress className={styles.postLoader} />}   */}
        </div>
        <Toaster />                   
      </>
    </div>
    {(categoryesCount > itemPerPage) ?    
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