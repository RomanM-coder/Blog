import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './PostPublication.module.css'

export const PostPublication: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.publicationWrapper}>
      <h2>{t('postPublication.header')}</h2>

      {/* <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form> */}
    </div>
  )
}
