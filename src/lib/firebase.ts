// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-4074214820-89fb1",
  "appId": "1:46112749787:web:ee54202312638525d9b4fe",
  "storageBucket": "studio-4074214820-89fb1.firebasestorage.app",
  "apiKey": "AIzaSyA5CwrnHIHyYY_ogS4rnBNUMuoa5vkZvgM",
  "authDomain": "studio-4074214820-89fb1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "46112749787"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
