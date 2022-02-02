// Import the functions you need from the SDKs you need
import firebase, { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoLIo6Ao7Ka9fgiAQGwemMORmiQ_GCjTs",
  authDomain: "cybpen-a1f80.firebaseapp.com",
  projectId: "cybpen-a1f80",
  storageBucket: "cybpen-a1f80.appspot.com",
  messagingSenderId: "474612019511",
  appId: "1:474612019511:web:6b836db22122325f30eab2",
  measurementId: "G-2MBKLMBJ41"
};

// Initialize Firebase
if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}