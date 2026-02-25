import axios, { AxiosRequestConfig } from 'axios'
import { basicUrl } from '../../utilita/default.ts'

// const headers = {
//   'Content-Type': 'application/json',
//   // 'Access-Control-Allow-Origin': '*',
// } as RawAxiosRequestHeaders

interface CheckRealUserProps {
  emailUser: string
  setIsRealUser: React.Dispatch<React.SetStateAction<boolean>>
}

export const checkRealUser = async ({
  emailUser,
  setIsRealUser,
}: CheckRealUserProps) => {
  try {
    console.log('emailUser=', emailUser)
    const config = {
      method: 'GET',
      url: `${basicUrl.urlAuth}/check-user`,
      data: { email: emailUser.trim() },
      // headers,
    } as AxiosRequestConfig

    const result = await axios<{ success: boolean }>(config)

    if (result.data.success) setIsRealUser(true)
    else setIsRealUser(false)
  } catch (error: unknown) {}
}
