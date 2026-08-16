import React from 'react';
import { useAuth } from '../context/AuthContext';
import { authReady } from '../config/firebase';

export default function LoginPage() {
  const { signInWithGoogle, authError, initializing } = useAuth();

  return (
    <div className="login-page">
      <div className="login-card card-skeuo">
        <div className="login-brand">
          <img src="/logo.svg" alt="GimbalFlow" className="brand-logo-img" />
          <span className="login-brand-name">GimbalFlow</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in with Google to continue — no passwords, no signup forms.</p>

        <button
          className="login-google-btn"
          onClick={() => signInWithGoogle()}
          disabled={initializing}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C41.4 35.9 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          Continue with Google
        </button>

        {authError && <p className="login-error">{authError}</p>}

        {!authReady && (
          <p className="login-setup-note">
            Firebase keys missing — add VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN and VITE_FIREBASE_PROJECT_ID to the app's .env file, then restart the dev server.
          </p>
        )}

        <p className="login-foot">New here? Signing in with Google creates your account automatically.</p>
      </div>
    </div>
  );
}