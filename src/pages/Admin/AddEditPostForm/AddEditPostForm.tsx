import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { useTranslation } from 'react-i18next'
import ClearIcon from '@mui/icons-material/Clear'
import { IPostForm } from '../../../utilita/modelPostForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './AddEditPostForm.module.css'

interface AddEditPostFormProps {
  handleAddEditPostFormHide: () => void,
  modePost: 'add'|'edit'
  extendedSelectedPost: IPostForm,
  addBlogPost: (post: FormData) => void,
  editBlogPost: (post: FormData) => void,
  categoryId: string 
}

export const AddEditPostForm: React.FC<AddEditPostFormProps> = ({
  handleAddEditPostFormHide,
  modePost, 
  extendedSelectedPost,
  addBlogPost, 
  editBlogPost,
  categoryId 
}) => {
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const formSchema = z  
    .object({      
      title: z.string()            
        .min(3, t('zod.messageNamePostShort'))
        .max(30, t('zod.messageNamePostLong')),
      title_ru: z.string()
        .min(3, t('zod.messageTransNamePostShort'))
        .max(50, t('zod.messageTransNamePostLong')),           
      description: z.string()
        .min(3, t('zod.messageDescPostShort'))
        .max(100, t('zod.messageDescPostLong')),
      description_ru: z.string()
        .min(3, t('zod.messageTransDescPostShort'))
        .max(100, t('zod.messageTransDescPostLong')),
      favorite: z.number(),
      nofavorite: z.number(),      
  })
  
  type FormSchema = z.infer<typeof formSchema>

  let defaultValues: IPostForm = {} as IPostForm
  if (modePost === 'edit') {
    defaultValues = { 
      title: extendedSelectedPost.title,
      title_ru: extendedSelectedPost.title_ru,         
      description: extendedSelectedPost.description,
      description_ru: extendedSelectedPost.description_ru,
      favorite: extendedSelectedPost.favorite,
      nofavorite: extendedSelectedPost.nofavorite
    }
  } else if (modePost === 'add') {
    defaultValues = {
      title: '',
      title_ru: '',         
      description: '',
      description_ru: '',
      favorite: 0,
      nofavorite: 0
    }
  }

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    getValues,
    setValue,       
    formState: { errors, isSubmitting, isValid },   
  } = useForm<FormSchema>({ 
    resolver: zodResolver(formSchema),    
    mode: 'onChange', 
    defaultValues: defaultValues
  })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => { savePost(data)}

  const createFormData = (editPostForm: FormSchema) => {      
    const formData = new FormData()

    formData.append('id', extendedSelectedPost._id || '')
    formData.append('title', editPostForm.title)
    formData.append('title_ru', editPostForm.title_ru)    
    formData.append('description', editPostForm.description)
    formData.append('description_ru', editPostForm.description_ru)    
    formData.append('categoryId', categoryId)    
    formData.append('nameOld', extendedSelectedPost.title)
    formData.append('adminId', userId)    
    
    return formData 
  }  
  
  const savePost = (postForm: FormSchema) => {
    // event.preventDefault()
    const formData = createFormData(postForm)
    if (modePost === 'add') addBlogPost(formData)  
    else if (modePost === 'edit') editBlogPost(formData)

    console.log('Сохранить кат-ю -- button ', formData)      
    handleAddEditPostFormHide()
  }
  
  const handleEnter = (
    event: React.KeyboardEvent<HTMLFormElement>, 
    postForm: FormSchema 
  ) => {        
    if (event.key === 'Enter') {
      event.preventDefault()

      const formData = createFormData(postForm)
      if (modePost === 'add') addBlogPost(formData)  
      else if (modePost === 'edit') editBlogPost(formData)
      
      handleAddEditPostFormHide()      
    }
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {
        handleAddEditPostFormHide()
      }
    }    
    window.addEventListener('keyup', handleEscape)       

    return () => {
      window.removeEventListener('keyup', handleEscape)     
    }
  }, [])

  useEffect(() => {
    if (modePost === 'edit') {
      for (const [key, value] of Object.entries(extendedSelectedPost)) {
        if (key in extendedSelectedPost ) {           
          setValue(key as keyof FormSchema, value)  
        }
      }        
    }    
  }, [extendedSelectedPost._id])
  
  return (
    <>      
      <form        
        className={styles.editPostForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddEditPostFormHide()}>
          <ClearIcon />
        </button>
        <h2>{(modePost === 'add') ? t('addEditPostForm.titleAdd') : t('addEditPostForm.titleEdit')}</h2>
        <div>
          <input
            {...register("title", { required: true })} 
            type='text' 
            name='title' 
            className={`${styles.inputEditPost} ${errors.title ? 'is-invalid' : ''}`}
            placeholder={t('addEditPostForm.placeholderName')}       
            autoFocus                         
          />         
          {errors.title?.type === "required" && (
            <p role="alert">{t('addEditPostForm.titleIsRequired')}</p>
          )}
        </div>
        <div>
          <input
            {...register("title_ru", { required: true })} 
            type='text' 
            name='title_ru' 
            className={`${styles.inputEditPost} ${errors.title ? 'is-invalid' : ''}`}
            placeholder={t('addEditPostForm.placeholderNameRu')}                   
          />         
          {errors.title_ru?.type === "required" && (
            <p role="alert">{t('addEditPostForm.titleTransIsRequired')}</p>
          )}
        </div>
        <div>
          <textarea
            {...register("description", { required: true })}
            name='description' 
            placeholder={t('addEditPostForm.placeholderDescription')}
            className={styles.textareaEditPost}           
            rows={8}                         
          />
          {errors.description?.type === "required" && (
            <p role="alert">{t('addEditPostForm.descIsRequired')}</p>
          )}
        </div>
        <div>          
          <textarea
            {...register("description_ru", { required: true })}
            name='description_ru' 
            placeholder={t('addEditPostForm.placeholderDescriptionRu')}
            className={styles.textareaEditPost}           
            rows={8}                         
          />
          {errors.description_ru?.type === "required" && (
            <p role="alert">{t('addEditPostForm.descRuIsRequired')}</p>
          )}
        </div>
        <div>
          <input
            {...register("favorite", { required: true })} 
            type='number' 
            name='favorite' 
            className={styles.inputEditPost}
            placeholder={t('addEditPostForm.placeholderFavorite')}                    
          />              
          {errors.favorite?.type === "required" && (
            <p role="alert">{t('addEditPostForm.favoriteIsRequired')}</p>
          )}            
        </div>
        <div>
          <input
            {...register("nofavorite", { required: true })} 
            type='number' 
            name='nofavorite' 
            className={styles.inputEditPost}
            placeholder={t('addEditPostForm.placeholderNoFavorite')}                    
          />              
          {errors.nofavorite?.type === "required" && (
            <p role="alert">{t('addEditPostForm.nofavoriteIsRequired')}</p>
          )}
        </div>         
        <div>
          <input 
            type="submit" 
            value={(modePost === 'add') ? t('addEditPostForm.addPost') : t('addEditPostForm.savePost')}
            className={styles.buttonSubmit}           
            disabled={!isValid || isSubmitting}
          />          
        </div>
      </form>
      <div 
        className={styles.overlay} 
        onClick={() => handleAddEditPostFormHide()}               
      ></div>
    </>
  )
}