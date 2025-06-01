import React, { useEffect, useState, useRef, useContext } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { BlogPost } from '../../components/BlogPost/BlogPost.tsx'
import { ReactPagination } from '../../components/Pagination/ReactPagination.tsx'
import { IPost } from '../../utilita/modelPost.ts'
import { usePosts } from '../PostPage/post.hook.ts'
import { useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import {useDebounce} from '../../utilita/useDebounce.ts'
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.tsx'
import { basicUrl } from "../../utilita/defauit.ts"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './PostPage.module.css'

interface IPostPageProps {
  dataGetSearch: string
}

export const PostPage:React.FC = () => {
  const [activePage, setActivePage] = useGlobalState('activePage')  
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch] = useGlobalState('itemSearch')  
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [headerSize, setHeaderSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })  
  const postRef = useRef<HTMLDivElement>(null)
  const [postSize, setPostSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 }) 
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost)  
  const [favorite, setFavorite] = useState<number>(0)
  const [noFavorite, setNoFavorite] = useState<number>(0) 
 
  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 3  
 
  const catId = useParams().id!  
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  const { t, i18n } = useTranslation()
  const [message, setMessage] = useState('')
  const socket = useContext(SocketContext)  
  
  const {posts, useGetPosts, useLikePost, useGetSearch, error, clearError, category, useGetCategoryForNavBar} = usePosts()

  const lastItemIndex = currentPage * itemPerPage
  const firstItemIndex = lastItemIndex - itemPerPage
  const currentItem = posts.slice(firstItemIndex, lastItemIndex)
  
  // const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders
  // #e53935 red darken-1/#42a5f5 blue lighten-1/#69f0ae green accent-2/#ffc107 orange   
  
  const likePost =  async (updatePost: IPost) => {       
    try {
      const result = await useLikePost(updatePost)
      if (result !== 'only once') {
        myToast(t('postPage.toast.voteLike'), basicColor.green)       
      } else {
        await  useGetPosts(updatePost.categoryId)
        setIsLoading(false)
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
      duration: 3000,
    })
  }
  
  const handleSelectPost = (selectedPost: IPost) => {
    setSelectedPost(selectedPost)
  }  

  function listPost() {
    return (
      <div className={styles.allPosts}>
        {currentItem.map((post) => {
          return (
            <div key={post.title} className={styles.postWrapper}>
               {isLoading ? <Skeleton width={postSize.width} height={postSize.height} key={post._id} style={{ margin: '5px 0'}}/> :
                <div ref={postRef} key={post._id} className={styles.postContainer}> 
                  <BlogPost 
                    post={post}
                    // key={post._id}
                    setFavorite={setFavorite}
                    setNoFavorite={setNoFavorite}
                    likePost={likePost}                   
                    handleSelectPost={handleSelectPost}
                    categoryId={catId}               
                  />
                </div>}
            </div>           
          )
        })}
      </div>
    )
  }

  function listPostEmpty() {
    return (
      <h3 style={{textAlign: 'center'}}>{isLoading ? <Skeleton />: t('postPage.noPost')}</h3>
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
    // if (category) {
    //   const nameCategory = category?.name as string
    //   console.log('nameCategory', nameCategory)
    //   setActiveSubPage(nameCategory) 
    // }  
  }, [catId, i18n.language])

  useEffect(() => {
    useGetCategoryForNavBar()
    console.log('useGetCategoryForNavBar----------')    
  }, [i18n.language])

  useEffect(() => {    
    useGetSearch(catId, debouncedInputValue) // update
    console.log('useGetSearch----------')           
  }, [debouncedInputValue])

  // useEffect(() => {
  //   if (category) {
  //     setActiveSubPage(category.name)
  //   }
  // }, [category])

  useEffect(() => {
    const handleWindowResize = () => {
      if (headerRef.current && postRef.current) {
        const currHeaderRef = headerRef.current        
        const currPostRef = postRef.current
                
        const width1 = currHeaderRef.scrollWidth
        const height1 = currHeaderRef.scrollHeight
        setHeaderSize({ ...headerSize, width: width1, height: height1 })       
            
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

  useEffect(() => {
    if (!socket) return     
           
    socket.emit('joinRoom', { room: 'posts', userId })    
    console.log('Socket is initialized room posts')

    socket.on('server_edit_response', (data) => {
      console.log('server_edit_response: ', data.messages)
      const translatedMessage = data.messages[i18n.language]        
      setMessage(translatedMessage)
      myToast(translatedMessage, basicColor.orange)          
    })

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err)
    })     

    return () => {
      // remove Event Listener
      socket.emit('leaveRoom', { room: 'posts', userId })             
      socket.off('server_edit_response')
      socket.off('connect_error')              
    }    
  }, [socket])
  
  return (
    <>
    <div 
      className={styles.blogPage} 
      style={{opacity: postsOpacity, pointerEvents: pointerEvents}}
    >   
      <div className={styles.posts}>
        <div className={styles.divAddPost}>
          {isLoading ? <Skeleton width={headerSize.width} height={headerSize.height} style={{margin: '20px 0'}}/> :
          <h2 ref={headerRef}>{t('postPage.header')+`${category?.name}`}</h2>}           
        </div>
        {(posts.length === 0) ? listPostEmpty() : listPost()}
        {/* {isLoading && <CircularProgress className={styles.postLoader} />}                     */}
      </div>
      <Toaster />     
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