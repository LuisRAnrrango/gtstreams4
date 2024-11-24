import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Servicio } from '@/types';

export async function getServices(): Promise<Servicio[]> {
  try {
    const serviciosRef = collection(db, 'servicios');
    const q = query(serviciosRef, orderBy('fechaRegistro', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombreservicio: data.nombreservicio || '',
        descripcion: data.descripcion || '',
        imagen: data.imagen || '',
        link: data.link || '',
        numeroperfiles: data.numeroperfiles || 0,
        precio: data.precio || 0,
        proveedorId: data.proveedorId || '',
        fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

export async function getService(id: string): Promise<Servicio | null> {
  try {
    const docRef = doc(db, 'servicios', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      nombreservicio: data.nombreservicio || '',
      descripcion: data.descripcion || '',
      imagen: data.imagen || '',
      link: data.link || '',
      numeroperfiles: data.numeroperfiles || 0,
      precio: data.precio || 0,
      proveedorId: data.proveedorId || '',
      fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

export async function createService(data: Omit<Servicio, 'id' | 'fechaRegistro'>) {
  try {
    const docRef = await addDoc(collection(db, 'servicios'), {
      ...data,
      fechaRegistro: Timestamp.now(),
    });
    return docRef;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function updateService(id: string, data: Partial<Omit<Servicio, 'id' | 'fechaRegistro'>>) {
  try {
    const docRef = doc(db, 'servicios', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    const docRef = doc(db, 'servicios', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}