import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext'
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import axiosIC from '../../utilita/axiosIC.ts'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IPost } from "../../utilita/modelPost"
import { IPostForm } from "../../utilita/modelPostForm"
import { IComment } from "../../utilita/modelComment"
import { ICategory } from "../../utilita/modelCategory.ts"
import { basicUrl } from "../../utilita/defauit"


export const useAdminPosts = () => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [categoryList, setCategoryList] = useGlobalState('categoryList') // для NavBar Link 
  const [activeSubPage, setActiveSubPage] = useGlobalState('activeSubPage') 
  const [extendedSelectedPost, setExtendedSelectedPost] = useState<IPostForm>({} as IPostForm)
  
  const [posts, setPosts] = useState<IPost[]>([])
  const [category, setCategory] = useState<ICategory>({} as ICategory) 
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext)
  const { i18n: {language} } = useTranslation()
  const categoryId  = useParams().id  

  // const headers = {    
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders 

  const useLikePost = useCallback( async (updatePost: IPost) => {   
    setIsLoading(true)   
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/update`,
      data: {
        id: updatePost._id,        
        favorite: updatePost.favorite,
        nofavorite: updatePost.nofavorite
      },       
      // headers
    } as AxiosRequestConfig
    
    await axiosIC<IPost>(config)    
      .then((response) => {       
        const resServer: IPost = response.data
        console.log('Лайк изменен ', resServer)        
        useGetPosts(updatePost.categoryId)        
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

  const useAddNewPost = useCallback( async (post: FormData) => {
    setIsLoading(true)
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAdminPost}/insert`,
      data: post,             
      // headers
    } as AxiosRequestConfig

    await axiosIC(config)
      .then((response) => {        
        console.log('Пост добавлен: ', response.data)
        useGetPosts(category._id!) 
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

  // interface ValidationError {
  //   message: string;
  //   errors: Record<string, string[]>
  // }
  // (axios.isAxiosError<ValidationError, Record<string, unknown>>(error))

  const useEditBlogPost = useCallback( async (updateBlogPost: FormData) => {   
    setIsLoading(true)
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlAdminPost}/edit}`,     
      data: updateBlogPost,             
      // headers
    } as AxiosRequestConfig

    await axiosIC<IPost>(config)
      .then((response) => {
        console.log('Пост изменен: ', response.data)
        useGetPosts(categoryId!) 
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
        setActiveSubPage(response.data.category.name)        
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

  const useDeletePost = useCallback( async (post: IPost, adminId: string) => {  
    setIsLoading(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlAdminPost}/delete/${post._id}/${adminId}`,       
      // headers: headers
    } as AxiosRequestConfig

    await axios<IPost>(config)
    .then((response) => {
      console.log('Пост удален ', response.data)       
      useGetPosts(post.categoryId)     
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
  
  // const useDeleteCommentPost = useCallback( async (post: IPost) => { 
  //   setIsLoading(true)
  //   const config = {
  //     method: 'DELETE',
  //     url: `${basicUrl.urlAdminComment}/delete/${post._id}`,       
  //     // headers: headers
  //   } as AxiosRequestConfig

  //   await axios<IComment>(config)
  //   .then((response) => {
  //     console.log('Все Комментарии поста удалены', response.data)           
  //     setIsLoading(false)             
  //   })
  //   .catch((error: AxiosError) => {
  //     if (axios.isAxiosError(error)) {
  //       axiosErrors(error)
  //     } else {        
  //       setIsLoading(false)
  //       setError('Glob error')
  //     }
  //   })    
  // }, [])

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

  const useGetSearch = useCallback(async (query: string) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/search/${categoryId!}/?query=${query}`,       
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

  const useGetFieldTranslation = useCallback(async (selectPost: IPost, signal?: AbortSignal) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlAdminPost}/${selectPost._id}`,
      signal     
    } as AxiosRequestConfig   

    axiosIC<IPostForm>(config)
      .then((response) => {
        console.log('Расширенный пост получен ', response.data)
        const resServer = response.data
        if (resServer) setExtendedSelectedPost(resServer)        
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

  return {posts, useGetPosts, useLikePost, useAddNewPost, useEditBlogPost, useDeletePost, useGetSearch, error, clearError, category, useGetCategoryForNavBar, useGetFieldTranslation, extendedSelectedPost}
} 