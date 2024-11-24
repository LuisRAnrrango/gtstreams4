"use client";

import { useRouter } from "next/navigation";
import { ClientForm } from "@/components/clients/client-form";
import { createClient } from "@/lib/actions/clients";
import { Cliente } from "@/types";
import { toast } from "sonner";

export default function NuevoClientePage() {
  const router = useRouter();

  const onSubmit = async (data: Omit<Cliente, 'id' | 'fechaRegistro'>) => {
    try {
      await createClient(data);
      toast.success("Cliente creado exitosamente");
      router.push("/dashboard/clientes");
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error("Error al crear el cliente");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h2>
      <ClientForm onSubmit={onSubmit} />
    </div>
  );
}