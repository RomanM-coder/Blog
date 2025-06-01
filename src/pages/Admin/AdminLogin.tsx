// AdminLogin.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../../useGlobalState'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { basicColor, basicUrl } from '../../utilita/defauit.ts'
import axios, {AxiosRequestConfig} from 'axios'
import styles from './AdminLogin.module.css'

interface userData {
  token: string,
  userId: string
}

export const AdminLogin: React.FC = () => {
  const [isAdmin, setIsAdmin] = useGlobalState('isAdmin')
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
    // headers['Accept-Language'] = `${i18n.language}` // надо ли?
      const dataUser: userData = JSON.parse(localStorage.getItem('userData')!)
      const config = {
        method: 'GET',
        url: `${basicUrl.urlAuth}/role/?userid=${dataUser.userId}`                    
        // headers
      } as AxiosRequestConfig 
      console.log('config=', config)         

    await axios(config)
      .then((response) => {
        if (response.data.role === 'admin') {
          localStorage.setItem('userData', JSON.stringify({
            userId: dataUser.userId, 
            role: response.data.role, 
            token: dataUser.token}))
          setIsAdmin(true)  
          console.log('Admin залогинен: ', response.data)          
          myToast(t('adminLogin.login'), basicColor.blue) 
          setIsLoading(false)
          navigate('/admin')
        } else {
          setIsLoading(false)
          navigate('/')
        }        
      })
      .catch((error) => {
        const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(error.response.data.message)}`        
        myToast(err, basicColor.red)
              
        setIsLoading(false)
        navigate('/') 
        console.log(error.response.data)
        console.log(error.response.status)              
      })    
    } catch (error) {
      console.error('Login error:', error);
    }
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

  return (
    <div className={styles.adminLoginPage}>
      <h2>Admin Login</h2>
      <button
        className={styles.buttonAdminLogin} 
        onClick={handleSubmit}        
      >Login Admin</button>
      {/* <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form> */}
      <Toaster />
    </div>
  )
}