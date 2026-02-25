import { useTranslation } from 'react-i18next'
import styles from './Footer.module.css'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  return (
    <footer className={styles.footer}>
      <span className={styles.footer_span}>
        {t('footer.title')} - {t('footer.current_date', { date: new Date() })}
      </span>
    </footer>
  )
}
