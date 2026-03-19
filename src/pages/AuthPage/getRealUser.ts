import axios, { AxiosRequestConfig } from 'axios'
import { basicUrl } from '../../utilita/default.ts'

// проверяет есть ли user с таким email в базе
export const getRealUser = async (emailUser: string): Promise<boolean> => {
  try {
    console.log('emailUser=', emailUser)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlAuth}/real-user`,
      params: { email: emailUser.trim() },
      // headers,
    } as AxiosRequestConfig

    const response = await axios<{ success: boolean }>(config)
    return response.data.success
  } catch (error: unknown) {
    return false
  }
}
