import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHkqtm92MLok6kx9Kxcw8eN_i_HJjmpIw",
  authDomain: "cvbuilders-6bac6.firebaseapp.com",
  projectId: "cvbuilders-6bac6",
  storageBucket: "cvbuilders-6bac6.firebasestorage.app",
  messagingSenderId: "527941300140",
  appId: "1:527941300140:web:53a66d99ffe90182a5d409",
  measurementId: "G-YG6J9XV56J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { auth, db, googleProvider, analytics };
