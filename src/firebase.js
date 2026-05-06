import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBP5S6xUldCa9BOPYYFH3g0sQCt2cBnPFM",
  authDomain: "react-website-a6ea5.firebaseapp.com",
  projectId: "react-website-a6ea5",
  storageBucket: "react-website-a6ea5.appspot.com",
  messagingSenderId: "861287992612",
  appId: "1:861287992612:web:60001e83319f2c5f8c77b1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);