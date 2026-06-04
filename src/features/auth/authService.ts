import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import type { User } from "../../types";
 
// ─── Helpers ─────────────────────────────────────────────────────────────────
 
export const mapFirebaseUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});
 
export const getAuthErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este email ya está registrado.",
    "auth/invalid-email": "El email no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "No existe una cuenta con este email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde.",
    "auth/popup-closed-by-user": "Cerraste el popup de Google.",
    "auth/unauthorized-domain": "Dominio no autorizado. Contactá al administrador.",
    "auth/popup-blocked": "El popup fue bloqueado por el navegador.",
    "auth/cancelled-popup-request": "Operación cancelada.",
  };
  return messages[code] ?? "Credenciales incorrectas. Verificá usuario y contraseña.";
};
 
// ─── Auth functions ──────────────────────────────────────────────────────────
 
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(user);
};
 
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(user);
};
 
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    return mapFirebaseUser(user);
  } catch (error: any) {
    console.error("Google login error code:", error.code);
    console.error("Google login error message:", error.message);
    throw error;
  }
};
 
export const logout = (): Promise<void> => signOut(auth);
 
export const onAuthChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
};