//index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import '@react-native-firebase/app';
import firebase from '@react-native-firebase/app';

// Firebase 설정
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-domain.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-id.com",
    messagingSenderId: "368701358613",
    appId: "your-id",
    measurementId: "G-id",
    databaseURL: "https://yours.firebaseio.com"
};

// Firebase 앱이 이미 초기화되었는지 확인
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent(appName, () => App);
