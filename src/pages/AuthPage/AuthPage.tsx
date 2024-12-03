import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress'
import PasswordPopover from '../../components/PasswordPopover/PasswordPopover.tsx'
import EmailPopover from '../../components/EmailPopover/EmailPopover.tsx'
import { useForm, SubmitHandler } from "react-hook-form"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ClearIcon from '@mui/icons-material/Clear'
import { basicColor, basicUrl } from '../../utilita/defauit.ts'
import './AuthPage.css'

interface Inputs {
  email: string,
  password: string
}

function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay)
  })
}

export const AuthPage: React.FC = () => {
    
  const [isLoading, setIsLoading] = useState(false)
  const [visibility, setVisibility] = useState(false)   
  const auth = useContext(AuthContext)

  const {
    register,
    handleSubmit,       
    clearErrors,       
    setError,
    getValues,
    setValue,
    reset,
    watch,
    formState,           
    formState: { errors, isSubmitting },   
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: ''
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
    // await later(3000)
    // alert("Thank you for Authorization")
    console.log('auth');
    reset()

    setIsLoading(true)
    await axios
      .post(`${basicUrl.urlAuth}/login`, 
        {
          email: authForm.email, 
          password: authForm.password          
        }
      )
      .then((response) => {
        auth.login(response.data.token, response.data.userId)
        console.log('User залогинен: ', response.data)
        myToast('User залогинен', basicColor.blue)              
        setIsLoading(false)        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`        
        myToast(err, basicColor.red)
        // setAuthForm({email: '', password: ''})       
        // console.log(JSON.stringify(error.response.data))
        console.log(error.response.data)
        console.log(error.response.status)
        // console.log(error.response.headers);
      }) 
  } 

  const onSubmitRegister: SubmitHandler<Inputs> = async (authForm: Inputs) => {
    // await later(3000)
    // alert("Thank you for Register")
    console.log('reg')    
    // reset()

    setIsLoading(true)    
    await axios
      .post(`${basicUrl.urlAuth}/register`, 
        {
          email: authForm.email, 
          password: authForm.password          
        }
      )
      .then((response) => {
        console.log('User добавлен: ', response.data)
        myToast('User добавлен', basicColor.green)                
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

  const myToast = (message: string, backgroundColor: string) => {
    toast(message , {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 2000,
    })
  } 

  // const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {    
  //   setAuthForm({...authForm, [event.target.name]: event.target.value})
  // }

  // const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i>
  // const pattern2 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]</>{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/</>
  const RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
    
  useEffect(()=> {},[formState])

  return (
    <div className='row'>
      <div className="col">
        <h1>Blog post</h1>
        <form
          className='addCategoryForm'         
        >          
          <div className='cardBlue'>
            <div className="cardContent white-text">
              <span className='cardTitle'>Авторизация</span>
              <div className='collectionInput'>                
                <div className='inputField'>
                  <label className='labelInput' htmlFor="email">Email</label>
                  <EmailPopover>
                    {(
                      props // validate, visible
                    ) => (
                      <div style={{display: 'flex'}}>
                        <input
                          {...register("email", { required: true, pattern: RegExp })}        
                          type='text' 
                          name='email' 
                          className={`yellowInput ${errors.email ? "emailInput" : ""}`}
                          placeholder='Введите email'        
                          autoFocus
                          onFocus={() => {                
                            if (!errors.hasOwnProperty("email") && 
                              (getValues('email'))) props.visible(false)
                            else props.visible(true)
                          }}
                          onBlur={() => props.visible(false)}
                          onChange={(event) => {
                            setValue('email', event.target.value)
                            watch('email')                            
                            props.validate("email", getValues, setError, clearErrors)
                          }}
                          // aria-invalid={errors.email ? "true" : "false"}             
                        />                    
                        <ClearIcon 
                          style={{borderBottom: '1px solid white'}}
                          onClick={() => {                            
                            handleClear()
                            props.validate("email", getValues, setError, clearErrors)
                          }}
                          className='emailClearIcon'
                        />                        
                      </div>
                    )}
                  </EmailPopover>
                  {/* {errors.email && errors.email.type == "required" && (
                    <p className="error"> Email Required </p>
                  )}
                  {errors.email && errors.email.type == "pattern" && (
                    <p className="error"> Invalid Email </p>
                  )} */}
                </div>
                <div className='inputField'>
                <label className='labelInput' htmlFor="password">Password</label>
                <PasswordPopover>
                  {(
                    props // validate, visible
                  ) => (
                    <div style={{display: 'flex'}}>
                      <input
                        {...register("password", { required: "Password Required" })}
                        name="password"                        
                        type={visibility ? "text" : "password"}
                        className='yellowInput openInput'
                        placeholder='Введите password'
                        autoComplete="new-password"                                   
                        onFocus={() => {                
                          if (!errors.hasOwnProperty("password") && 
                            (getValues('password'))) props.visible(false)
                          else props.visible(true)
                        }}
                        onBlur={() => props.visible(false)}
                        onChange={(event) => {                           
                          setValue('password', event.target.value)                 
                          props.validate("password", getValues, setError, clearErrors)
                        }}   
                      />
                      { visibility ? 
                      <VisibilityOffIcon 
                        style={{borderBottom: '1px solid white'}}
                        onClick={hendleVisibilityOff}
                        className='passwordVisibilityOffIcon'
                      /> :
                      <VisibilityIcon 
                        style={{borderBottom: '1px solid white'}}
                        onClick={hendleVisibility}
                        className='passwordVisibilityIcon'
                      />}
                    </div>
                  )}
                </PasswordPopover>       
                {errors.password && (
                  <p className="error"> {errors.password.message} </p>
                )}                               
                </div>
              </div>
            </div>
            <div className='cardAction'>              
              <input
                type="submit"
                name='enter'
                value='ВОЙТИ'              
                onClick={handleSubmit(onSubmitAuth)}
                className='btnYellow'
                style={{marginRight: 10}}
                disabled={isSubmitting || 
                  (errors.password?.message ? true : false) || 
                  (errors.email?.message ? true : false) ||
                  ((getValues('email') === '') ? true : false) ||
                  ((getValues('password') === '') ? true : false)}                
              />
              <input
                type="submit"
                name='registration' 
                value='РЕГИСТРАЦИЯ'
                className='btnGray' 
                onClick={handleSubmit(onSubmitRegister)}
                disabled={   
                  isSubmitting || 
                  (errors.password?.message ? true : false) || 
                  (errors.email?.message ? true : false) ||
                  ((getValues('email') === '') ? true : false) ||
                  ((getValues('password') === '') ? true : false)}                  
              />                                           
            </div>
          </div>
        </form>
        {isLoading && <CircularProgress className='authLoader' />}   
      </div>
      <Toaster />
    </div>
  )  
}