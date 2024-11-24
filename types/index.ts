import { Timestamp } from 'firebase/firestore';

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
}

export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicios: string[];
  fechaRegistro: Date;
}

export interface Servicio {
  id: string;
  nombreservicio: string;
  descripcion: string;
  imagen: string;
  link: string;
  numeroperfiles: number;
  precio: number;
  proveedorId: string;
  fechaRegistro: Date;
}

export interface Cuenta {
  id: string;
  cuenta: string;
  nombreServicio: string;
  fechaFacturacion: Date;
  observacion: string;
  passwordCorreo: string;
  passwordCuenta: string;
  perfilesLibres: number;
  perfilesOcupados: number;
  fechaRegistro: Date;
}

export interface Perfil {
  id: string;
  cuentaId: string;
  clienteId: string;
  nombreCliente: string;
  nombrePerfil: string;
  pin?: string;
  estado: 'activo' | 'inactivo';
  fechaInicio: Date;
  fechaFin?: Date;
  fechaRegistro: Date;
  generaPago: boolean;
  precio: number;
  telefono: string;
}