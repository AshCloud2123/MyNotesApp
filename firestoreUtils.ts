import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { getCurrentUser } from './authUtils';

const db = getFirestore(app);

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  userId: string;
}

/**
 * Create a new note for the current user.
 */
export async function createNote(title: string, content: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const note = {
    title,
    content,
    createdAt: Timestamp.now(),
    userId: user.uid,
  };
  const docRef = await addDoc(collection(db, 'users', user.uid, 'notes'), note);
  return { ...note, id: docRef.id };
}

/**
 * Get all notes for the current user, sorted by most recent.
 */
export async function getNotes() {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const q = query(collection(db, 'users', user.uid, 'notes'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Note));
}

/**
 * Search notes by title for the current user.
 */
export async function searchNotes(title: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const q = query(collection(db, 'users', user.uid, 'notes'), where('title', '>=', title), where('title', '<=', title + '\uf8ff'), orderBy('title'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Note));
}

/**
 * Get a single note by ID for the current user.
 */
export async function getNote(noteId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const docRef = doc(db, 'users', user.uid, 'notes', noteId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Note not found');
  return { id: docSnap.id, ...docSnap.data() } as Note;
}

/**
 * Update a note by ID for the current user.
 */
export async function updateNote(noteId: string, data: Partial<Pick<Note, 'title' | 'content'>>) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const docRef = doc(db, 'users', user.uid, 'notes', noteId);
  await updateDoc(docRef, data);
}

/**
 * Delete a note by ID for the current user.
 */
export async function deleteNote(noteId: string) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const docRef = doc(db, 'users', user.uid, 'notes', noteId);
  await deleteDoc(docRef);
}