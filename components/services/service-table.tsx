"use client";

import { useState, useEffect } from "react";
import { Servicio, Proveedor } from "@/types";
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
import { Pencil, Trash2, Search, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteService } from "@/lib/actions/services";
import { getProviders } from "@/lib/actions/providers";
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
import Image from "next/image";

interface ServiceTableProps {
  services: Servicio[];
  onServiceDeleted: () => void;
}

export function ServiceTable({ services, onServiceDeleted }: ServiceTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<{ [key: string]: Proveedor }>({});

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providersData = await getProviders();
        const providersMap = providersData.reduce((acc, provider) => {
          acc[provider.id] = provider;
          return acc;
        }, {} as { [key: string]: Proveedor });
        setProviders(providersMap);
      } catch (error) {
        console.error('Error loading providers:', error);
        toast.error("Error al cargar los proveedores");
      }
    };
    loadProviders();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteService(deleteId);
      toast.success("Servicio eliminado exitosamente");
      onServiceDeleted();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Error al eliminar el servicio");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const filteredServices = services.filter((service) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      service.nombreservicio.toLowerCase().includes(searchTermLower) ||
      service.descripcion.toLowerCase().includes(searchTermLower) ||
      (providers[service.proveedorId]?.nombre || "").toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Perfiles</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    {searchTerm ? "No se encontraron servicios" : "No hay servicios registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="relative h-10 w-10">
                        <Image
                          src={service.imagen}
                          alt={service.nombreservicio}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{service.nombreservicio}</TableCell>
                    <TableCell>{providers[service.proveedorId]?.nombre || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">{service.descripcion}</TableCell>
                    <TableCell>{service.numeroperfiles}</TableCell>
                    <TableCell>${service.precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(service.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {format(
                        service.fechaRegistro instanceof Date 
                          ? service.fechaRegistro 
                          : new Date(service.fechaRegistro),
                        "dd/MM/yyyy",
                        { locale: es }
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/servicios/${service.id}/editar`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteId(service.id)}
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
              Esta acción no se puede deshacer. El servicio será eliminado permanentemente.
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