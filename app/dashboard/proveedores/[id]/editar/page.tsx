"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderForm } from "@/components/providers/provider-form";
import { getProvider, updateProvider } from "@/lib/actions/providers";
import { Proveedor } from "@/types";
import { toast } from "sonner";

export default function EditarProveedorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [provider, setProvider] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const data = await getProvider(params.id);
        if (!data) {
          toast.error("Proveedor no encontrado");
          router.push("/dashboard/proveedores");
          return;
        }
        setProvider(data);
      } catch (error) {
        console.error('Error loading provider:', error);
        toast.error("Error al cargar el proveedor");
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [params.id, router]);

  const onSubmit = async (data: Partial<Proveedor>) => {
    try {
      await updateProvider(params.id, data);
      toast.success("Proveedor actualizado exitosamente");
      router.push("/dashboard/proveedores");
    } catch (error) {
      console.error('Error updating provider:', error);
      toast.error("Error al actualizar el proveedor");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!provider) {
    return <div className="flex justify-center p-8">Proveedor no encontrado</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Editar Proveedor</h2>
      <ProviderForm initialData={provider} onSubmit={onSubmit} />
    </div>
  );
}