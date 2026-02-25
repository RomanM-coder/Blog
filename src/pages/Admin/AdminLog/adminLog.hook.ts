import { useCallback, useState } from 'react'
import { catchError } from '../../../utilita/catchError.ts'
import { IAdminLog } from '../../../utilita/modelAdminLog'
import { AxiosRequestConfig } from 'axios'
import axiosIC from '../../../utilita/axiosIC.ts'
import { basicUrl } from '../../../utilita/default.ts'

type TypeError = 'axiosError' | 'unknown' | 'noCatch'

export const useAdminLog = (
  setAdminLogsCount: (resServer: number) => void,
  setPageCount: React.Dispatch<React.SetStateAction<number>>,
  itemPerPage: number,
) => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [adminLogs, setAdminLogs] = useState<IAdminLog[]>([])

  type outUseGetAdminLogs =
    | { success: true; outAdminlogs: IAdminLog[] }
    | { success: false; message: string; typeError: TypeError }

  const useGetAdminLogs = useCallback(
    async (sortBy: string, page: number): Promise<outUseGetAdminLogs> => {
      try {
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminLog}/?sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        type GetAdminLogs =
          | { success: true; outAdminLogs: IAdminLog[]; countAdminLogs: number }
          | { success: false; message: string }

        const response = await axiosIC<GetAdminLogs>(config)

        const resServer = response.data
        console.log('Лист логов получен ', resServer)

        if (resServer.success) {
          if (
            'outAdminLogs' in resServer &&
            resServer.outAdminLogs.length !== 0
          ) {
            const { outAdminLogs, countAdminLogs } = resServer
            setAdminLogs(outAdminLogs)
            setAdminLogsCount(countAdminLogs)
            const calculatedPageCount = Math.ceil(countAdminLogs / itemPerPage)
            setPageCount(calculatedPageCount)
            setLoadingState('loaded')
            return { success: true, outAdminlogs: outAdminLogs }
          } else {
            setAdminLogs([])
            setAdminLogsCount(0)
            setPageCount(0)
            setLoadingState('empty')
            return { success: true, outAdminlogs: [] }
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

  type outUseAdminLogsGetSearch =
    | { success: true; outAdminLogs: IAdminLog[] }
    | { success: false; message: string; typeError: TypeError }

  const useAdminLogsGetSearch = useCallback(
    async (
      searchString: string,
      sortBy: string,
      page: number,
    ): Promise<outUseAdminLogsGetSearch> => {
      try {
        const config = {
          method: 'GET',
          url: `${basicUrl.urlAdminLog}/search/?q=${searchString}&sortBy=${sortBy}&page=${page}&limit=${itemPerPage}`,
          // headers: headers
        } as AxiosRequestConfig

        type UseGetSearch =
          | { success: true; outAdminLogs: IAdminLog[]; countAdminLogs: number }
          | { success: false; message: string }

        const response = await axiosIC<UseGetSearch>(config)

        const resServer = response.data
        console.log('Лист логов получен ', resServer)

        if (resServer.success) {
          if (resServer.outAdminLogs.length === 0) {
            setAdminLogs([])
            setAdminLogsCount(0)
            setPageCount(0)
            setLoadingState('empty')
            return { success: true, outAdminLogs: [] }
          } else {
            const { outAdminLogs, countAdminLogs } = resServer
            setAdminLogs(outAdminLogs)
            setAdminLogsCount(countAdminLogs)
            const calculatedPageCount = Math.ceil(countAdminLogs / itemPerPage)
            setPageCount(calculatedPageCount)
            setLoadingState('loaded')
            return { success: true, outAdminLogs }
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
    useGetAdminLogs,
    useAdminLogsGetSearch,
    adminLogs,
    setAdminLogs,
    loadingState,
  }
}
