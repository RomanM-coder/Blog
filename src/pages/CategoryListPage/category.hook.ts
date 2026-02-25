import { useCallback, useState } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import { ICategory } from '../../utilita/modelCategory'
import axios, { AxiosRequestConfig } from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import { basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'

export const useCategoryes = () => {
  const [, setSelectedCategory] = useGlobalState('selectedCategory')
  const [, setIsEmailConfirm] = useGlobalState('isEmailConfirm')
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [categoryList, setCategoryList] = useState<ICategory[]>([])
  const {
    i18n: { language },
  } = useTranslation()

  // const headers = {
  //   'Content-Type': 'application/json',//'Content-Type': 'multipart/form-data',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  //   'Accept-Language' : `${language}`
  // } as RawAxiosRequestHeaders

  const useGetSelectedCategory = useCallback(
    async (
      categoryId: string,
    ): Promise<{ success: boolean; message?: string; data?: ICategory }> => {
      const abortController = new AbortController()
      try {
        // setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlCategory}/${categoryId}`,
          signal: abortController.signal,
        } as AxiosRequestConfig
        console.log('config=', config)

        const response = await axiosIC<{
          success: boolean
          category?: ICategory
          message?: string
        }>(config)
        console.log(
          'useGetSelectedCategory - Лист категорий получен ',
          response.data,
        )
        const { success, category, message } = response.data

        // ✅ Проверяем abort ДО обработки данных
        if (abortController.signal.aborted) {
          return { success: false, message: 'Request aborted' }
        }
        // ✅ УСПЕХ
        if (success && category) {
          setSelectedCategory(category!)
          // setLoadingState('loaded')
          return { success: true, data: category }
          // ✅ ЛОГИЧЕСКИЕ ОШИБКИ ОТ СЕРВЕРА
        } else if (message) {
          // setLoadingState('error')
          return { success: false, message }
        }
        // ✅ НЕОЖИДАННЫЙ ОТВЕТ (нет ни success, ни message)
        // setLoadingState('error')
        return { success: false, message: 'Unexpected response format' }
      } catch (error: unknown) {
        // setLoadingState('error')
        // ✅ Проверяем abort в начале catch
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return { success: false, message: 'Request aborted' }
        }
        if (axios.isAxiosError(error)) {
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })

          const errorMessage = error.response?.data?.message || 'Unknown error'
          return { success: false, message: errorMessage }
        } else {
          return { success: false, message: 'Global error: ' + String(error) }
        }
      } finally {
      }
    },
    [setSelectedCategory],
  )

  const useGetCategoryForNavBar = useCallback(async (): Promise<{
    success: boolean
    message?: string
    data?: ICategory[]
  }> => {
    const abortController = new AbortController()
    try {
      setLoadingState('loading')
      const config = {
        method: 'GET',
        url: `${basicUrl.urlCategory}/`,
        signal: abortController.signal,
      } as AxiosRequestConfig

      console.log('config=', config)
      const response = await axiosIC<{
        success: boolean
        outCategories: ICategory[]
      }>(config)

      console.log('Кол-во постов получено=', response.data)
      if (abortController.signal.aborted) {
        return { success: false, message: 'Request aborted' }
      }
      if (response.data && response.data.outCategories) {
        setCategoryList(response.data.outCategories)
        setLoadingState(
          response.data.outCategories.length === 0 ? 'empty' : 'loaded',
        )
        return { success: true, data: response.data.outCategories }
      } else {
        setLoadingState('empty')
        return { success: false, message: 'There are no outCategories' }
      }
    } catch (error: unknown) {
      setLoadingState('error')
      if (abortController.signal.aborted) {
        console.log('Request was aborted')
        return { success: false, message: 'Request aborted' }
      }
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Unknown error'
        return { success: false, message: errorMessage }
      } else {
        return { success: false, message: 'Global error: ' + String(error) }
      }
    } finally {
    }
  }, [language])

  const useGetUserEmailConfirm = useCallback(async () => {
    const abortController = new AbortController()
    try {
      setLoadingState('loading')
      const config = {
        method: 'GET',
        url: `${basicUrl.urlCategory}/user/confirmed`,
        signal: abortController.signal,
        // headers: headers
      } as AxiosRequestConfig
      // headers['Accept-Language'] = `${language}`

      const response = await axiosIC<{ success: boolean; confirmed: boolean }>(
        config,
      )

      console.log('user confirmed получен ', response.data)

      if (abortController.signal.aborted) {
        return { success: false, message: 'Request aborted' }
      }

      const { success, confirmed } = response.data
      if (success) setIsEmailConfirm(confirmed)
      else setIsEmailConfirm(false)
    } catch (error: unknown) {
      if (abortController.signal.aborted) {
        console.log('Request was aborted')
        return { success: false, message: 'Request aborted' }
      }
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Unknown error'
        return { success: false, message: errorMessage }
      } else {
        return { success: false, message: 'Global error: ' + String(error) }
      }
    } finally {
      setLoadingState('loaded')
    }
  }, [])

  return {
    useGetSelectedCategory,
    useGetCategoryForNavBar,
    useGetUserEmailConfirm,
    categoryList,
    loadingState,
  }
}
