import axios, { AxiosRequestConfig } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface UseResetPasswordByTokenProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
  token: string | undefined
}

// показывает форму (для ввода нового пароля) по токену из письма
export const useResetPasswordByToken = ({
  myToast,
  catchErrors,
  token,
}: UseResetPasswordByTokenProps) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const resetPasswordByToken = async () => {
    console.log('-------reset-passwordByToken----------')
    setIsLoading(true)

    const resetByTokenHeaders = {
      'Content-Type': 'application/json',
      'Accept-Language': i18n.language,
    }

    const config = {
      method: 'GET',
      url: `${basicUrl.urlAuth}/reset-password/${token}`,
      headers: resetByTokenHeaders,
    } as AxiosRequestConfig
    console.log('forget-passwordByToken config ', config)
    try {
      const response = await axios<{
        success: boolean
        message: string
      }>(config)
      console.log('✅ reset-passwordByToken успех:', response.data)

      const { success, message } = response.data
      if (success) {
        myToast(
          t('auth.resetForm.toast.messageInputNewPassword'),
          basicColor.green,
        )
      } else {
        switch (message) {
          case 'Token is required':
            myToast(
              t('auth.resetForm.toast.messageTokenRequired'),
              basicColor.red,
            )
            break
          case 'Invalid token format':
            myToast(
              t('auth.resetForm.toast.messageInvalidTokenFormat'),
              basicColor.red,
            )
            break
          case 'The user was not found':
            myToast(
              t('auth.resetForm.toast.messageLinkIncorrect'),
              basicColor.red,
            )
            break
          case 'Invalid or expired confirmation link':
            myToast(
              t('auth.resetForm.toast.messageUserNotFound'),
              basicColor.red,
            )
            break
          case 'Reset link has expired':
            myToast(
              t('auth.resetForm.toast.messageLinkExpired'),
              basicColor.red,
            )
            break
          default:
            myToast(`${t('postPage.toast.error')}, ${message}`, basicColor.red)
        }
      }
    } catch (error) {
      // const err = `Ошибка статус ${error.response.status}, ${JSON.stringify(
      //   error.response.data.message
      // )}`
      console.log('❌ forget-passwordByToken ошибка:', error)
      catchErrors(error, 'forget-passwordByToken')

      navigate('/auth/invalidpage')
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPasswordByToken }
}
