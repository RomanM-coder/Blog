import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {DateTime} from 'luxon'

let random = (Math.random()*10000)
random = Math.trunc(random) 

i18n
  .use(Backend) 
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    fallbackLng: 'en', 
    // resources,    
    // interpolation: {
    //   escapeValue: false // react already safes from xss
    // },
    returnEmptyString: false,
    backend: {
      loadPath: `/public/locales/{{lng}}/{{ns}}.json?v={{${random}}}`, // Путь к файлам переводов
    },
  }) 

i18n.services.formatter?.add('MY_DATE', (value, lng, _options) => {
  return DateTime.fromJSDate(value).setLocale(lng ?? "").toLocaleString(DateTime.DATE_FULL)
})  

export default i18n