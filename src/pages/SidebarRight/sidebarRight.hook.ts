import { useCallback, useState } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import axios, { AxiosRequestConfig } from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import { IPost } from '../../utilita/modelPost.ts'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import { basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'

interface InputHook {
  setComments: React.Dispatch<React.SetStateAction<ICommentFull[]>>
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPageRef: React.MutableRefObject<number>
  hasMoreRef: React.MutableRefObject<boolean>
  itemPerPage: number
}

export const useSidebarRight = ({
  setComments,
  setHasMore,
  setCurrentPage,
  currentPageRef,
  hasMoreRef,
  itemPerPage,
}: InputHook) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [selectedPost] = useState<IPost>({} as IPost)
  const [commentsCount, setCommentsCount] = useState(0)

  const {
    i18n: { language },
  } = useTranslation()

  const useGetPopularComments = useCallback(
    async (page: number, sortBy: string) => {
      const abortController = new AbortController()
      try {
        setIsLoading(true)
        const config = {
          method: 'GET',
          url: `${basicUrl.urlComment}/popularcomments/?page=${page}&sortBy=${sortBy}&limit=${itemPerPage}`,
          params: { timestamp: Date.now() }, // Добавляем уникальный параметр
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outComments: ICommentFull[]
          count: number
        }>(config)
        if (!abortController.signal.aborted) {
          const { outComments, count } = response.data

          console.log('fetchedComment=', outComments)
          console.log('commentsCount=', commentsCount)
          setComments((prevComments) => {
            const existingIds = new Set(
              prevComments.map((comment) => comment._id),
            )
            const newComments = outComments.filter(
              (newComment) => !existingIds.has(newComment._id),
            )
            return [...prevComments, ...newComments]
          })
          if (outComments.length === 0) {
            setHasMore(false)
            hasMoreRef.current = false
            // Если это первая страница и данных нет
            if (page === 1) {
              setLoadingState('empty')
            } else {
              // Если это не первая страница и данных нет - успех, но больше нет данных
              // setLoadingState('loaded')
            }
          } else {
            setLoadingState('loaded')
          }
          setCommentsCount(count)
          setCurrentPage(page)
          currentPageRef.current = page
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return
        }
        console.log('Error in useIncreaseViewPost:', error)
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })
          if (error.response?.data?.message === 'Post not found') {
            console.error('❌ Post not found error from server')
            return 'Post not found'
          } else {
            return 'Error'
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [language],
  )

  const useGetSearch = useCallback(
    async (searchString: string, query: string, page: number) => {
      const abortController = new AbortController()
      try {
        setIsLoading(true)
        const config = {
          method: 'GET',
          url: `${basicUrl.urlComment}/search/?q=${searchString}&sortBy=${query}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        // await new Promise((resolve) => setTimeout(resolve, 500))

        const response = await axiosIC<{
          outComments: ICommentFull[]
          countComments: number
        }>(config)
        if (!abortController.signal.aborted) {
          console.log('Лист комментариев получен ', response.data)
          const { outComments, countComments } = response.data

          setComments((prevComments) => {
            const existingIds = new Set(
              prevComments.map((comment) => comment._id),
            )
            const newComments = outComments.filter(
              (newComment) => !existingIds.has(newComment._id),
            )
            return [...prevComments, ...newComments]
          })
          if (outComments.length === 0) {
            setHasMore(false)
            hasMoreRef.current = false
            // Если это первая страница и данных нет
            if (page === 1) {
              setLoadingState('empty')
            } else {
              // Если это не первая страница и данных нет - успех, но больше нет данных
              // setLoadingState('loaded')
            }
          } else {
            setLoadingState('loaded')
          }
          setCommentsCount(countComments)
          setCurrentPage(page)
          currentPageRef.current = page
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return
        }
        console.log('Error in useIncreaseViewPost:', error)
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })
          if (error.response?.data?.message === 'Post not found') {
            console.error('❌ Post not found error from server')
            return 'Post not found'
          } else {
            return 'Error'
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    selectedPost,
    commentsCount,
    loadingState,
    useGetPopularComments,
    useGetSearch,
  }
}
