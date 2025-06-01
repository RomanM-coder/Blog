import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext.ts'
import axios, { AxiosRequestConfig, AxiosError } from "axios"
import axiosIC from '../../utilita/axiosIC.ts'
import { useParams, useSearchParams } from 'react-router-dom'
import { IPost } from "../../utilita/modelPost.ts"
import { IPostForm } from "../../utilita/modelPostForm.ts"
import { ICategory } from "../../utilita/modelCategory.ts"
import { basicUrl } from "../../utilita/defauit.ts"
import { IComment } from "../../utilita/modelComment.ts"
import { ICommentForm } from "../../utilita/modelCommentForm.ts"
import { useTranslation } from 'react-i18next'

export const useAdminSingle = (userId: number) => {
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [categoryList, setCategoryList] = useGlobalState('categoryList')
  const [extendedSelectedPost, setExtendedSelectedPost] = useState<IPostForm>({} as IPostForm) 
  const [extendedSelectedComment, setExtendedSelectedComment] = useState<ICommentForm>({} as ICommentForm)

  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost)  
  const [comments, setComments] = useState<IComment[]>([])
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext)
  const { i18n: {language} } = useTranslation()
  const postId = useParams().id  
  const [searchParams] = useSearchParams()
  const categoryId: string = searchParams.get("categoryId")! 
  
  // <Link to={`/detail/${post._id}?categoryId=${categoryId}`} className={styles.aLink}>  
  
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
      data: updatePost
    } as AxiosRequestConfig
    
    await axiosIC<IPost>(config)    
      .then((response) => {       
        const resServer: IPost = response.data
        console.log('Лайк изменен ', resServer)        
        useGetPost()      
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
        const fetchedPost: IPost = response.data
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

  const useEditBlogPost = useCallback( async (updateBlogPost: FormData) => {
    setIsLoading(true)
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlAdminPost}/edit`,
      data: updateBlogPost
    } as AxiosRequestConfig

    await axiosIC<IPost>(config)
      .then((response) => {
        console.log('Пост изменен: ', response.data)
        useGetPost()
        useGetFieldTranslationPost(selectedPost)       
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

  const useDeletePost = useCallback( async (post: IPost) => { 
    setIsLoading(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlAdminPost}/delete/${post._id}`
    } as AxiosRequestConfig

    await axiosIC<IPost>(config)
    .then((response) => {
      console.log('Пост удален ', response.data)       
      // useGetPost()      
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

  const useLikeComment = useCallback( async (updateComment: IComment) => {  
    setIsLoading(true)       
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlComment}/update/${userId}`,
      data: updateComment
    } as AxiosRequestConfig
    
    await axiosIC<IComment>(config)    
      .then((response) => {       
        const resServer: IComment = response.data
        console.log('Лайк добавлен ', resServer)             
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
  
  const useDislikeComment = useCallback( async (updateComment: IComment) => {  
    setIsLoading(true)        
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlComment}/update/${userId}`,
      data: updateComment
    } as AxiosRequestConfig
    
    await axiosIC<IComment>(config)    
      .then((response) => {       
        const resServer: IComment = response.data
        console.log('Дизлайк добавлен ', resServer)        
        // useGetComments()      
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
  // получить все комментарии поста
  const useGetComments = useCallback( async () => {  
    setIsLoading(true)   
    const config = {
      method: 'GET',
      url: `${basicUrl.urlComment}/detail/${postId}`
    } as AxiosRequestConfig

    await axiosIC<{ comments: IComment[], post: IPost}>(config)
      .then((response) => {        
        const fetchedComment = response.data
        setComments(fetchedComment.comments)        
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

  const useAddNewComment = useCallback( async (comment: ICommentForm) => {
    setIsLoading(true)
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAdminComment}/insert`,
      data: {
        content: comment.content,
        content_ru: comment.content_ru,      
        like: comment.like,
        dislike: comment.dislike,
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

  const useEditComment = useCallback( async (updateComment: ICommentForm, commentId: string, adminId: string) => {
    setIsLoading(true)
    updateComment._id = commentId
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlAdminComment}/update/${adminId}`,
      data: updateComment
    } as AxiosRequestConfig

    await axiosIC<IPost>(config)
      .then((response) => {
        console.log('Комментарий изменен: ', response.data)
        useGetPost()               
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
  
  const useDeleteAllCommentPost = useCallback( async (post: IPost, adminId: string) => { 
    setIsLoading(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlAdminComment}/delete_all/${post._id}/${adminId}`
    } as AxiosRequestConfig

    await axiosIC<IComment>(config)
    .then((response) => {
      console.log('Комментарии поста удалены', response.data)
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
  
  const useDeleteComment = useCallback( async (comment: IComment, adminId: string) => { 
    setIsLoading(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlAdminComment}/delete/${comment._id}/${adminId}`
    } as AxiosRequestConfig

    await axiosIC<IComment>(config)
    .then((response) => {
      console.log('Комментарий поста удален', response.data)
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

  const useGetFieldTranslationPost = useCallback(async (selectPost: IPost, signal?: AbortSignal) => { 
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
  
  const useGetFieldTranslationComment = useCallback(async (    
    selectComment: IComment, 
    signal?: AbortSignal) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlAdminComment}/${selectComment._id}`,
      signal     
    } as AxiosRequestConfig   

    axiosIC<ICommentForm>(config)
      .then((response) => {
        console.log('Расширенный комментарий получен ', response.data)
        const resServer = response.data
        if (resServer) setExtendedSelectedComment(resServer)        
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

  return {categoryId, selectedPost, setSelectedPost, comments, useGetPost, useGetComments, useAddNewComment, useLikePost, useLikeComment, useDislikeComment, useEditBlogPost, useDeletePost, useDeleteAllCommentPost, useDeleteComment, useGetCategoryForNavBar, useEditComment, useGetFieldTranslationPost, extendedSelectedPost, useGetFieldTranslationComment, extendedSelectedComment, error, clearError}
} 