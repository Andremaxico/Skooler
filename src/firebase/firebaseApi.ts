import { getAuth } from 'firebase/auth';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

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
  measurementId: "G-L6Z13LL2ZV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth  = getAuth(app);
export const firestore = getFirestore();
