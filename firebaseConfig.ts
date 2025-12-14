import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: "perpect-ai.firebaseapp.com",
  projectId: "perpect-ai",
  storageBucket: "perpect-ai.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);