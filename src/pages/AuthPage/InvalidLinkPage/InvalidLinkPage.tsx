import { useTranslation } from 'react-i18next'
import styles from './InvalidLinkPage.module.css'

export const InvalidLinkPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.pageContent}>
          <p className={styles.pageMessage}>
            {t('invalidLinkPage.errorInvalidLink')}
          </p>
        </div>
      </div>
    </>
  )
}
