import { motion } from 'framer-motion'
import { NavLink } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'
import TranslateIcon from '@mui/icons-material/Translate'
import styles from './HeaderLanding.module.css'

export const HeaderLanding = () => {

  const { t, i18n } = useTranslation()

  return (
    <div className={styles.Header_headerWrapper}>
      <div className={styles.Header_header}>
        <div className={styles.Header_left}>
          <motion.li
            className={styles.elemMainMenu}                 
            whileTap={{ scale: 0.96 }}
          >
            <NavLink to={'/page1'}>{t('menuland.page1')}</NavLink>
          </motion.li>
          <motion.li
            className={styles.elemMainMenu}                 
            whileTap={{ scale: 0.96 }}
          >
            <NavLink to={'/page2'}>{t('menuland.page2')}</NavLink>
          </motion.li>
        </div>
        <div className={styles.Header_right}>
          <motion.button
            className={styles.button_lang}                 
            whileTap={{ scale: 0.96 }}
          >
            <div className={styles.header_lang}>
              <TranslateIcon />
              {t('menuland.lang')}
            </div>
          </motion.button>
          <motion.button
            className={styles.button_auth}                 
            whileTap={{ scale: 0.96 }}
          >
            <NavLink to={'/auth'}>{t('menuland.auth')}</NavLink>
          </motion.button>
        </div>
      </div>
    </div>
  )
} 