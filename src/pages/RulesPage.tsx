import { useTranslation } from 'react-i18next'

export const RulesPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="row" style={{ paddingTop: '60px', textAlign: 'center' }}>
      <h3>{t('rulesPage.header')}</h3>
    </div>
  )
}
