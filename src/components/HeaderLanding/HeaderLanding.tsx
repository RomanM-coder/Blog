import useScreenSize from '../../utilita/useScreenSize.ts'
import { useTranslation } from 'react-i18next'
import zastavka from '../../assets/zastavkaBlueGradient.webp'
import cornFlower from '../../assets/static/cornflower.png'
import styles from './HeaderLanding.module.css'

export const HeaderLanding = () => {
  const { width } = useScreenSize() // перерасчет ширин элементов
  const { t } = useTranslation()

  return (
    <section className={styles.headerSection}>
      <div className={styles.headerWrapper}>
        <div
          className={styles.gradient}
          style={{ backgroundImage: `url(${zastavka})` }}
        ></div>
        <div className={styles.headerBlock}>
          <div className={styles.leftContent}>
            <h2 className={styles.titlePart}>{t('headerLanding.header')}</h2>
            <div className={styles.headerDescription}>
              {t('headerLanding.context1')}
              <br />
              <br />
              {t('headerLanding.context2')}
            </div>
          </div>
          {width! > 1024 ? (
            <div className={styles.rightContent}>
              <img
                className={styles.headerImg}
                src={cornFlower}
                alt="header title"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
