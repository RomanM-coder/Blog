import React from 'react'
import styles from './EmailStatusIndicator.module.css'

interface EmailStatusIndicatorProps {
  status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
}

export const EmailStatusIndicator: React.FC<EmailStatusIndicatorProps> = ({
  status,
}) => {
  const statusConfig = {
    idle: null, // ничего не показываем
    checking: {
      icon: '⏳',
      text: 'Проверка email...',
      className: 'checking',
    },
    available: {
      icon: '✅',
      text: 'Email свободен',
      className: 'available',
    },
    taken: {
      icon: '❌',
      text: 'Email уже занят',
      className: 'taken',
    },
    invalid: {
      icon: '⚠️',
      text: 'Некорректный формат email',
      className: 'invalid',
    },
    error: {
      icon: '🔥',
      text: 'Ошибка проверки',
      className: 'error',
    },
  }

  const config = statusConfig[status]
  if (!config) return null

  return (
    <div className={`${styles.emailStatus} ${styles[config.className]}`}>
      <span className={styles.icon}>{config.icon}</span>
      <span className={styles.text}>{config.text}</span>
    </div>
  )
}
