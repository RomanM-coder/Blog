import { useCallback, useState, useContext } from "react"
import { AuthContext } from '../context/AuthContext'
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import { useParams, useSearchParams } from 'react-router-dom'
import { IPost } from "../utilita/modelPost"
import { basicUrl } from "../utilita/defauit"

export const useSingle = (watchForLoader: (state: boolean) => void) => {     
  const [selectedPost, setSelectedPost] = useState<any>({})
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext) 
  const idDetail = useParams().id
  const [searchParams] = useSearchParams()
  const categoryId: string = searchParams.get("categoryId")!

  const headers = {    
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    authorization: `Bearer ${token}`,
  } as RawAxiosRequestHeaders  
  
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
        useGetPost()      
        watchForLoader(false)                      
      })
      .catch((error: AxiosError) => {
        if (axios.isAxiosError(error)) {
          axiosErrors(error)
        } else {        
          setError('Glob error')
        }
      })            
  }, [])    

  const useEditBlogPost = useCallback( async (updateBlogPost: IPost) => {
    watchForLoader(true)
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlPost}/edit/${updateBlogPost._id}`,
      data: {
        title: updateBlogPost.title,
        description: updateBlogPost.description,
        liked: updateBlogPost.liked,
        categoryId: categoryId 
      },             
      headers
    } as AxiosRequestConfig

    await axios<IPost>(config)
      .then((response) => {
        console.log('Пост изменен: ', response.data)
        useGetPost()       
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

  const useGetPost = useCallback( async () => {  
    watchForLoader(true)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlPost}/detail/${idDetail}`,       
      headers: headers
    } as AxiosRequestConfig

    await axios<IPost>(config)
      .then((response) => {
        // console.log(response.data)
        const fetchedPost: IPost = response.data
        setSelectedPost(fetchedPost)       
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
      useGetPost()      
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

  return {categoryId, selectedPost, setSelectedPost, useGetPost, useLikePost, useEditBlogPost, useDeletePost, error, clearError}
} 