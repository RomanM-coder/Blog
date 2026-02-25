import { useCallback, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import { IPost } from '../../utilita/modelPost.ts'
import { ICommentFull } from '../../utilita/modelCommentFull.ts'
import { basicUrl } from '../../utilita/default.ts'
import { IComment } from '../../utilita/modelComment.ts'
import { useTranslation } from 'react-i18next'

interface InputHook {
  setComments: (comm: ICommentFull[]) => void
  idUser: string
}

export const useInsertInPostList = ({ setComments, idUser }: InputHook) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost)
  const {
    i18n: { language },
  } = useTranslation()

  const useLikeDislikeComment = useCallback(
    async (
      updateComment: IComment,
      commentId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: IComment
      forUserId?: string
    }> => {
      const abortController = new AbortController()
      try {
        setLoadingState('loading')
        const config = {
          method: 'PUT',
          url: `${basicUrl.urlComment}/update`,
          data: updateComment,
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<
          | { comment: IComment; forUserId: string }
          | { message: string; forUserId: string }
        >(config)

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
            console.log('Лайк добавлен ', resServer)
            if (commentId) useGetCommentsInsertInPostList(commentId)
            else useGetComments(updateComment.postId)
            return {
              success: true,
              data: updateComment,
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
        // setIsLoading(false)
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
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  // все комментарии к посту
  const useGetComments = useCallback(
    async (
      postId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: { outComments: ICommentFull[] }
    }> => {
      const abortController = new AbortController()
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlComment}/detail/${postId}`,
          params: { timestamp: Date.now() }, // Добавляем уникальный параметр
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{
          outComments: ICommentFull[]
          outPost: IPost
        }>(config)

        if (!abortController.signal.aborted) {
          const { outComments, outPost } = response.data
          // const fetchedComment = response.data

          // if (fetchedComment) {
          setComments(outComments)
          setSelectedPost(outPost)
          // setSelectedPost(fetchedComment.outComments[0].post)
          // }

          // setComments(fetchedComment.outComments)
          // console.log('fetchedComment.comments=', fetchedComment.outComments)
          // setSelectedPost(fetchedComment.outComments[0].post)
          setLoadingState(outComments.length === 0 ? 'empty' : 'loaded')

          return { success: true, data: { outComments } }
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
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          const errorMessage = error.response?.data?.message || 'Unknown error'
          return { success: false, message: errorMessage }
        } else {
          return { success: false, message: 'Global error: ' + String(error) }
        }
      } finally {
      }
      // return () => abortController.abort()
    },
    [language],
  )

  // все вложенные комменты к какому-либо комменту
  const useGetCommentsInsertInPostList = useCallback(
    async (
      commentId: string,
    ): Promise<{
      success: boolean
      message?: string
      data?: { outComments: ICommentFull[] }
    }> => {
      const abortController = new AbortController()
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlComment}/commentsInsertInPostList/${commentId}`,
          params: { timestamp: Date.now() }, // Добавляем уникальный параметр
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<{ outComments: ICommentFull[] }>(config)

        if (!abortController.signal.aborted) {
          const { outComments } = response.data
          const fetchedComment = response.data

          setComments(fetchedComment.outComments)
          setLoadingState(
            fetchedComment.outComments.length === 0 ? 'empty' : 'loaded',
          )
          console.log('InsertInPostListComments=', fetchedComment.outComments)

          return { success: true, data: { outComments } }
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
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
          const errorMessage = error.response?.data?.message || 'Unknown error'
          return { success: false, message: errorMessage }
        } else {
          return { success: false, message: 'Global error: ' + String(error) }
        }
      } finally {
      }
      // return () => abortController.abort()
    },
    [language],
  )

  const useAddNewComment = useCallback(
    async (
      comment: string,
      related: string,
      postId: string,
      // userId: string,
      commentId: string | undefined,
    ): Promise<{
      success: boolean
      message?: string
      data?: { newComment: IComment }
      forUserId: string
    }> => {
      const abortController = new AbortController()
      try {
        setLoadingState('loading')
        const config = {
          method: 'POST',
          url: `${basicUrl.urlComment}/insert`,
          data: {
            content: comment,
            like: 0,
            dislike: 0,
            // owner: userId,
            related: related,
            postId: postId,
          },
          signal: abortController.signal,
        } as AxiosRequestConfig

        const response = await axiosIC<
          | { newComment: IComment; forUserId: string }
          | { message: string; forUserId: string }
        >(config)

        if (!abortController.signal.aborted) {
          console.log('Комментарий добавлен: ', response.data)
          const resServer = response.data
          if ('newComment' in resServer) {
            if (commentId) useGetCommentsInsertInPostList(commentId)
            else useGetComments(postId)

            setLoadingState('loaded')
            return {
              success: true,
              data: { newComment: resServer.newComment },
              forUserId: resServer.forUserId,
            }
          } else {
            // Это ошибка от сервера
            setLoadingState('error')
            return {
              success: false,
              message: resServer.message,
              forUserId: resServer.forUserId,
            }
          }
        } else {
          setLoadingState('loaded')
          return {
            success: false,
            message: 'Request aborted',
            forUserId: idUser,
          }
        }
      } catch (error: unknown) {
        setLoadingState('error')
        if (abortController.signal.aborted) {
          console.log('Request was aborted')
          return {
            success: false,
            message: 'Request aborted',
            forUserId: idUser,
          }
        }
        if (axios.isAxiosError(error)) {
          // const err = JSON.stringify(error.response?.data.message) && err === 'Нет авторизации.'
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
      } finally {
      }
      // return () => abortController.abort()
    },
    [],
  )

  return {
    selectedPost,
    useLikeDislikeComment,
    useGetComments,
    useAddNewComment,
    useGetCommentsInsertInPostList,
    loadingState,
  }
}
