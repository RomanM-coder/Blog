import { useCallback, useState, useContext } from "react"
import { AuthContext } from '../context/AuthContext'
import { ICategory } from "../utilita/modelCategory"
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import { basicUrl } from "../utilita/defauit"

export const useCategoryes = (watchForLoader: (state: boolean) => void) => {   
  const [categoryes, setCategoryes] = useState<ICategory[]>([])
  const [error, setError] = useState('')  

  const {token, logout} = useContext(AuthContext)

  const headers = {    
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    authorization: `Bearer ${token}`,
  } as RawAxiosRequestHeaders   

  const useGetCategoryList = useCallback( async () => { 
    watchForLoader(true)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/`,       
      headers: headers
    } as AxiosRequestConfig

    await axios<ICategory[]>(config)
      .then((response) => {
        console.log('Лист категорий получен ', response.data)
        const resServer: ICategory[] = response.data
        setCategoryes(resServer)       
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

  const useAddNewCategory = useCallback( async (category: {name: string, description: string}) => {   
    watchForLoader(true)
    console.log('category new: ', category);
    
    const config = {
      method: 'POST',
      url: `${basicUrl.urlCategory}/insert`,
      data: {
        name: category.name,
        description: category.description       
      },             
      headers
    } as AxiosRequestConfig

    await axios<ICategory>(config)
      .then((response) => {        
        console.log('Категория добавлена ', response.data)
        useGetCategoryList()     
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

  const useEditCategory = useCallback( async (updateCategory: ICategory) => {
    watchForLoader(true)
    const config = {
      method: 'PUT',
      url: `${basicUrl.urlCategory}/edit/${updateCategory._id}`,
      data: {
        name: updateCategory.name,
        description: updateCategory.description,        
        categoryId: updateCategory._id
      },             
      headers
    } as AxiosRequestConfig

    await axios<ICategory>(config)
      .then((response) => {
        console.log('Категория изменена ', response.data)
        useGetCategoryList() 
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

  const useDeleteCategory = useCallback( async (category: ICategory) => {   
    watchForLoader(true)
    const config = {
      method: 'DELETE',
      url: `${basicUrl.urlCategory}/delete/${category._id}`,       
      headers: headers
    } as AxiosRequestConfig

    await axios<ICategory>(config)
    .then((response) => {
      console.log('Категория удалена ', response.data)       
      useGetCategoryList()    
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

  return {categoryes, useGetCategoryList, useAddNewCategory, useEditCategory, useDeleteCategory, error, clearError}
} 