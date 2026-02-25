import React, { memo } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './SkeletonPostList.module.css'

export const SkeletonPostList: React.FC = memo(() => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div key={`skeleton-${index}`} className={styles.postWrapper}>
      <div className={styles.postContainer}>
        <div
          style={{
            margin: '15px',
            display: 'flex',
            textAlign: 'start',
            alignItems: 'center',
          }}
        >
          <Skeleton circle height={40} width={40} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              height: '60px',
              marginLeft: '7px',
            }}
          >
            <Skeleton height={10} width={30} style={{ margin: '0 10px' }} />
            <div style={{ display: 'flex' }}>
              <Skeleton height={10} width={50} />
              <Skeleton height={10} width={15} style={{ marginLeft: '10px' }} />
            </div>
          </div>
        </div>
        {/* Заголовок */}
        <Skeleton height={15} width="70%" style={{ margin: '15px 0' }} />

        {/* Изображение или контент */}
        <Skeleton height={410} width="93%" style={{ margin: '15px' }} />

        {/* Текст - несколько строк */}
        <Skeleton count={3} width="93%" style={{ margin: '0 15px 8px 15px' }} />

        {/* Нижняя часть - метаданные */}
        <div
          style={{
            width: '93%',
            display: 'flex',
            gap: '15px',
            margin: '15px 20px',
          }}
        >
          <Skeleton circle height={32} width={32} />
          <Skeleton height={10} width={25} />
          <Skeleton circle height={32} width={32} />
          <Skeleton height={10} width={15} />
        </div>
      </div>
    </div>
  ))
})
