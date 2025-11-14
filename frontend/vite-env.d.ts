/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more env variables here
  // readonly VITE_SOMETHING_ELSE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}