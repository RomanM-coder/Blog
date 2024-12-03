import { EditPostForm } from "../../components/EditForm/EditPostForm/EditPostForm.tsx"
import { DeletePostForm } from "../../components/DeleteForm/DeletePostForm.tsx" 
import { useEffect, useState } from 'react'
import { useSingle } from '../../hooks/single.hook.ts'
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CircularProgress from '@mui/material/CircularProgress'
import { IPost } from '../../utilita/modelPost.ts'
import toast, { Toaster } from 'react-hot-toast'
import { basicColor } from '../../utilita/defauit.ts'
import styles from '../SinglePostPage/SinglePostPage.module.css'

interface InputParameters {
  isLoading: boolean  
  watchForLoader: (state: boolean) => void
}

export const SinglePostPage: React.FC<InputParameters> = (props) => {
  
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)  
  const navigate = useNavigate()  
  const { categoryId, selectedPost, setSelectedPost, useGetPost, useLikePost, useEditBlogPost, useDeletePost, error, clearError } = useSingle(props.watchForLoader)  

  const likePost = (updatePost: IPost) => {      
    try {          
      useLikePost(updatePost)
      myToast('Лайк изменен', basicColor.green)                     
    } catch (err) {
      console.log(err)      
      myToast(error, basicColor.red)
      clearError()
    }
  }

  const deletePost = (post: IPost) => {
    if (window.confirm(`Удалить ${post.title} ?`)) {
      try {
        useDeletePost(post)
        myToast('Пост удален', basicColor.green)
        navigate('/')               
      } catch (err) {
        console.log(err)
        myToast(error, basicColor.red)      
        clearError()
      }
    }
  }

  const editBlogPost = (updateBlogPost: IPost) => {
    setShowEditForm(false)
    try {
      useEditBlogPost(updateBlogPost)
      myToast('Пост изменен', basicColor.green)               
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
      duration: 2000,
    })
  }

  const handleSelectPost = () => {
    setSelectedPost(selectedPost)
  }

  const handleEdit = () => {
    handleSelectPost()
    setShowEditForm(true)
  }

  const handleEditFormHide = () => {
    setShowEditForm(false)
  }

  const handleDeleteFormHide = () => {
    setShowDeleteForm(false)
  }

  const handleFavorite = () => {
    likePost(selectedPost)        
  }
  const handleDelete = () => {
    handleSelectPost()
    setShowDeleteForm(true)    
  }

  useEffect(() => {          
    useGetPost()
  },[])

  if (selectedPost.length === 0) return (
    <>      
      <h2 style={{textAlign: 'center'}}>Поста нет</h2>
    </>
  )

  const styleIcon = selectedPost.liked ? 'red' : 'black'  

  return (
    <>
      {showEditForm && <EditPostForm 
        handleEditFormHide={handleEditFormHide}
        selectedPost={selectedPost}
        editBlogPost={editBlogPost}
        categoryId={categoryId}
      />}
      {showDeleteForm && <DeletePostForm 
        handleDeleteFormHide={handleDeleteFormHide}
        selectedPost={selectedPost}
        deletePost={deletePost}       
      />}
      <div className={styles.post}>
        <div>        
          <h4>{selectedPost.title}</h4>
          <p>{selectedPost.description}</p>
          <button className={styles.favoriteButton} onClick={handleFavorite}>        
            <FavoriteIcon style={{fill: styleIcon}} />        
          </button>
        </div>
        <div className={styles.containerAction}>        
          <button className={styles.deleteButton} onClick={handleEdit}>
            <EditIcon />
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>
      {props.isLoading && <CircularProgress className={styles.postLoader} />}
      <Toaster />
    </>
  )
}