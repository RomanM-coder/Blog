import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { useGlobalState, getGlobalStateValue } from '../../../useGlobalState.ts'
import { ICategoryForm } from '../../../utilita/modelCategoryForm.ts'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { basicUrl } from '../../../utilita/defauit.ts'
import styles from './AddEditCategoryForm.module.css'

interface AddEditCategoryFormProps {
  handleAddEditFormHide: () => void,
  mode: 'add'|'edit'|undefined,  
  extendedSelectCategory: ICategoryForm,
  setExtendedSelectCategory: (initial: ICategoryForm) => void
  addCategory: (category: FormData) => void, 
  editCategory: (category: FormData) => void  
}

export const AddEditCategoryForm: React.FC<AddEditCategoryFormProps> = ({
  handleAddEditFormHide,
  mode, 
  extendedSelectCategory,
  setExtendedSelectCategory,
  addCategory, 
  editCategory 
}) => {
  // const [extendedSelectCategory, setExtendedSelectCategory] = useGlobalState('extendedSelectCategory')
  const [downloadBlob, setDownloadBlob] = useState<any>()
  const [isReady, setIsReady] = useState<boolean>(false) 
  const { t, ready } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string        
  
  // const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  // const ACCEPTED_IMAGE_TYPES = [
  //   "image/png",
  //   "image/jpeg",
  //   "image/jpg",
  //   "image/svg+xml",
  //   "image/gif",]

  const formSchema = z  
    .object({      
      name: z.string()            
        .min(3, t('zod.messageNameCatShort'))
        .max(30, t('zod.messageNameCatLong')),
      name_ru: z.string()
        .min(3, t('zod.messageTransNameCatShort'))
        .max(50, t('zod.messageTransNameCatLong')),     
      file: z.any(),     
      description: z.string()
        .min(3, t('zod.messageDescCatShort'))
        .max(100, t('zod.messageDescCatLong')),
      description_ru: z.string()
        .min(3, t('zod.messageTransDescCatShort'))
        .max(100, t('zod.messageTransDescCatLong'))      
  })

  type FormSchema = z.infer<typeof formSchema>

  let defaultValues: ICategoryForm = {} as ICategoryForm
  if (mode === 'edit') {
    defaultValues = { 
      name: extendedSelectCategory.name,
      name_ru: extendedSelectCategory.name_ru,    
      file: undefined, 
      description: extendedSelectCategory.description,
      description_ru: extendedSelectCategory.description_ru
    }
  } else if (mode === 'add') {
    defaultValues = {
      name: '',
      name_ru: '',    
      file: undefined, 
      description: '',
      description_ru: ''
    }
  }

  const {
    register,
    handleSubmit,
    watch,         
    // clearErrors,       
    // setError,
    getValues,
    setValue,       
    formState: { errors, isSubmitting, isValid, dirtyFields },   
  } = useForm<FormSchema>({ 
    resolver: zodResolver(formSchema),    
    mode: 'onChange', 
    defaultValues: defaultValues
  })

  const file = watch('file')
  console.log('file ' , file)
  let fileUrl = ''
  let fileName = ''
  if (mode === 'add') {   
    if (file) {
      const files = Array.from<File>(file || [])
      if (files.length>0) {
        fileUrl = URL.createObjectURL(files[0])
        fileName = files[0].name
      }      
    } 
  } else if (mode === 'edit') {
  
    if (dirtyFields.file) {
      const file = watch('file')    
      console.log('file ' , file)
      if (file) {
        const files = Array.from<File>(file || [])
        if (files.length>0) {
          fileUrl = URL.createObjectURL(files[0])
          fileName = files[0].name
        }      
      }      
    } else {
      if (downloadBlob) {
        const link: string|undefined = extendedSelectCategory.file   
        const blobToFile = (downloadBlob: Blob, link: string) => new File([downloadBlob], link, { 
          type: downloadBlob.type            
        })    
        const file = blobToFile(downloadBlob, link!)     
        fileUrl = URL.createObjectURL(file)
        fileName = file.name
      }    
    }  
  }

  const onSubmit: SubmitHandler<FormSchema> = async (data) => { saveCategory(data) }
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {  
  //   setCategoryForm({...categoryForm, [event.target.name]: event.target.value})
  // }  
  const saveCategory = (categoryForm: FormSchema) => {
    // event.preventDefault()     
    const formData = createFormData(categoryForm)
    if (mode === 'add') addCategory(formData)  
    else if (mode === 'edit')  editCategory(formData)

    console.log('Сохранить кат-ю -- button ', formData)    
    handleAddEditFormHide()
  }

  const createFormData = (editCategoryForm: FormSchema) => {      
    const formData = new FormData()    
    const arrFileList = editCategoryForm.file
    console.log('createFormData arrFileList=', arrFileList)
    
    if (arrFileList.length !== 0 ) {
      const files = Array.from<File>(editCategoryForm.file || [])      
      if (files.length>0) formData.append('file', files[0])      
    } else {
      const link: string|undefined = extendedSelectCategory.file
      console.log('link=', link)
         
      const blobToFile = (downloadBlob: Blob, link: string) => new File([downloadBlob], link, { 
        type: downloadBlob.type            
      })
      console.log('blobToFile=', blobToFile)
      const file = blobToFile(downloadBlob, link!)
      console.log('file=', file)  
      formData.append('file', file)      
    }

    formData.append('id', extendedSelectCategory._id || '')
    formData.append('name', editCategoryForm.name)
    formData.append('name_ru', editCategoryForm.name_ru)    
    formData.append('description', editCategoryForm.description)
    formData.append('description_ru', editCategoryForm.description_ru)    
    formData.append('nameOld', extendedSelectCategory.name)
    formData.append('adminId', userId)    
    
    return formData 
  }  
  
  const handleEnter = (event: React.KeyboardEvent<HTMLFormElement>, categoryForm: FormSchema) => {        
    if (event.key === 'Enter') {
      event.preventDefault()
      const formData = createFormData(categoryForm)
      
      if (mode === 'add') addCategory(formData)  
      else if (mode === 'edit')  editCategory(formData)
      console.log('Сохранить кат-ю -- enter ', formData)  
      handleAddEditFormHide()        
    }
  }
  
  const downloadFile = async (selectedCategoryId: string) => {   
    const path = `http://localhost:5000/api/file/download?id=${selectedCategoryId}`
    const response = await fetch( path, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200) {
      const blob = await response.blob()
      console.log('blob= ', blob);        
      setDownloadBlob(blob)        
    }
  }

  useEffect(() => {
    if (mode === 'edit') downloadFile(extendedSelectCategory._id!)
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {        
        setExtendedSelectCategory({} as ICategoryForm)
        handleAddEditFormHide()
      }
    }    
    window.addEventListener('keyup', handleEscape)       

    return () => {
      window.removeEventListener('keyup', handleEscape)     
    }
  }, [])
  
  useEffect(() => {
    if (ready) {
      setIsReady(true) // Устанавливаем флаг готовности переводов
    }
  }, [ready])

  useEffect(() => {
    if (mode === 'edit') {
      // setValue('name', extendedSelectCategory.name)
      // setValue('name_ru', extendedSelectCategory.name_ru)
      // setValue('description', extendedSelectCategory.description)
      // setValue('description_ru', extendedSelectCategory.description_ru)
      for (const [key, value] of Object.entries(extendedSelectCategory)) {
        if (key in extendedSelectCategory ) {
          if (key !== 'file') setValue(key as keyof FormSchema, value)  
        }
      }
    }
  }, [extendedSelectCategory.name])
  
  console.log('fileUrl= ', fileUrl)
  console.log('fileName= ', fileName)
  console.log('downloadBlob= ', downloadBlob)
  console.log('dirtyFirld= ', dirtyFields)
  console.log('getValues(name) ', getValues('name'))
  console.log('getValues(name_ru) ', getValues('name_ru'))
  console.log('getValues(description) ', getValues('description'))
  console.log('getValues(description_ru) ', getValues('description_ru'))
  console.log('getValues(file) ', getValues('file'))
  console.log('extendedSelectCategory=', extendedSelectCategory)

  return (
    <>      
      <form        
        className={styles.universCategoryForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button 
          className={styles.deleteButton} 
          onClick={() => {
            setExtendedSelectCategory({} as ICategoryForm)
            handleAddEditFormHide()}}>
            <ClearIcon />
        </button>        
        <h2>{(mode === 'add') ? t('addEditCatForm.titleAdd') : t('addEditCatForm.titleEdit')}</h2>        
        <div>
          <input
            {...register("name", { required: true })} 
            type='text' 
            name='name' 
            className={`${styles.inputCategory} ${errors.name ? 'is-invalid' : ''}`}
            placeholder={t('addEditCatForm.placeholderName')}        
            autoFocus                         
          />         
          {errors.name && (
            <span role='alert' className='error' style={{color: 'red'}}>
              {errors.name?.message}
            </span>
          )}
        </div>
        <div>
          <input
            {...register("name_ru", { required: true })} 
            type='text' 
            name='name_ru' 
            className={`${styles.inputCategory} ${errors.name ? 'is-invalid' : ''}`}
            placeholder={t('addEditCatForm.placeholderNameRu')}                                   
          />         
          {errors.name_ru && (
            <span role='alert' className='error' style={{color: 'red'}}>
              {errors.name_ru?.message}
            </span>
          )}
        </div>
        <div>
          <textarea
            {...register("description", { required: true })}
            name='description' 
            placeholder={t('addEditCatForm.placeholderDescription')}
            className={styles.textareaCategory}           
            rows={8}                         
          />
          {errors.description && (
            <span role='alert' className='error' style={{color: 'red'}}>
              {errors.description?.message}
            </span>
          )}
        </div>
        <div>
          <textarea
            {...register("description_ru", { required: true })}
            name='description_ru' 
            placeholder={t('addEditCatForm.placeholderDescriptionRu')}
            className={styles.textareaCategory}           
            rows={8}                         
          />
          {errors.description_ru && (
            <span role='alert' className='error' style={{color: 'red'}}>
              {errors.description_ru?.message}
            </span>
          )}
        </div>        
        <div id={styles.fileUpload}>          
          <input
          {...register("file", { required: true })}
            type="file"
            name='file'
            placeholder={t('addEditCatForm.placeholderChangeFile')}
            id={styles.fileAddCategory}
            className={styles.fileCategory}
            accept="image/*"                         
          />
          <div className={styles.containerImage}>            
            <div className={styles.imageLabel}>{t('addEditCatForm.fileName') + fileName}</div>
            {(mode === 'add' ) ? <div           
              id='image1'
              className={styles.imgPng}             
              style={{backgroundImage: `url(${fileUrl})`}}              
            /> : 
            <div           
              id='image1'              
              style={{backgroundImage: `url(${basicUrl.urlDownload}?id=${extendedSelectCategory._id})`, backgroundPosition: 'center', backgroundSize: 'cover', width: '25px', height: '25px'}}
              className={styles.imgPng}
            />}
          </div>     
        </div>                
        <div>          
          <input 
            type="submit" 
            value={(mode === 'add') ? t('addEditCatForm.addCategory') 
              : t('addEditCatForm.saveCategory')}
            className={styles.buttonSubmit}           
            disabled={!isValid || isSubmitting ||
              (getValues('name') === '') || 
              (getValues('name_ru') === '') ||
              (fileUrl === '') || 
              (getValues('description') === '') ||
              (getValues('description_ru') === '') ||
              !Object.keys(dirtyFields).length}
           />        
        </div>
      </form>
      <div 
        className={styles.overlay} 
        onClick={() => handleAddEditFormHide()}               
      ></div>
    </>
  )
}