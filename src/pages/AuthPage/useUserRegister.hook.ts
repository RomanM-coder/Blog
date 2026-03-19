import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import ReCAPTCHA from 'react-google-recaptcha'
import { useTranslation } from 'react-i18next'

interface UseUserRegisterProps {
  setEmailStatus: React.Dispatch<
    React.SetStateAction<
      'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
    >
  >
  myToast: (message: string, backgroundColor: string) => void
  catchErrorsWithReturn: (
    error: unknown,
    name: string,
  ) => {
    success: boolean
    message: any
  }
  recaptchaRef: React.RefObject<ReCAPTCHA>
}

interface Inputs {
  email: string
  password: string
  captchaToken: string
}

const headers = {
  'Content-Type': 'multipart/form-data',
  //'Access-Control-Allow-Origin': '*',
} as RawAxiosRequestHeaders

// регистрирует user
export const useUserRegister = ({
  setEmailStatus,
  myToast,
  catchErrorsWithReturn,
  recaptchaRef,
}: UseUserRegisterProps) => {
  const { t, i18n } = useTranslation()

  const userRegister = async (
    authForm: Inputs,
  ): Promise<{ success: boolean; message: string }> => {
    const abortController = new AbortController()

    try {
      const formData = new FormData()
      formData.append('email', authForm.email)
      formData.append('password', authForm.password)
      formData.append('captchaToken', authForm.captchaToken)
      console.log('formData=', formData)
      headers['Accept-Language'] = `${i18n.language}`

      const config = {
        method: 'POST',
        url: `${basicUrl.urlAuth}/register`,
        data: formData,
        signal: abortController.signal,
        headers,
      } as AxiosRequestConfig
      console.log('config: ', config)

      setEmailStatus('checking')
      type outAuthReg =
        | { success: true; message: string }
        | { success: false; message: string }

      const response = await axios<outAuthReg>(config)

      if (abortController.signal.aborted) {
        return { success: false, message: 'Request aborted' }
      }

      const resServer = response.data
      console.log('User добавлен: ', response.data)
      if (resServer.success) {
        myToast(t('auth.toast.reg.messageUserCreated'), basicColor.green)
        return { success: true, message: response.data.message }
      } else {
        // ✅ Обрабатываем случай, когда success: false от сервера
        switch (resServer.message) {
          case 'Such a user already exists':
            myToast(t('auth.toast.reg.messageAlreadyExists'), basicColor.red)
            break
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
      return catchErrorsWithReturn(error, 'userRegister')
    } finally {
      recaptchaRef.current?.reset()
    }
  }
  return { userRegister }
}
