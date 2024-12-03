import { ICategory } from "../../utilita/modelCategory"
import styles from './DeleteForm.module.css'

interface DeleteFormProps {
  handleDeleteFormHide: () => void,
  selectedCategory: ICategory,
  deleteCategory: (category: ICategory) => void 
}

export const DeleteCategoryForm: React.FC<DeleteFormProps> = ({
  handleDeleteFormHide, 
  selectedCategory,
  deleteCategory
}) => {

  const handleCancel = () => {
    handleDeleteFormHide()
  }

  const handleDelete = () => {
    deleteCategory(selectedCategory)
    handleDeleteFormHide()
  }

  return (
    <>
      <div className={styles.modalContainer}>
        <div className="modal-content">
            
          <p className="confirmation-message">
            Do you really want to delete a category named {selectedCategory.name}?
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