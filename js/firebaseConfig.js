// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5Zb5BPvVJ81BWq65M2W0rNa5BsCHEDPc",
  authDomain: "resumetrackin.firebaseapp.com",
  projectId: "resumetrackin",
  storageBucket: "resumetrackin.firebasestorage.app",
  messagingSenderId: "647829258405",
  appId: "1:647829258405:web:558537b72e47744af10d4c",
  measurementId: "G-GZ9Q64BD62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);