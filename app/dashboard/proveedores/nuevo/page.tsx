"use client";

import { useRouter } from "next/navigation";
import { ProviderForm } from "@/components/providers/provider-form";
import { createProvider } from "@/lib/actions/providers";
import { Proveedor } from "@/types";
import { toast } from "sonner";

export default function NuevoProveedorPage() {
  const router = useRouter();

  const onSubmit = async (data: Omit<Proveedor, 'id' | 'fechaRegistro'>) => {
    try {
      await createProvider(data);
      toast.success("Proveedor creado exitosamente");
      router.push("/dashboard/proveedores");
    } catch (error) {
      console.error('Error creating provider:', error);
      toast.error("Error al crear el proveedor");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Nuevo Proveedor</h2>
      <ProviderForm onSubmit={onSubmit} />
    </div>
  );
}