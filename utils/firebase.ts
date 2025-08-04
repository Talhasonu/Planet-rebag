import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCM8jxu0v34B0dLx8CZ-94qIcYktN3eJe4",
  authDomain: "planet-rebag.firebaseapp.com",
  projectId: "planet-rebag",
  storageBucket: "planet-rebag.firebasestorage.app",
  messagingSenderId: "765194029503",
  appId: "1:765194029503:web:40ab190b62c42dd894b90a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
