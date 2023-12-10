import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5zILBB4bXwuczgihWqHx28pZvAXpwUmI",
    authDomain: "insol-301b9.firebaseapp.com",
    projectId: "insol-301b9",
    storageBucket: "insol-301b9.appspot.com",
    messagingSenderId: "368701358613",
    appId: "1:368701358613:web:5b319cb5573fff5ec2041c",
    measurementId: "G-YT7FLJSQ49",
    databaseURL: "https://insol-301b9.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
