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
  apiKey: "AIzaSyCljK30w63Ef9UcSQaiAtTwnOt5YJyCfsk",
  authDomain: "studio-9664478551-b17ac.firebaseapp.com",
  projectId: "studio-9664478551-b17ac",
  storageBucket: "studio-9664478551-b17ac.firebasestorage.app",
  messagingSenderId: "871856870253",
  appId: "1:871856870253:web:68eed8301a20b616658064"
};

// Initialize Firebase Instance
const app = initializeApp(firebaseConfig);

// Initialize and Export Firestore Service
export const db = getFirestore(app);
export { app };
