import React, { useState, useContext, useEffect, useRef, useCallback, MutableRefObject } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalState } from '../../useGlobalState.ts'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm, SubmitHandler, ValidationRule } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { useTranslation } from 'react-i18next'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ClearIcon from '@mui/icons-material/Clear'
import { basicColor, basicUrl } from '../../utilita/defauit.ts'
import styles from './AuthPage.module.css'
import {motion, AnimatePresence} from 'framer-motion'

interface Inputs {
  email: string,
  password: string,
  file: File|undefined
}

const headers = {    
  'Content-Type': 'multipart/form-data',
  'Access-Control-Allow-Origin': '*'       
} as RawAxiosRequestHeaders

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading') 
  const [verify, setVerify] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [fileName, setFileName] = useState('')
   
  const [visibility, setVisibility] = useState(false)   
  const auth = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  const { verifi, id, token, email } = useParams()
  const navigate = useNavigate()
  const [ isOpenButton, setIsOpenButton] = useState(false)
  
  const MotionClearIcon = motion(ClearIcon)

  const inputRef = useRef<HTMLInputElement>(null)
  // const [isVisible, setIsVisible] = useState(true)

  // Проверяем, соответствует ли ввод текущему языку 
  const checkingKeyboardEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataInput = event.target.value
            
    if (dataInput !== '') {   
      if (i18n.language === 'en' && !/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {      
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)
      } else if (i18n.language === 'ru' && !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)) {      
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)           
      }
      const filteredValue = dataInput.replace(/[^a-zA-Z0-9._%+-@]/g, '')
      setValue('email', filteredValue, { shouldValidate: true, shouldDirty: true })
      console.log('getValues(email)', dataInput)
      console.log('getValues(filteredValue)', filteredValue)
      // trigger('email')   
    }
           
  }
  const checkingKeyboardPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataInput = event.target.value
    
    if (dataInput !== '') {
      if (i18n.language === 'en' && !/^[a-zA-Z0-9._%+-@]+$/.test(dataInput)) {      
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)  
      } else if (i18n.language === 'ru' && !/[а-яёА-ЯЁ0-9._%+-@]+$/.test(dataInput)) {      
        myToast(t('navBar.toast.keyboardLayout'), basicColor.red)           
      }
      const filteredValue = dataInput.replace(/[^a-zA-Z0-9._%+-@]/g, '')
      setValue('password', filteredValue, { shouldValidate: true, shouldDirty: true })
      console.log('getValues(password)', dataInput)
      // trigger('password') 
    }       
  }
  
  const formSchema = z  
    .object({      
      email: z.string()      
      .email({message: t('zod.messageEmailUncorrect')}),  // 'Некорректный email' 
      password: z.string()
        .min(8, t('zod.messageShort'))
        .max(20, t('zod.messageLong'))
        .refine((value) => /[a-z]/.test(value), {
          message: t('zod.messageLowercase') 
        })        
        .refine((value) => /[A-Z]/.test(value), {
          message: t('zod.messageUppercase')
        })
        .refine((value) => /[^0-9a-zA-Z\s]/.test(value), {
          message: t('zod.messageSymbols')
        })
        .refine((value) => /[0-9]/.test(value), {
          message: t('zod.messageNumber')
        }),
      file: z.instanceof(FileList).transform((fileList) => fileList[0])  
  })
  
  const {
    register,
    handleSubmit,       
    clearErrors,       
    setError,
    setFocus,
    getValues,
    setValue,
    reset,
    watch,
    trigger,
    formState,           
    formState: { errors, isSubmitting, dirtyFields },   
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      file: undefined
    }})    
  
  const handleClear = () => {
    setValue('email', '')
    watch('email')    
  }

  const hendleVisibilityOff = () => {
    setVisibility(false)
  }

  const hendleVisibility = () => {
    setVisibility(true)
  }

  const onSubmitAuth: SubmitHandler<Inputs> = async (authForm: Inputs) => {
        
    console.log('auth');
    reset()
    setIsLoading(true)
    headers['Accept-Language'] = `${i18n.language}` // надо ли?
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/login`,
      data: {
        email: authForm.email, 
        password: authForm.password                   
      },             
      headers
    } as AxiosRequestConfig    

    await axios(config)
      .then((response) => {
        auth.login(response.data.token, response.data.userId)
        console.log('User залогинен: ', response.data)
        myToast(t('userLogin'), basicColor.blue)
        setIsLoading(false)        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`        
        myToast(err, basicColor.red)
        setValue('email', '')
        setValue('password', '')       
        setIsLoading(false) 
        console.log(error.response.data)
        console.log(error.response.status)              
      }) 
  } 

  const onSubmitRegister: SubmitHandler<Inputs> = async (authForm: Inputs) => {    
    
    await userRegister(authForm)    
    await userUploadFile(authForm)
    console.log('reg')    
    // reset()    
  }

  const userRegister = async (authForm: Inputs) => {
    
    const formData = new FormData() 
    formData.append('file', authForm.file!)
    formData.append('email', authForm.email)
    formData.append('password', authForm.password)
    console.log('formData=', formData)
    headers['Accept-Language'] = `${i18n.language}`   // надо ли? 
    
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/register`,
      data: formData,             
      headers
    } as AxiosRequestConfig
    console.log('config: ', config)
    
    setIsLoading(true)      
    await axios(config)      
      .then((response) => {
        console.log('User добавлен: ', response.data)
        myToast(t('userAdd'), basicColor.green)
        setIsLoading(false)
      })
      .catch((error) => {       
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`        
        myToast(err, basicColor.red)       
        // setAuthForm({email: '', password: ''})       
        console.log(error.response.data)
        console.log(error.response.status)
      })    
  }

  const userUploadFile = async (authForm: Inputs) => {
    const formData = new FormData() 
    formData.append('file', authForm.file!)
    formData.append('email', authForm.email)
    formData.append('password', authForm.password)
    headers['Accept-Language'] = `${i18n.language}`    // надо ли?
    
    const config = {
      method: 'POST',
      url: `${basicUrl.urlFile}/upload`,
      data: formData,             
      headers
    } as AxiosRequestConfig
    
    setIsLoading(true)      
    await axios(config)      
      .then((response) => {
        console.log('File user добавлен: ', response.data)
        myToast(t('fileAdd'), basicColor.green)
        setIsLoading(false)
      })
      .catch((error) => {       
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`        
        myToast(err, basicColor.red)       
        // setAuthForm({email: '', password: ''})       
        console.log('Ошибка body ', error.response.data)
        console.log('Ошибка status ', error.response.status)
      })    
  }

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 2000,
    })
  }
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])   
    if (files[0]) {
      console.log(files[0]);
      
      const url: string = URL.createObjectURL(files[0])
      setFileUrl(url)
      setFileName(files[0].name)
    }        
  }
  
  const getVerify = async (email: string) => {    
    setIsLoading(true)
    headers['Accept-Language'] = `${i18n.language}`
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/verify`,
      data: { email: email },                   
      headers
    } as AxiosRequestConfig    

    await axios(config)
      .then((response) => {
        setVerify(response.data)
        console.log('Get field verify: ', response.data)        
        setIsLoading(false)        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`      
        console.log('Error: ', err)              
        setIsLoading(false) 
        console.log(error.response.data)
        console.log(error.response.status)              
      })
  }

  // посылает письмо
  const handleVerify = async (event: React.MouseEvent<HTMLButtonElement>, email: string) => {
    event.preventDefault()
    console.log('-------handleVerify----------')
    setIsLoading(true)
    headers['Accept-Language'] = `${i18n.language}`
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/verifyemail`,
      data: { email: email },                   
      headers
    } as AxiosRequestConfig    
    console.log('handleVerify config ', config)
    
    await axios(config)
      .then((response) => {        
        console.log('Письмо: ', response.data)        
        setIsLoading(false)        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`      
        console.log('Error: ', err)              
        setIsLoading(false) 
        console.log(error.response.data)
        console.log(error.response.status)              
      })
  }

  const verifyByToken = async () => {   
    console.log('-------verifyByToken----------')
    setIsLoading(true)
    headers['Accept-Language'] = `${i18n.language}`
    const config = {
      method: 'GET',
      url: `${basicUrl.urlAuth}/verify/${email}/${id}/${token}`,                        
      headers
    } as AxiosRequestConfig    
    console.log('verifyByToken config ', config)
    
    await axios(config)
      .then((response) => {        
        console.log('verifyByToken ok', response.data)        
        setIsLoading(false)        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`      
        console.log('Error: ', err)              
        setIsLoading(false) 
        console.log(error.response.data)
        console.log(error.response.status)
        navigate('/auth/invalidpage')
      })
  }
  // const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {    
  //   setAuthForm({...authForm, [event.target.name]: event.target.value})
  // }

  // const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i>
  // const pattern2 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]</>{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/</>
  const RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
    
  useEffect (()=> {},[formState]) 
  useEffect (()=> {
    if (getValues('email')) getVerify(getValues('email'))
    if (verifi === 'verify') {
      verifyByToken()
      setValue('email', email!)
    }  
  }, [])
  
  useEffect (()=> {
    setValue('email', '') 
    setValue('password', '')
    clearErrors()
  }, [i18n.language]) 

  useEffect (()=> {
   console.log('useEffect-isOpenButton')   
  }, [isOpenButton])

  const setRefs = useCallback(
    (element: HTMLInputElement | null) => {
      // Для react-hook-form
      const { ref } = register('email')
      ref(element)
      
      // Для input ref
      if (inputRef) {
        (inputRef as MutableRefObject<HTMLInputElement | null>).current = element
      }
    }, [register]
  )
  // или это
  // useEffect(() => {    
  //   const timeout = setTimeout(() => {      
  //     // После отображения формы устанавливаем фокус на email input
  //     if (inputRef.current) {
  //       inputRef.current.focus()
  //       // inputRef.current.dispatchEvent(new Event("input", { bubbles: true }))
  //       // setFocus("email")
  //     }      
  //   }, 200)  

  //   return () => clearTimeout(timeout)
  // }, [])

    // или requestAnimationFrame для синхронизации с браузером
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (inputRef.current) inputRef.current.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={styles.row}>      
      <div className={styles.col}>
        <h1>{t('auth.form.title')}</h1>                  
        {verifi ? <p>user`s email confirmed</p> : <p>user`s email not confirmed</p>}        
        <motion.form         
          className='authForm'          
          initial={{opacity: 0, x: '-100px'}}
          animate={{opacity: 1, x: '0px'}}         
          transition={{duration: 0.3}}          
        >          
          <div className={styles.cardBlue}>
            <div className="cardContent white-text">             
              <div className={styles.collectionInput}>                
                <div className={styles.inputField}>
                  <label 
                    className={styles.labelInput} 
                    htmlFor="email"
                  >
                    {t('auth.form.fieldEmail')}
                  </label>                  
                    <div style={{display: 'flex'}}>
                      <input
                        {...register("email", { required: true, pattern: RegExp })}  
                        ref={setRefs} 
                        id='userEmail'        
                        type='text' 
                        name='email'
                        onChange={checkingKeyboardEmail}                         
                        className={styles.yellowInput}
                        placeholder={t('auth.form.placeholderEmail')}
                        autoComplete="email"                       
                      />
                      {!verify && <button 
                        onClick={(event) => handleVerify(event, getValues('email'))}
                        className={styles.emailVefify}
                      >verify</button>}
                      <AnimatePresence>                   
                      {getValues('email')&&<MotionClearIcon 
                        // style={{borderBottom: '1px solid white'}}
                        onClick={handleClear}
                        className={styles.emailClearIcon}
                        initial={{ opacity: 0, rotate: 0, x: -30 }}
                        animate={{ opacity: 1, rotate: 90, x: 0 }}
                        exit={{ opacity: 0, rotate: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                      />}
                      </AnimatePresence>                        
                    </div>
                  {errors.email && 
                    <span role='alert' className='error' style={{color: 'red'}}>
                      {errors.email?.message}
                    </span>
                  }                 
                </div>
                <div className={styles.inputField}>
                  <label 
                    className={styles.labelInput} 
                    htmlFor="password"
                  >
                    {t('auth.form.fieldPassword')}
                  </label>                
                  <div style={{display: 'flex'}}>
                    <input
                      {...register("password", { required: "Password Required" })}
                      name="password"
                      id='inputPassword'
                      onChange={checkingKeyboardPassword} 
                      type={visibility ? "text" : "password"}                      
                      className={styles.yellowInput}// openInput'
                      placeholder={t('auth.form.placeholderPassword')}
                      autoComplete="password"                         
                    />
                    { visibility ? 
                    <VisibilityOffIcon 
                      style={{borderBottom: '1px solid white'}}
                      onClick={hendleVisibilityOff}
                      className={styles.passwordVisibilityOffIcon}
                    /> :
                    <VisibilityIcon 
                      style={{borderBottom: '1px solid white'}}
                      onClick={hendleVisibility}
                      className={styles.passwordVisibilityIcon}
                    />}
                  </div>
                {errors.password && 
                  <span role='alert' className='error' style={{color: 'red'}}>
                    {errors.password?.message}
                  </span>
                }                
                </div>
                <div className={styles.inputField}>
                  <label className={styles.labelInput}>{t('auth.form.fieldFile')}</label>
                  <div className={styles.fileUpload}>
                    <label 
                      htmlFor="file"
                      className={styles.labelFile}
                    >
                      {t('auth.form.placeholderFile')}
                    </label>
                    <div className={styles.fileName}>{fileName}</div>
                    <input
                      {...register("file", { required: true, onChange: e => {} })}
                      type="file"
                      name='file'
                      title=''
                      // id={styles.fileAddCategory}
                      className={styles.fileAddAuth}
                      accept="image/*"
                      onChange={handleImageUpload}
                        // const files = Array.from(event.target.files || [])
                        // const file = event.target.files 
                    />                    
                    <div           
                      id='image1'
                      className={styles.imgPng}             
                      style={{
                        backgroundImage: `url(${fileUrl})`, 
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}                      
                    />          
                  </div>
                </div> 
              </div>
            </div>
            <div className={styles.cardAction}>              
              <input
                type="submit"
                name='enter'
                value={t('auth.form.enter')}              
                onClick={handleSubmit(onSubmitAuth)}
                className={styles.btnYellow}
                style={{marginRight: 10}}
                disabled={((!dirtyFields.email) && 
                  !(verifi === 'verify') || 
                  (!dirtyFields.password)) ||
                  (getValues('email') === '') || 
                  (getValues('password') === '') ||
                  isSubmitting ||
                  // !Object.keys(dirtyFields).length
                  (errors.password?.message ? true : false) || 
                  (errors.email?.message ? true : false)
                }                
              />
              <input
                type="submit"
                name='registration' 
                value={t('auth.form.registr')}
                className={styles.btnGray} 
                onClick={handleSubmit(onSubmitRegister)}
                disabled={((!dirtyFields.email) && !(verifi === 'verify') || 
                  (!dirtyFields.password)) ||
                  (getValues('email') === '') || (getValues('password') === '') || 
                  isSubmitting ||
                  // !Object.keys(dirtyFields).length
                  (errors.password?.message ? true : false) || 
                  (errors.email?.message ? true : false)
                }                  
              />                                                         
            </div>
          </div>
        </motion.form>
        {isLoading && <CircularProgress className={styles.authLoader} />}   
      </div>      
      <Toaster />
    </div>
  )  
}