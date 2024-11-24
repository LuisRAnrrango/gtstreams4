"use client";

import { Cliente } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteClient } from "@/lib/actions/clients";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientTableProps {
  clients: Cliente[];
  onClientDeleted: (id: string) => void;
}

export function ClientTable({ clients, onClientDeleted }: ClientTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) {
      return;
    }

    try {
      await deleteClient(id);
      toast.success("Cliente eliminado exitosamente");
      onClientDeleted(id);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error("Error al eliminar el cliente");
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.nombre}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.telefono}</TableCell>
              <TableCell>{client.direccion}</TableCell>
              <TableCell>
                {format(
                  client.fechaRegistro instanceof Date 
                    ? client.fechaRegistro 
                    : new Date(client.fechaRegistro),
                  "dd/MM/yyyy",
                  { locale: es }
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/clientes/${client.id}/editar`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}