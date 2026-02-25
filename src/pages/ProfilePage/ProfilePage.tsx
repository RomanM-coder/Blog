// pages/ProfilePage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import axiosIC from '../../utilita/axiosIC.ts'
import toast from 'react-hot-toast'
import { ProfileHeader } from '../../components/ProfileHeader/ProfileHeader.tsx'
import { ProfileStats } from '../../components/ProfileStats/ProfileStats.tsx'
import { ProfileInfo } from '../../components/ProfileInfo/ProfileInfo.tsx'
import { useTranslation } from 'react-i18next'
import { basicUrl, basicColor } from '../../utilita/default.ts'
import { IUser } from '../../utilita/modelUser.ts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './ProfilePage.module.css'

export const ProfilePage: React.FC = () => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'error'
  >('loading')
  const [profile, setProfile] = useState<IUser | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { t } = useTranslation()

  const myToast = useCallback((message: string, backgroundColor: string) => {
    toast(message, {
      position: 'top-center',
      style: {
        background: backgroundColor,
      },
      duration: 4000,
    })
  }, [])

  const loadUserProfile = async () => {
    setLoadingState('loading')
    try {
      const response = await axiosIC.get<{
        success: boolean
        userProfile?: IUser
        message?: string
      }>(`${basicUrl.urlUser}/profile`)

      if (response.data.success && response.data.userProfile) {
        setProfile(response.data.userProfile)
        setLoadingState('loaded')
      } else {
        setLoadingState('error')
        // throw new Error(response.data.message || 'Failed to load user profile')
      }
    } catch (error) {
      setLoadingState('error')
      console.error('Ошибка загрузки профиля:', error)
      catchErrors(error, 'get(.../profile)')
    } finally {
    }
  }

  const catchErrors = (error: unknown, name: string) => {
    if (axios.isAxiosError(error)) {
      console.log(name + ':', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message,
      })

      const errorMessage = error.response?.data?.message || 'Unknown error'
      myToast(errorMessage, basicColor.red)
    } else {
      const errorMessage =
        error instanceof Error
          ? `Global error: ${error.message}`
          : `Global error: ${String(error)}`
      myToast(errorMessage, basicColor.red)
    }
  }

  const skeleton = () => {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div
                className={styles.avatarContainer}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Skeleton width={36} height={36} style={{ margin: '0 20px' }} />
                <div className={styles.avatarOverlay}>
                  <div>{t('profilePage.profileHeader.changeAvatar')}</div>
                </div>
              </div>
            </div>

            <div className={styles.profileIinfo}>
              <Skeleton
                height={48}
                style={{ width: 'calc(100% - 80px)', margin: '21.5px 40px' }}
              />
              <div className={styles.footerHeader}>
                <Skeleton
                  height={24}
                  style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
                />
                <Skeleton
                  height={24}
                  style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.profileStats}>
            <div className={styles.statsGrid}>
              {Array.from({ length: 3 }).map((_, index) => {
                return (
                  <div
                    key={`stat-item-skeleton${index}`}
                    className={styles.statItem}
                  >
                    <Skeleton
                      height={28}
                      style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoHeader}>
              <h3 style={{ textAlign: 'center', margin: '18px 0' }}>
                {t('profilePage.profileInfo.infoHeader')}
              </h3>
              <div
                className={styles.btnEdit}
                // style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
              >
                {t('profilePage.profileInfo.edit')}
              </div>
            </div>

            <div className={styles.infoContent}>
              <Skeleton
                height={30}
                style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
              />
              <Skeleton
                height={30}
                style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  type LoadingState = 'loading' | 'loaded' | 'error'

  // Основная функция рендеринга
  const renderProfileUser = () => {
    const content = {
      loading: skeleton(),
      error: (
        <div className={styles.profileError}>{t('profilePage.noProfile')}</div>
      ),
      loaded: profile && (
        <div className={styles.profilePage}>
          <div className={styles.profileContainer}>
            {/* Блок с аватаром и основной информацией */}
            <ProfileHeader
              profile={profile}
              loadUserProfile={loadUserProfile}
            />

            {/* Статистика */}
            <ProfileStats profile={profile} />

            {/* Информация о пользователе */}
            <ProfileInfo
              profile={profile}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              setProfile={setProfile}
            />

            {/* Последние активности */}
            {profile.lastLogin && (
              <p style={{ marginBottom: '15px', padding: '0 50px' }}>
                {t('profilePage.lastVisit')}{' '}
                {new Date(profile.lastLogin).toLocaleDateString()}{' '}
                {new Date(profile.lastLogin).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      ),
    }
    return <div>{content[loadingState as LoadingState] || null}</div>
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  return renderProfileUser()
}
