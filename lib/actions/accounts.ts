import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  query,
  orderBy
} from "firebase/firestore";
import { Cuenta } from "@/types";

export async function getAccounts(): Promise<Cuenta[]> {
  try {
    const accountsQuery = query(collection(db, "cuentas"), orderBy("fechaRegistro", "desc"));
    const querySnapshot = await getDocs(accountsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        cuenta: data.cuenta || '',
        servicioId: data.servicioId || '',
        nombreServicio: data.nombreServicio || '',
        fechaFacturacion: data.fechaFacturacion?.toDate() || new Date(),
        observacion: data.observacion || '',
        passwordCorreo: data.passwordCorreo || '',
        passwordCuenta: data.passwordCuenta || '',
        perfilesLibres: data.perfilesLibres || 5,
        perfilesOcupados: data.perfilesOcupados || 0,
        fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

export async function getAccountCount(): Promise<number> {
  try {
    const accountsRef = collection(db, "cuentas");
    const snapshot = await getDocs(accountsRef);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting account count:", error);
    return 0;
  }
}

export async function getAccount(id: string): Promise<Cuenta | null> {
  try {
    const docRef = doc(db, "cuentas", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      cuenta: data.cuenta || '',
      servicioId: data.servicioId || '',
      nombreServicio: data.nombreServicio || '',
      fechaFacturacion: data.fechaFacturacion?.toDate() || new Date(),
      observacion: data.observacion || '',
      passwordCorreo: data.passwordCorreo || '',
      passwordCuenta: data.passwordCuenta || '',
      perfilesLibres: data.perfilesLibres || 5,
      perfilesOcupados: data.perfilesOcupados || 0,
      fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
}

export async function createAccount(data: Omit<Cuenta, "id" | "fechaRegistro">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "cuentas"), {
      ...data,
      fechaFacturacion: Timestamp.fromDate(new Date(data.fechaFacturacion)),
      fechaRegistro: Timestamp.now(),
      perfilesLibres: 5,
      perfilesOcupados: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

export async function updateAccount(id: string, data: Partial<Omit<Cuenta, "id" | "fechaRegistro">>): Promise<void> {
  try {
    const docRef = doc(db, "cuentas", id);
    const updateData = {
      ...data,
      fechaFacturacion: data.fechaFacturacion ? Timestamp.fromDate(new Date(data.fechaFacturacion)) : undefined,
    };
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

export async function deleteAccount(id: string): Promise<void> {
  try {
    const docRef = doc(db, "cuentas", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}