import { useCallback, useState } from 'react'
import { useGlobalState } from '../../useGlobalState.ts'
import axios, { AxiosRequestConfig } from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import { IPostFull } from '../../utilita/modelPostFull.ts'
import { basicUrl } from '../../utilita/default.ts'
import { ICategory } from '../../utilita/modelCategory.ts'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { basicColor } from '../../utilita/default.ts'

export const usePosts = (
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setSelectedPost: React.Dispatch<React.SetStateAction<IPostFull>>,
  currentPageRef: React.MutableRefObject<number>,
  hasMoreRef: React.MutableRefObject<boolean>,
  itemPerPage: number,
  idUser: string,
) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [, setSelectedCategory] = useGlobalState('selectedCategory')
  const [, setCountPosts] = useGlobalState('countPosts')
  const [postsFull, setPostsFull] = useState<IPostFull[]>([])
  const [category, setCategory] = useState<ICategory | null>(null)
  const { t, i18n } = useTranslation()
  const language = i18n.language

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])
  // const headers = {
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders

  const useLikeDislikePost = useCallback(
    async (
      updatePostId: string,
      updatePostLike: number,
      updatePostDislike: number,
    ): Promise<{
      success: boolean
      message?: string
      data?: IPostFull
      forUserId?: string
    }> => {
      const abortController = new AbortController()
      try {
        // setLoadingState('loading')
        console.log(
          'useLike---data',
          updatePostId,
          updatePostLike,
          updatePostDislike,
        )
        const config = {
          method: 'PUT',
          url: `${basicUrl.urlPost}/update`,
          data: {
            _id: updatePostId,
            favorite: updatePostLike,
            nofavorite: updatePostDislike,
          },
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<
          | { outPost: IPostFull; forUserId: string }
          | { message: string; forUserId: string }
        >(config)

        console.log('📨 Full response:', response)
        console.log('📦 Response data:', response.data)
        console.log('🔍 Type of data:', typeof response.data)
        console.log('📋 Keys in data:', Object.keys(response.data))

        if (!abortController.signal.aborted) {
          const resServer = response.data
          if ('message' in resServer) {
            console.log('message in resServer', resServer)
            // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
            return {
              success: false,
              message: resServer.message,
              forUserId: resServer.forUserId,
            }
          } else {
            const updatePost = resServer.outPost
            console.log('Лайк добавлен ', resServer)
            setPostsFull((prevPosts) =>
              prevPosts.map((post) =>
                post._id === updatePost!._id
                  ? {
                      ...post,
                      favorite: updatePost.favorite,
                      nofavorite: updatePost.nofavorite,
                    }
                  : post,
              ),
            )
            return {
              success: true,
              data: updatePost,
              forUserId: resServer.forUserId,
            }
          }
        } else {
          return {
            success: false,
            message: 'Request aborted',
            forUserId: idUser,
          }
        }
      } catch (error: unknown) {
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return {
            success: false,
            message: 'Request aborted',
            forUserId: idUser,
          }
        }
        console.log('Error in useLikeDislikePost:', error)
        if (axios.isAxiosError(error)) {
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })
          const errorMessage = error.response?.data?.message || 'Unknown error'
          return { success: false, message: errorMessage, forUserId: idUser }
        } else {
          return {
            success: false,
            message: 'Global error: ' + String(error),
            forUserId: idUser,
          }
        }
        // } else {
        //   // Возвращаем объект с сообщением об ошибке,
        //   // чтобы в likeDislikePost не показался тост успеха
        //   return 'Error'
        // }
      } finally {
        // setLoadingState('loaded')
      }
    },
    [],
  )

  // OK
  // даёт посты категории подгрузкой по page
  const useGetPosts = useCallback(
    async (
      categoryId: string,
      page: number,
      sortBy?: string, // сортировка
    ): Promise<{
      success: boolean
      message?: string
      data?: { outPosts: IPostFull[]; category: ICategory }
    }> => {
      console.log('useGetPosts-categoryId=', categoryId)

      const abortController = new AbortController()
      try {
        if (page === 1) setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/${categoryId}?page=${page}&sortBy=${sortBy}&limit=${itemPerPage}`,
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outPosts: IPostFull[]
          category: ICategory
          count: number
        }>(config)

        if (!abortController.signal.aborted) {
          const { outPosts, category, count } = response.data
          console.log('response.data=', response.data)
          setPostsFull((prevPosts) => {
            const existingIds = new Set(prevPosts.map((post) => post._id))
            const newPosts = outPosts.filter(
              (newPost) => !existingIds.has(newPost._id),
            )
            return [...prevPosts, ...newPosts]
          })
          // setLoadingState(
          //   response.data.outPosts.length === 0 ? 'empty' : 'loaded'
          // )
          console.log('category=', category)
          setCurrentPage(page)
          currentPageRef.current = page

          setCategory(category)
          setCountPosts(count)
          if (outPosts.length === 0) {
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
          // setIsLoading(false)
          return { success: true, data: { outPosts, category } }
        } else {
          return { success: false, message: 'Request aborted' }
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return { success: false, message: 'Request aborted' }
        }
        console.log('Error in useGetPosts:', error)
        // setIsLoading(false)
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
    [language],
  )

  // даёт выбранный пост
  const useGetPost = useCallback(
    async (
      postId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: IPostFull[]
    }> => {
      const abortController = new AbortController()
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/detailAggregation/${postId}`,
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{ postsFullWithComments: IPostFull[] }>(
          config,
        )
        if (!abortController.signal.aborted) {
          const { postsFullWithComments } = response.data
          console.log(
            'detailAggregation-post-postsFullWithComments=',
            postsFullWithComments,
          )

          setPostsFull(postsFullWithComments)
          // setLoadingState(
          //   response.data.postsFullWithComments.length === 0
          //     ? 'empty'
          //     : 'loaded'
          // )
          setSelectedPost(postsFullWithComments[0])
          setLoadingState('loaded')
          return { success: true, data: response.data.postsFullWithComments }
        } else {
          setLoadingState('loaded')
          return { success: false, message: 'Request aborted' }
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return { success: false, message: 'Request aborted' }
        }
        console.log('Error in useGetPost:', error)
        if (axios.isAxiosError(error)) {
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })
          const errorMessage = error.response?.data?.message || 'Unknown error'

          console.error('❌ Incorrect Post ID format error from server')
          return { success: false, message: errorMessage }
        } else {
          // Для всех остальных axios ошибок
          return { success: false, message: 'Global error: ' + String(error) }
        }
      } finally {
      }
      // return () => abortController.abort()
    },
    [language],
  )

  // даёт выбранный пост и модифицирует состояние postsFull
  const useUpdatePostComments = useCallback(
    async (
      postId: string,
      // query: number
    ): Promise<{
      success: boolean
      message?: string
      data?: IPostFull[]
    }> => {
      const abortController = new AbortController()
      try {
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/detailAggregation/${postId}`, // /?query=${query}
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{ postsFullWithComments: IPostFull[] }>(
          config,
        )
        if (!abortController.signal.aborted) {
          const { postsFullWithComments } = response.data
          console.log(
            'detailAggregation-post-postsFullWithComments=',
            postsFullWithComments,
          )

          setPostsFull((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    countComments: postsFullWithComments[0].countComments,
                  }
                : post,
            ),
          )
          setSelectedPost(postsFullWithComments[0])
          return { success: true, data: response.data.postsFullWithComments }
        } else {
          return { success: false, message: 'Request aborted' }
        }
      } catch (error: unknown) {
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return { success: false, message: 'Request aborted' }
        }
        console.log('Error in useGetPost:', error)
        if (axios.isAxiosError(error)) {
          console.log('📨 Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.response?.data?.message,
          })
          const errorMessage = error.response?.data?.message || 'Unknown error'

          console.error('❌ Incorrect Post ID format error from server')
          return { success: false, message: errorMessage }
        } else {
          // Для всех остальных axios ошибок
          return { success: false, message: 'Global error: ' + String(error) }
        }
      } finally {
      }
      // return () => abortController.abort()
    },
    [language],
  )

  // увеличивает у выбранного поста views
  const useIncreaseViewPost = useCallback(
    async (postId: string): Promise<string | void> => {
      const abortController = new AbortController()
      try {
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/viewInFull/${postId}`,
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{ views: number }>(config)

        if (!abortController.signal.aborted) {
          const { views } = response.data

          console.log('viewInFull-post=', response.data)

          setPostsFull((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId ? { ...post, views: views } : post,
            ),
          )
        }
      } catch (error: unknown) {
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
      }
      // return () => abortController.abort()
    },
    [],
  )

  // Ok
  // старт - даёт посты по времени - page №
  const useGetPostsStart = useCallback(
    async (page: number, sortType: string) => {
      const abortController = new AbortController()
      try {
        if (page === 1) setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/?page=${page}&sortBy=${sortType}&limit=${itemPerPage}`,
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outPosts: IPostFull[]
          count: number
        }>(config)

        console.log('useGetPostsStart-posts=', response.data)
        const { outPosts, count } = response.data
        if (!abortController.signal.aborted) {
          setPostsFull((prevPosts) => {
            const existingIds = new Set(prevPosts.map((post) => post._id))
            const newPosts = outPosts.filter(
              (newPost) => !existingIds.has(newPost._id),
            )
            return [...prevPosts, ...newPosts]
          })
          // setLoadingState(
          //   response.data.outPosts.length === 0 ? 'empty' : 'loaded'
          // )
          setCountPosts(count)
          setCurrentPage(page)
          currentPageRef.current = page

          if (outPosts.length === 0) {
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
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return
        }
        console.log('Error in useGetPostsStart:', error)
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          // axiosErrors(error)
          console.log(error.status)
          myToast(t('postPage.toast.errorLoad'), basicColor.orange)
        } else {
        }
      } finally {
      }
      return () => abortController.abort()
    },
    [language],
  )

  const useGetSearch = useCallback(
    async (
      categoryId: string, // надо сделать в эндпойнте условие поиска по наличию категории
      page: number,
      searchString: string,
      query?: string, // сортировка
    ): Promise<{
      success: boolean
      message?: string
      data?: { outPosts: IPostFull[]; category: ICategory }
    }> => {
      const abortController = new AbortController()
      try {
        if (page === 1) setLoadingState('loading')

        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/search/${categoryId}/?q=${searchString}&sortBy=${query}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outPosts: IPostFull[]
          category: ICategory
          count: number
        }>(config)

        if (!abortController.signal.aborted) {
          const { outPosts, category, count } = response.data
          console.log('posts=', outPosts)
          setPostsFull((prevPosts) => {
            const existingIds = new Set(prevPosts.map((post) => post._id))
            const newPosts = outPosts.filter(
              (newPost) => !existingIds.has(newPost._id),
            )
            return [...prevPosts, ...newPosts]
          })

          console.log('category=', category)
          setCurrentPage(page)
          currentPageRef.current = page

          setCategory(category)
          setCountPosts(count)

          if (outPosts.length === 0) {
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

          return { success: true, data: { outPosts, category } }
        } else {
          return { success: false, message: 'Request aborted search' }
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return { success: false, message: 'Request aborted' }
        }
        console.log('Error in useGetSearch:', error)

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
      // return () => abortController.abort()
    },
    [],
  )

  return {
    postsFull,
    setPostsFull,
    useGetPost,
    useUpdatePostComments,
    useIncreaseViewPost,
    useGetPosts,
    useGetPostsStart,
    useLikeDislikePost,
    useGetSearch,
    category,
    setSelectedCategory,
    loadingState,
  }
}
