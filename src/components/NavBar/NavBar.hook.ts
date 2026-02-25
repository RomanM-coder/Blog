import { useCallback, useState } from 'react'
import { catchError } from '../../utilita/catchError.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { AxiosRequestConfig } from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import { basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'

export const useNavBar = () => {
  const [categoryList, setCategoryList] = useState<ICategory[]>([])

  const {
    i18n: { language },
  } = useTranslation()

  const useGetCategoryForNavBar = useCallback(async () => {
    try {
      // setLoadingState('loading')
      const config = {
        method: 'GET',
        url: `${basicUrl.urlCategory}/`,
        // headers: headers
      } as AxiosRequestConfig
      console.log('config=', config)
      const response = await axiosIC<{
        success: boolean
        outCategories: ICategory[]
      }>(config)

      console.log('Лист категорий получен in NavBar', response.data)
      const resServer = response.data.outCategories
      if (resServer.length > 0) {
        setCategoryList(resServer)
        // setLoadingState('loaded')
      } else {
        // setLoadingState('empty')
        // setCurrentItems(resServer)
      }
    } catch (error: unknown) {
      // setLoadingState('error')
      // Используем функцию catchError
      const caughtError = catchError(error)
      return caughtError
    } finally {
    }
  }, [language])

  return {
    useGetCategoryForNavBar,
    categoryList,
  }
}
