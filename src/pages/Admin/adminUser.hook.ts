import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext'
import { ICategory } from "../../utilita/modelCategory"
import { IUser } from "../../utilita/modelUser"
import { IPost } from '../../utilita/modelPost.ts'
import { IComment } from "../../utilita/modelComment.ts"
import { ICategoryForm } from "../../utilita/modelCategoryForm.ts"
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import axiosIC, { setHeaders } from '../../utilita/axiosIC.ts'
import { basicUrl } from "../../utilita/defauit"
import { useTranslation } from 'react-i18next'


export const useAdminUsers = (
  setUsersCount: (resServer: number) => void, 
  setPosts: (resServer: string[]) => void,
  setComments: (resServer: string[]) => void,
  dataGetSearch: string 
) => {   
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [error, setError] = useState('')
  const [users, setUsers] = useState<IUser[]>([])
  const {token, logout} = useContext(AuthContext)

  const useGetUsers = useCallback(async () => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',      
      url: `${basicUrl.urlAdminUser}/list`,            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IUser[]>(config)
      .then((response) => {
        console.log('Лист пользователей получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setUsers([])
          setUsersCount(0)
        } else {       
          setUsers(resServer)
          setUsersCount(resServer.length)         
        }
        setIsLoading(false)                     
      })   
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          axiosErrors(error)
        } else {
          setIsLoading(false)
          setError('Glob error')
        }
      })           
  }, [])

  const useGetVotePostsComments = useCallback(async () => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',      
      url: `${basicUrl.urlAdminUser}/allposts&comments`,            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<{ posts: string[], comments: string[]}>(config)
      .then((response) => {
        console.log('Лист пользователей получен ', response.data)
        const resServer = response.data

        if (resServer.posts.length === 0) setPosts([])         
        else setPosts(resServer.posts)              
       
        if (resServer.comments.length === 0) setPosts([])          
        else setComments(resServer.comments)                 
        
        setIsLoading(false)                     
      })   
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          axiosErrors(error)
        } else {
          setIsLoading(false)
          setError('Glob error')
        }
      })           
  }, [])

  const useAddUser = useCallback(async (addUser: FormData) => { 
    setIsLoading(true)
    console.log('hook addUser: ', addUser)   

    const config = {
      method: 'POST',
      url: `${basicUrl.urlAdminUser}/insert`,
      data: addUser
    } as AxiosRequestConfig

    setHeaders('multipart/form-data')
    console.log('hook user config1: ', config)

    axiosIC<IUser>(config)
      .then((response) => {        
        console.log('User добавлен ', response.data)
        useGetSearch(dataGetSearch)     
        setIsLoading(false)
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
      } else {      
        setIsLoading(false)
        setError('Glob error')
      }
      })           
  }, [])

  const useEditUser = useCallback(async (editUser: FormData) => { 
    setIsLoading(true)
    console.log('hook editUser: ', editUser) 
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlAdminUser}/edit`,
      data: editUser,             
      // headers
    } as AxiosRequestConfig

    setHeaders('multipart/form-data')

    axiosIC<IUser>(config)
      .then((response) => {
        console.log('User изменен ', response.data)
        useGetSearch(dataGetSearch)
        // useGetCategoryList()        
        // setExtendedSelectCategory({} as ICategoryForm)            
        setIsLoading(false)
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {        
          setIsLoading(false)
          setError('Glob error')
        }
      })          
  }, [])

  const useDeleteUser = useCallback(async (user: IUser, adminId: string) => { 
    setIsLoading(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlAdminUser}/delete/${user._id}/${adminId}`
    } as AxiosRequestConfig
    setHeaders('application/json')

    axiosIC<IUser>(config)
      .then((response) => {
        console.log('Юзер удален ', response.data)               
        useGetSearch(dataGetSearch)    
        setIsLoading(false)             
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {       
          setIsLoading(false)
          setError('Glob error')
        }
      })           
  }, [])

  const useGetSearch = useCallback(async (query: string) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',      
      url: `${basicUrl.urlAdminUser}/search/?query=${query}`,            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IUser[]>(config)
      .then((response) => {
        console.log('Лист пользователей получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setUsers([])
          setUsersCount(0)
        } else {       
          setUsers(resServer)
          setUsersCount(resServer.length)         
        }
        setIsLoading(false)                     
      })   
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          axiosErrors(error)
        } else {
          setIsLoading(false)
          setError('Glob error')
        }
      })           
  }, [])

  const useGetUsersSort = useCallback(async (sort: {}) => { 
    setIsLoading(true)
    const sortnew = {...sort, dataSearch: dataGetSearch}   
    const config = {
      method: 'POST',      
      url: `${basicUrl.urlAdminUser}/sort`,
      data: sortnew            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IUser[]>(config)
      .then((response) => {
        console.log('Лист пользователей получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setUsers([])
          setUsersCount(0)
        } else {       
          setUsers(resServer)
          setUsersCount(resServer.length)         
        }
        setIsLoading(false)                     
      })   
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          axiosErrors(error)
        } else {
          setIsLoading(false)
          setError('Glob error')
        }
      })           
  }, [])

  const axiosErrors = (error: AxiosError) => {
    setIsLoading(false)
    setError(error.message)       
    console.log(error.status)
    console.error(error.response)
    if (error.status === 401 ) {            
      logout()
    }
  }
  
  const clearError = useCallback(() => setError(''), [])
  
  return {useGetUsers, useGetSearch, useGetVotePostsComments, useAddUser, useEditUser, useDeleteUser, useGetUsersSort, users, setUsers, error, clearError}  
}    