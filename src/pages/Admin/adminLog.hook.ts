import { useCallback, useState, useContext } from "react"
import { useGlobalState } from '../../useGlobalState.ts'
import { AuthContext } from '../../context/AuthContext'
import { IAdminLog } from "../../utilita/modelAdminLog"
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosError } from "axios"
import axiosIC, { setHeaders } from '../../utilita/axiosIC.ts'
import { basicUrl } from "../../utilita/defauit"

export const useAdminLog = (
  setAdminCount: (resServer: number) => void, 
  dataGetSearch: string 
) => {   
  const [isLoading, setIsLoading] = useGlobalState('isLoading')
  const [error, setError] = useState('')
  const [admins, setAdmins] = useState<IAdminLog[]>([])
  const {token, logout} = useContext(AuthContext)

  const useGetAdminLog = useCallback(async () => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',      
      url: `${basicUrl.urlAdminLog}/list`,            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IAdminLog[]>(config)
      .then((response) => {
        console.log('Лист логов получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setAdmins([])
          setAdminCount(0)
        } else {       
          setAdmins(resServer)
          setAdminCount(resServer.length)         
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

  const useAdminLogGetSearch = useCallback(async (query: string) => { 
    setIsLoading(true)    
    const config = {
      method: 'GET',      
      url: `${basicUrl.urlAdminLog}/search/?query=${query}`,            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IAdminLog[]>(config)
      .then((response) => {
        console.log('Лист логов получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setAdmins([])
          setAdminCount(0)
        } else {       
          setAdmins(resServer)
          setAdminCount(resServer.length)         
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

  const useGetAdminLogSort = useCallback(async (sort: {}) => { 
    setIsLoading(true)
    let newSort = {} 
    newSort = {...sort, dataSearch: dataGetSearch} 
    console.log('newSort=', newSort)     
    const config = {
      method: 'POST',      
      url: `${basicUrl.urlAdminLog}/sort`,
      data: newSort            
      // headers: headers
    } as AxiosRequestConfig   

    axiosIC<IAdminLog[]>(config)
      .then((response) => {
        console.log('Лист логов получен ', response.data)
        const resServer = response.data
        if (resServer.length === 0) {
          setAdmins([])
          setAdminCount(0)
        } else {       
          setAdmins(resServer)
          setAdminCount(resServer.length)         
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
  
  return {useGetAdminLog, useAdminLogGetSearch, useGetAdminLogSort, admins, setAdmins, error, clearError}  
}    