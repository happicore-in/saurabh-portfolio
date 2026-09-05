import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Existing Firebase configuration for saurabhprotfolio
const metaEnv = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyAl2w2Nj_CCtA4iyho7-eAE8e4fSdyb-qQ",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "saurabhprotfolio.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "saurabhprotfolio",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "saurabhprotfolio.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "245851571441",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:245851571441:web:a5d46b0407fbcafce6d550",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-9MRDDRN8B5"
};

// Exactly one Firebase app initialization
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Single instances of Firebase services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Safe Analytics initialization
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn("[Firebase] Analytics initialization skipped:", err);
      }
    }
  }).catch(() => {});
}

export default app;

