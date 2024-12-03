import { IPost } from '../../utilita/modelPost'
import styles from './DeleteForm.module.css'

interface DeleteFormProps {
  handleDeleteFormHide: () => void,
  selectedPost: IPost,
  deletePost: (post: IPost) => void 
}

export const DeletePostForm: React.FC<DeleteFormProps> = ({
  handleDeleteFormHide, 
  selectedPost,
  deletePost
}) => {

  const handleCancel = () => {
    handleDeleteFormHide()
  }

  const handleDelete = () => {
    deletePost(selectedPost)
    handleDeleteFormHide()
  }

  return (
    <>
      <div className={styles.modalContainer}>
        <div className="modal-content">
            
          <p className="confirmation-message">
            Do you really want to delete a post named {selectedPost.title}?
          </p>

          <div className="button-container">
            <button 
              id="deleteBtn" 
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Ok
            </button>
              
            <button 
              id="cancelBtn" 
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div 
        className={styles.overlay} 
        onClick={() => handleDeleteFormHide()}               
      >        
      </div>
  </>
  )
}