import React, { useState, useEffect, useCallback } from 'react'
import { useGlobalState } from '../../../useGlobalState.ts'
import axios from 'axios'
import axiosIC from '../../../utilita/axiosIC.ts'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AdminProfileHeader } from '../../../components/AdminProfileHeader/AdminProfileHeader.tsx'
import { ProfileStats } from '../../../components/ProfileStats/ProfileStats.tsx'
import { AdminProfileInfo } from '../../../components/AdminProfileInfo/AdminProfileInfo.tsx'
import { useTranslation } from 'react-i18next'
import { basicUrl, basicColor } from '../../../utilita/default.ts'
import { IUser } from '../../../utilita/modelUser.ts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './AdminProfileUser.module.css'

export const AdminProfileUser: React.FC = () => {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'empty' | 'error'
  >('loading')
  const [, setActivePage] = useGlobalState('activePage')
  const [profile, setProfile] = useState<IUser | null>(null)
  const userId = useParams().id!
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

  const loadUserProfile = async (userId: string) => {
    if (!userId) return
    setLoadingState('loading')
    try {
      const response = await axiosIC.get<{
        success: boolean
        outUser?: IUser
        message?: string
      }>(`${basicUrl.urlAdminUser}/${userId}`)

      if (response.data.success && response.data.outUser) {
        console.log('outUser=', response.data.outUser)

        setProfile(response.data.outUser)
        setLoadingState('loaded')
      } else {
        setLoadingState('empty')
        setProfile(null)
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
                  <div>{t('adminUser.profileHeader.changeAvatar')}</div>
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
                    // className={styles.statItem}
                    style={{
                      padding: '0px 40px',
                      // width: '100%',
                      // boxSizing: 'border-box',
                    }}
                  >
                    <Skeleton
                      height={28}
                      // style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
                      // width="100%"
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoHeader}>
              <h3 style={{ textAlign: 'center', margin: '18px 0' }}>
                {t('adminUser.profileInfo.infoHeader')}
              </h3>
            </div>

            <div className={styles.infoContent}>
              <Skeleton
                height={22}
                style={{ width: 'calc(100% - 80px)', margin: '0 40px' }}
              />
              <Skeleton
                height={22}
                style={{
                  width: 'calc(100% - 80px)',
                  margin: '0 40px',
                }}
              />
            </div>
          </div>
          <Skeleton
            height={22}
            style={{ width: 'calc(100% - 80px)', margin: '0 40px 15px 40px' }}
          />
        </div>
      </div>
    )
  }

  const userEmpty = () => (
    <div className={styles.profileUser}>{t('adminUser.noProfile')}</div>
  )

  const userError = () => (
    <div className={styles.profileUser}>{t('adminUser.error')}</div>
  )

  type LoadingState = 'loading' | 'empty' | 'error' | 'loaded'

  // Основная функция рендеринга
  const renderContentProfileUser = () => {
    const content = {
      loading: skeleton(),
      empty: userEmpty(),
      error: userError(),
      loaded: profile && (
        <div className={styles.profilePage}>
          <div className={styles.profileContainer}>
            {/* Блок с аватаром и основной информацией */}
            <AdminProfileHeader
              profile={profile}
              loadUserProfile={() => loadUserProfile(userId)}
            />

            {/* Статистика */}
            <ProfileStats profile={profile} />

            {/* Информация о пользователе */}
            <AdminProfileInfo profile={profile} />

            {/* Последние активности */}
            {profile.lastLogin && (
              <p style={{ marginBottom: '15px', padding: '0 50px' }}>
                {t('adminUser.lastVisit')}{' '}
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
    loadUserProfile(userId)
    setActivePage(4) // вообще-то это не users,а user
  }, [])

  return renderContentProfileUser()
}
