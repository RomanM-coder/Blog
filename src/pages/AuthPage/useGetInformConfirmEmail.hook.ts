import axios, { AxiosRequestConfig } from 'axios'
import { basicUrl } from '../../utilita/default.ts'
import { useTranslation } from 'react-i18next'

interface UseGetConfirmProps {
  myToast: (message: string, backgroundColor: string) => void
  catchErrors: (error: unknown, name: string) => void
  checkedEmail: string
  setIsEmailConfirmed: (value: React.SetStateAction<boolean>) => void
  setCheckedEmail: (value: React.SetStateAction<string>) => void
  noUserConfirmTimerRef: React.MutableRefObject<NodeJS.Timeout | null>
  setIsRealUser: React.Dispatch<React.SetStateAction<boolean>>
}

export const useGetInformConfirmEmail = ({
  checkedEmail,
  setIsEmailConfirmed,
  setCheckedEmail,
  noUserConfirmTimerRef,
  setIsRealUser,
}: UseGetConfirmProps) => {
  const { i18n } = useTranslation()

  const getInformConfirmEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      console.log('🟡 getInformConfirmEmail: пропущен - пустой email')
      return
    }
    // ✅ Не проверяем повторно тот же email
    if (email === checkedEmail) return

    // Очищаем предыдущий таймер
    if (noUserConfirmTimerRef.current) {
      clearTimeout(noUserConfirmTimerRef.current)
      noUserConfirmTimerRef.current = null
    }

    const getConfirmHeaders = {
      'Content-Type': 'application/json',
      'Accept-Language': i18n.language,
    }

    console.log('🔍 getInformConfirmEmail запрос:', {
      email: email,
      url: `${basicUrl.urlAuth}/informConfirmEmail`,
      headers: getConfirmHeaders,
    })
    const config = {
      method: 'POST',
      url: `${basicUrl.urlAuth}/informConfirmEmail`,
      data: { email: email },
      headers: getConfirmHeaders,
    } as AxiosRequestConfig
    try {
      const response = await axios<{
        success: boolean
        confirm: boolean
        message?: string
      }>(config)

      console.log('✅ getInformConfirmEmail успех:', response.data)

      const { success, confirm, message } = response.data
      if (success) {
        setIsEmailConfirmed(confirm)
        setIsRealUser(true)
        setCheckedEmail(email)
      } else {
        switch (message) {
          case 'Invalid email format':
            // myToast(t('auth.toast.reg.invalidEmailFormat'), basicColor.red)
            setIsEmailConfirmed(false)
            setIsRealUser(false)
            setCheckedEmail(email)
            break
          case 'User not found':
            if (!noUserConfirmTimerRef.current) {
              noUserConfirmTimerRef.current = setTimeout(() => {
                // myToast(
                //   t('auth.toast.login.messageUserNotFound'),
                //   basicColor.red,
                // )
                noUserConfirmTimerRef.current = null // Сбрасываем после выполнения
              }, 700)
            }
            setIsEmailConfirmed(false)
            setIsRealUser(false)
            setCheckedEmail(email)
            break
          default:
            // myToast(`${t('postPage.toast.error')}, ${message}`, basicColor.red)
            setIsEmailConfirmed(false)
            setIsRealUser(false)
            setCheckedEmail(email)
        }
      }
    } catch (error) {
      console.log('❌ getInformConfirmEmail ошибка:', error)

      // catchErrors(error, 'getInformConfirmEmail')
      setIsEmailConfirmed(false)
      setCheckedEmail('')
    } finally {
    }
  }

  return { getInformConfirmEmail }
}
