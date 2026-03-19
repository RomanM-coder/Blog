import axios, { AxiosRequestConfig } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UseFormSetValue } from 'react-hook-form'

interface Inputs {
  email: string
  password: string
  captchaToken: string
}

interface UseConfirmByTokenProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
  setIsEmailConfirmed: React.Dispatch<React.SetStateAction<boolean>>
  token: string | undefined
  setValue: UseFormSetValue<Inputs>
}

// записывает в базу users поле confirmed=true по токену из письма
export const useConfirmByToken = ({
  myToast,
  catchErrors,
  setIsEmailConfirmed,
  token,
  setValue,
}: UseConfirmByTokenProps) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const confirmByToken = async () => {
    setIsLoading(true)

    const confirmByTokenHeaders = {
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin': '*',
      'Accept-Language': i18n.language,
    }

    const config = {
      method: 'GET',
      url: `${basicUrl.urlAuth}/confirm-email/${token}`,
      headers: confirmByTokenHeaders,
    } as AxiosRequestConfig
    console.log('confirmByToken config ', config)
    try {
      const response = await axios<{
        success: boolean
        message: string
        email?: string
      }>(config)
      console.log('✅ confirmByToken успех:', response.data)

      const { success, message, email } = response.data
      if (success) {
        myToast(t('auth.toast.login.messageEmailConfirm'), basicColor.green)
        setIsEmailConfirmed(true)
        setValue('email', email!, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else {
        switch (message) {
          case 'Token is required':
            myToast(t('auth.toast.login.messageTokenRequired'), basicColor.red)
            break
          case 'Invalid token format':
            myToast(
              t('auth.toast.login.messageInvalidTokenFormat'),
              basicColor.red,
            )
            break
          case 'The user was not found':
            myToast(t('auth.toast.login.messageLinkIncorrect'), basicColor.red)
            break
          case 'Invalid or expired confirmation link':
            myToast(t('auth.toast.login.messageUserNotFound'), basicColor.red)
            break
          case 'Confirmation link has expired':
            myToast(t('auth.toast.login.messageLinkExpired'), basicColor.red)
            break
          default:
            myToast(`${t('postPage.toast.error')}, ${message}`, basicColor.red)
        }
      }
    } catch (error) {
      // const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(
      //   error.response.data.message
      // )}`
      console.log('❌ confirmByToken ошибка:', error)
      catchErrors(error, 'confirmByToken')

      navigate('/auth/invalidpage')
    } finally {
      setIsLoading(false)
    }
  }

  return { confirmByToken }
}
