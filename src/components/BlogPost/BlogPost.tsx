import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { IPost } from "../../utilita/modelPost"
import { Link } from 'react-router-dom'
import styles from './BlogPost.module.css' 

interface IBlogPostProps {
  post: IPost,
  likedPost: () => void, 
  handleSelectPost: () => void,
  handleEditFormShow: () => void,
  handleDeleteFormShow: () => void
  categoryId: string|number  
}

export const BlogPost: React.FC<IBlogPostProps> = ({
    post, 
    likedPost,    
    handleSelectPost,
    handleEditFormShow,
    handleDeleteFormShow,
    categoryId
  }) => { 

  const handleFavorite = () => {
    likedPost()        
  }  
  const handleDelete = () => {
    handleSelectPost()
    handleDeleteFormShow()    
  }
  const handleEdit = () => {
    handleSelectPost()
    handleEditFormShow()
  }

  const styleIcon = post.liked ? 'red' : 'black'  

  return (
    <div className={styles.post}>
      <div>        
        <h4>{post.title}</h4>
        <p>{post.description}</p>
        <button className={styles.favoriteButton} onClick={handleFavorite}>        
          <FavoriteIcon style={{fill: styleIcon}} />        
        </button>
        <button>         
          <Link to={`/detail/${post._id}?categoryId=${categoryId}`}>
            <MoreHorizIcon />
          </Link>       
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
  )
}