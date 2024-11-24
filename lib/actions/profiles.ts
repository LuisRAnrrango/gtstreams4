"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, Timestamp, deleteDoc, doc, updateDoc, getDoc, runTransaction } from "firebase/firestore";
import { Perfil } from "@/types";

export const getProfiles = async (cuentaId: string): Promise<Perfil[]> => {
  try {
    const perfilesRef = collection(db, 'perfiles');
    const q = query(perfilesRef, where("cuentaId", "==", cuentaId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaInicio: doc.data().fechaInicio?.toDate() || null,
      fechaFin: doc.data().fechaFin?.toDate() || null,
    } as Perfil));
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};

export const getAllProfiles = async (): Promise<Perfil[]> => {
  try {
    const perfilesRef = collection(db, 'perfiles');
    const querySnapshot = await getDocs(perfilesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaInicio: doc.data().fechaInicio?.toDate() || null,
      fechaFin: doc.data().fechaFin?.toDate() || null,
    } as Perfil));
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    return [];
  }
};

export const getAvailableProfilesCount = async (): Promise<number> => {
  try {
    const [profiles, accounts] = await Promise.all([
      getAllProfiles(),
      getDocs(collection(db, 'cuentas'))
    ]);

    let totalProfiles = 0;
    accounts.forEach(account => {
      const service = account.data().nombreServicio.toLowerCase();
      totalProfiles += service.includes("netflix") ? 5 : 4;
    });

    const usedProfiles = profiles.length;
    return totalProfiles - usedProfiles;
  } catch (error) {
    console.error('Error getting available profiles count:', error);
    return 0;
  }
};

export const createProfile = async (profileData: Partial<Perfil>): Promise<string> => {
  try {
    const perfilesRef = collection(db, 'perfiles');
    
    // Usar una transacción para actualizar tanto el perfil como la cuenta
    return await runTransaction(db, async (transaction) => {
      // Obtener la cuenta actual
      const cuentaRef = doc(db, 'cuentas', profileData.cuentaId as string);
      const cuentaDoc = await transaction.get(cuentaRef);
      
      if (!cuentaDoc.exists()) {
        throw new Error('La cuenta no existe');
      }

      const cuentaData = cuentaDoc.data();
      const perfilesOcupados = cuentaData.perfilesOcupados || 0;
      const perfilesLibres = cuentaData.perfilesLibres || 5;

      // Verificar que hay perfiles disponibles
      if (perfilesLibres <= 0) {
        throw new Error('No hay perfiles disponibles en esta cuenta');
      }

      // Actualizar los contadores de la cuenta
      transaction.update(cuentaRef, {
        perfilesOcupados: perfilesOcupados + 1,
        perfilesLibres: perfilesLibres - 1
      });

      // Crear el nuevo perfil
      const newProfileRef = doc(collection(db, 'perfiles'));
      transaction.set(newProfileRef, {
        ...profileData,
        fechaInicio: Timestamp.fromDate(profileData.fechaInicio as Date),
        fechaFin: Timestamp.fromDate(profileData.fechaFin as Date),
        fechaRegistro: Timestamp.fromDate(new Date()),
      });

      return newProfileRef.id;
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const updateProfile = async (profileId: string, profileData: Partial<Perfil>): Promise<void> => {
  try {
    const profileRef = doc(db, 'perfiles', profileId);
    const updateData = {
      ...profileData,
      fechaInicio: profileData.fechaInicio ? Timestamp.fromDate(new Date(profileData.fechaInicio)) : undefined,
      fechaFin: profileData.fechaFin ? Timestamp.fromDate(new Date(profileData.fechaFin)) : undefined,
    };
    await updateDoc(profileRef, updateData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteProfile = async (profileId: string): Promise<void> => {
  try {
    // Obtener el perfil para saber a qué cuenta pertenece
    const profileRef = doc(db, 'perfiles', profileId);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      throw new Error('El perfil no existe');
    }

    const profileData = profileDoc.data();
    const cuentaId = profileData.cuentaId;

    // Usar una transacción para actualizar tanto el perfil como la cuenta
    await runTransaction(db, async (transaction) => {
      // Obtener la cuenta actual
      const cuentaRef = doc(db, 'cuentas', cuentaId);
      const cuentaDoc = await transaction.get(cuentaRef);
      
      if (!cuentaDoc.exists()) {
        throw new Error('La cuenta no existe');
      }

      const cuentaData = cuentaDoc.data();
      const perfilesOcupados = cuentaData.perfilesOcupados || 0;
      const perfilesLibres = cuentaData.perfilesLibres || 0;

      // Actualizar los contadores de la cuenta
      transaction.update(cuentaRef, {
        perfilesOcupados: Math.max(0, perfilesOcupados - 1),
        perfilesLibres: Math.min(5, perfilesLibres + 1)
      });

      // Eliminar el perfil
      transaction.delete(profileRef);
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};