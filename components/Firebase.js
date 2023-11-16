// Firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';



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
const database = getDatabase(app);
// Analytics가 지원되는 경우에만 초기화
initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const auth = getAuth(app);

export { auth, database };
