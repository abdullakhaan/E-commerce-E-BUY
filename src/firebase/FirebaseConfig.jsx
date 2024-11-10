// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ5eV6W2YxX7xRdYxkVktDCBSOHDw7pdc",
  authDomain: "ecommerce-c8598.firebaseapp.com",
  projectId: "ecommerce-c8598",
  storageBucket: "ecommerce-c8598.appspot.com",
  messagingSenderId: "370669819765",
  appId: "1:370669819765:web:54d51fed570f97bc58a53c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB,auth } ;