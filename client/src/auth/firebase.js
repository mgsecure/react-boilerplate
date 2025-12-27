import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

export const {VITE_DEV_FIRESTORE: devFirestore} = import.meta.env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Firebase configuration

const firebaseConfig = {
    apiKey,
    authDomain: 'coffee-tracker-a75fa.firebaseapp.com',
    projectId: 'coffee-tracker-a75fa',
    storageBucket: 'coffee-tracker-a75fa.firebasestorage.app',
    messagingSenderId: '634033952992',
    appId: '1:634033952992:web:6e2f11c0963f958d10d885',
    measurementId: 'G-2T9G8T55NQ'
}
// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = devFirestore==='true' ? getFirestore(app, 'lpubelts-dev') : getFirestore(app)
