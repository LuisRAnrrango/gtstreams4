"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/components/clients/client-form";
import { getClient, updateClient } from "@/lib/actions/clients";
import { Cliente } from "@/types";
import { toast } from "sonner";

export default function EditarClientePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await getClient(params.id);
        if (!data) {
          toast.error("Cliente no encontrado");
          router.push("/dashboard/clientes");
          return;
        }
        setClient(data);
      } catch (error) {
        console.error('Error loading client:', error);
        toast.error("Error al cargar el cliente");
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [params.id, router]);

  const onSubmit = async (data: Partial<Cliente>) => {
    try {
      await updateClient(params.id, data);
      toast.success("Cliente actualizado exitosamente");
      router.push("/dashboard/clientes");
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error("Error al actualizar el cliente");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!client) {
    return <div className="flex justify-center p-8">Cliente no encontrado</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Editar Cliente</h2>
      <ClientForm initialData={client} onSubmit={onSubmit} />
    </div>
  );
}