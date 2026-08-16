import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { FIREBASE_CONFIG, authReady, TOKEN_STORAGE_KEY, PROFILE_STORAGE_KEY } from '../config/firebase';

const AuthContext = createContext(null);

const SDK_URLS = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js'
];

let sdkPromise = null;

function loadSdk() {
  if (window.firebase && window.firebase.auth) return Promise.resolve(window.firebase);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    let loaded = 0;
    const fail = () => reject(new Error('Firebase SDK failed to load (internet needed).'));
    SDK_URLS.forEach((src) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => { loaded += 1; if (loaded === SDK_URLS.length) resolve(window.firebase); };
      s.onerror = fail;
      document.head.appendChild(s);
    });
    setTimeout(fail, 20000);
  });
  return sdkPromise;
}

async function apiVerify(idToken) {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  if (!res.ok) throw new Error('Server rejected the sign-in.');
  return res.json();
}

async function apiMe(idToken) {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${idToken}` }
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
      return p && p.id ? p : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || '');
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const applySession = useCallback((fbUser) => {
    if (!fbUser) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      setToken('');
      setUser(null);
      return;
    }
    fbUser.getIdToken().then((idToken) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, idToken);
      setToken(idToken);
      apiVerify(idToken)
        .then((data) => {
          if (!mountedRef.current) return;
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
          setUser(data.profile);
        })
        .catch(() => {
          if (!mountedRef.current) return;
          setAuthError('Could not sync profile with server.');
        });
    }).catch(() => {});
  }, []);

  // Initialize Firebase + restore session on boot
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!authReady) { setInitializing(false); return; }
      try {
        const firebase = await loadSdk();
        if (cancelled || !mountedRef.current) return;
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        firebase.auth().onAuthStateChanged((fbUser) => {
          if (!mountedRef.current) return;
          if (fbUser) applySession(fbUser);
          else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(PROFILE_STORAGE_KEY);
            setToken('');
            setUser(null);
          }
          setInitializing(false);
        });
      } catch (err) {
        if (!cancelled) {
          setAuthError(err.message || 'Firebase init failed.');
          setInitializing(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [applySession]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError('');
    if (!authReady) {
      setAuthError('Firebase keys are missing. Add them to .env and restart.');
      return;
    }
    try {
      const firebase = await loadSdk();
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      // onAuthStateChanged handles the rest
    } catch (err) {
      let msg = err && err.message ? err.message : 'Sign-in failed. Try again.';
      if (msg.includes('popup-closed-by-user')) msg = 'Popup closed before sign-in — click the button again.';
      else if (msg.includes('configuration')) msg = 'Google sign-in is not enabled in Firebase console (Authentication → Google → Enable).';
      else if (msg.includes('origin')) msg = 'This domain is not in Firebase Authorized domains — add it in Firebase console.';
      setAuthError(msg);
    }
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setToken('');
    setUser(null);
    if (window.firebase && window.firebase.auth) {
      try { await window.firebase.auth().signOut(); } catch { /* ignore */ }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!t) return;
    try {
      const data = await apiMe(t);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
      setUser(data.profile);
    } catch { /* keep current */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, initializing, authError, signInWithGoogle, signOut, refreshUser, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}