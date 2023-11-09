/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INTERNAL_NEW_YORK_TIMES_API_KEY: string;
  readonly VITE_INTERNAL_THE_GUARDIANS_API_KEY: string;
  readonly VITE_INTERNAL_NEWS_API_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
