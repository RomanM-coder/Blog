// utils/catchError.ts
import axios from 'axios'

type outCatchError = {
  success: false
  message: string
  typeError: 'axiosError' | 'unknown'
  forUserId: string
}

export const catchError = (error: unknown): outCatchError => {
  const userId: string = JSON.parse(localStorage.getItem('userData')!)
    .userId as string | ''

  if (axios.isAxiosError(error)) {
    console.log('📨 Axios error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message,
    })

    const errorMessage = error.response?.data?.message || 'Unknown error'
    return {
      success: false,
      message: errorMessage,
      typeError: 'axiosError',
      forUserId: userId,
    }
  } else {
    return {
      success: false,
      message: 'Global error: ' + String(error),
      typeError: 'unknown',
      forUserId: userId,
    }
  }
}
