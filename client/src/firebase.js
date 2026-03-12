import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD0UTnKpb0Cmrd4gEaqviJ045UBH7qZAwY',
  authDomain: 'finalyearproject-e2db9.firebaseapp.com',
  projectId: 'finalyearproject-e2db9',
  storageBucket: 'finalyearproject-e2db9.firebasestorage.app',
  messagingSenderId: '320911765593',
  appId: '1:320911765593:web:fed82358795fffaa5ec148'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
