import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { UseFormSetValue } from 'react-hook-form'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'
import ReCAPTCHA from 'react-google-recaptcha'

interface UseUserLoginProps {
  setEmailStatus: React.Dispatch<
    React.SetStateAction<
      'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
    >
  >
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
  setValue: UseFormSetValue<Inputs>
  auth: {
    token: string | null
    userId: string | null
    role: string | null
    login: (_token: string, _userId: string, _role: string) => void
    logout: () => void
  }
  recaptchaRef: React.RefObject<ReCAPTCHA>
}

interface Inputs {
  email: string
  password: string
  captchaToken: string
  // file: File | undefined
}

const headers = {
  'Content-Type': 'multipart/form-data',
  // 'Access-Control-Allow-Origin': '*',
} as RawAxiosRequestHeaders

// посылает письмо
export const useUserLogin = ({
  setEmailStatus,
  myToast,
  catchErrors,
  setValue,
  auth,
  recaptchaRef,
}: UseUserLoginProps) => {
  // const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()

  const userLogin = async (authForm: Inputs): Promise<{ success: boolean }> => {
    const abortController = new AbortController()
    try {
      // reset()
      console.log('email=', authForm.email)

      setEmailStatus('checking')
      headers['Accept-Language'] = `${i18n.language}`
      const config = {
        method: 'POST',
        url: `${basicUrl.urlAuth}/login`,
        data: {
          email: authForm.email,
          password: authForm.password,
          captchaToken: authForm.captchaToken,
        },
        signal: abortController.signal,
        headers,
      } as AxiosRequestConfig

      type outAuthLogin =
        | { success: true; token: string; userId: string; role: string }
        | { success: false; message: string }

      const response = await axios<outAuthLogin>(config)

      if (abortController.signal.aborted) {
        return { success: false }
      }
      const resServer = response.data
      if (resServer.success) {
        if (resServer.token && resServer.userId && resServer.role) {
          auth.login(resServer.token, resServer.userId, resServer.role)
          console.log('User залогинен: ', response.data)
          setEmailStatus('idle')
          myToast(t('auth.toast.login.userLogin'), basicColor.blue)
          // setIsLoading(false) - появляются ложные красные myToast
          return { success: true }
        }
        return { success: true }
      } else {
        // ✅ Обрабатываем случай, когда success: false от сервера
        setEmailStatus('error')
        switch (resServer.message) {
          case 'Incorrect data to log in to the system':
            myToast(
              t('auth.toast.login.messageDataIncorrectLog'),
              basicColor.red,
            )
            break
          // case 'The user was not found':
          //   myToast(t('auth.toast.login.messageUserNotFound'), basicColor.red)
          //   break
          // case 'Invalid password, try again':
          //   myToast(
          //     t('auth.toast.login.messagePasswordIncorrect'),
          //     basicColor.red,
          //   )
          //   break
          default:
            myToast(
              `${t('auth.toast.error')}: ${resServer.message}`,
              basicColor.red,
            )
            break
        }
        return { success: false }
      }
    } catch (error: unknown) {
      if (abortController.signal.aborted) {
        console.log('Request was aborted')
        return { success: false }
      }
      setEmailStatus('error')

      catchErrors(error, 'onSubmitAuth')
      setValue('email', '')
      setValue('password', '')
    } finally {
      // убрано : появляются ложные красные myToast
      recaptchaRef.current?.reset()
    }
    return { success: false }
  }
  return { userLogin }
}
