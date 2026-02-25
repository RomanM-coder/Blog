import { useState, useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import { useGlobalState } from '../../useGlobalState'
import { basicUrl } from '../../utilita/default.ts'

interface userData {
  token: string
  userId: string
  role: string
}

export const useAuth = () => {
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated')
  const [, setIsAdmin] = useGlobalState('isAdmin')
  const [, setIsLoading] = useGlobalState('isLoading')
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const validateTokenRef = useRef(true)

  const login = useCallback(
    (jwtToken: string, id: string, userRole: string) => {
      // ✅ Добавляем базовую проверку токена
      if (!isValidToken(jwtToken)) {
        console.warn('Invalid token provided to login')
        logout() // Очищаем невалидные данные
        return
      }
      console.log('start')

      setToken(jwtToken)
      setUserId(id)
      setIsAuthenticated(true)
      setIsAdmin(userRole === 'admin')
      setRole(userRole)
      console.log('jwtToken', jwtToken)

      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: id,
          token: jwtToken,
          role: userRole,
        }),
      )
      recordLoginDate(jwtToken)
      setIsLoading(false)
      setReady(true)
      console.log('end')
    },
    [setIsAuthenticated, setIsAdmin],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    localStorage.removeItem('userData')
    // window.location.href = '/'
  }, [setIsAuthenticated, setIsAdmin])

  const recordLoginDate = useCallback(async (jwtToken: string) => {
    try {
      const response = await axios.put(
        `${basicUrl.urlAuth}/record-login-date`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      // Проверяем ответ
      if (response.data.success === true) {
        console.log('record-login-date update success')
      } else {
        console.log('record-login-date no update')
      }
    } catch (validationError) {
      console.log('record-login-date error')
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      if (validateTokenRef.current) {
        validateTokenRef.current = false
        const userDataStr = localStorage.getItem('userData')
        if (userDataStr) {
          try {
            const data: userData = JSON.parse(userDataStr)

            // ✅ Проверяем наличие обязательных полей
            if (!data?.token || !data.userId || !data.role) {
              console.warn('Invalid user data in localStorage')
              logout()
              return
            }

            // ✅ Дополнительная проверка формата токена
            if (!isValidToken(data.token)) {
              console.warn('Stored token is invalid, logging out')
              logout()
              return
            }

            try {
              // ✅ вызов validate-token с authMiddleware
              const response = await axios.get(
                `${basicUrl.urlAuth}/validate-token`,
                {
                  headers: {
                    Authorization: `Bearer ${data.token}`,
                    'Content-Type': 'application/json',
                  },
                },
              )

              // Если дошли сюда - токен валиден (authMiddleware пропустил)
              if (response.data.valid === true) {
                console.log('Token is valid, auto-login')
                login(data.token, data.userId, data.role)
              } else {
                console.log('Token returned valid: false, clearing storage')
                logout()
              }
            } catch (validationError) {
              if (axios.isAxiosError(validationError)) {
                if (validationError.response?.status === 401) {
                  console.log(
                    'Token is invalid or expired (401), clearing storage',
                  )
                  logout()
                } else {
                  console.log(
                    'Network error during token validation:',
                    validationError.message,
                  )
                  // При сетевой ошибке можно оставить как есть или разлогинить
                  // Для безопасности лучше разлогинить:
                  logout()
                }
              } else {
                console.log('Unexpected error during token validation')
                logout()
              }
            }
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error)
            logout()
          } finally {
            setReady(true)
          }
        }
      }
    }
    initializeAuth()
  }, [login, logout])

  // Функция для базовой проверки токена
  const isValidToken = (token: string): boolean => {
    if (!token || typeof token !== 'string') return false

    // Проверяем базовую структуру JWT (3 части разделенные точками)
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Проверяем, что это не пустой или слишком короткий токен
    if (token.length < 20) return false

    return true
  }

  return { login, logout, token, userId, role, ready }
}
