import { ICategory } from '../../utilita/modelCategory'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from "react-router-dom"
import styles from './CategoryCard.module.css'

interface ICategoryCard {
  category: ICategory,
  handleSelectCategory: (category: ICategory) => void,
  handleEditFormShow: () => void,
  handleDeleteFormShow: ()=> void  
}

export const CategoryCard = ({
  category, 
  handleSelectCategory, 
  handleEditFormShow,
  handleDeleteFormShow  
}: ICategoryCard) => {

  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, category: ICategory) => {
    event.preventDefault()
    handleSelectCategory(category)
    navigate(`post/${category._id}/${category.name}`, { replace: true })    
  }

  const handleDelete = () => {   
    handleSelectCategory(category)
    handleDeleteFormShow()   
  }
  const handleEdit = () => {
    handleSelectCategory(category)    
    handleEditFormShow()
  }

  return (
    <>     
      <div className={styles.categoryItem} data-tooltip={`${category.description}`}>                    
        <button 
          onClick={(event) => handleClick(event, category)}
          className={styles.nameCategoryBtn}          
        >
          <h3 style={{fontSize: '22px'}}>{category.name}</h3>            
        </button>
        <div className={styles.containerAction}>                
          <button className={styles.deleteButton} onClick={handleEdit}>
            <EditIcon />
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>          
      </div>
          
    </>
  )
}