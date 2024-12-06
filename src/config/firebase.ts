// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjnqQcFBFNb8l97csQxB2lYDaz0V3oGHo",
  authDomain: "routespark-1f47d.firebaseapp.com",
  projectId: "routespark-1f47d",
  storageBucket: "routespark-1f47d.firebasestorage.app",
  messagingSenderId: "187662773284",
  appId: "1:187662773284:android:6bef8b50343c9cefd6fcb1"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };