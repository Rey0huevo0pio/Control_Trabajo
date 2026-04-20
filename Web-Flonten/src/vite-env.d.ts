interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}

interface Window {
  google?: {
    accounts?: {
      oauth2?: {
        initTokenClient: (config: any) => any;
        revoke: (token: string, callback: (response: any) => void) => void;
      };
    };
  };
}