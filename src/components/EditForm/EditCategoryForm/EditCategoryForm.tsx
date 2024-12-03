import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear'
import { ICategory } from '../../../utilita/modelCategory'
import styles from './EditCategoryForm.module.css'

interface EditCategoryFormProps {
  handleEditFormHide: () => void,
  selectedCategory: ICategory,
  editCategory: (category: ICategory) => void  
}

interface Inputs {
  name: string,
  description: string
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  handleEditFormHide, 
  selectedCategory, 
  editCategory
}) => {

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,       
    formState: { errors, isSubmitting, isValid },   
  } = useForm<Inputs>({ defaultValues: { 
    name: selectedCategory.name, 
    description: selectedCategory.description 
  }})

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => { changeCategory(data)}

  // const [categoryForm, setCategoryForm] = useState({
  //   name: selectedCategory.name,
  //   description: selectedCategory.description   
  // })

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {  
  //   setCategoryForm({...categoryForm, [event.target.name]: event.target.value})
  // } 
  
  const changeCategory = (categoryForm: Inputs) => {
    // event.preventDefault()
    const category = {
      _id: selectedCategory._id,
      name: categoryForm.name,
      description: categoryForm.description      
    }
    console.log('Сохранить кат ', category)
    editCategory(category)
    handleEditFormHide()
  }
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, categoryForm: ICategory) => {        
    if (event.key === 'Enter') {
      event.preventDefault()
      const categoryEnter = {
        _id: selectedCategory._id,     
        name: categoryForm.name,
        description: categoryForm.description        
      }      
      editCategory(categoryEnter)
      handleEditFormHide()      
    }
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {
        handleEditFormHide()
      }
    }    
    window.addEventListener('keyup', handleEscape)       

    return () => {
      window.removeEventListener('keyup', handleEscape)     
    }
  }, [])
  
  return (
    <>      
      <form        
        className={styles.editCategoryForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleEditFormHide()}>
          <ClearIcon />
        </button>
        <h2>Редактирование категории</h2>        
        <div>
          <input
            {...register("name", { required: true })} 
            type='text' 
            name='name' 
            className={`${styles.inputEditCategory} ${errors.name ? 'is-invalid' : ''}`}
            placeholder='Заголовок категории'        
            autoFocus
            aria-invalid={errors.name ? "true" : "false"}             
          />         
          {errors.name?.type === "required" && (
            <p role="alert">Title is required</p>
          )}
        </div>        
        <div>
          <textarea
            {...register("description", { required: true })}
            name='description' 
            placeholder='Описание категории'
            className={styles.textareaEditCategory}           
            rows={8}            
            aria-invalid={errors.description ? "true" : "false"}             
          />
          {errors.description?.type === "required" && (
            <p role="alert">Description is required</p>
          )}
        </div>        
        <div>          
          <input 
            type="submit" 
            value='Сохранить категорию'
            className={styles.buttonSubmit}           
            disabled={!isValid || isSubmitting}
           />        
        </div>
      </form>
      <div 
        className={styles.overlay} 
        onClick={() => handleEditFormHide()}               
      ></div>
    </>
  )
}