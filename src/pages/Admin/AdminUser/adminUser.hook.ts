import { useCallback, useState } from 'react'
import { catchError } from '../../../utilita/catchError.ts'
import { IUser } from '../../../utilita/modelUser'
import { AxiosRequestConfig } from 'axios'
import axiosIC, { setHeaders } from '../../../utilita/axiosIC.ts'
import { basicUrl } from '../../../utilita/default.ts'

type TypeError = 'axiosError' | 'unknown' | 'noCatch'

export const useAdminUsers = (
  setUsersCount: (resServer: number) => void,
  setPosts: (resServer: string[]) => void,
  setComments: (resServer: string[]) => void,
  itemPerPage: number,
  setPageCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [users, setUsers] = useState<IUser[]>([])
  const userId = JSON.parse(localStorage.getItem('userData')!).userId

  type outUseGetUsers =
    | { success: true; outUsers: IUser[] }
    | { success: false; message: string; typeError: TypeError }

  const useGetUsers = useCallback(
    async (sortBy: string, page: number): Promise<outUseGetUsers> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminUser}/?sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        type GetUsers =
          | { success: true; outUsers: IUser[]; countUsers: number }
          | { success: false; message: string }

        const response = await axiosIC<GetUsers>(config)

        const resServer = response.data
        console.log('Лист пользователей получен ', resServer)

        if (resServer.success) {
          if ('outUsers' in resServer && resServer.outUsers.length !== 0) {
            const { outUsers, countUsers } = resServer
            setUsers(outUsers)
            setUsersCount(countUsers)
            const calculatedPageCount = Math.ceil(countUsers / itemPerPage)
            setPageCount(calculatedPageCount)
            setLoadingState('loaded')
            return { success: true, outUsers: outUsers }
          } else {
            setUsers([])
            setUsersCount(0)
            setPageCount(0)
            setLoadingState('empty')
            return { success: true, outUsers: [] }
          }
        }
        return {
          success: false,
          message: resServer.message,
          typeError: 'noCatch',
        }
      } catch (error: unknown) {
        setLoadingState('error')
        const caughtError = catchError(error)
        return caughtError
      } finally {
        // setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseGetVotePostsComments =
    | { success: true; posts: string[]; comments: string[] }
    | { success: false; message: string; typeError: TypeError }

  const useGetVotePostsComments =
    useCallback(async (): Promise<outUseGetVotePostsComments> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminUser}/allposts&comments`,
          // headers: headers
        } as AxiosRequestConfig

        type GetVotePostsComments =
          | { success: true; posts: string[]; comments: string[] }
          | { success: false; message: string }

        const response = await axiosIC<GetVotePostsComments>(config)
        const resServer = response.data
        console.log('Листы posts и comments получены ', response.data)

        if (
          resServer.success &&
          'posts' in resServer &&
          'comments' in resServer
        ) {
          const { posts, comments } = resServer

          if (resServer.posts.length === 0) setPosts([])
          else setPosts(posts)

          if (resServer.comments.length === 0) setComments([])
          else setComments(comments)

          return { success: true, posts, comments }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
          }
        }
      } catch (error: unknown) {
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    }, [])

  type outUseAddUser =
    | { success: true; outUser: IUser; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useAddUser = useCallback(
    async (
      addUser: FormData,
      sortBy: string,
      page: number,
    ): Promise<outUseAddUser> => {
      try {
        setLoadingState('loading')
        console.log('hook addUser: ', addUser)

        const config = {
          method: 'POST',
          url: `${basicUrl.urlAdminUser}/insert`,
          data: addUser,
        } as AxiosRequestConfig

        setHeaders('multipart/form-data')
        console.log('hook user config1: ', config)
        type AddUser =
          | { success: true; outUser: IUser; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<AddUser>(config)

        const resServer = response.data
        console.log('User добавлен ', resServer)

        if (resServer.forUserId && resServer.forUserId === userId) {
          if (resServer.success && 'outUser' in resServer) {
            useGetUsers(sortBy, page)

            return {
              success: true,
              outUser: resServer.outUser,
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
        } else {
          return {
            success: false,
            message: 'error',
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseEditUser =
    | { success: true; outUser: IUser; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useEditUser = useCallback(
    async (
      editUser: FormData,
      sortBy: string,
      page: number,
    ): Promise<outUseEditUser> => {
      try {
        setLoadingState('loading')
        console.log('hook editUser: ', editUser)
        const config = {
          method: 'PUT',
          url: `${basicUrl.urlAdminUser}/edit`,
          data: editUser,
          // headers
        } as AxiosRequestConfig

        setHeaders('multipart/form-data')
        type UseEditUser =
          | { success: true; outUser: IUser; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<UseEditUser>(config)

        const resServer = response.data
        console.log('User изменен ', resServer)

        if (resServer.forUserId && resServer.forUserId === userId) {
          if (resServer.success && 'outUser' in resServer) {
            // useGetSearch(dataGetSearch)
            useGetUsers(sortBy, page)
            return {
              success: true,
              outUser: resServer.outUser,
              forUserId: resServer.forUserId,
            }
            // useGetCategoryList()
            // setExtendedSelectCategory({} as ICategoryForm)
            // setIsLoading(false)
          } else {
            return {
              success: false,
              message: resServer.message,
              typeError: 'noCatch',
              forUserId: resServer.forUserId,
            }
          }
        } else {
          return {
            success: false,
            message: 'error',
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseDeleteUser =
    | { success: true; outUser: IUser; forUserId: string }
    | {
        success: false
        message: string
        typeError: TypeError
        forUserId: string
      }

  const useDeleteUser = useCallback(
    async (
      user: IUser,
      sortBy: string,
      page: number,
    ): Promise<outUseDeleteUser> => {
      try {
        setLoadingState('loading')

        const config = {
          method: 'DELETE',
          url: `${basicUrl.urlAdminUser}/delete/${user._id}`,
        } as AxiosRequestConfig
        setHeaders('application/json')

        type UseDeleteUser =
          | { success: true; outUser: IUser; forUserId: string }
          | { success: false; message: string; forUserId: string }

        const response = await axiosIC<UseDeleteUser>(config)

        const resServer = response.data
        //    переделать  --- loadingState

        if (resServer.forUserId && resServer.forUserId === userId) {
          if (resServer.success && 'outUser' in resServer) {
            console.log('Юзер удален ', resServer)
            useGetUsers(sortBy, page)
            // useGetSearch(dataGetSearch)
            return {
              success: true,
              outUser: resServer.outUser,
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
        } else {
          return {
            success: false,
            message: 'error',
            typeError: 'noCatch',
            forUserId: resServer.forUserId,
          }
        }
      } catch (error: unknown) {
        const caughtError = catchError(error)
        return caughtError
      } finally {
        setLoadingState('loaded')
      }
    },
    [],
  )

  type outUseGetSearch =
    | { success: true; outUsers: IUser[] }
    | { success: false; message: string; typeError: TypeError }

  const useGetSearch = useCallback(
    async (
      searchString: string,
      sortBy: string,
      page: number,
    ): Promise<outUseGetSearch> => {
      try {
        setLoadingState('loading')
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminUser}/search/?q=${searchString}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        type UseGetSearch =
          | { success: true; outUsers: IUser[]; countUsers: number }
          | { success: false; message: string }

        const response = await axiosIC<UseGetSearch>(config)

        const resServer = response.data
        console.log('Лист пользователей получен ', resServer)

        if (resServer.success) {
          if (resServer.outUsers.length === 0) {
            setUsers([])
            setUsersCount(0)
            setPageCount(0)
            setLoadingState('empty')
            return { success: true, outUsers: [] }
          } else {
            const { outUsers, countUsers } = resServer
            setUsers(outUsers)
            setUsersCount(countUsers)
            const calculatedPageCount = Math.ceil(countUsers / itemPerPage)
            setPageCount(calculatedPageCount)
            setLoadingState('loaded')
            return { success: true, outUsers }
          }
        } else {
          return {
            success: false,
            message: resServer.message,
            typeError: 'noCatch',
          }
        }
      } catch (error: unknown) {
        const caughtError = catchError(error)
        return caughtError
      } finally {
        // setLoadingState('loaded')
      }
    },
    [],
  )

  return {
    useGetUsers,
    useGetSearch,
    useGetVotePostsComments,
    useAddUser,
    useEditUser,
    useDeleteUser,
    users,
    setUsers,
    loadingState,
  }
}
