import React, { useEffect } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { ICategory } from '../../../utilita/modelCategory'
import { useForm, SubmitHandler } from "react-hook-form"
import styles from './AddCategoryForm.module.css'

interface AddCategoryFormProps {
  handleAddFormHide: () => void,
  addNewCategory: (category: ICategory) => void  
}

interface Inputs {
  name: string,
  description: string
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  handleAddFormHide, 
  addNewCategory
}) => {
  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,       
    formState: { errors, isSubmitting, isDirty, isValid },   
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => { createCategory(data)}
  // const [categoryForm, setCategoryForm] = useState({
  //   name: '',    
  //   description: ''   
  // })  

  // const handleChange = () => {     
  //   // setCategoryForm({event.target.name: event.target.value})
  //   setCategoryForm({...categoryForm, [event.target.name]: event.target.value})   
  // }  
  
  const createCategory = (values: Inputs) => {
    // event.preventDefault()
    const category = {     
      name: values.name,
      description: values.description      
    }
    console.log('new category ', category);
       
    addNewCategory(category)
    handleAddFormHide()
  }  
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, categoryForm: ICategory ) => {          
    if (event.key === 'Enter') {
      event.preventDefault()
      const categoryEnter = {     
        name: categoryForm.name,
        description: categoryForm.description       
      }
      addNewCategory(categoryEnter)
      handleAddFormHide()       
    }
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {
        handleAddFormHide()
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
        className={styles.addCategoryForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddFormHide()}>
          <ClearIcon />
        </button>
        <h2>Добавление категории</h2>
        <div>
          <input
            {...register("name", { required: true })} 
            type='text' 
            name='name' 
            className={`${styles.inputAddCategory} ${errors.name ? 'is-invalid' : ''}`}
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
            className={styles.textareaAddCategory}           
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
            value='Добавить категорию'
            className={styles.buttonSubmit}           
            disabled={!isDirty || !isValid || isSubmitting}
            />
        </div>
      </form>     
      <div 
        className={styles.overlay} 
        onClick={() => handleAddFormHide()}               
      ></div>
    </>    
  )
}