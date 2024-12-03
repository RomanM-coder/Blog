import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear'
import styles from './EditPostForm.module.css'
import { IPost } from '../../../utilita/modelPost'

interface EditPostFormProps {
  handleEditFormHide: () => void,
  selectedPost: IPost,
  editBlogPost: (post: IPost) => void,
  categoryId: string|number  
}

interface Inputs {
  title: string,
  description: string
}

export const EditPostForm: React.FC<EditPostFormProps> = ({
  handleEditFormHide, 
  selectedPost, 
  editBlogPost,
  categoryId 
}) => {

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,       
    formState: { errors, isSubmitting, isValid },   
  } = useForm<Inputs>({ defaultValues: { 
    title: selectedPost.title, 
    description: selectedPost.description 
  }})

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => { changePost(data)}

  // const [postForm, setPostForm] = useState({
  //   title: selectedPost.title,
  //   description: selectedPost.description
  // })

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {   
  //   setPostForm({...postForm, [event.target.name]: event.target.value})
  // } 
  
  const changePost = (postForm: Inputs) => {
    // event.preventDefault()
    const post = {
      _id: selectedPost._id,
      title: postForm.title,
      description: postForm.description,
      liked: selectedPost.liked,
      categoryId: categoryId
    }
    editBlogPost(post)
    handleEditFormHide()
  }
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, postForm: {title: string, description: string} ) => {        
    if (event.key === 'Enter') {
      event.preventDefault()
      const postEnter = {
        _id: selectedPost._id,     
        title: postForm.title,
        description: postForm.description,
        liked: selectedPost.liked,
        categoryId: categoryId
      }
      editBlogPost(postEnter)
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
        className={styles.editPostForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleEditFormHide()}>
          <ClearIcon />
        </button>
        <h2>Редактирование поста</h2>
        <div>
          <input
            {...register("title", { required: true })} 
            type='text' 
            name='title' 
            className={`${styles.inputEditPost} ${errors.title ? 'is-invalid' : ''}`}
            placeholder='Заголовок поста'        
            autoFocus
            aria-invalid={errors.title ? "true" : "false"}             
          />         
          {errors.title?.type === "required" && (
            <p role="alert">Title is required</p>
          )}
        </div>
        <div>
          <textarea
            {...register("description", { required: true })}
            name='description' 
            placeholder='Описание поста'
            className={styles.textareaEditPost}           
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
            value='Сохранить пост'
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