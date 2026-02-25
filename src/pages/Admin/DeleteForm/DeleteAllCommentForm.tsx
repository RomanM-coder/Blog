import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './DeleteForm.module.css'
import { IPostFull } from '../../../utilita/modelPostFull'

interface DeleteAllCommentFormProps {
  handleDeleteAllCommentFormHide: () => void
  selectedPost: IPostFull
  deleteAllCommentPost: (post: IPostFull, admin: string) => Promise<void>
}

export const DeleteAllCommentForm: React.FC<DeleteAllCommentFormProps> = ({
  handleDeleteAllCommentFormHide,
  selectedPost,
  deleteAllCommentPost,
}) => {
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const handleCancel = () => {
    handleDeleteAllCommentFormHide()
  }

  const handleDelete = async () => {
    await deleteAllCommentPost(selectedPost, userId)
    handleDeleteAllCommentFormHide()
  }

  return (
    <>
      <div className={styles.modalContainer}>
        <div className="modal-content">
          <p className={styles.confirmationMessage}>
            <span style={{ color: 'black' }}>
              {t('deleteForm.doYouReallyAllComm')}
            </span>
            <span style={{ fontWeight: 'bold', color: 'black' }}>
              {selectedPost.title}
            </span>
            <span style={{ color: 'black' }}> ?</span>
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
        onClick={() => handleDeleteAllCommentFormHide()}
      ></div>
    </>
  )
}
