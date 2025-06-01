import { ICategory } from "../../../utilita/modelCategory"
import { IComment } from "../../../utilita/modelComment"
import { IPost } from "../../../utilita/modelPost"
import { IUser } from "../../../utilita/modelUser"
import { useTranslation } from 'react-i18next'
import styles from './DeleteForm.module.css'

interface DeleteFormProps {
  type: 'category' | 'post' | 'comment' | 'user' 
  selectedItem: ICategory | IPost | IComment | IUser
  onDelete: (selectedItem: ICategory | IPost | IComment | IUser, admId: string) => Promise<void>
  handleDeleteFormHide: () => void
}

export const DeleteForm: React.FC<DeleteFormProps> = ({
  type, 
  selectedItem,
  onDelete,
  handleDeleteFormHide
}) => {
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const handleCancel = () => {
    handleDeleteFormHide()
  }

  const handleDelete = () => {
    if (type === 'category') {
      const item = selectedItem as ICategory
      onDelete(item, userId)
    }
    if (type === 'post') {
      const item = selectedItem as IPost
      onDelete(item, userId)
    }
    if (type === 'comment') {
      const item = selectedItem as IComment
      onDelete(item, userId)
    }
    if (type === 'user') {
      const item = selectedItem as IUser
      onDelete(item, userId)
    }    
    handleDeleteFormHide()
  }

  const contentItem = (type: 'category' | 'post' | 'comment' | 'user') => {
    if (type === 'category') {
      const item = selectedItem as ICategory
      return item.name
    }
    if (type === 'post') {
      const item = selectedItem as IPost
      return item.title
    }
    if (type === 'comment') {
      const item = selectedItem as IComment
      return item.content
    }
    if (type === 'user') {
      const item = selectedItem as IUser
      return item.email
    }
  }

  const doYouReally = (type: 'category' | 'post' | 'comment' | 'user') => {
    if (type === 'category') return t('deleteForm.doYouReally', { type })
    if (type === 'post') return t('deleteForm.doYouReally', { type })
    if (type === 'comment') return t('deleteForm.doYouReally', { type })
    if (type === 'user') return t('deleteForm.doYouReally', { type })
  }

  return (
    <>
      <div className={styles.modalContainer}>
        <div className="modal-content">            
          <p className={styles.confirmationMessage}>
            <span style={{color: 'black'}}>{doYouReally(type)}</span> 
            <span style={{fontWeight: 'bold', color: 'black'}}>{contentItem(type)}</span>
            <span style={{color: 'black'}}>?</span> 
          </p>
          <div className="button-container">
            <button 
              id="deleteBtn" 
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              {t('deleteForm.Ok')}
            </button>              
            <button 
              id="cancelBtn" 
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              {t('deleteForm.Cancel')}
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