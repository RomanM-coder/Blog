/// <reference types="vite/client" />

// declare module '*.jpg' {
//   const src: string;
//   export default src;
// }

interface ImportMetaEnv {
  readonly VITE_RECAPTCHA_SITE_KEY: string
  // другие переменные...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
