import i18next from "i18next"
import { z } from "zod"
import { makeZodI18nMap } from "zod-i18n-map"
import translationEn from "zod-i18n-map/locales/en/zod.json"
import translationRu from "zod-i18n-map/locales/ru/zod.json"
// import zodTranslationEn from "../../../src/locales/en/zodTranslation.json"
// import zodTranslationRu from "../../../src/locales/ru/zodTranslation.json"
// import defTranslationEn from "../../../src/locales/en/translation.json"
// import defTranslationRu from "../../../src/locales/ru/translation.json"

//lng and resources key depend on your locale.
// i18next.init({
//   debug: true,
//   fallbackLng: 'en',
//   resources: {
//     en: {
//       default: defTranslationEn, 
//       zod: translationEn,
//       custom: zodTranslationEn,
//     },
//     ru: {
//       default: defTranslationRu, 
//       zod: translationRu,
//       custom: zodTranslationRu, 
//     },
//   },
//   returnEmptyString: false,
// })

z.setErrorMap(makeZodI18nMap({ ns: ["zod", "custom", "default"] }))

// export configured zod instance
export { z }