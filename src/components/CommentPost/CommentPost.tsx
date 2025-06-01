import React from 'react'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { IComment } from '../../utilita/modelComment'
import styles from './CommentPost.module.css'

interface ICommentPostProps {
  comment: IComment,  
  handleLikeDislikeComment: (comment: IComment) => void,   
  handleSelectComment: (comment: IComment) => void 
}

export const CommentPost: React.FC<ICommentPostProps> = ({
  comment, 
  handleLikeDislikeComment,  
  handleSelectComment
}) => {  

  const handleLike = async () => {
    const updateComment = {...comment}
    updateComment.like++
    handleSelectComment(updateComment)
    handleLikeDislikeComment(updateComment)            
  }
  
  const handleDislike = async () => {
    const updateComment = {...comment}
    comment.dislike++
    handleSelectComment(updateComment)
    handleLikeDislikeComment(updateComment)            
  }  

  return (
    <div className={styles.comment}>
      <div>        
        <p className={styles.titleComent}>{comment.content}</p>        
        <button className={styles.likedButton} onClick={handleLike}>
          <p className={styles.likeComment}>{comment.like}</p>        
          <ThumbUpOffAltIcon style={{fill: 'red'}} />        
        </button>
        <button className={styles.dislikedButton} onClick={handleDislike}>
          <p className={styles.likeComment}>{comment.dislike}</p>       
          <ThumbDownOffAltIcon style={{fill: 'black'}} />        
        </button>                
      </div>      
    </div>
  )
}