import React, { useState, useCallback } from 'react'
import axiosIC from '../../utilita/axiosIC.ts'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { basicUrl, basicColor, production } from '../../utilita/default.ts'
import { IUser } from '../../utilita/modelUser.ts'
import styles from './AdminProfileHeader.module.css'

interface AdminProfileHeaderProps {
  profile: IUser
  loadUserProfile: () => void
}

export const AdminProfileHeader: React.FC<AdminProfileHeaderProps> = ({
  profile,
  loadUserProfile,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const userId = JSON.parse(localStorage.getItem('userData')!).userId
  const { t, i18n } = useTranslation()

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Валидация
    if (!file.type.startsWith('image/')) {
      myToast(t('adminUser.profileHeader.fileIsImage'), basicColor.orange)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      myToast(t('adminUser.profileHeader.fileSize'), basicColor.orange)
      return
    }
    const formData = new FormData()
    formData.append('userId', profile._id)
    formData.append('avatar', file)

    setIsUploading(true)
    try {
      const response = await axiosIC.put<{
        success: boolean
        avatar: string
        message: string
        forUserId: string
      }>(`${basicUrl.urlAdminUser}/change-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const resServer = response.data

      if (resServer.forUserId && resServer.forUserId === userId) {
        if (response.data.success) {
          myToast(t(response.data.message), basicColor.green) // Аватар успешно обновлен
          loadUserProfile() // Перезагружаем профиль
        } else myToast(t(response.data.message), basicColor.red)
      }
    } catch (error: any) {
      // ✅ Проверяем, есть ли ответ от сервера (ошибка 500, 400 и т.д.)
      if (
        error.response?.data?.forUserId &&
        error.response?.data?.forUserId === userId
      ) {
        const errorData = error.response.data
        console.error('Ошибка загрузки аватара:', errorData.message)
        myToast(errorData.message, basicColor.red)
      } else {
        // Сетевая ошибка или другая проблема
        console.error('Сетевая ошибка:', error)
        myToast(t('profilePage.profileHeader.errorEdit'), basicColor.red)
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          <img
            // src={profile.avatar || '/default-avatar.png'}
            //src={`${basicUrl.urlUserFiles}?id=${profile._id}&nameImage=${profile.avatar}`}
            src={
              production
                ? `/uploads/avatars/${profile.avatar}`
                : `${basicUrl.urlUserFiles}?id=${profile._id}&nameImage=${profile.avatar}`
            }
            alt="avatar"
            className={styles.avatarImage}
            loading="lazy"
          />
          <div className={styles.avatarOverlay}>
            <label htmlFor="avatar-upload" className={styles.avatarUploadLabel}>
              {isUploading
                ? t('adminUser.profileHeader.loading')
                : t('adminUser.profileHeader.changeAvatar')}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className={styles.profileIinfo}>
        <h1 className={styles.profileName}>
          {profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : t('adminUser.profileHeader.user')}
        </h1>
        <div className={styles.footerHeader}>
          <p className={styles.profileEmail}>Email: {profile.email}</p>
          <p className={styles.profileJoinDate}>
            {t('adminUser.profileHeader.register')}{' '}
            {new Date(profile.createdAt).toLocaleDateString(i18n.language)}{' '}
            {t('adminUser.profileHeader.year')}
          </p>
        </div>
      </div>
    </div>
  )
}
