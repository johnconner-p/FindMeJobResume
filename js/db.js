import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import app from './firebaseConfig.js';

const db = getFirestore(app);

// --- Resume CRUD ---

// Create a new resume with default template data
export const createResume = async (userId, resumeData) => {
    const resumesRef = collection(db, `users/${userId}/resumes`);
    const docRef = await addDoc(resumesRef, {
        ...resumeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        name: resumeData.profile.name || "Untitled Resume"
    });
    return docRef.id;
};

// Get a single resume by ID
export const getResume = async (userId, resumeId) => {
    const docRef = doc(db, `users/${userId}/resumes/${resumeId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Resume not found");
    }
};

// Update resume data (Auto-save)
export const updateResume = async (userId, resumeId, data) => {
    const docRef = doc(db, `users/${userId}/resumes/${resumeId}`);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

// Delete resume
export const deleteResume = async (userId, resumeId) => {
    const docRef = doc(db, `users/${userId}/resumes/${resumeId}`);
    await deleteDoc(docRef);
};

// List all resumes for a user
export const listResumes = async (userId) => {
    const resumesRef = collection(db, `users/${userId}/resumes`);
    const q = query(resumesRef); // You can add orderBy here if you index it
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
    });
    return list;
};