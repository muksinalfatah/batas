/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AREA_SERVICE_BASE_URL: string
    readonly VITE_AREA_PARTNER_NAME: string
    readonly VITE_AREA_PARTNER_KEY: string
    readonly VITE_AREA_PARTNER_SECRET_WORD: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
