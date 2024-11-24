import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Proveedor } from '@/types';

export async function getProviders(): Promise<Proveedor[]> {
  try {
    const proveedoresRef = collection(db, 'proveedores');
    const q = query(proveedoresRef, orderBy('fechaRegistro', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
        direccion: data.direccion || '',
        estado: data.estado || '',
        servicio: data.servicio || '',
        fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}

export async function getProvider(id: string): Promise<Proveedor | null> {
  try {
    const docRef = doc(db, 'proveedores', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      nombre: data.nombre || '',
      email: data.email || '',
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      estado: data.estado || '',
      servicio: data.servicio || '',
      fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error;
  }
}

export async function createProvider(data: Omit<Proveedor, 'id' | 'fechaRegistro'>) {
  try {
    const docRef = await addDoc(collection(db, 'proveedores'), {
      ...data,
      fechaRegistro: Timestamp.now(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating provider:', error);
    throw error;
  }
}

export async function updateProvider(id: string, data: Partial<Omit<Proveedor, 'id' | 'fechaRegistro'>>) {
  try {
    const docRef = doc(db, 'proveedores', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating provider:', error);
    throw error;
  }
}

export async function deleteProvider(id: string) {
  try {
    const docRef = doc(db, 'proveedores', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw error;
  }
}