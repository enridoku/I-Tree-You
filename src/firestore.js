import {
  collection, getDocs, addDoc, updateDoc,
  doc, increment, orderBy, query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase.js';

export async function loadAllTrees() {
  const q = query(collection(db, 'trees'), orderBy('votes', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function incrementTreeVotes(treeId) {
  await updateDoc(doc(db, 'trees', String(treeId)), { votes: increment(1) });
}

export async function uploadTreePhoto(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `trees/${Date.now()}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function addNewTree(treeData) {
  const docRef = await addDoc(collection(db, 'trees'), treeData);
  return docRef.id;
}
