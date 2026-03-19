// utils/errorHandler.ts
import { basicColor } from '../utilita/default'
import { toast } from 'react-hot-toast'

export type ApiResult = {
  success: boolean
  message: string
  typeError: 'axiosError' | 'unknown' | 'noCatch'
}

// Базовая функция обработки ошибок
export const handleApiError = (
  result: ApiResult,
  t: (key: string) => string,
): void => {
  if (result.success) return

  // Функция для отображения toast
  const myToast = (message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }

  const errorMessages: Record<string, string> = {
    // Auth
    'Incorrect data during registration':
      'auth.toast.reg.messageDataIncorrectReg',
    'Such a user already exists': 'auth.toast.reg.messageAlreadyExists',
    'Registration failed': 'auth.toast.reg.registrationFailed',
    'File not found': 'auth.toast.reg.fileNotFound',
    'File already exist': 'auth.toast.reg.fileExist',
    'Invalid email format': 'auth.toast.reg.invalidEmailFormat',
    'The user was not found': 'auth.toast.login.messageUserNotFound',
    'Invalid password, try again': 'auth.toast.login.messagePasswordIncorrect',
    'Invalid or expired confirmation link':
      'auth.toast.login.messageLinkIncorrect',
    'Incorrect data to log in to the system':
      'auth.toast.login.messageDataIncorrectLog',

    // Categories
    'The category not found': 'adminCatList.toast.categoryNotFound',

    // Posts
    'Post not found': 'adminPostPage.toast.postNotFound',
    'Posts not found': 'adminPostPage.toast.postsNotFound',
    'User not found': 'adminSinglePost.toast.userNotFound',
    'vote once': 'adminPostPage.toast.voteOnce',
    'RuPost not found': 'adminSinglePost.toast.ruPostNotFound',
    'The user can vote only once': 'adminSinglePost.toast.voteOnce',

    // Comments
    'Comment not found': 'adminSinglePost.toast.commentNotFound',
    'Comments not found': 'adminSinglePost.toast.commentsNotFound',

    // HTTP errors (автоматически определяются из сообщения)
    '401': 'adminLogin.unauthorized',
    '403': 'adminLogin.forbidden',
    '404': 'adminLogin.notFound',
    '500': 'adminLogin.serverError',
  }

  let message = result.message

  // Ищем точное совпадение
  if (errorMessages[message]) {
    message = t(errorMessages[message])
  }
  // Ищем по части сообщения (HTTP коды)
  else {
    for (const [code, key] of Object.entries(errorMessages)) {
      if (message.includes(code) && /^\d{3}$/.test(code)) {
        message = t(key)
        break
      }
    }
  }

  myToast(message, basicColor.red)

  // console.error('API Error:', result);
}
