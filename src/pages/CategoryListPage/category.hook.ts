import { useCallback, useState, useContext } from "react"
import { useGlobalState, getGlobalStateValue } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext'
import { ICategory } from "../../utilita/modelCategory"
import { ICategoryForm } from "../../utilita/modelCategoryForm.ts"
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from "axios"
import axiosIC from '../../utilita/axiosIC.ts'
// import { useQuery } from '@tanstack/react-query'
import { basicUrl } from "../../utilita/defauit"
import { useTranslation } from 'react-i18next'

export const useCategoryes = (
  setCategoryesCount: (resServer: number) => void, 
  setCurrentItems: (resServer: ICategory[]) => void,
  sort: string 
) => {   
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  // const [language, setLanguage] = useGlobalState('language')
  const [categoryList, setCategoryList] = useGlobalState('categoryList') // для NavBar Link  
  const [error, setError] = useState('')
  const {token, logout} = useContext(AuthContext)
  const { i18n: {language} } = useTranslation()   

  // const headers = {    
  //   'Content-Type': 'application/json',//'Content-Type': 'multipart/form-data',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  //   'Accept-Language' : `${language}`
  // } as RawAxiosRequestHeaders 
  
  const useGetCategoryListCount = useCallback(async (itemPerPage: number, setPageCount: (pc: number) => void, signal?: AbortSignal) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/count`,
      signal,       
      // headers: headers
    } as AxiosRequestConfig 
    // headers['Accept-Language'] = `${language}`
    // const key = [config.method, config.url, language].filter(Boolean).join('&')   
    // const cachedData = sessionStorage.getItem(key)    
    // console.log('JSON.parse(cachedData)=', JSON.parse(cachedData!))
    
    // if (cachedData) {
    //   // return Promise.resolve(JSON.parse(cachedData))
    //   setCategoryesCount(JSON.parse(cachedData))
    //   const pc = Math.ceil(JSON.parse(cachedData) / itemPerPage)
    //   setPageCount(pc)
    //   console.log('useGetCategoryListCount----Cashe')           
    //   setIsLoading(false) 
    // } else { 

    axiosIC<number>(config)
      .then((response) => {
        console.log('Количество категорий получено ', response.data)
        const resServer = response.data 
        setCategoryesCount(resServer)
        const pc = Math.ceil(resServer / itemPerPage)
        setPageCount(pc)
        // sessionStorage.setItem(key, JSON.stringify(response.data))                
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
    // }       
  }, [])

  const useGetCategoryList = useCallback(async () => {     
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/`,            
      // headers: headers
    } as AxiosRequestConfig 
    // headers['Accept-Language'] = `${language}`
    console.log('config=', config)
    
    axiosIC<ICategory[]>(config)
      .then((response) => {
        console.log('Лист категорий получен ', response.data)
        const resServer = response.data 
        setCurrentItems(resServer)                
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

// function generateCacheKey(method: string, url:string, language: string): string {
//   return [method, url, language].filter(Boolean).join('&')
// }

  const useGetCategoryForNavBar = useCallback(async () => {     
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/`,       
      // headers: headers
    } as AxiosRequestConfig 
    // console.log('language',language);    
    // headers['Accept-Language'] = `${language}`
    // const key = [config.method, config.url, language].filter(Boolean).join('&')   
    // const cachedData = sessionStorage.getItem(key)    
    // console.log('JSON.parse(cachedData)=', JSON.parse(cachedData!))
    
    // if (cachedData) {
    //   // return Promise.resolve(JSON.parse(cachedData))
    //   setCategoryList(JSON.parse(cachedData))
    //   console.log('useGetCategoryForNavBar----Cashe')
    //   setIsLoading(false) 
    // } else {
      console.log('config=', config)
      axiosIC<ICategory[]>(config)
        .then((response) => {
          console.log('Лист категорий получен for NavBar', response.data)
          const resServer = response.data 
          setCategoryList(resServer)          
          // sessionStorage.setItem(key, JSON.stringify(response.data))         
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
      // }     
  }, [language])
  
  const useGetCategoryListPagination = useCallback( async (
    itemPerPage: number, 
    skip: number,
    sort: string = '+name',   
    signal?: AbortSignal
  ) => { 
    setIsLoading(true)
    let sortParam
    if (sort.slice(0,1) === '+') sortParam = true
    if (sort.slice(0,1) === '-') sortParam = false    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/pagination/?limit=${itemPerPage}&skip=${skip}&sortfield=${sort.slice(1)}&sortparam=${sortParam}`,
      signal,       
      // headers: headers
    } as AxiosRequestConfig
    // headers['Accept-Language'] = `${language}`    
    console.log('configPag=', config)
    
    // const key = [config.method, config.url, language].filter(Boolean).join('&') 
    // console.log('key=', key)  
    // const cachedData = sessionStorage.getItem(key)
    // console.log('cachedData=', cachedData)
    // if (cachedData) {
    //   // return Promise.resolve(cachedData)
    //   setCurrentItems(JSON.parse(cachedData))
    //   console.log('useGetCategoryListPagination----Cashe')
    //   setIsLoading(false) 
    // } else {
      axiosIC<ICategory[]>(config)
        .then((response) => {
          console.log('Лист категорий получен pagination ', response.data)
          const resServer = response.data       
          setCurrentItems(resServer)
          // sessionStorage.setItem(key, JSON.stringify(response.data))        
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
    // }
  }, [language])

  
  const axiosErrors = (error: AxiosError) => {
    setIsLoading(false)
    setError(error.message)       
    console.log(error.status)
    console.error(error.response)
    if (error.status === 401 ) {            
      logout()
    }
  }   

  const useGetSearch = useCallback(async (query: string, signal?: AbortSignal) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',
      url: `${basicUrl.urlCategory}/search/?query=${query}`,
      signal,       
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<ICategory[]>(config)
      .then((response) => {
        console.log('Лист категорий получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setCurrentItems([])
          // setCategoryesCount(0)
        } else {       
        setCurrentItems(resServer)         
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

  const clearError = useCallback(() => setError(''), [])

  return {useGetCategoryList, useGetCategoryForNavBar, useGetCategoryListCount, useGetSearch, useGetCategoryListPagination, error, clearError}
} 