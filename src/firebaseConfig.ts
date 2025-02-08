import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig  =  {
    apiKey: "AIzaSyCRJA0l7MlxyBo8-NMBerGFyDDKBO9dEss",
    authDomain: "hrv-endurance-landing.firebaseapp.com",
    projectId: "hrv-endurance-landing",
    storageBucket: "hrv-endurance-landing.appspot.com",
    messagingSenderId: "228357777566",
    appId: "1:228357777566:web:9120c54e80fecf3ce3b38f",
    measurementId: "G-80B1PFKXX5"
}
  
// Initialize Firebase
const app  =  initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)