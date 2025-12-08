// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWRL1xe_qNx3z1-JyaHcNmU6690g-W40M",
  authDomain: "formdatabase-9fd27.firebaseapp.com",
  projectId: "formdatabase-9fd27",
  storageBucket: "formdatabase-9fd27.firebasestorage.app",
  messagingSenderId: "547692090610",
  appId: "1:547692090610:web:0109469cb5b9192d916c6b",
  measurementId: "G-SFH976YYFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
