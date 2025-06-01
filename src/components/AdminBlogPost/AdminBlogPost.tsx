import { useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { IPost } from "../../utilita/modelPost"
import { Link } from 'react-router-dom'
import styles from './AdminBlogPost.module.css' 

interface IAdminBlogPostProps {
  post: IPost,
  setModePost: (mode: 'add'|'edit') => void,
  setFavorite: (num: number|((prev: number) => number)) => void,
  setNoFavorite: (num: number|((prev: number) => number)) => void,
  likePost: (selPost: IPost) => void,
  useGetFieldTranslation: (selPost: IPost) => void, 
  handleSelectPost: (post: IPost) => void,
  handleAddEditFormShow: () => void,
  handleDeleteFormShow: () => void
  categoryId: string  
}

export const AdminBlogPost: React.FC<IAdminBlogPostProps> = ({
    post,
    setModePost,
    setFavorite,
    setNoFavorite, 
    likePost,
    useGetFieldTranslation,    
    handleSelectPost,
    handleAddEditFormShow,
    handleDeleteFormShow,
    categoryId
  }) => {
  
  const handleFavorite = async () => {
    handleSelectPost(post)
    setFavorite(post.favorite++)  
    likePost({...post})        
  }
  
  const handleNoFavorite = async () => {
    handleSelectPost(post)
    setNoFavorite(post.nofavorite++)
    likePost({...post})        
  }

  const handleDelete = () => {
    handleSelectPost(post)
    handleDeleteFormShow()    
  }
  const handleEdit = async () => {
    handleSelectPost(post)
    useGetFieldTranslation(post)
    setModePost('edit')
    handleAddEditFormShow()
  }

  useEffect(() => {
    setFavorite(post.favorite)
    setNoFavorite(post.nofavorite)
  }, [])

  // const styleIcon = post.liked ? 'red' : 'black'
  return (
    <div className={styles.post}>
      <div>        
        <h4>{post.title}</h4>       
        <div className={styles.paragraphContainer}>
          <Link to={`/admin/post/${post._id}?categoryId=${categoryId}`} className={styles.aLink}>
           {/* <Route path="/admin/posts/:id" element={<AdminSinglePost />} />  */}
            <p className={styles.paragraph}>{post.description}</p>            
          </Link>
        </div>         
        <div className={styles.containerFavorite}>
          <div className={styles.favorite}>        
            <button className={styles.favoriteButton} onClick={handleFavorite}>        
              <FavoriteIcon style={{fill: 'red'}} />        
            </button>
            <span className={styles.number}>{post.favorite}</span>
          </div> 
          <div className={styles.unFavorite}>
            <button className={styles.favoriteButton} onClick={handleNoFavorite}>        
              <FavoriteIcon style={{fill: 'black'}} />        
            </button>
            <span className={styles.number}>{post.nofavorite}</span>
          </div>
        </div>       
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
  )
}