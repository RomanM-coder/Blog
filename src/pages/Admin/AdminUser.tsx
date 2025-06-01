import React, { useState, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useAdminUsers } from './adminUser.hook.ts'
import { basicUrl, basicColor } from "../../utilita/defauit.ts"
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Skeleton from 'react-loading-skeleton'
import {useDebounce} from '../../utilita/useDebounce.ts'
import { AdminUserCard } from '../../components/AdminUserCard/AdminUserCard.tsx'
import { AddEditUserForm } from './AddEditUserForm/AddEditUserForm.tsx'
import { DeleteForm } from './DeleteForm/DeleteForm.tsx'
import { ICategory } from '../../utilita/modelCategory.ts'
import { IUser } from '../../utilita/modelUser.ts'
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from '../../utilita/modelComment.ts'
import useScreenSize from '../../utilita/useScreenSize.ts'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminUser.module.css'

interface IAdminUserProps {
  dataGetSearch: string
}

export const AdminUser: React.FC = (
  // {dataGetSearch}
) => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch, setDataGetSearch] = useGlobalState('itemSearch')    
  const [usersCount, setUsersCount] = useState<number>(0)  
  const [votePosts, setVotePosts] = useState<string[]>([])
  const [voteComments, setVoteComments] = useState<string[]>([])
  const [modeUser, setModeUser] = useState<'add'|'edit'>('add')
  const [showAddEditUserForm, setShowAddEditUserForm] = useState(false)
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser>({} as IUser)  
  // вычисления для Skeletona  
  const userRef = useRef<HTMLDivElement>(null)
  const [userSize, setUserSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })  

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<IUser[]>([])
  const itemPerPage = 3

  const { t, i18n } = useTranslation()
  const {width} = useScreenSize() // перерасчет ширин элементов
  const [maxWidth, setMaxWidth] = useState(0)
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay
  interface ISortState {
    role: 'asc' | 'desc' | 'none',
    email: 'asc' | 'desc' | 'none',
    createAt: 'asc' | 'desc' | 'none',
    lastLogin: 'asc' | 'desc' | 'none'
  }
  const [sortState, setSortState] = useState<ISortState>({
    role: 'none',
    email: 'none',
    createAt: 'none',
    lastLogin: 'none'
  })
  const [activeSort, setActiveSort] = useState(0)

  let random = (Math.random()*10000)
  random = Math.trunc(random)  

  const showButton = (nameButton: keyof ISortState) => {
    if (sortState[nameButton] === 'desc') return <ArrowDropDownIcon/>
    if (sortState[nameButton] === 'asc') return <ArrowDropUpIcon/>
    if (sortState[nameButton] === 'none') return ''
  }

  const arrayButton = [
    <>Role {showButton('role')}</>,
    <>Email {showButton('email')}</>,
    <>Create {showButton('createAt')}</>, 
    <>Last {showButton('lastLogin')}</>  
  ]

  const {useGetUsers, useGetSearch, useGetVotePostsComments, useAddUser, useEditUser, useDeleteUser, useGetUsersSort, users, setUsers, error, clearError} = useAdminUsers(setUsersCount, setVotePosts, setVoteComments, dataGetSearch)
  
  const addUser = async (newUser: FormData) => {
    setShowDeleteUserForm(false)
    try {           
      await useAddUser(newUser)
      // await useGetUsers()             
      myToast(t('adminUser.toast.userAdd'), basicColor.orange)
                           
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }   
  }

  const editUser = async (editUser: FormData) => {
    setShowDeleteUserForm(false)
    try {            
      await useEditUser(editUser)
      await useGetUsers()             
      myToast(t('adminUser.toast.userUpdated'), basicColor.orange)
                           
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }   
  }

  const deleteUser = async (item: IUser | ICategory | IPost | IComment, adminId: string) => {
    setShowDeleteUserForm(false)
    try {
      const user = item as IUser
      if (user as IUser) {      
        await useDeleteUser(user, adminId)                
        myToast(t('adminUser.toast.userDeleted'), basicColor.orange)
      }                     
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }
  }

  const sortFields: (keyof ISortState)[] = ['role', 'email', 'createAt', 'lastLogin']
  
  const handleSort = async (index: number) => {
    try {
      // Проверяем, что индекс корректен
      if (index < 0 || index >= sortFields.length) {
        throw new Error('Invalid index')
      }
      setActiveSort(index)

      // Получаем поле по индексу
      const field  = sortFields[index]
      const newsort = toggleSort(field)

      console.log('newsort=', newsort)

      await useGetUsersSort(newsort)
    } catch (err) {
      console.error('Ошибка:', err)
      myToast(error, basicColor.red)
      clearError()
    }
  }
  
  const toggleSort = (field: keyof ISortState): { 
    sortField: string, 
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
  
  // const sort = {
  //   sortEmail: undefined,
  //   sortRole: undefined,
  //   sortCreate: undefined,
  //   sortLast: undefined
  // }

  // const handleSort = async (index: number) => {    
  //   try {      
  //     setActiveSort(index)     
  //     let newsort = sort
  //     if (index === 0) { newsort = toggleSort( 'sortRole', sortRole, setSortRole) } 
  //     if (index === 1) { newsort = toggleSort( 'sortEmail', sortEmail, setSortEmail) } 
  //     if (index === 2) { newsort = toggleSort( 'sortCreate', sortCreate, setSortCreate) }
  //     if (index === 3) { newsort = toggleSort( 'sortLast', sortLast, setSortLast) }
  //     console.log('newsort=', newsort)
      
  //     await useGetUsersSort(newsort)                                
  //   } catch (err) {
  //     console.log(err)
  //     myToast(error, basicColor.red)      
  //     clearError()
  //   }   
  // }

  // const toggleSort = (
  //   fieldSort: string, 
  //   sortDirection: string, 
  //   setSortField: (sortDir: string) => void    
  // ) => {    
  //   if (sortDirection === '+') {
  //     const sortObject: { [key: string]: '+'|'-' } = { [fieldSort]: '-' }
  //     setSortField('-')
  //     const newsort = {...sort, ...sortObject}
  //     return newsort
  //   }
  //   else {
  //     const sortObject: { [key: string]: '+'|'-' } = { [fieldSort]: '+' }
  //     setSortField('+')
  //     const newsort = {...sort, ...sortObject}
  //     return newsort
  //   }
  // }  

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

  const handleAddUser = () => {
    setModeUser('add')   
    setShowAddEditUserForm(true)
  }

  const handleSelectUser = (
    // event: React.MouseEvent<HTMLLIElement>, 
    selectUser: IUser) => {      
    setSelectedUser(selectUser)
  }
  
  const handleAddEditUserFormShow = () => {
    setShowAddEditUserForm(true)    
  }

  const handleDeleteUserFormShow = () => {
    setShowDeleteUserForm(true)    
  }

  const handleAddEditUserFormHide = () => {
    setShowAddEditUserForm(false)    
  }

  const handleDeleteUserFormHide = () => {
    setShowDeleteUserForm(false)    
  }

  function listUser(usersList: IUser[]) {
    console.log('usersList= ', usersList)
    
    return (        
      <ul className={styles.userList}>        
          {usersList.map((user: IUser, i: number) => (
          <>                      
            <div                          
              key={`${user._id}`}
              className={styles.singleUser}                                      
            > 
              {isLoading ? <Skeleton width={userSize.width} height={userSize.height} 
              // key={`${user._id}`}
              /> : <>
              <p className={styles.singleNumber}>{i + 1}</p> 
              <div ref={userRef} className={styles.userWrapper} 
              // key={`${user._id?.concat(random.toString())}`}
              >
                <AdminUserCard                       
                  user={user}                                      
                  handleSelectUser={handleSelectUser}
                  setModeUser={setModeUser} 
                  handleAddEditUserFormShow={handleAddEditUserFormShow}
                  handleDeleteUserFormShow={handleDeleteUserFormShow}
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

  function listUserEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('adminUser.user_zero')}</h3>
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
    const newPage = (data.selected * itemPerPage) % users.length
    console.log('newPage', newPage)    
    setCurrentPage(newPage)
  }  

  useEffect(() => {
    useGetSearch(debouncedInputValue)              
    console.log('use1----------')   
  }, [debouncedInputValue])

  useEffect(() => {
    // useGetUsers()
    useGetSearch('')
    useGetVotePostsComments()
  }, [])  

  useEffect(() => {
    // useGetSearch(debouncedInputValue)    
    const lastItemIndex = currentPage + itemPerPage   
    setCurrentItems(users.slice(currentPage, lastItemIndex))
    setPageCount(Math.ceil(users.length / itemPerPage))
  }, [users, currentPage])

  useEffect(() => {    
    const handleWindowResize = () => {      
      console.log('userRef.current', userRef.current)
      if (userRef.current) {
        console.log('user--useEffect')            
        const width4 = userRef.current.scrollWidth
        const height4 = userRef.current.scrollHeight
        setUserSize({ ...userSize, width: width4, height: height4 })
      }
    }
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handleWindowResize)     
    }, 300)    

    return () => {
      if (timeoutId) clearTimeout(timeoutId)     
    }      
  }, [dataGetSearch])

  // useEffect(() => {
  //   if (userRef.current) {
  //     const resizeObserver = new ResizeObserver((entries) => {
  //       for (let entry of entries) {
  //         const { width, height } = entry.contentRect;
  //         setUserSize({ width, height });
  //       }
  //     });
  //     resizeObserver.observe(userRef.current);
  //     return () => {
  //       resizeObserver.unobserve(userRef.current!);
  //     };
  //   }
  // }, [dataGetSearch])

  useEffect(() => {   
    setMaxWidth(width!)   
  }, [width])

  return (
    <>
    <div className={styles.adminUsers}>
      {showAddEditUserForm && <AddEditUserForm 
        handleAddEditUserFormHide={handleAddEditUserFormHide}
        modeUser={modeUser}
        selectedUser={selectedUser}
        addUser={addUser}
        editUser={editUser}
        voteposts={votePosts}
        votecomments={voteComments}               
      />}
      {showDeleteUserForm && <DeleteForm 
        type={'user'}
        handleDeleteFormHide={handleDeleteUserFormHide}
        selectedItem={selectedUser}
        onDelete={deleteUser}          
      />}
      <div>       
        <h2 className={styles.title}>{t('adminUser.header')}</h2>       
        <div style={{display: 'flex', justifyContent: 'center', margin: '10px 0'}}>
          <div className={styles.containerButton}>
            <button className={styles.addButton} onClick={handleAddUser}>                
              <AddIcon />        
            </button>
            <>
            {arrayButton.map((item, index) => (              
              <button 
                className={styles.addButton}
                // className={(activeSort === index) ? `${styles.addButton} activeLine` : `${styles.addButton}`}
                key={index} 
                onClick={() => handleSort(index)}
                // initial={{ color: '#000' }}
                // animate={{color: activeSort === index ? 'rgb(255, 0, 0)': '#000' }}
                // exit={{ color: '#000' }} // Анимация исчезновения
                // transition={{ duration: 0.25 }} 
              >
                {item}                           
                {(activeSort === index) && <ActiveLine />}               
              </button>
            ))}          
            </>                      
          </div>
        </div>
        {/* } */}
        {(currentItems.length === 0) ? listUserEmpty() : listUser(currentItems)}
      </div>  
      <Toaster />
    </div>
    {(users.length > itemPerPage) ? 
      <div className={styles.paginationContainer}>   
        <ReactPaginate
          breakLabel="..."
          nextLabel={t('adminUser.next')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={t('adminUser.prev')}
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