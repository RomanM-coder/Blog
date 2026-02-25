import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'

interface UseUserUploadFileProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrorsWithReturn: (
    error: unknown,
    name: string
  ) => {
    success: boolean
    message: any
  }
}

interface Inputs {
  email: string
  password: string
  file: File | undefined
}

const headers = {
  'Content-Type': 'multipart/form-data',
  'Access-Control-Allow-Origin': '*',
} as RawAxiosRequestHeaders

// посылает письмо
export const useUserUploadFile = ({
  myToast,
  catchErrorsWithReturn,
}: UseUserUploadFileProps) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()

  const userUploadFile = async (
    authForm: Inputs
  ): Promise<{ success: boolean; message?: string }> => {
    const abortController = new AbortController()

    try {
      const formData = new FormData()
      formData.append('file', authForm.file!)
      formData.append('email', authForm.email)
      formData.append('password', authForm.password)
      headers['Accept-Language'] = `${i18n.language}`

      const config = {
        method: 'POST',
        url: `${basicUrl.urlFile}/upload`,
        data: formData,
        signal: abortController.signal,
        headers,
      } as AxiosRequestConfig

      setIsLoading(true)

      type IUploadResponse = {
        message: string
        success: boolean
        file?: {
          _id?: string
          name?: string
          type?: string
          size?: number
          userId?: string
        }
      }

      const response = await axios<IUploadResponse>(config)

      if (abortController.signal.aborted) {
        return { success: false, message: 'Request aborted' }
      }

      const resServer = response.data
      console.log('File user добавлен: ', response.data)
      if (resServer.success) {
        myToast(t('auth.toast.reg.fileAdd'), basicColor.green)
        return { success: true, message: resServer.message }
      } else if (resServer.message) {
        switch (resServer.message) {
          case 'User not found':
            myToast(t('auth.toast.reg.userNotFound'), basicColor.red)
            break
          case 'File not found':
            myToast(t('auth.toast.reg.fileNotFound'), basicColor.red)
            break
          case 'File already exist':
            myToast(t('auth.toast.reg.fileExists'), basicColor.red)
            break
          default:
            myToast(
              `${t('auth.toast.error')}: ${resServer.message}`,
              basicColor.red
            )
            break
        }
      }
      return { success: false, message: resServer.message }
    } catch (error: unknown) {
      if (abortController.signal.aborted) {
        console.log('Request was aborted')
        return { success: false, message: 'Request aborted' }
      }
      return catchErrorsWithReturn(error, 'userUploadFile')
    } finally {
      setIsLoading(false)
    }
  }

  return { userUploadFile }
}
