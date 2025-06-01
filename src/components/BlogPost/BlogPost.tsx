import { useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { IPost } from "../../utilita/modelPost"
import { Link } from 'react-router-dom'
import styles from './BlogPost.module.css'

interface IBlogPostProps {
  post: IPost,
  setFavorite: (num: number|((prev: number) => number)) => void,
  setNoFavorite: (num: number|((prev: number) => number)) => void,
  likePost: (selPost: IPost) => void, 
  handleSelectPost: (selPost: IPost) => void, 
  categoryId: string  
}

export const BlogPost: React.FC<IBlogPostProps> = ({
    post,
    setFavorite,
    setNoFavorite, 
    likePost,    
    handleSelectPost,    
    categoryId
  }) => { 

  const handleFavorite = async () => {
    handleSelectPost(post)     
    setFavorite(post.favorite++)
    // const favorite = post.favorite + 1
    console.log('handleFavorite---post', post)    
    likePost({...post})        
  }
  
  const handleNoFavorite = async () => {
    handleSelectPost(post)
    setNoFavorite(post.nofavorite++)
    likePost({...post})        
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
          <Link to={`/post/${post._id}?categoryId=${categoryId}`} className={styles.aLink}>
         
          {/* <Route path="/posts/:id" element={<PostPage dataGetSearch={dataGetSearch} />} /> */}
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
    </div>
  )
}