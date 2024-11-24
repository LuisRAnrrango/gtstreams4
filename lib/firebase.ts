import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDswFCZExemK7TB_2-gSmPJAzSS_7HqYnA",
  authDomain: "gtstreams.firebaseapp.com",
  projectId: "gtstreams",
  storageBucket: "gtstreams.appspot.com",
  messagingSenderId: "147702056719",
  appId: "1:147702056719:web:5f70e5e681e72ab14e607a",
  measurementId: "G-0T5VJ9VQME"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };