import React, {Dispatch, SetStateAction} from 'react'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IComment } from '../../utilita/modelComment'
import styles from './AdminComment.module.css'

interface IAdminCommentProps {
  comment: IComment,
  handleLikeComment: (comment: IComment) => void,
  handleDislikeComment: (comment: IComment) => void,  
  setMode: Dispatch<SetStateAction<"add" | "edit">>,
  handleSelectComment: (selectComment: IComment) => void,
  useGetFieldTranslationComment: (selectComment: IComment) => void
  handleAddEditCommentFormShow: () => void, 
  handleDeleteComment: () => void,  
  updateComments: () => void 
}

export const AdminComment: React.FC<IAdminCommentProps> = ({
  comment,
  handleLikeComment,
  handleDislikeComment,
  setMode,
  handleSelectComment,
  useGetFieldTranslationComment,
  handleAddEditCommentFormShow,
  handleDeleteComment, 
  updateComments
}) => {  
  
  const handleEdit = async (comment: IComment) => {
    setMode('edit')       
    handleSelectComment(comment)
    console.log('handleEdit=>comment', comment)
    useGetFieldTranslationComment(comment)
    handleAddEditCommentFormShow()
    // updateComments()        
  }

  const handleDelete = async (comment: IComment) => {
    handleSelectComment(comment)
    handleDeleteComment()
    // updateComments()        
  }

  const handleLike = async (comment: IComment) => {
    handleSelectComment(comment)
    handleLikeComment(comment)
    updateComments()        
  }
  
  const handleDislike = async (comment: IComment) => {
    handleSelectComment(comment)
    handleDislikeComment(comment)
    updateComments()        
  }  

  return (
    <div className={styles.comment}>
      <div>        
        <p className={styles.titleComent}>{comment.content}</p>        
        <button className={styles.likedButton} onClick={() => handleLike(comment)}>
          <p className={styles.likeComment}>{comment.like}</p>        
          <ThumbUpOffAltIcon style={{fill: 'red'}} />        
        </button>
        <button className={styles.dislikedButton} onClick={() => handleDislike(comment)}>
          <p className={styles.likeComment}>{comment.dislike}</p>       
          <ThumbDownOffAltIcon style={{fill: 'black'}} />        
        </button>                
      </div>
      <div className={styles.containerAction}>                
        <button className={styles.deleteButton} onClick={() => handleEdit(comment)}>
          <EditIcon />
        </button>
        <button className={styles.deleteButton} onClick={() => handleDelete(comment)}>
          <DeleteIcon />
        </button>
      </div>      
    </div>
  )
}