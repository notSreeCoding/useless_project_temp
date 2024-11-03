// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBEbvp_hbIfqa6TSjeyXHf-aUYTAVlh4M0",
    authDomain: "autorickshaw-call.firebaseapp.com",
    projectId: "autorickshaw-call",
    storageBucket: "autorickshaw-call.firebasestorage.app",
    messagingSenderId: "433525367642",
    appId: "1:433525367642:web:e44952c9900867266ec963",
    measurementId: "G-9C3YEEDJRD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
