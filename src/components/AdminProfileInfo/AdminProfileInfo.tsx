// components/AdminProfileInfo.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IUser } from '../../utilita/modelUser.ts'
import styles from './AdminProfileInfo.module.css'

interface AdminProfileInfoProps {
  profile: IUser
}

export const AdminProfileInfo: React.FC<AdminProfileInfoProps> = ({
  profile,
}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.profileInfo}>
      <div className={styles.infoHeader}>
        <h3>{t('adminUser.profileInfo.infoHeader')}</h3>
      </div>

      <div className={styles.infoContent}>
        {profile.firstName || profile.lastName ? (
          <div className={styles.infoItem}>
            <div className={styles.bg2}>
              <strong className={styles.strongField}>
                {t('adminUser.profileInfo.name')}
              </strong>
              <p className={styles.field}>
                {profile.firstName} {profile.lastName}
              </p>
            </div>
          </div>
        ) : (
          <p className={styles.noInfo}>
            {t('adminUser.profileInfo.noInformation')}
          </p>
        )}

        {profile.bio ? (
          <div className={styles.infoItem}>
            <div className={styles.bg1}>
              <strong className={styles.strongField}>
                {t('adminUser.profileInfo.bio')}
              </strong>
              <p className={styles.field}> {profile.bio}</p>
            </div>{' '}
          </div>
        ) : (
          <p className={styles.noInfo}>
            {t('adminUser.profileInfo.noInformation')}
          </p>
        )}
      </div>
    </div>
  )
}
