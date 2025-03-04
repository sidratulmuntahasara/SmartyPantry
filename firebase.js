// Import the functions you need from the SDKs you need
import {getAuth} from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKfpkC5MAtvq5fJe_YTZNNSjMDsvWT20E",
  authDomain: "pantrypal-17636.firebaseapp.com",
  projectId: "pantrypal-17636",
  storageBucket: "pantrypal-17636.appspot.com",
  messagingSenderId: "638147519523",
  appId: "1:638147519523:web:71a5d441aed8e6280ebd96",
  measurementId: "G-WNGJYG85G9"
};

let auth;
let firestore;
let analytics;
if (typeof window !== "undefined"){
  // Initialize Firebase
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
  analytics = getAnalytics(app);
}

export {auth, firestore, analytics}