import { useTranslation } from 'react-i18next'

export const AboutPage = () => {
  const { t } = useTranslation()

  return (
    <div className="row" style={{ paddingTop: '60px', textAlign: 'center' }}>
      <h2>{t('aboutPage.header')}</h2>
    </div>
  )
}
