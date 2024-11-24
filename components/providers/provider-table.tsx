"use client";

import { useState } from "react";
import { Proveedor } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProvider } from "@/lib/actions/providers";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface ProviderTableProps {
  providers: Proveedor[];
  onProviderDeleted: () => void;
}

export function ProviderTable({ providers, onProviderDeleted }: ProviderTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteProvider(deleteId);
      toast.success("Proveedor eliminado exitosamente");
      onProviderDeleted();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error("Error al eliminar el proveedor");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      provider.nombre.toLowerCase().includes(searchTermLower) ||
      provider.email.toLowerCase().includes(searchTermLower) ||
      provider.telefono.toLowerCase().includes(searchTermLower) ||
      provider.direccion.toLowerCase().includes(searchTermLower) ||
      provider.servicio.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {searchTerm ? "No se encontraron proveedores" : "No hay proveedores registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.nombre}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.telefono}</TableCell>
                    <TableCell>{provider.direccion}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {provider.servicio}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.estado === 'activo' ? 'success' : 'destructive'}>
                        {provider.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(
                        provider.fechaRegistro instanceof Date 
                          ? provider.fechaRegistro 
                          : new Date(provider.fechaRegistro),
                        "dd/MM/yyyy",
                        { locale: es }
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/proveedores/${provider.id}/editar`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteId(provider.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proveedor será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}