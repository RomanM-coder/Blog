import axios, { AxiosRequestConfig } from 'axios'
import { basicColor, basicUrl } from '../../utilita/default.ts'
import { useGlobalState } from '../../useGlobalState.ts'
import { useTranslation } from 'react-i18next'

interface UseHandleConfirmProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
}

// посылает письмо
export const useHandleConfirm = ({
  myToast,
  catchErrors,
}: UseHandleConfirmProps) => {
  const [, setIsLoading] = useGlobalState('isLoading')
  const { t, i18n } = useTranslation()

  const handleConfirm = async (
    event: React.MouseEvent<HTMLButtonElement>,
    email: string,
  ) => {
    event.preventDefault()
    setIsLoading(true)

    const handleConfirmHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Language': i18n.language,
    }

    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/confirmEmail`,
      data: { email: email },
      headers: handleConfirmHeaders,
    } as AxiosRequestConfig
    console.log('handleConfirm config ', config)

    try {
      const response = await axios<{ success: boolean; message: string }>(
        config,
      )

      console.log('Письмо: ', response.data)
      const { success, message } = response.data
      if (success) {
        myToast(t('auth.toast.login.messageEmailToken'), basicColor.green)
      } else {
        switch (message) {
          case 'The user was not found':
            myToast(t('auth.toast.login.messageUserNotFound'), basicColor.red)
            break
          default:
            myToast(`${t('postPage.toast.error')}, ${message}`, basicColor.red)
        }
      }
    } catch (error) {
      catchErrors(error, 'handleConfirm')
      console.log('❌ handleConfirm ошибка:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleConfirm }
}
