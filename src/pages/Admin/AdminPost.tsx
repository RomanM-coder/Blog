import React, { useEffect, useState, useRef, useContext } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { AdminBlogPost } from '../../components/AdminBlogPost/AdminBlogPost.tsx'
import { ReactPagination } from '../../components/Pagination/ReactPagination.tsx'
import { ICategory } from '../../utilita/modelCategory.ts'
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from '../../utilita/modelComment.ts'
import { IUser } from '../../utilita/modelUser.ts'
import { AddEditPostForm } from './AddEditPostForm/AddEditPostForm.tsx'
import { DeleteForm } from './DeleteForm/DeleteForm.tsx'
import { useAdminPosts } from './adminPost.hook.ts'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useDebounce } from '../../utilita/useDebounce.ts'
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.tsx'
import Skeleton from 'react-loading-skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminPost.module.css'

export const AdminPost:React.FC = () => {
  const [activePage, setActivePage] = useGlobalState('activePage')  
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch, setDataGetSearch] = useGlobalState('itemSearch')  

  const headerRef = useRef<HTMLHeadingElement>(null)
  const [headerSize, setHeaderSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonSize, setButtonSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const postRef = useRef<HTMLDivElement>(null)
  const [postSize, setPostSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 }) 
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay  

  // const [mode, setMode] = useState<'add'|'edit'|undefined>(undefined)
  const [showAddEditForm, setShowAddEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)
  const [modePost, setModePost] = useState<'add'|'edit'>('add')
  
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost)
  const [favorite, setFavorite] = useState<number>(0)
  const [noFavorite, setNoFavorite] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 3
  
  const catId = useParams().id!  
  const userId: string = JSON.parse(localStorage.getItem('userData')!).userId as string
  const { t, i18n } = useTranslation()
  const [message, setMessage] = useState('')
  const socket = useContext(SocketContext)
  
  const {posts, useGetPosts, useLikePost, useAddNewPost, useDeletePost, useEditBlogPost, useGetSearch, error, clearError, category, useGetCategoryForNavBar, useGetFieldTranslation, extendedSelectedPost} = useAdminPosts()

  const lastItemIndex = currentPage * itemPerPage
  const firstItemIndex = lastItemIndex - itemPerPage
  const currentItem = posts.slice(firstItemIndex, lastItemIndex)
  
  // const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders
  // #e53935 red darken-1/#42a5f5 blue lighten-1/#69f0ae green accent-2/#ffc107 orange   
  
  const likePost = async (updatePost: IPost) => {       
    try {
      await useLikePost(updatePost)
      myToast(t('adminPostPage.toast.changeLike'), basicColor.green)                     
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }   
  }

  const addBlogPost = async (post: FormData) => {    
    setShowAddEditForm(false)
    try {
      await useAddNewPost(post)
      myToast(t('adminPostPage.toast.addPost'), basicColor.green)        
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }   
  }

  const editBlogPost = async (updateBlogPost: FormData) => {
    setShowAddEditForm(false)
    try {
      await useEditBlogPost(updateBlogPost)
      myToast(t('adminPostPage.toast.editPost'), basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }    
  }    

  const deletePost = async (item: ICategory|IPost|IComment|IUser, adminId: string) => {    
    try {
      const post = item as IPost
      if (post as IPost) {
        await useDeletePost(post, adminId)
        myToast(t('adminPostPage.toast.deletePost'), basicColor.green)
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
  
  const handleSelectPost = (selectedPost: IPost) => {
    // useGetFieldTranslation(selectedPost)
    setSelectedPost(selectedPost)
  }  
  
  const handleAddEditFormShow = () => {
    setShowAddEditForm(true)
  }

  const handleAddEditFormHide = () => {
    setShowAddEditForm(false)
  }
  
  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleDeleteFormShow = () => {
    setShowDeleteForm(true)
  }  

  function listPost() {
    return (
      <div className={styles.allPosts}>
        <AnimatePresence>
        {currentItem.map((post) => {
          return (
            <motion.div 
              key={post.title} 
              style={{display: 'flex', flexDirection: 'column', padding: '5px 0px'}}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
            >
               {isLoading ? <Skeleton width={postSize.width} height={postSize.height} key={post._id} style={{ margin: '5px 0'}}/> :
                <div ref={postRef} key={post._id}> 
                  <AdminBlogPost 
                    post={post}
                    // key={post._id}
                    setModePost={setModePost}
                    setFavorite={setFavorite}
                    setNoFavorite={setNoFavorite}
                    likePost={likePost}
                    useGetFieldTranslation={useGetFieldTranslation}             
                    handleAddEditFormShow={handleAddEditFormShow}
                    handleDeleteFormShow={handleDeleteFormShow}
                    handleSelectPost={handleSelectPost}
                    categoryId={catId}               
                  />
                </div>}
            </motion.div>           
          )
        })}
        </AnimatePresence>
      </div>
    )
  }

  function listPostEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('adminPostPage.noPost')}</h3>
    )
  }
  // console.log('posts=', posts.length);  

  const changePage = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => prev + 1)
  const prevPage = () => setCurrentPage(prev => prev - 1)
 
  // const postsOpacity = isLoading ? 0.5 : 1 
  // const pointerEvents = isLoading ? "none" as React.CSSProperties["pointerEvents"] : "auto" as React.CSSProperties["pointerEvents"] 
  
  const postsOpacity = 1 
  const pointerEvents = "auto" as React.CSSProperties["pointerEvents"]
  

  useEffect(() => {    
    useGetPosts(catId)
    setActivePage(1)
    console.log('useGetPosts----------')
    // if (Object.keys(category).length !== 0) {
    //   const nameCategory = category.name as string
    //   console.log('nameCategory', nameCategory)
    //   setActiveSubPage(nameCategory) 
    // }  
  }, [catId, i18n.language])

  useEffect(() => {
    useGetCategoryForNavBar()
    console.log('useGetCategoryForNavBar----------')    
  }, [i18n.language])

  useEffect(() => {
    if (dataGetSearch === '') {
      // changeOptionsPage(currentPage) 
    } else 
    useGetSearch(debouncedInputValue) // update
    console.log('useGetSearch----------')
  }, [debouncedInputValue]) 

  useEffect(() => {    
    socket.on('connect', () => { 
      console.log('Connection socket');
            
      socket.emit('joinRoom', { room: 'adminPosts', userId })

      socket.on('server_edit_response', (data) => {
        console.log('server_edit_response: ', data.messages)
        const translatedMessage = data.messages[i18n.language]        
        setMessage(translatedMessage)
        myToast(translatedMessage, basicColor.green)          
      })
      
      socket.on('connect_error', (err) => {
        console.error('Connection error:', err)
      })
    })
    return () => {
      // remove Event Listener
      socket.emit('leaveRoom', { room:'posts', userId })     
      socket.off()
      // socket.disconnect()     
    }
  }, [socket, message])

  useEffect(() => {
    const handleWindowResize = () => {
      if (headerRef.current && buttonRef.current && postRef.current) {
        const currHeaderRef = headerRef.current
        const currButtonRef = buttonRef.current
        const currPostRef = postRef.current
                
        const width1 = currHeaderRef.scrollWidth
        const height1 = currHeaderRef.scrollHeight
        setHeaderSize({ ...headerSize, width: width1, height: height1 })
            
        const width2 = currButtonRef.scrollWidth
        const height2 = currButtonRef.scrollHeight
        setButtonSize({ ...buttonSize, width: width2, height: height2 })
            
        const width3 = currPostRef.scrollWidth
        const height3 = currPostRef.scrollHeight
        setPostSize({ ...postSize, width: width3, height: height3 })
      }
    }    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(handleWindowResize)     
    }, 300)    

    return () => {
      if (timeoutId) clearTimeout(timeoutId)     
    }    
  }, [])  
  
  return (
    <>
    <div 
      className={styles.blogPage} 
      style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
    >      
      {showAddEditForm && <AddEditPostForm 
        handleAddEditPostFormHide={handleAddEditFormHide}
        modePost={modePost}
        extendedSelectedPost={extendedSelectedPost}
        addBlogPost={addBlogPost}
        editBlogPost={editBlogPost}
        categoryId={catId}
      />}
      {showDeleteForm && <DeleteForm         
        type={'post'}
        handleDeleteFormHide={handleDeleteFormHide}
        selectedItem={selectedPost}
        onDelete={deletePost}                            
      />}                   
      <>       
        <div className={styles.posts}>
          <div className={styles.divAddPost}>
            {isLoading ? <Skeleton width={headerSize.width} height={headerSize.height} style={{margin: '20px 0'}}/> :
            <h2 ref={headerRef}>{t('adminPostPage.header')+`${category?.name}`}</h2>}             
            {isLoading ? <Skeleton width={buttonSize.width} height={buttonSize.height} /> :
            <button
              ref={buttonRef} 
              className='btnBlack' 
              onClick={() => {
                setModePost('add')
                handleAddEditFormShow()}}
            >
              {t('adminPostPage.createPost')}
            </button>}
          </div>
          {(posts.length === 0) ? listPostEmpty() : listPost()}
          {/* {isLoading && <CircularProgress className={styles.postLoader} />}                     */}
        </div>
        <Toaster />        
      </>
    </div>       
    {(posts.length > itemPerPage) ?      
      <ReactPagination 
        itemsPerPage={itemPerPage}
        allItems={posts.length}
        changePage={changePage}
        currentPage={currentPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    : null }
    </>  
  )
}