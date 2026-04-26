// Run once: node scripts/reset-votes.js
// Sets votes to 0 on every document in /trees.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBAf2-j0OCaxSVuEl-5uAyM4Up1JhDUNko',
  authDomain: 'i-tree-you.firebaseapp.com',
  projectId: 'i-tree-you',
  storageBucket: 'i-tree-you.firebasestorage.app',
  messagingSenderId: '679005900460',
  appId: '1:679005900460:web:3df4c6eb97ac3ad6385909',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'trees'));
const batch = writeBatch(db);
snap.docs.forEach(d => batch.update(doc(db, 'trees', d.id), { votes: 0 }));
await batch.commit();

console.log(`✓ Reset votes to 0 for ${snap.docs.length} trees.`);
process.exit(0);
