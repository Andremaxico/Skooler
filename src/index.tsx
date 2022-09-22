import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getAuth, Auth } from 'firebase/auth';

import { initializeApp, getApps, getApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from 'firebase/firestore';
import { getMessaging } from "firebase/messaging";
import { Database, getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMkGjC1EwkYTerwkrYzROPdmBDQZsoE7Q",
  authDomain: "real-time-chat-test-ece84.firebaseapp.com",
  projectId: "real-time-chat-test-ece84",
  storageBucket: "real-time-chat-test-ece84.appspot.com",
  messagingSenderId: "839183074345",
  appId: "1:839183074345:web:dc7ec68d14d4eb7f3b0838",
  measurementId: "G-L6Z13LL2ZV",
  databaseURL: "https://real-time-chat-test-ece84-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const auth  = getAuth(app);
auth.useDeviceLanguage();

const firestore = getFirestore();
const messaging = getMessaging(app);
const database = getDatabase(app);

export const FirebaseContext = createContext({
  auth: null,
  analytics: null,
  firestore: null,
  database: null,
} as {
  auth: Auth | null,
  analytics: Analytics | null,
  firestore: Firestore | null,
  database: Database | null,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <FirebaseContext.Provider value={{
      analytics,
      auth,
      firestore,
      database
  }}>
    <App />
  </FirebaseContext.Provider>
);



