import React, { useEffect } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { IPost } from '../../../utilita/modelPost'
import { useForm, SubmitHandler } from "react-hook-form"
import styles from './AddPostForm.module.css'

interface AddPostFormProps {
  handleAddFormHide: () => void,
  addNewPost: (post: IPost) => void,
  categoryId: string|number 
}
 
interface Inputs {
  title: string,
  description: string
}

export const AddPostForm: React.FC<AddPostFormProps> = ({
  handleAddFormHide, 
  addNewPost, 
  categoryId
}) => {  
  // const later = (delay: number) => {
  //   return new Promise(function(resolve) { 
  //     setTimeout(resolve, delay)
  //   })
  // }
  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,       
    formState: { errors, isSubmitting, isDirty, isValid },   
  } = useForm<Inputs>({ mode: "onChange"})

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => { createPost(data)
    // console.log(data)    
    // await later(2000)
    // alert('thanks for regisrter')
    // reset()

    // return new Promise(function (resolve) { 
    //   setTimeout(resolve, 2000)
    // })
    // reset()
  }

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
  //   // console.log('----')       
  //   setPostForm({...postForm, [event.target.name]: event.target.value})   
  // }  
  
  const createPost = (postForm: Inputs) => {
    // event.preventDefault()
    const post = {     
      title: postForm.title,
      description: postForm.description,
      liked: false,
      categoryId: categoryId
    }    
    addNewPost(post)
    handleAddFormHide()
  }  
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, postForm: {title: string, description: string} ) => {          
    if (event.key === 'Enter') {
      event.preventDefault()
      const postEnter = {     
        title: postForm.title,
        description: postForm.description,
        liked: false,
        categoryId: categoryId
      }
      addNewPost(postEnter)
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
    // window.addEventListener('keydown', handleEnter)
   
    // const customEvent = new CustomEvent<Object>('keydown', {detail: {name: 'iuyiy'}})
    // window.dispatchEvent(customEvent)
    // customEvent.stopPropagation = false
    // customEvent.stopImmediatePropagation = false
    // customEvent.canceled = false
    // customEvent.isTrusted = false
    // customEvent.target = null     

    return () => {
      window.removeEventListener('keyup', handleEscape)
      // window.removeEventListener('keydown', handleEnter)
    }
  }, [])

  return (    
    <>     
      <form       
        className={styles.addPostForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddFormHide()}>
          <ClearIcon />
        </button>
        <h2>Добавление поста</h2>
        <div>
          <input
            {...register("title", { required: true })} 
            type='text' 
            name='title' 
            className={`${styles.inputAddPost} ${errors.title ? 'is-invalid' : ''}`}
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
            className={styles.textareaAddPost}           
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
            value='Добавить пост'
            className={styles.buttonSubmit}           
            disabled={!isDirty || !isValid || isSubmitting}
            />
             
          {/* <button 
            className='btnBlack' 
            type='submit'
            disabled={!isDirty || !isValid}
            // disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          > 
            Добавить пост 
          </button> */}
        </div>
      </form>
      <div 
        className={styles.overlay} 
        onClick={() => handleAddFormHide()}               
      ></div>
    </>    
  )
}