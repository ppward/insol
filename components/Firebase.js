// Firebase.js
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA5zILBB4bXwuczgihWqHx28pZvAXpwUmI",
    authDomain: "insol-301b9.firebaseapp.com",
    projectId: "insol-301b9",
    storageBucket: "insol-301b9.appspot.com",
    messagingSenderId: "368701358613",
    appId: "1:368701358613:web:5b319cb5573fff5ec2041c",
    measurementId: "G-YT7FLJSQ49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const getFirebase = () => app;
const auth = getAuth(app);

export { app, analytics,db ,auth, getFirebase };
