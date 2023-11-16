import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';

// Firebase 설정
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

// Firebase 앱이 이미 초기화되었는지 확인
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent(appName, () => App);
