import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { useTranslation } from 'react-i18next'
import ClearIcon from '@mui/icons-material/Clear'
import { IUserForm } from '../../../utilita/modelUserForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Flatpickr from "react-flatpickr"
import 'flatpickr/dist/flatpickr.min.css'
import styles from './AddEditUserForm.module.css'

interface AddEditUserFormProps {
  handleAddEditUserFormHide: () => void,
  modeUser: 'add'|'edit'
  selectedUser: IUserForm,
  addUser: (user: FormData) => void,
  editUser: (user: FormData) => void,
  voteposts: string[], // id всех постов 
  votecomments: string[] // id всех комментов
}

export const AddEditUserForm: React.FC<AddEditUserFormProps> = ({
  handleAddEditUserFormHide,
  modeUser, 
  selectedUser,
  addUser, 
  editUser,
  voteposts,
  votecomments
}) => {
  const [dateCreatedAt, setDateCreatedAt] = useState<Date | null>(null)
  const [dateLastLogin, setDateLastLogin] = useState<Date | null>(null)
  const { t } = useTranslation()
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  const formSchema = z  
    .object({      
      email: z.string()      
        .email({message: t('zod.messageEmailUncorrect')}),
      role: z.string()
        .min(3, t('zod.messageTransNamePostShort'))
        .max(50, t('zod.messageTransNamePostLong')),           
      createdAt: z.date(),        
      lastLogin: z.union([z.date(), z.null()]),             
      verified: z.boolean(),
      block: z.boolean(),      
      votepost: z.array(z.string()),
      votecomment: z.array(z.string())      
  })
  
  type FormSchema = z.infer<typeof formSchema>

  let defaultValues: IUserForm = {} as IUserForm
  if (modeUser === 'edit') {
    defaultValues = { 
      email: selectedUser.email,
      role: selectedUser.role,         
      createdAt: selectedUser.createdAt,
      lastLogin: selectedUser.lastLogin,
      verified: selectedUser.verified,
      block: selectedUser.block,      
      votepost: selectedUser.votepost,
      votecomment: selectedUser.votecomment
    }
  } else if (modeUser === 'add') {
    defaultValues = {
      email: '',
      role: '',
      createdAt: new Date(Date.now()),//.toISOString().slice(0, 16),         
      lastLogin: null,      
      verified: false,
      block: false,
      votepost: [],
      votecomment: []
    }
  }

  const {
    register,
    handleSubmit,       
    // clearErrors,       
    // setError,
    watch,    
    getValues,
    setValue,       
    formState: { errors, isSubmitting, isValid },   
  } = useForm<FormSchema>({ 
    resolver: zodResolver(formSchema),    
    mode: 'onChange', 
    defaultValues: defaultValues
  })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => { savePost(data)}

  const createFormData = (editUserForm: FormSchema) => {      
    const formData = new FormData()    

    formData.append('id', selectedUser._id || '')
    formData.append('email', editUserForm.email)
    formData.append('role', editUserForm.role)        
    formData.append('block', editUserForm.block ? 'true' : 'false')
    formData.append('verified', editUserForm.verified ? 'true' : 'false')    
    formData.append('createdAt', editUserForm.createdAt.toISOString())
    // Проверка на "позже"
    if (editUserForm.lastLogin) {
      const newLastLogin = (editUserForm.createdAt.getTime() > editUserForm.lastLogin!.getTime()) ?
    'null' : editUserForm.lastLogin!.toISOString()
      formData.append('lastLogin', newLastLogin)
    } else {
      const newLastLogin = null
      formData.append('lastLogin', newLastLogin!)
    }    
    // formData.append('lastLogin', newLastLogin)
    formData.append('votepost', JSON.stringify(editUserForm.votepost))
    formData.append('votecomment', JSON.stringify(editUserForm.votecomment))
    formData.append('adminId', userId)     
    console.log('editUserForm.votepost=', editUserForm.votepost)
    console.log('formData=', formData)
    
    return formData 
  }  
  
  const savePost = (userForm: FormSchema) => {
    // event.preventDefault()
    const formData = createFormData(userForm)
    console.log('formData=', formData)
    if (modeUser === 'add') addUser(formData)  
    else if (modeUser === 'edit') editUser(formData)

    console.log('Сохранить юзера -- button ', formData)      
    handleAddEditUserFormHide()
  }
  
  const handleEnter = (
    event: React.KeyboardEvent<HTMLFormElement>, 
    userForm: FormSchema 
  ) => {        
    if (event.key === 'Enter') {
      event.preventDefault()

      const formData = createFormData(userForm)
      if (modeUser === 'add') addUser(formData)  
      else if (modeUser === 'edit') editUser(formData)
      
      handleAddEditUserFormHide()      
    }
  }

  // const handleChangePost = (item: string) => {
  //   setSelectedPosts(prev => 
  //     prev.includes(item) 
  //       ? prev.filter(i => i !== item) 
  //       : [...prev, item]
  //   )
  // }

  // const handleChangePost = (item: string) => {
  //   const currentSelected = getValues("votepost") || [];
  //   const newSelected = currentSelected.includes(item)
  //     ? currentSelected.filter(v => v !== item)
  //     : [...currentSelected, item];
    
  //   setValue("votepost", newSelected);    
  // }
  const selectedPosts = watch('votepost')
  const selectedComments = watch('votecomment')

  const handleChangePost = (vote: string) => {
    const currentSelectedPosts = [...selectedPosts];
    if (currentSelectedPosts.includes(vote)) {
      const index = currentSelectedPosts.indexOf(vote);
      if (index !== -1) currentSelectedPosts.splice(index, 1); // Удаляем при отмене выбора
    } else {
      currentSelectedPosts.push(vote); // Добавляем при выборе
    }
    setValue('votepost', currentSelectedPosts); // Обновляем значение в форме
  }
  
  const handleChangeComment = (vote: string) => {
    const currentSelectedComments = [...selectedComments];
    if (currentSelectedComments.includes(vote)) {
      const index = currentSelectedComments.indexOf(vote);
      if (index !== -1) currentSelectedComments.splice(index, 1); // Удаляем при отмене выбора
    } else {
      currentSelectedComments.push(vote); // Добавляем при выборе
    }
    setValue('votecomment', currentSelectedComments); // Обновляем значение в форме
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {      
      if (event.key === 'Escape') {
        handleAddEditUserFormHide()
      }
    }    
    window.addEventListener('keyup', handleEscape)       

    return () => {
      window.removeEventListener('keyup', handleEscape)     
    }
  }, [])

  useEffect(() => {
    if (modeUser === 'edit') {
      console.log('selectedUser', selectedUser)
      if (selectedUser.lastLogin === undefined) selectedUser.lastLogin = null      
      for (const [key, value] of Object.entries(selectedUser)) {
        if (key in selectedUser ) {
          if (selectedUser && (key === 'createdAt') || (key === 'lastLogin')) {
            if (key === 'createdAt') {             
              setDateCreatedAt(new Date(value))
              setValue(key as keyof FormSchema, new Date(value))
              console.log('createdAt', new Date(value))
            }
            if (key === 'lastLogin') {             
              setDateLastLogin(new Date(value))
              setValue(key as keyof FormSchema, new Date(value))
              console.log('lastLogin', new Date(value))
            }           
          } else setValue(key as keyof FormSchema, value)
          console.log(key, typeof value)            
        }
      }        
    } else setValue('lastLogin', null)    
  }, [selectedUser._id])

  // const arr = ['672a41528e006a0ea1eaea60', '672a43518e006a0ea1eaea61', '672a43518e006a0ea1eaea62']
  console.log('createdAt=', getValues('createdAt'))
  console.log('lastLogin=', getValues('lastLogin'))
  return (
    <>      
      <form        
        className={styles.editUserForm}
        onSubmit={handleSubmit(onSubmit)}        
        onKeyDown={(e) => { handleEnter(e, getValues()) }}
      >
        <button className={styles.deleteButton} onClick={() => handleAddEditUserFormHide()}>
          <ClearIcon />
        </button>
        <h2>{(modeUser === 'add') ? t('addEditUserForm.titleAdd') : t('addEditUserForm.titleEdit')}</h2>
        <div>
          <input
            {...register("email", { required: true })} 
            type='text' 
            name='email' 
            className={`${styles.inputEditUser} ${errors.email ? 'is-invalid' : ''}`}
            placeholder={t('addEditUserForm.placeholderEmail')}       
            autoFocus                         
          />         
          {errors.email?.type === "required" && (
            <p role="alert">{t('addEditUserForm.emailIsRequired')}</p>
          )}
        </div>
        <div>
          <input
            {...register("role", { required: true })} 
            type='text' 
            name='role' 
            className={`${styles.inputEditUser} ${errors.role ? 'is-invalid' : ''}`}
            placeholder={t('addEditUserForm.placeholderRole')}                   
          />         
          {errors.role?.type === "required" && (
            <p role="alert">{t('addEditUserForm.roleIsRequired')}</p>
          )}
        </div>
        <div className={styles.wrapperCheck}>
          <input
            {...register("verified", { required: true })}
            type='checkbox'
            name='verified'            
            className={styles.inputEditUser}                                     
          />
          <p>{t('addEditUserForm.placeholderVerified')}</p>         
        </div>
        <div className={styles.wrapperCheck}>          
          <input
            {...register("block", { required: true })}
            type='checkbox'
            name='block'            
            className={styles.inputEditUser}                                     
          />
          <p>{t('addEditUserForm.placeholderBlocked')}</p>         
        </div>       
        <div className={styles.dateTime}>
          <p>created at: </p>
          <Flatpickr
            {...register("createdAt", { required: true })}
            name='createdAt' 
            className={styles.inputDatetime}
            options={{              
              enableTime: true, // Включает выбор времени
              noCalendar: false, // Показывает календарь
              dateFormat: 'Y-m-dTH:i[Z]', // Формат ISO с временной меткой UTC
              // dateFormat: 'Y-m-d H:i', // Формат даты и времени
              time_24hr: true, // 24-часовой формат
              // utc: true, // Используем UTC-формат
            }}
            onChange={(date) => {
              // const formattedDate = date[0]?.toISOString() // Преобразуем дату в строку
              const formattedDate = date[0]
              setValue('createdAt', formattedDate) // Устанавливаем значение в форму              
            }}
            value={dateCreatedAt!}
            // value={date}
            // onChange={(selectedDates) => setDate(selectedDates)}
          />          
          {errors.createdAt?.type === "required" && (
            <p role="alert">{t('addEditUserForm.createdAtRequired')}</p>
          )}            
        </div>
        <div className={styles.dateTime}>
          <p>last login: </p>
          <Flatpickr
            {...register("lastLogin")}
            name='lastLogin' 
            className={styles.inputDatetime}
            options={{              
              enableTime: true, // Включает выбор времени
              noCalendar: false, // Показывает календарь
              // dateFormat: 'Y-m-d H:i', // Формат даты и времени
              dateFormat: 'Y-m-dTH:i[Z]', // Формат ISO с временной меткой UTC
              time_24hr: true, // 24-часовой формат
              // utc: true, // Используем UTC-формат
            }}
            onChange={(date) => {
              // const formattedDate = date[0]?.toISOString() // Преобразуем дату в строку
              const formattedDate = date[0]              
              setValue('lastLogin', formattedDate) // Устанавливаем значение в форму              
            }}
            value={dateLastLogin!}
          />  
          {/* <input
            {...register("lastLogin", { required: true })} 
            type="date" 
            name='lastLogin' 
            className={styles.inputEditUser}
            placeholder={t('addEditUserForm.placeholderLastLogin')}                    
          />               */}
          {errors.lastLogin?.type === "required" && (
            <p role="alert">{t('addEditUserForm.lastLoginRequired')}</p>
          )}
        </div>        
        <div>
          <p>{t('addEditUserForm.checkPosts')}</p>
          <div className={styles.wrapperPost}>
          {(voteposts.length > 0)  && voteposts.map((vote) => (
            <label key={vote} className={styles.listPost}>
              <input
                {...register("votepost")}
                type="checkbox"
                name={vote}                                
                className={styles.inputEditPost}
                checked={selectedPosts ? selectedPosts.includes(vote) : false}
                onChange={() => handleChangePost(vote)}
              />
              {vote}
            </label>
          ))}
          </div>
        </div>
        <div>
          <p>{t('addEditUserForm.checkComments')}</p>
          <div className={styles.wrapperComment}>
          {(votecomments.length > 0) && votecomments.map((vote) => (
            <label key={vote} className={styles.listComment}>
              <input
                {...register("votecomment")}
                type="checkbox"
                name={vote}                  
                className={styles.inputEditComment}
                checked={selectedComments ? selectedComments.includes(vote) : false}
                onChange={() => handleChangeComment(vote)}
              />
              {vote}
            </label>
          ))}
          </div>         
        </div>          
        <div>
          <input 
            type="submit" 
            value={(modeUser === 'add') ? t('addEditUserForm.addUser') : t('addEditUserForm.saveUser')}
            className={styles.buttonSubmit}           
            //disabled={!isValid || isSubmitting}
          />          
        </div>
      </form>
      <div 
        className={styles.overlay} 
        onClick={() => handleAddEditUserFormHide()}               
      ></div>
    </>
  )
}