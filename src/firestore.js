import {
  collection, getDocs, addDoc, updateDoc,
  doc, increment, orderBy, query,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { supabase } from './supabase.js';

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
  const path = `${Date.now()}_${safeName}`;

  const { data, error } = await supabase.storage
    .from('tree-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('tree-photos')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function addNewTree(treeData) {
  const docRef = await addDoc(collection(db, 'trees'), treeData);
  return docRef.id;
}
