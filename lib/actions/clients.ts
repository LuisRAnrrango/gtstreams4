import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cliente } from '@/types';

export async function getClients(): Promise<Cliente[]> {
  try {
    const clientesRef = collection(db, 'clientes');
    const q = query(clientesRef, orderBy('fechaRegistro', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
        direccion: data.direccion || '',
        fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getClientCount(): Promise<number> {
  try {
    const clientesRef = collection(db, 'clientes');
    const snapshot = await getDocs(clientesRef);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting client count:', error);
    return 0;
  }
}

export async function getClient(id: string): Promise<Cliente | null> {
  try {
    const docRef = doc(db, 'clientes', id);
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
      fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

export async function createClient(data: Omit<Cliente, 'id' | 'fechaRegistro'>) {
  try {
    const docRef = await addDoc(collection(db, 'clientes'), {
      ...data,
      fechaRegistro: Timestamp.now(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function updateClient(id: string, data: Partial<Omit<Cliente, 'id' | 'fechaRegistro'>>) {
  try {
    const docRef = doc(db, 'clientes', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  try {
    const docRef = doc(db, 'clientes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}