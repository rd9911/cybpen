// Import the functions you need from the SDKs you need
import firebase, { initializeApp, getApps } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";
import { collection, getDoc, query, getFirestore, addDoc, doc, where, limit, getDocs, DocumentSnapshot } from 'firebase/firestore'
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

let app: any;

// Initialize Firebase
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}
export const provider = new GoogleAuthProvider()
export const auth = getAuth(app)
export const db = getFirestore(app)


// Helper functions
/**
 * returns user's username from firebase
 * @param username 
 * 
 */
export async function getUserWithUsername(username: string) {
  const userRef = collection(db, 'users')
  const q = query(userRef, where('username', '==', username), limit(1))
  const userDoc = (await getDocs(q)).docs[0]
  return userDoc
}

/**
 * Converts a firestore document into JSON
 * @param { DocumentSnapshot } doc
 */

export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}