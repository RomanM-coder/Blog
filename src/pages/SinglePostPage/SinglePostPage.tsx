import { AddCommentForm } from "./AddCommentForm/AddCommentForm.tsx"
import { CommentPost } from "../../components/CommentPost/CommentPost.tsx"
import ReactPaginate from 'react-paginate'
import { useEffect, useState, useContext, useRef } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { useSinglePost } from './singlePost.hook.ts'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from "../../utilita/modelComment.ts"
import {useDebounce} from '../../utilita/useDebounce.ts'
import toast, { Toaster } from 'react-hot-toast'
import { SocketContext } from '../../context/SocketContext.tsx'
import { useTranslation } from 'react-i18next'
import { basicColor } from '../../utilita/defauit.ts'
import Skeleton from 'react-loading-skeleton'
import { motion } from "framer-motion"
import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../SinglePostPage/SinglePostPage.module.css'

export const SinglePostPage: React.FC = () => {  
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [dataGetSearch] = useGlobalState('itemSearch') 
  const divRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const commentRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerSize, setHeaderSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<IComment>({} as IComment)
  const [comments, setComments] = useState<IComment[]>([])
  const [favorite, setFavorite] = useState<number>(0)
  const [noFavorite, setNoFavorite] = useState<number>(0)  
  const [message, setMessage] = useState('')
  const socket = useContext(SocketContext)
  
  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<IComment[]>([])
  const itemPerPage = 3

  const { t, i18n } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string
  const debouncedInputValue = useDebounce(dataGetSearch, 300) // Debounce with 300ms delay

  const handleSetComments = (newComments: IComment[]) => {
    // if (Array.isArray(newComments)) {          
    //   setComments([...comments, ...newComments])         
    // } else {          
    //   setComments([...comments, newComments])
    // } 
    setComments(newComments)  
  }
    
  const { categoryId, selectedPost, useGetPost, useLikePost, useLikeDislikeComment, useGetComments, useAddNewComment, useGetCategoryForNavBar, useGetSearch, error, clearError } = useSinglePost({handleSetComments, setComments})

  const likePost = async (updatePost: IPost) => {      
    try {          
      const result = await useLikePost(updatePost)
      if (result !== 'only once') {
        myToast(t('singlePostPage.toast.changeLike'), basicColor.green)       
      } else {
        await useGetPost()
        setIsLoading(false)
      }                        
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }
  }
  
  const likeDislikeComment = async (updateComment: IComment) => {      
    try {               
      const result = await useLikeDislikeComment(updateComment)
      if (result !== 'only once') {
        myToast(t('singlePostPage.toast.changeLike'), basicColor.green)       
      } else {
        await useGetComments()
        setIsLoading(false)
      } 
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }
  } 
  
  const addNewComment = async (newComment: string) => {
    setShowAddForm(false)  
    try {
      await useAddNewComment(newComment)      
      myToast(t('singlePostPage.toast.addComment'), basicColor.green)               
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

  const handleAddFormShow = () => {
    setShowAddForm(true)
  } 

  const handleLikeDislikeComment = async (selectedComment: IComment) => {    
    await likeDislikeComment(selectedComment)    
  }  

  const handleSelectComment = (selectedComment: IComment) => {
    setSelectedComment(selectedComment)
  }

  const handleAddFormHide = () => {
    setShowAddForm(false)
  }

  const handleFavorite = async (selectedPost: IPost) => {   
    setFavorite(selectedPost.favorite++)   
    await likePost(selectedPost)            
  }
  
  const handleNoFavorite = async (selectedPost: IPost) => {
    setNoFavorite(selectedPost.nofavorite++)
    await likePost(selectedPost)            
  }  
  
  const listComments = () => {
    return (
      <div className={styles.commentsList}>
        {currentItems.map((comment: IComment) => {
          return (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
            >
            {isLoading ? <Skeleton width={sizes.width} height={sizes.height} key={comment._id} style={{marginBottom: '10px'}}/> :
              <div ref={commentRef} key={comment._id}> 
                <CommentPost
                  // key={comment._id}
                  comment={comment}                  
                  handleLikeDislikeComment={handleLikeDislikeComment}                   
                  handleSelectComment={handleSelectComment}
                />
              </div>}           
            </motion.div> 
          )
        })}
      </div>
    )
  }
  
  const handlePageClick = (data: { selected: number }) => {
    console.log('data.selected', data.selected)    
    const newPage = (data.selected * itemPerPage) % comments.length
    console.log('newPage', newPage)    
    setCurrentPage(newPage)
  }
  
  useEffect(() => {    
    useGetSearch(selectedPost._id!, debouncedInputValue) // update
    console.log('useGetSearch----------')           
  }, [debouncedInputValue])

  useEffect(() => {   
    useGetPost()
    useGetCategoryForNavBar()
    useGetComments()     
  },[i18n.language])

  useEffect(() => { 
    console.log('Comments changed') // -----------Логируем изменения
    console.log('currentPage=', currentPage)    
    console.log('comments.length=', comments.length)   
    const lastItemIndex = currentPage + itemPerPage       
    setCurrentItems(comments.slice(currentPage, lastItemIndex))
    setPageCount(Math.ceil(comments.length / itemPerPage))
  }, [comments, currentPage])

  useEffect(() => {
    const handleWindowResize = () => {      
      if (divRef.current && headerRef.current && commentRef.current) {         
        const width = divRef.current.scrollWidth
        const height = divRef.current.scrollHeight
        setSize({ ...size, width: width, height: height })
            
        const width2 = headerRef.current.scrollWidth
        const height2 = headerRef.current.scrollHeight
        setHeaderSize({ ...headerSize, width: width2, height: height2 })
             
        const width3 = commentRef.current.scrollWidth
        const height3 = commentRef.current.scrollHeight
        setSizes({ ...sizes, width: width3, height: height3 })
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
                
    socket.emit('joinRoom', { room: 'singlePost', userId })    
    console.log('Socket is initialized room singlePost')   

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
      socket.emit('leaveRoom', { room:'singlePost', userId })           
      socket.off('server_edit_response')
      socket.off('connect_error')          
    }
  }, [socket])
  
  if (!selectedPost) return (
    <>      
      <h2 style={{textAlign: 'center'}}>{t('singlePostPage.toast.noPost')}</h2>
    </>
  )

  return (
    <>
    <div className={styles.singlePostPage}>
      <div>        
        {showAddForm && <AddCommentForm 
          handleAddFormHide={handleAddFormHide}
          addNewComment={addNewComment}
          post={selectedPost}             
        />}
        {isLoading ? <Skeleton width={size.width} height={size.height} style={{margin: '3px 10px'}}
        /> :        
        <div className={styles.post} ref={divRef}>        
          <div>        
            <h4>{selectedPost.title}</h4>
            <p className={styles.descriptionSinglePost}>{selectedPost.description}</p>
            <div className={styles.containerFavorite}>
              <div className={styles.favorite}>        
                <button className={styles.favoriteButton} onClick={() => handleFavorite(selectedPost)}>        
                  <FavoriteIcon style={{fill: 'red'}} />        
                </button>
                <span className={styles.number}>{selectedPost.favorite}</span>
              </div> 
              <div className={styles.unFavorite}>
                <button className={styles.favoriteButton} onClick={() => handleNoFavorite(selectedPost)}>        
                  <FavoriteIcon style={{fill: 'black'}} />        
                </button>
                <span className={styles.number}>{selectedPost.nofavorite}</span>
              </div>
            </div>            
          </div>                     
        </div>}
      </div>
      <div className={styles.comments}>
      {isLoading ? <Skeleton width={headerSize.width} height={headerSize.height} style={{marginBottom: '5px'}}/> :
        <div className={styles.headerComments} ref={headerRef}>
          <h3 className={styles.titleComents}>{t('singlePostPage.header')}</h3>
          <button className={styles.addButton} onClick={handleAddFormShow}>                
            <AddIcon />        
          </button>
        </div>}
        {(comments.length === 0) ? <p style={{textAlign: 'center'}}>{t('singlePostPage.noComments')}</p>: listComments() }
      </div>  
      {/* {isLoading && <CircularProgress className={styles.postLoader} />} */}
      <Toaster />                  
    </div>
    {comments.length > itemPerPage ?
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
    : null }
    </>
  )
}

// const dislikeComment = async (updateComment: IComment) => {      
//   try {          
//     await useDislikeComment(updateComment, (err: string)=> {
//       if (err !== 'only once') {
//         myToast(t('singlePostPage.toast.changeLike'), basicColor.orange)         
//       }
//     })