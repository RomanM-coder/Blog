import React, { useEffect } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { IPost } from '../../../utilita/modelPost'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import styles from './AddCommentForm.module.css'

interface AddCommentFormProps {
  handleAddFormHide: () => void,
  addNewComment: (comment: string) => void,
  post: IPost 
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({
  handleAddFormHide, 
  addNewComment, 
  post
}) => {
  const { t } = useTranslation()
  
  const formSchema = z  
    .object({      
      content: z.string().max(150, t('zod.messageNameCommentLong')) //messageNameCommentLong     
    })

  type FormSchema = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,       
    formState: { errors, isSubmitting, isDirty, isValid },   
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }})

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {createComment(data.content)}

  const createComment = (formContent: string) => {
    // event.preventDefault()       
    addNewComment(formContent)
    handleAddFormHide()
  }  
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, formContent: FormSchema ) => {          
    if (event.key === 'Enter') {
      event.preventDefault()     
      addNewComment(formContent.content)
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
        className={styles.addCommentForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddFormHide()}>
          <ClearIcon />
        </button>
        <h2>{t('addEditCommentForm.titleAdd')}</h2>        
        <div>
          <textarea
            {...register("content", { required: true })}
            name='content' 
            placeholder={t('addEditCommentForm.placeholderComment')}
            className={styles.textareaAddComment}           
            rows={10}
            autoFocus                        
          />
          {errors.content?.type === "required" && (
            <p role="alert">{t('addEditCommentForm.commentIsRequired')}</p>
          )}
        </div>
        <div>
          <input 
            type="submit" 
            value={t('addEditCommentForm.addComment')}
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