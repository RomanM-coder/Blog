import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { DateTime } from 'luxon'
// import translationEn from '../public/locales/en/translation.json'
// import translationRu from '../public/locales/ru/translation.json'
// import adminEn from '../public/locales/en/admin.json'
// import adminRu from '../public/locales/ru/admin.json'

// const resources = {
//   en: { translation: {} },
//   ru: { translation: {} },
// }

// let random = Math.random() * 10000
// random = Math.trunc(random)

const initI18n = () => {
  // const timestamp = Date.now()

  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      debug: true,
      fallbackLng: 'en',
      // 🔥 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ:
      // resources: {
      //   ru: {
      //     translation: translationRu,
      //     admin: adminRu, // Добавьте namespace admin
      //   },
      //   en: {
      //     translation: translationEn,
      //     admin: adminEn, // Добавьте namespace admin
      //   },
      // },

      // 🔥 Загружать оба namespace
      // preload: ['ru', 'en'], // языки
      // ns: ['translation', 'admin'],
      // defaultNS: 'translation',

      // 🔥 Укажите, какие namespace использовать:
      // ns: ['translation', 'admin'], // Оба namespace!

      // 🔥 Предзагрузить оба namespace при старте
      // preload: ['ru', 'en'], // языки
      // ns: ['translation', 'admin'], // namespace

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      returnEmptyString: false,
      backend: {
        // loadPath: `locales/{{lng}}/{{ns}}.json?v=${timestamp}`, // Путь к файлам переводов
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        // loadPath: 'locales/{{lng}}/{{ns}}.json',
        // queryStringParams: {
        //   v: () => Date.now(), // Функция вызывается при каждом запросе/ либо функция initi18n
        // },
      },
    })

  i18n.services.formatter?.add('MY_DATE', (value, lng, _options) => {
    return DateTime.fromJSDate(value)
      .setLocale(lng ?? '')
      .toLocaleString(DateTime.DATE_FULL)
  })
}

initI18n()

export default i18n
