import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext'
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import axiosIC from '../../utilita/axiosIC.ts'
import { IPost } from "../../utilita/modelPost.ts"
import { IComment } from "../../utilita/modelComment"
import { basicUrl } from "../../utilita/defauit"
import { ICategory } from "../../utilita/modelCategory.ts"
import { useTranslation } from 'react-i18next'

export const usePosts = () => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [categoryList, setCategoryList] = useGlobalState('categoryList') // для NavBar Link    
  
  const [posts, setPosts] = useState<IPost[]>([])
  const [category, setCategory] = useState<ICategory|null>(null) 
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext)
  const { i18n: {language} } = useTranslation()

  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string

  // const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders   
 
  const useLikePost = useCallback( async (updatePost: IPost): Promise<string | void> => {   
    setIsLoading(true)     
    console.log('useLike---data', updatePost)    
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/update/${userId}`,
      data: {
        _id: updatePost._id,
        favorite: updatePost.favorite,
        nofavorite: updatePost.nofavorite
      },       
      // headers
    } as AxiosRequestConfig
    
    return await axiosIC<IPost|{message: string}>(config)    
      .then((response) => {
        const resServer = response.data        
        if ('message' in resServer) {
          console.log('message in resServer', resServer)          
          if (resServer.message === 'only once') return resServer.message        
        } else {
          console.log('Лайк добавлен ', resServer) 
          useGetPosts(updatePost.categoryId)
        }              
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
 
  const useGetPosts = useCallback( async (categoryId: string) => {
    setIsLoading(true)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/${categoryId}`,       
      // headers: headers
    } as AxiosRequestConfig
    // headers['Accept-Language'] = `${language}`    

    await axiosIC<{ posts: IPost[], category: ICategory}>(config)
      .then((response) => {
        console.log('posts', response.data.posts)        
        setPosts(response.data.posts)
        console.log('category', response.data.category)
        setCategory(response.data.category)
        // setActiveSubPage(response.data.category.name)        
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
  }, [language]) 

  const useGetCategoryForNavBar = useCallback(async () => {     
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/`,       
      // headers: headers
    } as AxiosRequestConfig
    // headers['Accept-Language'] = `${dataLang}`

    // console.log('config=', config)
    axiosIC<ICategory[]>(config)
      .then((response) => {
        console.log('Лист категорий получен ', response.data)
        const resServer = response.data 
        setCategoryList(resServer)
        // setCurrentItems(resServer)                
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
  }, [language])

  const useGetSearch = useCallback(async (categoryId: string, query: string) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/search/${categoryId}/?query=${query}`,       
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IPost[]>(config)
      .then((response) => {
        console.log('Лист постов получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setPosts([])
          // setCategoryesCount(0)
        } else {       
        setPosts(resServer)         
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

  return {posts, useGetPosts, useLikePost, useGetSearch, error, clearError, category, useGetCategoryForNavBar}
} 