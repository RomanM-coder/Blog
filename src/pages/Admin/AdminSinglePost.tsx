import { AddEditPostForm } from "../Admin/AddEditPostForm/AddEditPostForm.tsx"
import { AddEditCommentForm } from "./AddEditCommentForm/AddEditCommentForm.tsx"
import { DeleteForm } from "./DeleteForm/DeleteForm.tsx"
import { DeleteAllCommentForm } from "./DeleteForm/DeleteAllCommentForm.tsx"
import { AdminComment } from "../../components/AdminComment/AdminComment.tsx"
import ReactPaginate from 'react-paginate'
import { useEffect, useState, useContext, useRef } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext.ts'
import { useAdminSingle } from './adminSinglePost.hook.ts'
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import { ICategory } from "../../utilita/modelCategory.ts"
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from "../../utilita/modelComment.ts"
import { IUser } from '../../utilita/modelUser.ts'
import { ICommentForm } from "../../utilita/modelCommentForm.ts"
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { SocketContext } from '../../context/SocketContext.tsx'
import { basicColor } from '../../utilita/defauit.ts'
import Skeleton from 'react-loading-skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminSinglePost.module.css'

export const AdminSinglePost: React.FC = () => {  
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [activePage, setActivePage] = useGlobalState('activePage')
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage')  
  const divRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const commentRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerSize, setHeaderSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  // forms AddEdit and Delete
  const [showAddEditPostForm, setShowAddEditPostForm] = useState<boolean>(false)
  const [showDeletePostForm, setShowDeletePostForm] = useState<boolean>(false)
  const [showAddEditCommentForm, setShowAddEditCommentForm] = useState<boolean>(false)
  const [showDeleteCommentForm, setShowDeleteCommentForm] = useState<boolean>(false)
  const [showDeleteAllCommentForm, setShowDeleteAllCommentForm] = useState<boolean>(false)
  const [selectedComment, setSelectedComment] = useState<IComment>({} as IComment)
  const [modePost, setModePost] = useState<'add'|'edit'>('add')
  const [modeComment, setModeComment] = useState<'add'|'edit'>('add') 

  // states for pagination
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItems, setCurrentItems] = useState<IComment[]>([])
  const itemPerPage = 3

  const { t, i18n } = useTranslation()
  const {userId} = useContext(AuthContext)
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const socket = useContext(SocketContext)
  const [favorite, setFavorite] = useState<number>(0)
  const [noFavorite, setNoFavorite] = useState<number>(0)
  const [like, setLike] = useState<number>(0)
  const [dislike, setDislike] = useState<number>(0)
    
  const { categoryId, selectedPost, setSelectedPost, comments, useGetPost, useLikePost, useLikeComment, useDislikeComment, useGetComments, useAddNewComment, useEditBlogPost, useDeletePost, useDeleteAllCommentPost, useDeleteComment, useGetCategoryForNavBar, useEditComment, useGetFieldTranslationPost, useGetFieldTranslationComment, extendedSelectedPost, extendedSelectedComment, error, clearError } = useAdminSingle(userId!)  

  const likePost = async (updatePost: IPost) => {      
    try {          
      useLikePost(updatePost)
      myToast(t('adminSinglePost.toast.changeLikePost'), basicColor.green)                    
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }
  }
  // пустая болванка чтобы был пропс на AddEditPostForm
  const addBlogPost = async (addBlogPost: FormData) => {}

  const editBlogPost = async (updateBlogPost: FormData) => {
    setShowAddEditPostForm(false)
    try {
      useEditBlogPost(updateBlogPost)
      myToast(t('adminSinglePost.toast.editPost'), basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }
  }

  const deletePost = async (item: ICategory|IPost|IComment|IUser) => {    
    try {
      const post = item as IPost
        if (post as IPost) {
        useDeletePost(post)
        myToast(t('adminSinglePost.toast.deletePost'), basicColor.green)
        navigate('/admin/posts')
      }               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }    
  }

  const likeComment = async (updateComment: IComment) => {      
      try {          
        useLikeComment(updateComment)
        // myToast(t('singlePostPage.toast.changeLike'), basicColor.green)                     
      } catch (err) {
        console.log(err)      
        myToast(error, basicColor.red)
        clearError()
      }
    } 
  
    const dislikeComment = async (updateComment: IComment) => {      
      try {          
        useDislikeComment(updateComment)
        // myToast(t('singlePostPage.toast.changeLike'), basicColor.green)                     
      } catch (err) {
        console.log(err)      
        myToast(error, basicColor.red)
        clearError()
      }
    }

  const addNewComment = async (newComment: ICommentForm) => {
    setShowAddEditCommentForm(false)  
    try {
      useAddNewComment(newComment)      
      myToast(t('adminSinglePost.toast.addComment'), basicColor.green)               
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }
  }

  const editComment = async (updateComment: ICommentForm, commentId: string, adminId: string) => {
    setShowAddEditPostForm(false)
    try {
      useEditComment(updateComment, commentId, adminId)
      myToast(t('adminSinglePost.toast.editComment'), basicColor.green)          
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)
      clearError()
    }
  }

  const deleteAllCommentPost = async (post: IPost, adminId: string) => {
    try {
      useDeleteAllCommentPost(post, adminId)
      myToast(t('adminSinglePost.toast.detetedAllComments'), basicColor.green)                 
    } catch (err) {
      console.log(err)
      myToast(error, basicColor.red)      
      clearError()
    }
  }

  const deleteComment = async (item: ICategory|IPost|IComment|IUser, adminId: string) => {   
    try {
      const comment = item as IComment
      if (comment as IComment) {
        useDeleteComment(comment, adminId)
        myToast(t('adminSinglePost.toast.deteteComment'), basicColor.green)
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

  const handleAddEditPostFormHide = () => {
    setShowAddEditPostForm(false)  
  } 

  const handleDeleteAllCommentFormHide = () => {
    setShowDeleteAllCommentForm(false)  
  }

  const handleAddEditCommentFormHide = () => {
    setShowAddEditCommentForm(false)
  }

  const handleAddEditCommentFormShow = () => {
    setShowAddEditCommentForm(true)
  }  

  const handleSelectComment = (selectedComment: IComment) => {
    setSelectedComment(selectedComment)
  }

  const handleEditPost = async () => {
    setSelectedPost(selectedPost)
    useGetFieldTranslationPost(selectedPost)
    setModePost('edit')
    setShowAddEditPostForm(true)
  } 

  const handleAddComment = () => {
    setModeComment('add')   
    setShowAddEditCommentForm(true)
  }

  const handleDeleteComment = () => {    
    handleDeleteCommentFormShow()
  }

  const handleDeleteAllComment = () => {
    setShowDeleteAllCommentForm(true)   
  }
  
  const handleDeletePost = () => {
    setSelectedPost(selectedPost)   
    setShowDeletePostForm(true)    
  }

  const handleDeletePostFormHide = () => {
    setShowDeletePostForm(false)
  } 

  const handleDeleteCommentFormHide = () => {
    setShowDeleteCommentForm(false)
  }
  
  const handleDeleteCommentFormShow = () => {
    setShowDeleteCommentForm(true)
  }

  const handleFavorite = async (selectedPost: IPost) => {   
    setFavorite(selectedPost.favorite++)   
    likePost(selectedPost)            
  }
  
  const handleNoFavorite = async (selectedPost: IPost) => {
    setNoFavorite(selectedPost.nofavorite++)
    likePost(selectedPost)            
  }

  const handleLikeComment = (selectedComment: IComment) => {
    setLike(selectedComment.like++)
    likeComment(selectedComment)
  }

  const handleDislikeComment = (selectedComment: IComment) => {
    setDislike(selectedComment.dislike++)
    dislikeComment(selectedComment)
  }
  // получить все комментарии поста
  const updateComments = async () => {
    useGetComments()
  }
  
  const listComments = () => {
    return (
      <div className={styles.commentsList}>
        <AnimatePresence>
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
                <AdminComment
                  // key={comment._id}
                  comment={comment}
                  setMode={setModeComment}
                  handleLikeComment={handleLikeComment}
                  handleDislikeComment={handleDislikeComment}                 
                  handleSelectComment={handleSelectComment}
                  useGetFieldTranslationComment={useGetFieldTranslationComment}
                  handleAddEditCommentFormShow={handleAddEditCommentFormShow}
                  handleDeleteComment={handleDeleteComment}             
                  updateComments={updateComments}                   
                />
              </div>}
            </motion.div> 
          )
        })}
        </AnimatePresence>
      </div>
    )
  }
  
  const handlePageClick = (data: { selected: number }) => {
    console.log('data.selected', data.selected);
    
    const newPage = (data.selected * itemPerPage) % comments.length
    console.log('newPage', newPage);
    
    setCurrentPage(newPage)
  }  

  useEffect(() => {   
    useGetPost()
    useGetCategoryForNavBar()
    useGetComments()     
  },[i18n.language]) 

  useEffect(() => {    
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
    socket.on('connect', () => { 
      console.log('Connection socket');
            
      socket.emit('joinRoom', { room: 'adminSinglePost', userId })

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
      socket.emit('leaveRoom', { room:'singlePost', userId })      
      socket.off()
      //socket.disconnect()     
    }
  }, [socket, message])

  // useEffect(() => {

  // }, [selectedComment])
  
  if (Object.keys(selectedPost).length === 0) return (
    <>      
      <h2 style={{textAlign: 'center'}}>{t('adminSinglePost.noPost')}</h2>
    </>
  ) 
 
  return (
    <>
    <div className={styles.singlePostPage}>
      <div>      
        {showAddEditPostForm && <AddEditPostForm 
          handleAddEditPostFormHide={handleAddEditPostFormHide}
          modePost={modePost}
          extendedSelectedPost={extendedSelectedPost}
          addBlogPost={addBlogPost}
          editBlogPost={editBlogPost}
          categoryId={categoryId}       
        />}
        {showDeletePostForm && <DeleteForm
          type={'post'} 
          handleDeleteFormHide={handleDeletePostFormHide}          
          selectedItem={selectedPost}
          onDelete={deletePost}                
        />}
         {showDeleteAllCommentForm && <DeleteAllCommentForm           
          handleDeleteAllCommentFormHide={handleDeleteAllCommentFormHide}          
          selectedPost={selectedPost}
          deleteAllCommentPost={deleteAllCommentPost}              
        />}
        {showAddEditCommentForm && <AddEditCommentForm 
          handleAddEditCommentFormHide={handleAddEditCommentFormHide}
          modeComment={modeComment}
          extendedSelectedComment={extendedSelectedComment}
          addNewComment={addNewComment}
          editComment={editComment}                       
        />}
        {showDeleteCommentForm && <DeleteForm          
          type={'comment'}
          handleDeleteFormHide={handleDeleteCommentFormHide}
          selectedItem={selectedComment}
          onDelete={deleteComment}                    
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
          <div className={styles.containerAction}>        
            <button className={styles.deleteButton} onClick={handleEditPost}>
              <EditIcon />
            </button>
            <button className={styles.deleteButton} onClick={handleDeletePost}>
              <DeleteIcon />
            </button>
            <div className={styles.deleteAllComment}>
              <button className={styles.deleteButton} onClick={handleDeleteAllComment}>
                <DeleteIcon />
                <p style={{fontSize: '10px'}}>{t('adminSinglePost.deleteAllComments')}</p>
              </button>
            </div>          
          </div>           
        </div>}
      </div>
      <div className={styles.comments}>
      {isLoading ? <Skeleton width={headerSize.width} height={headerSize.height} style={{marginBottom: '5px'}}/> :
        <div className={styles.headerComments} ref={headerRef}>
          <h3 className={styles.titleComents}>{t('adminSinglePost.header')}</h3>
          <button className={styles.addButton} onClick={handleAddComment}>                
            <AddIcon />        
          </button>
        </div>}
        {(comments.length === 0) ? <p style={{textAlign: 'center'}}>{t('adminSinglePost.noComments')}</p>: listComments() }
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