import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import app from './firebaseConfig.js';

const auth = getAuth(app);

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

export const monitorAuth = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};

export const getCurrentUser = () => auth.currentUser;