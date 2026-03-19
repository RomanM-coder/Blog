import axios, { AxiosRequestConfig } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface ResetPasswordApiInputs {
  token: string | undefined
  email: string
  newPassword: string
}

interface UseResetPasswordProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
}

// отправляет форму с новым паролем и токеном из письма
export const useResetPassword = ({
  myToast,
  catchErrors,
}: UseResetPasswordProps) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const resetPassword = async (resetForm: ResetPasswordApiInputs) => {
    setIsLoading(true)

    const confirmByTokenHeaders = {
      'Content-Type': 'application/json',
      'Accept-Language': i18n.language,
    }
    const formData = new FormData()
    formData.append('token', resetForm.token!)
    formData.append('email', resetForm.email)
    formData.append('newPassword', resetForm.newPassword)
    console.log('formData=', formData)

    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/reset-password`,
      data: formData,
      headers: confirmByTokenHeaders,
    } as AxiosRequestConfig
    console.log('reset-password config ', config)
    try {
      const response = await axios<{
        success: boolean
        message: string
      }>(config)
      console.log('✅ reset-password успех:', response.data)

      const { success, message } = response.data
      if (success) {
        myToast(
          t('auth.resetForm.toast.messageInputNewPassword'),
          basicColor.green,
        )
        navigate('/auth')
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
          case 'New password is required':
            myToast(
              t('auth.resetForm.toast.messageNewPasswordRequired'),
              basicColor.red,
            )
            break
          case 'New password must be a string':
            myToast(
              t('auth.resetForm.toast.messageNewPasswordIsString'),
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
      console.log('❌ reset-password ошибка:', error)
      catchErrors(error, 'reset-password')
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPassword }
}
