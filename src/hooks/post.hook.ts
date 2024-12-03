import { useCallback, useState, useContext } from "react"
import { AuthContext } from '../context/AuthContext'
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import { IPost } from "../utilita/modelPost"
import { basicUrl } from "../utilita/defauit"

export const usePosts = (watchForLoader: (state: boolean) => void) => {  
  const [posts, setPosts] = useState<IPost[]>([]) 
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext)

  const headers = {    
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    authorization: `Bearer ${token}`,
  } as RawAxiosRequestHeaders 
  
  interface IPostAdd {
    title: string,
    description:string,
    liked: boolean,
    categoryId: string|number
  }

  const useLikePost = useCallback( async (updatePost: IPost) => {   
    watchForLoader(true)     
    const temp = {...updatePost}   
    temp.liked = !temp.liked
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/update/${temp._id}`,
      data: temp,       
      headers
    } as AxiosRequestConfig
    
    await axios<IPost>(config)    
      .then((response) => {       
        const resServer: IPost = response.data
        console.log('Лайк изменен ', resServer)        
        useGetPosts(updatePost.categoryId)        
        watchForLoader(false)                      
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {          
          watchForLoader(false)
          setError('Glob error')
        }
      })            
  }, [])

  const useAddNewPost = useCallback( async (post: IPostAdd) => {
     watchForLoader(true)
    const config = {
      method: 'POST',
      url: `${basicUrl.urlPost}/insert`,
      data: {
        title: post.title, 
        description: post.description, 
        liked: post.liked,
        categoryId: post.categoryId
      },             
      headers
    } as AxiosRequestConfig

    await axios(config)
      .then((response) => {        
        console.log('Пост добавлен: ', response.data)
        useGetPosts(post.categoryId) 
        watchForLoader(false)
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
      } else { 
        watchForLoader(false)
        setError('Glob error')
      }
      })     
  }, [])

  // interface ValidationError {
  //   message: string;
  //   errors: Record<string, string[]>
  // }
  // (axios.isAxiosError<ValidationError, Record<string, unknown>>(error))

  const useEditBlogPost = useCallback( async (updateBlogPost: IPost) => {   
    watchForLoader(true)
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/edit/${updateBlogPost._id}`,
      data: {
        title: updateBlogPost.title,
        description: updateBlogPost.description,
        liked: updateBlogPost.liked,
        categoryId: updateBlogPost.categoryId
      },             
      headers
    } as AxiosRequestConfig

    await axios<IPost>(config)
      .then((response) => {
        console.log('Пост изменен: ', response.data)
        useGetPosts(updateBlogPost.categoryId) 
        watchForLoader(false)
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {      
          watchForLoader(false)
          setError('Glob error')
        }
      })       
  }, [])

  const useGetPosts = useCallback( async (categoryId: string|number) => {
    watchForLoader(true)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/${categoryId}`,       
      headers: headers
    } as AxiosRequestConfig

    await axios<IPost[]>(config)
      .then((response) => {
        // console.log(response.data)
        const resServer: IPost[] = response.data
        setPosts(resServer)        
        watchForLoader(false)              
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          axiosErrors(error)
        } else {         
          watchForLoader(false)
          setError('Glob error')
        }
      })
  }, [])

  const useDeletePost = useCallback( async (post: IPost) => {  
    watchForLoader(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlPost}/delete/${post._id}`,       
      headers: headers
    } as AxiosRequestConfig

    await axios<IPost>(config)
    .then((response) => {
      console.log('Пост удален ', response.data)       
      useGetPosts(post.categoryId)     
      watchForLoader(false)             
    })
    .catch((error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        axiosErrors(error)
      } else {       
        watchForLoader(false)
        setError('Glob error')
      }
    })    
  }, [])  
  
  const axiosErrors = (error: AxiosError) => {   
    watchForLoader(false)
    setError(error.message)       
    console.log(error.status)
    console.error(error.response)
    if (error.status === 401 ) {            
      logout()
    }
  }

  const clearError = useCallback(() => setError(''), [])

  return {posts, useGetPosts, useLikePost, useAddNewPost, useEditBlogPost, useDeletePost, error, clearError}
} 