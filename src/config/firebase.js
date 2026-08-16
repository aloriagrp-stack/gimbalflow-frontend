// Firebase configuration — keys come from the Firebase web app config.
// The SDK itself is loaded from Google's CDN at runtime (no npm install,
// keeps the build small and works with limited disk space).

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
};

export const authReady = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain && FIREBASE_CONFIG.projectId);

export const TOKEN_STORAGE_KEY = 'gimbalflow_auth_token';
export const PROFILE_STORAGE_KEY = 'gimbalflow_auth_profile';