// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Required for phone auth

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "otp-verification-a24e7.firebaseapp.com",
  projectId: "otp-verification-a24e7",
  storageBucket: "otp-verification-a24e7.appspot.com",
  messagingSenderId: "346975041384",
  appId: "1:346975041384:web:aaed64365bf5ad5d2848dd",
  measurementId: "G-0MTRVBM964"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Get Auth instance to use in Signup.js
export const auth = getAuth(app);
