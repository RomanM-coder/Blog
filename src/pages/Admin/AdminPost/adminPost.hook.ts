import { useCallback, useState } from 'react'
import { useGlobalState } from '../../../useGlobalState.ts'
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import axiosIC from '../../../utilita/axiosIC.ts'
import { catchError } from '../../../utilita/catchError.ts'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IPost } from '../../../utilita/modelPost.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import { IPostForm } from '../../../utilita/modelPostForm.ts'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { basicUrl } from '../../../utilita/default.ts'

type TypeError = 'axiosError' | 'unknown' | 'noCatch'

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

export const useAdminPosts = (itemPerPage: number) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [, setActiveSubPage] = useGlobalState('activeSubPage')
  const [extendedSelectedPost, setExtendedSelectedPost] = useState<IPostForm>(
    {} as IPostForm,
  )
  const [postsFull, setPostsFull] = useState<IPostFull[]>([])
  const [countPosts, setCountPosts] = useState(0)
  const [category, setCategory] = useState<ICategory>({} as ICategory)

  const {
    i18n: { language },
  } = useTranslation()
  const categoryId = useParams().id

  // const headers = {
  //   'Content-Type': 'application/json',
  //   // 'Access-Control-Allow-Origin': '*',
  //   authorization: `Bearer ${token}`,
  // } as RawAxiosRequestHeaders

  type outUseLikePost =
    | { success: true; data: IPostFull; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useLikePost = useCallback(
    async (updatedPost: IUpdatedPost): Promise<outUseLikePost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'PUT',
          url: `${basicUrl.urlAdminPost}/like/update`,
          data: updatedPost,
          // headers
        } as AxiosRequestConfig

        type LikePostResponse =
          | { success: true; outPost: IPostFull; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<LikePostResponse>(config)

        const resServer = response.data
        console.log('resServer=', resServer)
        if ('message' in resServer && !resServer.success) {
          // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        } else {
          const updatePost = resServer.outPost
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
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseAddNewPost =
    | { success: true; data: IPost; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useAddNewPost = useCallback(
    async (
      post: FormData,
      sortBy: string,
      page: number,
    ): Promise<outUseAddNewPost> => {
      try {
        const headers = {
          'Content-Type': 'multipart/form-data',
        } as RawAxiosRequestHeaders

        setLoadingState('loading')
        const config = {
          method: 'POST',
          url: `${basicUrl.urlAdminPost}/insert`,
          data: post,
          headers,
        } as AxiosRequestConfig

        type AddBlogPostResponse =
          | { success: true; addedPost: IPost; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<AddBlogPostResponse>(config)

        console.log('Пост добавлен: ', response.data)
        const resServer = response.data

        if ('message' in resServer && !resServer.success) {
          // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        } else {
          await useGetPosts(resServer.addedPost.categoryId, sortBy, page)
          return {
            success: true,
            data: resServer.addedPost,
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseEditBlogPost =
    | { success: true; data: IPost; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useEditBlogPost = useCallback(
    async (
      updateBlogPost: FormData,
      sortBy: string,
      page: number,
    ): Promise<outUseEditBlogPost> => {
      try {
        const headers = {
          'Content-Type': 'multipart/form-data',
        } as RawAxiosRequestHeaders
        setLoadingState('loading')

        const config = {
          method: 'PUT',
          url: `${basicUrl.urlAdminPost}/edit`,
          data: updateBlogPost,
          headers,
        } as AxiosRequestConfig

        type EditBlogPostResponse =
          | { success: true; updatedPost: IPost; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<EditBlogPostResponse>(config)

        const resServer = response.data
        console.log('Пост изменен: ', resServer)
        if ('message' in resServer && !resServer.success) {
          // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        } else {
          await useGetPosts(resServer.updatedPost.categoryId, sortBy, page)
          return {
            success: true,
            data: resServer.updatedPost,
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  const useGetPosts = useCallback(
    async (categoryId: string, sortBy: string, page: number) => {
      try {
        setLoadingState('loading')

        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminPost}/postlist/${categoryId}/?sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig
        // headers['Accept-Language'] = `${language}`

        const response = await axiosIC<{
          outPosts: IPostFull[]
          category: ICategory
          count: number
        }>(config)

        console.log('outPosts', response.data.outPosts)
        const { outPosts, category, count } = response.data

        if (outPosts && category) {
          setPostsFull(outPosts)
          setCountPosts(count)
          if (count === 0) setLoadingState('empty')
          else setLoadingState('loaded')
          console.log('category', category)
          setCategory(category)
          setActiveSubPage(category._id!)
        }
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        // setLoadingState('loaded')
      }
    },
    [language],
  )

  type outUseDeletePost =
    | { success: true; data: IPost; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useDeletePost = useCallback(
    async (
      post: IPostFull,
      adminId: string,
      sortBy: string,
      page: number,
    ): Promise<outUseDeletePost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminPost}/delete/${post._id}/${adminId}`,
          // headers: headers
        } as AxiosRequestConfig

        type DeletePostResponse =
          | { success: true; post: IPost; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<DeletePostResponse>(config)

        console.log('Пост удален ', response.data)
        const resServer = response.data
        if (resServer.success) {
          await useGetPosts(post.categoryId, sortBy, page)
          return {
            success: true,
            data: resServer.post,
            forUserId: resServer.forUserId,
          }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
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
    async (searchString: string, sortBy: string, page: number) => {
      try {
        setLoadingState('loading')

        const config = {
          method: 'GET',
          url: `${
            basicUrl.urlPost
          }/search/${categoryId!}/?q=${searchString}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        type UseGetSearchResponse = {
          //success: true;
          outPosts: IPostFull[]
          category: ICategory
          count: number
        }

        const response = await axiosIC<UseGetSearchResponse>(config)

        console.log('Лист постов получен ', response.data)
        const resServer = response.data
        const { outPosts, count } = resServer
        if (resServer.outPosts.length === 0) {
          setPostsFull([])
          setCountPosts(0)
          setLoadingState('empty')
        } else {
          setPostsFull(outPosts)
          setCountPosts(count)
          setLoadingState('loaded')
        }
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        // setLoadingState('loaded')
      }
    },
    [language],
  )

  type outUseGetFieldTranslationPost =
    | { success: true; selectPost: IPostForm }
    | { success: false; message: string; typeError: string }

  const useGetFieldTranslation = useCallback(
    async (
      selectPost: IPostFull,
      signal?: AbortSignal,
    ): Promise<outUseGetFieldTranslationPost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminPost}/${selectPost._id}`,
          signal,
        } as AxiosRequestConfig

        type GetFieldTranslationPostResponse =
          | { success: true; selectPost: IPostForm }
          | { success: false; message: string }

        const response = await axiosIC<GetFieldTranslationPostResponse>(config)

        console.log('Расширенный пост получен ', response.data)
        const resServer = response.data

        if ('selectPost' in resServer && resServer.success) {
          setExtendedSelectedPost(resServer.selectPost)
          return { success: true, selectPost: resServer.selectPost }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
          }
        }
      } catch (error: unknown) {
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
    postsFull,
    useGetPosts,
    useLikePost,
    useAddNewPost,
    useEditBlogPost,
    useDeletePost,
    useGetSearch,
    category,
    useGetFieldTranslation,
    extendedSelectedPost,
    loadingState,
    countPosts,
  }
}
