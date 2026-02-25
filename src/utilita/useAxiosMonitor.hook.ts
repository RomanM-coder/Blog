// hooks/useAxiosMonitor.ts
import { useEffect } from 'react'
import axios from 'axios'

export const useAxiosMonitor = () => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.log('🔐 Client: Received 401 from:', error.config?.url)
          console.log(
            '🔐 Client: Error message:',
            error.response?.data?.message
          )
          console.log('🔐 Client: Full error:', error.response?.data)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])
}
