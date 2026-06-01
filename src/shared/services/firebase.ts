import { initializeApp } from 'firebase/app'
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxaolUAaSgAr3asm-kFVLePPhBeG0Mkd4",
  authDomain: "devfeed-6147c.firebaseapp.com",
  projectId: "devfeed-6147c",
  storageBucket: "devfeed-6147c.firebasestorage.app",
  messagingSenderId: "1021011063435",
  appId: "1:1021011063435:web:725b61535e1916065c1a8e",
  measurementId: "G-88CHS9MLRF"
};

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})
export { auth }