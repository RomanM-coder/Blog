import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { useTranslation } from 'react-i18next'
// import { UseFormSetValue } from 'react-hook-form'
import { basicUrl } from '../../utilita/default.ts'

const headers = {
  'Content-Type': 'application/json',
  // 'Access-Control-Allow-Origin': '*',
} as RawAxiosRequestHeaders

// interface UseCheckEmailAvailabilityProps {
//   emailToCheck: string
// }

export const useCheckEmailAvailability = () => {
  const { i18n } = useTranslation()

  const checkEmailAvailability = async (emailToCheck: string) => {
    try {
      console.log('emailToCheck=', emailToCheck)

      headers['Accept-Language'] = `${i18n.language}`
      const config = {
        method: 'POST',
        url: `${basicUrl.urlAuth}/check-email`,
        data: { email: emailToCheck.trim() },
        headers,
      } as AxiosRequestConfig

      const result = await axios<{ status: string }>(config)

      return {
        status: result.data.status,
      }
    } catch (error: unknown) {}
  }

  return { checkEmailAvailability }
}
