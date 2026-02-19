// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";

// TODO: Replace with your actual Firebase Project Configuration
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
export default app;