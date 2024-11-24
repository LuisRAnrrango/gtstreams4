"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/services/service-form";
import { getService, updateService } from "@/lib/actions/services";
import { Servicio } from "@/types";
import { toast } from "sonner";

export default function EditarServicioPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await getService(params.id);
        if (!data) {
          toast.error("Servicio no encontrado");
          router.push("/dashboard/servicios");
          return;
        }
        setService(data);
      } catch (error) {
        console.error('Error loading service:', error);
        toast.error("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [params.id, router]);

  const onSubmit = async (data: Partial<Servicio>) => {
    try {
      await updateService(params.id, data);
      toast.success("Servicio actualizado exitosamente");
      router.push("/dashboard/servicios");
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error("Error al actualizar el servicio");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!service) {
    return <div className="flex justify-center p-8">Servicio no encontrado</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Editar Servicio</h2>
      <ServiceForm initialData={service} onSubmit={onSubmit} />
    </div>
  );
}