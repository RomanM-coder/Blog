// components/ProfileStats.tsx
import React from 'react'
import { IUser } from '../../utilita/modelUser.ts'
import styles from './ProfileStats.module.css'

interface ProfileStatsProps {
  profile: IUser
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const statItem = [
    { count: profile.postsPublishedId.length, desc: 'Публикаций' },
    { count: profile.commentsCount, desc: 'Комментариев' },
    {
      count: profile.votecomment.length + profile.votepost.length,
      desc: 'Лайков',
    },
  ]

  return (
    <div className={styles.profileStats}>
      <div className={styles.statsGrid}>
        {statItem.map((item, index) => {
          return (
            <div
              key={`stat-item${index}`}
              className={
                styles.statItem +
                ' ' +
                (index % 2 === 0 ? styles.bg1 : styles.bg2)
              }
            >
              <div className={styles.statNumber}>{item.count}</div>
              <div className={styles.statLabel}>{item.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
