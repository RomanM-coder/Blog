// components/AdminRoute.tsx
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  // const { userId } = useAuth()
  // 1. Получаем информацию о пользователе из контекста
  // const { userId } = useAuth(); // Ваш хук для получения данных пользователя

  // 2. Отладка
  console.log('🔐 AdminRoute проверка:', {
    userId: auth.userId,
    role: auth.role,
    tokenExists: !!auth.token,
    isAdmin: auth.role === 'admin',
  })

  // 3. Если пользователь не админ — перенаправляем на главную
  // ВСЕ ПРОВЕРКИ ПРАВ ДОЛЖНЫ ДУБЛИРОВАТЬСЯ НА СЕРВЕРЕ!
  // 4. Проверяем по РОЛИ из контекста
  if (!auth.userId || auth.role !== 'admin') {
    console.warn('❌ Отказ в достуке. userId:', auth.userId, 'role:', auth.role)
    return <Navigate to="/" replace />
  }

  // 5. Если пользователь админ — показываем запрашиваемый компонент
  console.log('✅ Доступ к админке разрешен для', auth.userId)
  return children
}

export default AdminRoute
