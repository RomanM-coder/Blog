import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'

interface UseForgetPasswordProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrorsWithReturn: (
    error: unknown,
    name: string,
  ) => {
    success: boolean
    message: any
  }
}

const headers = {
  'Content-Type': 'multipart/form-data',
} as RawAxiosRequestHeaders

// посылает письмо
export const useForgetPassword = ({
  myToast,
  catchErrorsWithReturn,
}: UseForgetPasswordProps) => {
  const { t, i18n } = useTranslation()

  const userForgetPassword = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    const abortController = new AbortController()

    try {
      const formData = new FormData()
      formData.append('email', email)
      console.log('formData=', formData)
      headers['Accept-Language'] = `${i18n.language}`

      const config = {
        method: 'POST',
        url: `${basicUrl.urlAuth}/forget-password`,
        data: formData,
        signal: abortController.signal,
        headers,
      } as AxiosRequestConfig
      console.log('config: ', config)

      // setEmailStatus('checking')
      type outAuthForgetPassword =
        | { success: true; message: string }
        | { success: false; message: string }

      const response = await axios<outAuthForgetPassword>(config)

      if (abortController.signal.aborted) {
        return { success: false, message: 'Request aborted' }
      }

      const resServer = response.data
      console.log('User добавлен: ', response.data)
      if (resServer.success) {
        myToast(t('auth.toast.forget.messageEmailPassword'), basicColor.green)
        return { success: true, message: response.data.message }
      } else {
        // ✅ Обрабатываем случай, когда success: false от сервера
        switch (resServer.message) {
          // case 'Such a user already exists':
          //   myToast(t('auth.toast.reg.messageAlreadyExists'), basicColor.red)
          //   break
          default:
            myToast(
              `${t('auth.toast.error')}: ${resServer.message}`,
              basicColor.red,
            )
            break
        }
        return { success: false, message: resServer.message }
      }
    } catch (error: unknown) {
      if (abortController.signal.aborted) {
        console.log('Request was aborted')
        return { success: false, message: 'Request aborted' }
      }
      return catchErrorsWithReturn(error, 'userForgetPassword')
    } finally {
    }
  }
  return { userForgetPassword }
}
