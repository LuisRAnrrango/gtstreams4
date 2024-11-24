"use client";

import { useRouter } from "next/navigation";
import { ServiceForm } from "@/components/services/service-form";
import { createService } from "@/lib/actions/services";
import { Servicio } from "@/types";
import { toast } from "sonner";

export default function NuevoServicioPage() {
  const router = useRouter();

  const onSubmit = async (data: Omit<Servicio, 'id' | 'fechaRegistro'>) => {
    try {
      await createService(data);
      toast.success("Servicio creado exitosamente");
      router.push("/dashboard/servicios");
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error("Error al crear el servicio");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Nuevo Servicio</h2>
      <ServiceForm onSubmit={onSubmit} />
    </div>
  );
}