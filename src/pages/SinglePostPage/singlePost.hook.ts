import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext.ts'
import axios, { AxiosRequestConfig, AxiosError } from "axios"
import axiosIC from '../../utilita/axiosIC.ts'
import { useParams, useSearchParams } from 'react-router-dom'
import { IPost } from "../../utilita/modelPost.ts"
import { ICategory } from "../../utilita/modelCategory.ts"
import { basicUrl } from "../../utilita/defauit.ts"
import { IComment } from "../../utilita/modelComment.ts"
import { useTranslation } from 'react-i18next'

interface InputHook { 
  handleSetComments: (newComments: IComment[]) => void,
  setComments: (comm: IComment[]) => void
}

export const useSinglePost = ({handleSetComments, setComments}: InputHook) => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [categoryList, setCategoryList] = useGlobalState('categoryList') 
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost)  
  
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext) 
  const postId = useParams().id!
  const { i18n: {language} } = useTranslation()  
  
  const [searchParams] = useSearchParams()
  const categoryId: string = searchParams.get("categoryId")!
  const userId = JSON.parse(localStorage.getItem('userData')!).userId as string  
  
  const useLikePost = useCallback( async (updatePost: IPost): Promise<string | void> => {  
    setIsLoading(true)    
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/update/${userId}`,
      data: updatePost
    } as AxiosRequestConfig
    
    return await axiosIC<IPost|{message: string}>(config)    
      .then((response) => {       
        const resServer = response.data
        if ('message' in resServer) {
          console.log('message in resServer', resServer)          
          if (resServer.message === 'only once') return resServer.message        
        } else {
          console.log('Лайк добавлен ', resServer) 
          useGetPost()
        }              
        setIsLoading(false)                            
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {        
          setError('Glob error')
        }
      })            
  }, [])   

  const useGetPost = useCallback( async () => {  
    setIsLoading(true)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/detail/${postId}`
    } as AxiosRequestConfig

    await axiosIC<IPost>(config)
      .then((response) => {        
        const fetchedPost = response.data       
        setSelectedPost(fetchedPost)       
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
  }, [language])
  
  const useLikeDislikeComment = useCallback( async (updateComment: IComment): Promise<string | void> => {  
    setIsLoading(true)       
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlComment}/update/${userId}`,
      data: updateComment
    } as AxiosRequestConfig
    
    return await axiosIC<IComment|{message: string}>(config)    
      .then((response) => {       
        const resServer = response.data        
        if ('message' in resServer) {
          console.log('message in resServer', resServer)          
          if (resServer.message === 'only once') return resServer.message        
        } else {
          console.log('Лайк добавлен ', resServer) 
          useGetComments()
        }              
        setIsLoading(false)  
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {        
          setError('Glob error')
        }
      })            
  }, [])  

  const useGetComments = useCallback( async () => {  
    setIsLoading(true)   
    const config = {
      method: 'GET',
      url: `${basicUrl.urlComment}/detail/${postId}`,
      params: { timestamp: Date.now() }, // Добавляем уникальный параметр
    } as AxiosRequestConfig   

    await axiosIC<{ comments: IComment[], post: IPost}>(config)
      .then((response) => {        
        const fetchedComment = response.data               
        handleSetComments(fetchedComment.comments)
        console.log('fetchedComment.comments=', fetchedComment.comments) 
        setSelectedPost(fetchedComment.post)                   
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
  }, [language])

  const useAddNewComment = useCallback( async (comment: string) => {
    setIsLoading(true)
    const config = {
      method: 'POST',
      url: `${basicUrl.urlComment}/insert`,
      data: {
        content: comment,      
        like: 0,
        dislike: 0,
        owner: userId,  
        postId: postId
      }
    } as AxiosRequestConfig

    await axiosIC(config)
      .then((response) => {        
        console.log('Комментарий добавлен: ', response.data)
        useGetComments()       
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

  const useGetCategoryForNavBar = useCallback(async () => {     
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/`
    } as AxiosRequestConfig 
    
    console.log('config=', config)
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

  const useGetSearch = useCallback(async (postId: string, query: string) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlComment}/search/${postId}/?query=${query}`,       
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IComment[]>(config)
      .then((response) => {
        console.log('Лист комментариев получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setComments([])
          // setCategoryesCount(0)
        } else {       
          setComments(resServer)         
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

  return {categoryId, selectedPost, useGetPost, useLikeDislikeComment, useGetComments, useAddNewComment, useLikePost, useGetCategoryForNavBar, useGetSearch, error, clearError}
} 

// const useDislikeComment = useCallback( async (updateComment: IComment, onError?: (err: string) => void) => {  
//   setIsLoading(true)        
//   const config = {
//     method: 'PUT',
//     url: `${basicUrl.urlComment}/update/${userId}`,
//     data: updateComment
//   } as AxiosRequestConfig
  
//   await axiosIC<IComment|{message: string}>(config)    
//     .then((response) => {       
//       const resServer = response.data        
//       if ('message' in resServer) {
//         console.log('message in resServer')          
//         if (resServer.message === 'only once') {
//           onError?.('only once')
//           // setError('only once')
//           // console.log('message in resServer only once')
//         }        
//       } else console.log('Дизлайк добавлен ', resServer) 
//       useGetComments()              
//       setIsLoading(false)                      
//     })