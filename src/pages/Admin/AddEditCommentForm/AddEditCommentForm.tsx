import React, { useEffect } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { IPost } from '../../../utilita/modelPost'
import { IComment } from '../../../utilita/modelComment'
import { ICommentForm } from '../../../utilita/modelCommentForm'
import styles from './AddEditCommentForm.module.css'

interface AddEditCommentFormProps {
  handleAddEditCommentFormHide: () => void,
  modeComment: 'add'|'edit',
  extendedSelectedComment: ICommentForm,
  addNewComment: (comment: ICommentForm) => void,
  editComment: (comment: ICommentForm, idComment: string, admin: string) => void   
}

export const AddEditCommentForm: React.FC<AddEditCommentFormProps> = ({
  handleAddEditCommentFormHide,
  modeComment,
  extendedSelectedComment, 
  addNewComment,
  editComment
}) => {
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const formSchema = z  
    .object({      
      content: z.string().max(100, t('zod.messageNameCommentLong')),
      content_ru: z.string().max(100, t('zod.messageTransNameCommentLong')),      
      like: z.number(),
      dislike: z.number()      
  })

  type FormSchema = z.infer<typeof formSchema>
  let defaultValues: ICommentForm = {} as ICommentForm
  if (modeComment === 'edit') {
    defaultValues = {
      // _id: extendedSelectedComment._id,
      content: extendedSelectedComment.content,
      content_ru: extendedSelectedComment.content_ru,
      like: extendedSelectedComment.like,
      dislike: extendedSelectedComment.dislike      
    }
  } if (modeComment === 'add') {
    defaultValues = {      
      content: '',
      content_ru: '',
      like: 0,
      dislike: 0
    }
  }

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,
    setValue,       
    formState: { errors, isSubmitting, isDirty, isValid },   
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema), defaultValues })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {saveComment(data)}

  const saveComment = (commentForm: FormSchema) => {
    // event.preventDefault()
    if (modeComment === 'add') {
      addNewComment(commentForm)
    } else if (modeComment = 'edit') {
      editComment(commentForm, extendedSelectedComment._id!, userId)
    }    
    handleAddEditCommentFormHide()
  }  
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, commentForm: FormSchema ) => {          
    if (event.key === 'Enter') {
      event.preventDefault()
      if (modeComment === 'add') {
        addNewComment(commentForm)
      } else if (modeComment = 'edit') {
        editComment(commentForm, extendedSelectedComment._id!, userId)
      }    
      handleAddEditCommentFormHide()       
    }
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {
        handleAddEditCommentFormHide()
      }
    }    
    window.addEventListener('keyup', handleEscape)      

    return () => {
      window.removeEventListener('keyup', handleEscape)    
    }
  }, [])

  useEffect(() => {
    if (modeComment === 'edit') {
      for (const [key, value] of Object.entries(extendedSelectedComment)) {
        if (key in extendedSelectedComment ) {           
          setValue(key as keyof FormSchema, value)  
        }
      }        
    }
  }, [extendedSelectedComment._id])

  return (    
    <>     
      <form       
        className={styles.addEditCommentForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddEditCommentFormHide()}>
          <ClearIcon />
        </button>
        <h2>{(modeComment === 'add') ? t('addEditCommentForm.titleAdd') : t('addEditCommentForm.titleEdit')}</h2>        
        <div>
          <textarea
            {...register("content", { required: true })}
            name='content'             
            placeholder={t('addEditCommentForm.placeholderComment')}
            className={styles.textareaAddComment}           
            rows={8}
            autoFocus        
          />
          {errors.content?.type === "required" && (
            <p role="alert">{t('addEditCommentForm.commentIsRequired')}</p>
          )}
        </div>
        <div>
          <textarea
            {...register("content_ru", { required: true })}
            name='content_ru'            
            placeholder={t('addEditCommentForm.placeholderCommentRu')}
            className={styles.textareaAddComment}           
            rows={8}              
          />
          {errors.content_ru?.type === "required" && (
            <p role="alert">{t('addEditCommentForm.commentTransIsRequired')}</p>
          )}
        </div>
        <div>
          <input
            {...register("like", { required: true })}
            name='like'
            type='number'
            min={0} 
            placeholder={t('addEditCommentForm.placeholderLike')}
            className={styles.numberAddComment}           
          />         
        </div>
        <div>
          <input
            {...register("dislike", { required: true })}
            name='dislike'
            type='number'
            min={0} 
            placeholder={t('addEditCommentForm.placeholderDislike')}
            className={styles.numberAddComment}
          />          
        </div>
        <div>
          <input 
            type="submit" 
            value={(modeComment === 'add') ? t('addEditCommentForm.addComment') : t('addEditCommentForm.saveComment')}
            className={styles.buttonSubmit}           
            // disabled={!isDirty || !isValid || isSubmitting}
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
        onClick={() => handleAddEditCommentFormHide()}               
      ></div>
    </>    
  )
}