import {
  collection, getDocs, addDoc, updateDoc,
  doc, increment, orderBy, query,
} from 'firebase/firestore';
import { db } from './firebase.js';

export async function loadAllTrees() {
  const q = query(collection(db, 'trees'), orderBy('votes', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function incrementTreeVotes(treeId) {
  await updateDoc(doc(db, 'trees', String(treeId)), { votes: increment(1) });
}

export async function addNewTree(treeData) {
  const ref = await addDoc(collection(db, 'trees'), treeData);
  return ref.id;
}
