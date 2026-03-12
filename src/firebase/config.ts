import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * AI CRYPTO - FIREBASE CONFIGURATION PROTOCOL
 * 
 * TO CONNECT YOUR WORKSTATION:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Select your Project (or create a new one)
 * 3. Go to Project Settings > General
 * 4. Under "Your apps", click the "</>" icon to add a Web App
 * 5. Copy the 'firebaseConfig' object and paste it below.
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase Instance
const app = initializeApp(firebaseConfig);

// Initialize and Export Firestore Service
export const db = getFirestore(app);
export { app };
