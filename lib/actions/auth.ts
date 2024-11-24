"use client";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'user';
}

export async function signIn(email: string, password: string): Promise<User> {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'usuarios', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado en la base de datos');
    }

    const userData = userDoc.data();
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      nombre: userData.nombre || '',
      rol: userData.rol || 'user'
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function signUp(email: string, password: string, nombre: string): Promise<User> {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const userData = {
      email,
      nombre,
      rol: 'user',
      fechaRegistro: new Date()
    };

    await setDoc(doc(db, 'usuarios', userCredential.user.uid), userData);

    return {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      nombre,
      rol: 'user'
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

export async function signOut() {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error('Error al cerrar sesión');
  }
}

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada';
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo electrónico';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este correo electrónico';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    default:
      return 'Error de autenticación';
  }
}