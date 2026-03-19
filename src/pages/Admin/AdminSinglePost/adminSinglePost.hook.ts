import { useCallback, useState } from 'react'
import { catchError } from '../../../utilita/catchError.ts'
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import axiosIC from '../../../utilita/axiosIC.ts'
import { useSearchParams } from 'react-router-dom'
import { IPost } from '../../../utilita/modelPost.ts'
import { ICategory } from '../../../utilita/modelCategory.ts'
import { IPostFull } from '../../../utilita/modelPostFull.ts'
import { IPostForm } from '../../../utilita/modelPostForm.ts'
import { basicUrl } from '../../../utilita/default.ts'
import { IComment } from '../../../utilita/modelComment.ts'
import { ICommentForm } from '../../../utilita/modelCommentForm.ts'
import { useTranslation } from 'react-i18next'
import { ICommentFull } from '../../../utilita/modelCommentFull.ts'

type TypeError = 'axiosError' | 'unknown' | 'noCatch'

interface IUpdatedComment {
  _id: string
  like: number
  dislike: number
}

interface IUpdatedPost {
  _id: string
  favorite: number
  nofavorite: number
}

export const useAdminSingle = (
  userId: string,
  setPageCount: React.Dispatch<React.SetStateAction<number>>,
  itemPerPage: number,
  idUser: string,
) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [extendedSelectedPost, setExtendedSelectedPost] = useState<IPostForm>(
    {} as IPostForm,
  )
  const [extendedSelectedComment, setExtendedSelectedComment] =
    useState<ICommentForm>({} as ICommentForm)

  const [selectedPost, setSelectedPost] = useState<IPostFull>({} as IPostFull)
  const [comments, setComments] = useState<ICommentFull[]>([])
  const [countComments, setCountComments] = useState(0)
  const [singleCategory, setSingleCategory] = useState<ICategory>(
    {} as ICategory,
  )
  const {
    i18n: { language },
  } = useTranslation()
  const [searchParams] = useSearchParams()
  const categoryId: string = searchParams.get('categoryId')!

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
        } as AxiosRequestConfig

        type LikePostResponse =
          | { success: true; outPost: IPostFull; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<LikePostResponse>(config)

        const resServer = response.data
        if ('message' in resServer && !resServer.success) {
          console.log('message resServer=', resServer.message)
          // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        } else {
          const updatePost = resServer.outPost
          console.log('Лайк добавлен ', resServer)
          setSelectedPost((prevPosts) =>
            prevPosts._id === updatePost!._id
              ? {
                  ...prevPosts,
                  favorite: updatePost.favorite,
                  nofavorite: updatePost.nofavorite,
                }
              : prevPosts,
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

  const useGetPost = useCallback(
    async (postId: string) => {
      try {
        // if (postId) return
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlPost}/detailAggregation/${postId}`,
        } as AxiosRequestConfig

        const response = await axiosIC<{ postsFullWithComments: IPostFull[] }>(
          config,
        )

        const fetchedPost = response.data.postsFullWithComments[0]
        setSelectedPost(fetchedPost)
      } catch (error: unknown) {
        // Используем функцию catchError
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [language],
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
    async (updateBlogPost: FormData): Promise<outUseEditBlogPost> => {
      try {
        setLoadingState('loading')
        const headers = {
          'Content-Type': 'multipart/form-data',
        } as RawAxiosRequestHeaders

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
          await useGetPost(resServer.updatedPost._id!)
          await useGetFieldTranslationPost(resServer.updatedPost._id!)
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

  type outUseDeletePost =
    | { success: true; data: IPost; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useDeletePost = useCallback(
    async (post: IPostFull): Promise<outUseDeletePost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminPost}/delete/${post._id}`,
        } as AxiosRequestConfig

        type DeletePostResponse =
          | { success: true; post: IPost; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<DeletePostResponse>(config)

        console.log('Пост удален ', response.data)
        const resServer = response.data
        if (resServer.success) {
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

  type outUseLikeDislikeComment =
    | { success: true; data: IComment; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useLikeDislikeComment = useCallback(
    async (
      updatedComment: IUpdatedComment,
    ): Promise<outUseLikeDislikeComment> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'PUT',
          url: `${basicUrl.urlAdminComment}/like/comment/update`,
          data: updatedComment,
        } as AxiosRequestConfig

        type LikeDislikeCommentResponse =
          | { success: true; comment: IComment; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<LikeDislikeCommentResponse>(config)

        const resServer = response.data

        if ('message' in resServer && !resServer.success) {
          console.log('message in resServer', resServer)
          // Любое сообщение от сервера считаем "ошибкой" бизнес-логики
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        } else if ('comment' in resServer && resServer.success) {
          const updatedComment = resServer.comment
          console.log('Лайк добавлен ', resServer)

          setComments((prevComments) => {
            const newComments = prevComments.map((comment) => {
              if (comment._id === updatedComment._id) {
                return {
                  ...comment,
                  like: updatedComment.like,
                  dislike: updatedComment.dislike,
                }
              }
              return comment
            })

            // 3. Проверяем, что что-то изменилось
            console.log('Обновление комментариев:', {
              oldComment: prevComments.find(
                (c) => c._id === updatedComment._id,
              ),
              newComment: newComments.find((c) => c._id === updatedComment._id),
              sameObject:
                prevComments.find((c) => c._id === updatedComment._id) ===
                newComments.find((c) => c._id === updatedComment._id),
            })

            return newComments
          })
          return {
            success: true,
            data: updatedComment,
            forUserId: resServer.forUserId,
          }
        }
        return {
          success: false,
          message: 'unknown200',
          typeError: 'noCatch',
          forUserId: idUser,
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

  type outUseGetCommentsPagination =
    | { success: true; outComments: ICommentFull[] }
    | { success: false; message: string; typeError: TypeError }

  // получить комментарии поста + пагинация
  const useGetCommentsPagination = useCallback(
    async (
      postId: string,
      sortBy: string,
      page: number,
    ): Promise<outUseGetCommentsPagination> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminComment}/detail/pagination/?postId=${postId}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
        } as AxiosRequestConfig

        type GetCommentsResponse =
          | {
              success: true
              outComments: ICommentFull[]
              count: number
              outPost: IPost
              outCategory: ICategory
            }
          | { success: false; message: string }

        const response = await axiosIC<GetCommentsResponse>(config)

        const fetchedComment = response.data
        if (fetchedComment.success && 'outComments' in fetchedComment) {
          setComments(fetchedComment.outComments)
          setCountComments(fetchedComment.count)
          const pc = Math.ceil(fetchedComment.count / itemPerPage)
          setPageCount(pc)
          setSingleCategory(fetchedComment.outCategory)
          setLoadingState('loaded')
          return { success: true, outComments: fetchedComment.outComments }
        } else {
          setComments([])
          setCountComments(0)
          setPageCount(0)
          setLoadingState('empty')
          return {
            success: false,
            message: fetchedComment.message,
            typeError: 'noCatch',
          }
        }
        // setSelectedPost(fetchedComment.outPost)
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

  type outUseGetCommentsSearch =
    | { success: true; outComments: ICommentFull[] }
    | { success: false; message: string; typeError: TypeError }

  // получить комментарии поста + пагинация
  const useGetCommentsSearch = useCallback(
    async (
      searchString: string,
      postId: string,
      sortBy: string,
      page: number,
    ): Promise<outUseGetCommentsSearch> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminComment}/search/query/?q=${searchString}&postId=${postId}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
        } as AxiosRequestConfig

        type GetCommentsResponse =
          | {
              success: true
              outComments: ICommentFull[]
              count: number
              outPost: IPost
            }
          | { success: false; message: string }

        const response = await axiosIC<GetCommentsResponse>(config)

        const fetchedComment = response.data
        if (fetchedComment.success && 'outComments' in fetchedComment) {
          setComments(fetchedComment.outComments)
          setCountComments(fetchedComment.count)
          const pc = Math.ceil(fetchedComment.count / itemPerPage)
          setPageCount(pc)
          setLoadingState('loaded')
          return { success: true, outComments: fetchedComment.outComments }
        } else {
          setComments([])
          setCountComments(0)
          setPageCount(0)
          setLoadingState('empty')
          return {
            success: false,
            message: fetchedComment.message,
            typeError: 'noCatch',
          }
        }
        // setSelectedPost(fetchedComment.outPost)
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

  type outUseAddNewComment =
    | { success: true; message: string; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useAddNewComment = useCallback(
    async (
      comment: ICommentForm,
      postId: string,
    ): Promise<outUseAddNewComment> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'POST',
          url: `${basicUrl.urlAdminComment}/insert`,
          data: {
            content: comment.content,
            content_ru: comment.content_ru,
            like: comment.like,
            dislike: comment.dislike,
            owner: userId,
            postId: postId,
          },
        } as AxiosRequestConfig

        type AddNewCommentResponse =
          | { success: true; newComment: ICommentFull; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<AddNewCommentResponse>(config)

        const resServer = response.data
        console.log('Комментарий добавлен: ', resServer)
        if ('newComment' in resServer && resServer.success) {
          // await useGetComments()
          const newComment = resServer.newComment
          setComments((prevComments) => {
            return [newComment, ...prevComments]
          })
          return {
            success: true,
            message: 'ok',
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

  type outUseEditComment =
    | { success: true; message: string; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useEditComment = useCallback(
    async (
      updateComment: ICommentForm,
      commentId: string,
    ): Promise<outUseEditComment> => {
      try {
        setLoadingState('loading')
        updateComment._id = commentId

        const config = {
          method: 'PUT',
          url: `${basicUrl.urlAdminComment}/update`,
          data: updateComment,
        } as AxiosRequestConfig

        const response = await axiosIC<{
          updatedComment: IComment
          forUserId: string
        }>(config)
        const resServer = response.data
        console.log('Комментарий изменен: ', resServer)
        if ('updatedComment' in resServer) {
          const updComment = resServer.updatedComment
          setComments((prevComments) => {
            const newComments = prevComments.map((comment) => {
              if (comment._id === updComment._id) {
                return {
                  ...comment,
                  content: updComment.content,
                  like: updComment.like,
                  dislike: updComment.dislike,
                }
              }
              return comment
            })
            return newComments
          })
          // await useGetPost()
          return {
            success: true,
            message: 'ok',
            forUserId: resServer.forUserId,
          }
        }
        return {
          success: false,
          message: 'error',
          typeError: 'noCatch',
          forUserId: idUser,
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

  type outUseDeleteAllCommentPost =
    | { success: true; message: string; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useDeleteAllCommentPost = useCallback(
    async (
      post: IPostFull,
      sortBy: string,
      page: number,
    ): Promise<outUseDeleteAllCommentPost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminComment}/delete_all/${post._id}`,
        } as AxiosRequestConfig

        type DeleteAllCommentPostResponse =
          | {
              success: true
              message: string
              deletedComments: number
              deletedTranslations: number
              deletedUsersAffected: number
              postId: string
              forUserId: string
            }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<DeleteAllCommentPostResponse>(config)

        const resServer = response.data

        if (resServer.success) {
          console.log('Все комментарии поста удалены', response.data)
          await useGetCommentsPagination(resServer.postId, sortBy, page)

          return {
            success: true,
            message: `delete all comments for post ${post.title}: ${resServer.deletedComments} comments, ${resServer.deletedTranslations} translations. There were data from ${resServer.deletedUsersAffected} users`,
            forUserId: resServer.forUserId,
          }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
            forUserId: idUser,
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

  type outUseDeleteComment =
    | { success: true; message: string; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useDeleteComment = useCallback(
    async (
      comment: ICommentFull,
      sortBy: string,
      page: number,
    ): Promise<outUseDeleteComment> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminComment}/delete/${comment._id}`,
        } as AxiosRequestConfig

        type DeleteCommentResponse =
          | {
              success: true
              message: string
              deletedComments: number
              deletedTranslations: number
              postId: string
              forUserId: string
            }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<DeleteCommentResponse>(config)

        const resServer = response.data

        if (resServer.success) {
          console.log('Комментарий поста удален', resServer)
          await useGetCommentsPagination(resServer.postId, sortBy, page)

          return {
            success: true,
            message: `delete comment ${comment.content}: ${resServer.deletedComments} comments, ${resServer.deletedTranslations} translations`,
            forUserId: resServer.forUserId,
          }
        } else {
          return {
            success: false,
            message: `${resServer.message}`,
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

  type outUseGetFieldTranslationPost =
    | { success: true; selectPost: IPostForm }
    | { success: false; message: string; typeError: TypeError }

  const useGetFieldTranslationPost = useCallback(
    async (
      selectPostId: string,
      signal?: AbortSignal,
    ): Promise<outUseGetFieldTranslationPost> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminPost}/${selectPostId}`,
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

  type outUseGetFieldTranslationComment =
    | { success: true; selectComment: ICommentForm }
    | { success: false; message: string; typeError: TypeError }

  const useGetFieldTranslationComment = useCallback(
    async (
      selectComment: ICommentFull,
      signal?: AbortSignal,
    ): Promise<outUseGetFieldTranslationComment> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminComment}/${selectComment._id}`,
          signal,
        } as AxiosRequestConfig

        type GetFieldTranslationComment =
          | { success: true; selectComment: ICommentForm }
          | { success: false; message: string }

        const response = await axiosIC<GetFieldTranslationComment>(config)

        console.log('Расширенный комментарий получен ', response.data)
        const resServer = response.data
        if ('selectComment' in resServer && resServer.success) {
          setExtendedSelectedComment(resServer.selectComment)
          return { success: true, selectComment: resServer.selectComment }
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
    categoryId,
    selectedPost,
    setSelectedPost,
    comments,
    useGetPost,
    useGetCommentsPagination,
    useGetCommentsSearch,
    useAddNewComment,
    useLikePost,
    useLikeDislikeComment,
    useEditBlogPost,
    useDeletePost,
    useDeleteAllCommentPost,
    useDeleteComment,
    useEditComment,
    useGetFieldTranslationPost,
    extendedSelectedPost,
    useGetFieldTranslationComment,
    extendedSelectedComment,
    loadingState,
    countComments,
    singleCategory,
  }
}
