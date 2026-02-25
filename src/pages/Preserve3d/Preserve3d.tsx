import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Preserve3d.module.css'

export const Preserve3d: React.FC = () => {
  const [isRotated, setIsRotated] = useState(false)
  const { t } = useTranslation()

  return (
    <div className={styles.preserve}>
      <div
        className={`${styles.hoverRotate} ${isRotated ? styles.rotated : ''}`}
        onMouseEnter={() => setIsRotated(true)}
      >
        <p
          style={{
            width: '50%',
            margin: '0 auto',
            fontSize: '100px',
            textTransform: 'uppercase',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {t('preserve3d.title')}
        </p>
      </div>
    </div>
  )
}
