import { useCallback, useState } from 'react'
import { catchError } from '../../../utilita/catchError.ts'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { AxiosRequestConfig } from 'axios'
import axiosIC, { setHeaders } from '../../../utilita/axiosIC.ts'
import { basicUrl } from '../../../utilita/default.ts'
import { useTranslation } from 'react-i18next'
import { ICategoryForm } from '../../../utilita/modelCategoryForm.ts'

export const useAdminCategoryes = (
  setCategoriesCount: (resServer: number) => void,
  setCurrentItems: (resServer: ICategory[]) => void,
  setPageCount: (val: number) => void,
  itemPerPage: number,
) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [extendedSelectCategory, setExtendedSelectCategory] =
    useState<ICategoryForm>({} as ICategoryForm)

  const {
    i18n: { language },
  } = useTranslation()

  // const headers = {
  //   'Content-Type': 'application/json',//'Content-Type': 'multipart/form-data',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  //   'Accept-Language' : `${language}`
  // } as RawAxiosRequestHeaders

  const useGetCategoryListCount = useCallback(
    async (itemPerPage: number, signal?: AbortSignal) => {
      try {
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminCategory}/all/count`,
          signal,
          // headers: headers
        } as AxiosRequestConfig
        // headers['Accept-Language'] = `${language}`

        const response = await axiosIC<number>(config)

        console.log('Количество категорий получено ', response.data)
        const resServer = response.data
        setCategoriesCount(resServer)
        const pc = Math.ceil(resServer / itemPerPage)
        setPageCount(pc)
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
      }
    },
    [],
  )

  const useGetCategoryList = useCallback(async () => {
    try {
      setLoadingState('loading')
      const config = {
        method: 'GET',
        url: `${basicUrl.urlCategory}/`,
        // headers: headers
      } as AxiosRequestConfig
      // headers['Accept-Language'] = `${language}`
      console.log('config=', config)

      const response = await axiosIC<{
        success: boolean
        outCategories: ICategory[]
      }>(config)

      console.log('Лист категорий получен ', response.data)
      const outCategories = response.data.outCategories
      if (outCategories.length > 0) {
        setCurrentItems(outCategories)
        setLoadingState('loaded')
      } else {
        setLoadingState('empty')
      }
    } catch (error: unknown) {
      setLoadingState('error')
      // Используем функцию catchError
      const caughtError = catchError(error)
      return caughtError
    } finally {
    }
  }, [])

  const useGetCategoryListPagination = useCallback(
    async (
      itemPerPage: number,
      skip: number,
      sort: string = '+name',
      signal?: AbortSignal,
    ) => {
      try {
        setLoadingState('loading')
        const page = skip * itemPerPage
        let sortParam
        if (sort.slice(0, 1) === '+') sortParam = true
        if (sort.slice(0, 1) === '-') sortParam = false
        const config = {
          method: 'GET',
          url: `${
            basicUrl.urlAdminCategory
          }/list/pagination/?limit=${itemPerPage}&skip=${page}&sortfield=${sort.slice(
            1,
          )}&sortparam=${sortParam}`,
          signal,
          // headers: headers
        } as AxiosRequestConfig
        // headers['Accept-Language'] = `${language}`
        console.log('configPag=', config)

        const response = await axiosIC<{
          categoriesItems: ICategory[]
          count: number
        }>(config)

        const resServer = response.data
        console.log('Лист категорий получен pagination ', response.data)
        const { categoriesItems, count } = resServer
        if (categoriesItems.length > 0) {
          setCurrentItems(categoriesItems)
          setCategoriesCount(count)
          const pc = Math.ceil(count / itemPerPage)
          setPageCount(pc)
          setLoadingState('loaded')
        } else {
          setCurrentItems([])
          setCategoriesCount(0)
          setPageCount(0)
          setLoadingState('empty')
        }
      } catch (error: unknown) {
        setLoadingState('error')
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
      }
    },
    [language],
  )

  const useAddNewCategory = useCallback(async (category: FormData) => {
    try {
      setLoadingState('loading')
      console.log('hook category new: ', category)

      const config = {
        method: 'POST',
        url: `${basicUrl.urlAdminCategory}/insert`,
        data: category,
      } as AxiosRequestConfig

      setHeaders('multipart/form-data')
      console.log('hook category config1: ', config)

      const response = await axiosIC<ICategory>(config)
      console.log('Категория добавлена ', response.data)
    } catch (error: unknown) {
      setLoadingState('error')
      // Используем функцию catchError
      const caughtError = catchError(error)
      return caughtError
    } finally {
      setLoadingState('loaded')
    }
  }, [])

  const useEditCategory = useCallback(async (updateCategory: FormData) => {
    try {
      setLoadingState('loading')
      // const headers = {
      //   'Content-Type': 'multipart/form-data',
      //   'Access-Control-Allow-Origin': '*',
      //   authorization: `Bearer ${token}`,
      // } as RawAxiosRequestHeaders
      const config = {
        method: 'PUT',
        url: `${basicUrl.urlAdminCategory}/edit`,
        data: updateCategory,
        // headers
      } as AxiosRequestConfig

      setHeaders('multipart/form-data')
      const response = await axiosIC<ICategory>(config)

      console.log('Категория изменена ', response.data)
      setExtendedSelectCategory({} as ICategoryForm) // ?????
    } catch (error: unknown) {
      setLoadingState('error')
      // Используем функцию catchError
      const caughtError = catchError(error)
      return caughtError
    } finally {
      setLoadingState('loaded')
    }
  }, [])

  const useDeleteCategory = useCallback(
    // переделать, послать данные параметрами, а не динамически
    async (category: ICategory) => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminCategory}/delete/${category._id}`,
        } as AxiosRequestConfig
        setHeaders('application/json')

        const response = await axiosIC<ICategory>(config)

        console.log('Категория удалена ', response.data)
        // await useGetCategoryPagePagination(itemPerPage, currentPage + 1)
        // await useGetCategoryList()
      } catch (error: unknown) {
        setLoadingState('error')
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  const useGetSearch = useCallback(
    async (
      searchString: string,
      sortBy: string,
      page: number,
      signal?: AbortSignal,
    ) => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminCategory}/search/query/?q=${searchString}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          signal,
          // headers: headers
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outCategories: ICategory[]
          count: number
        }>(config)

        console.log('Лист категорий получен ', response.data)
        const { outCategories, count } = response.data
        if (outCategories.length > 0) {
          setCurrentItems(outCategories)
          setCategoriesCount(count)
          const pc = Math.ceil(count / itemPerPage)
          setPageCount(pc)
          setLoadingState('loaded')
        } else {
          setCurrentItems([])
          setCategoriesCount(0)
          setPageCount(0)
          setLoadingState('empty')
        }
      } catch (error: unknown) {
        setLoadingState('error')
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
      }
    },
    [],
  )

  type outUseGetFieldTranslationCategory =
    | { success: true; selectCategory: ICategoryForm }
    | { success: false; message: string; typeError: string }

  const useGetFieldTranslation = useCallback(
    async (
      selectCategory: ICategory,
      signal?: AbortSignal,
    ): Promise<outUseGetFieldTranslationCategory> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminCategory}/${selectCategory._id}`,
          signal,
        } as AxiosRequestConfig

        type GetFieldTranslationCategoryResponse =
          | { success: true; selectCategory: ICategoryForm }
          | { success: false; message: string }

        const response =
          await axiosIC<GetFieldTranslationCategoryResponse>(config)

        const resServer = response.data
        console.log('Расширенная категория получена ', resServer)

        if ('selectCategory' in resServer && resServer.success) {
          setExtendedSelectCategory(resServer.selectCategory)
          return { success: true, selectCategory: resServer.selectCategory }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
          }
        }
      } catch (error: unknown) {
        setLoadingState('error')
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  return {
    useGetCategoryList,
    useGetCategoryListCount,
    useGetSearch,
    useGetCategoryListPagination,
    // useGetCategoryPagePagination,
    useAddNewCategory,
    useGetFieldTranslation,
    extendedSelectCategory,
    setExtendedSelectCategory,
    useEditCategory,
    useDeleteCategory,
    loadingState,
  }
}
