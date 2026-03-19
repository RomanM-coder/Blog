import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './EmailStatusIndicator.module.css'

interface EmailStatusIndicatorProps {
  status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'
}

export const EmailStatusIndicator: React.FC<EmailStatusIndicatorProps> = ({
  status,
}) => {
  const { t } = useTranslation()
  const statusConfig = {
    idle: null, // ничего не показываем
    checking: {
      icon: '⏳',
      text: t('auth.Form.checking'),
      className: 'checking',
    },
    available: {
      icon: '✅',
      text: t('auth.Form.available'),
      className: 'available',
    },
    taken: {
      icon: '❌',
      text: t('auth.Form.taken'),
      className: 'taken',
    },
    invalid: {
      icon: '⚠️',
      text: t('auth.Form.invalid'),
      className: 'invalid',
    },
    error: {
      icon: '🔥',
      text: t('auth.Form.error'),
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
