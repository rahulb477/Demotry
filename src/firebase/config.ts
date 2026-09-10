import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDz2qmIIHKj-oQ8_U-W0WCbWdCiTpWrAlk",
  authDomain: "battlezone-x-68bcf.firebaseapp.com",
  projectId: "battlezone-x-68bcf",
  storageBucket: "battlezone-x-68bcf.firebasestorage.app",
  messagingSenderId: "267726584551",
  appId: "1:267726584551:web:7ae896ed7cf94912860042"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export default app;
