import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBAf2-j0OCaxSVuEl-5uAyM4Up1JhDUNko',
  authDomain: 'i-tree-you.firebaseapp.com',
  projectId: 'i-tree-you',
  storageBucket: 'i-tree-you.firebasestorage.app',
  messagingSenderId: '679005900460',
  appId: '1:679005900460:web:3df4c6eb97ac3ad6385909',
  measurementId: 'G-P5EFXKTSVD',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
