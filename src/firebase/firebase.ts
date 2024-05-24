// Import the functions you need from the SDKs you need
import { getApp, initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPHN88zwMYW1Dj1W5eH1rIPJVnG8QV71U",
  authDomain: "quizcodepro-b5ac9.firebaseapp.com",
  databaseURL: "https://quizcodepro-b5ac9-default-rtdb.firebaseio.com",
  projectId: "quizcodepro-b5ac9",
  storageBucket: "quizcodepro-b5ac9.appspot.com",
  messagingSenderId: "644204509463",
  appId: "1:644204509463:web:9dbd930d8dc1945ed4df52",
  measurementId: "G-QKD50MRNKP"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const firestore=getFirestore(app);

export {auth, firestore, app};