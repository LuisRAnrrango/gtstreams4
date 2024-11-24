"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccount } from "@/lib/actions/accounts";
import { getClients } from "@/lib/actions/clients";
import { createProfile } from "@/lib/actions/profiles";
import { Cliente, Cuenta } from "@/types";
import { toast } from "sonner";
import { ProfileForm } from "@/components/profiles/profile-form";
import { addDays } from "date-fns";

export default function NuevoPerfilPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [account, setAccount] = useState<Cuenta | null>(null);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountData, clientsData] = await Promise.all([
          getAccount(params.id),
          getClients()
        ]);

        if (!accountData) {
          toast.error("Cuenta no encontrada");
          router.push("/dashboard/cuentas");
          return;
        }

        setAccount(accountData);
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, router]);

  const onSubmit = async (data: any) => {
    try {
      const client = clients.find(c => c.id === data.clienteId);
      if (!client || !account) return;

      const profileData = {
        cuentaId: account.id,
        clienteId: data.clienteId,
        nombreCliente: client.nombre,
        nombrePerfil: data.nombrePerfil,
        pin: data.pin,
        telefono: data.telefono,
        estado: 'activo',
        fechaInicio: data.fechaContrato,
        fechaFin: addDays(data.fechaContrato, 30),
        generaPago: data.generaPago,
        precio: account.nombreServicio.toLowerCase().includes("netflix") ? 4 : 3.50,
      };

      await createProfile(profileData);
      toast.success("Perfil creado exitosamente");
      router.push("/dashboard/cuentas");
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error al crear el perfil");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!account) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Nuevo Perfil</h2>
      <div className="flex flex-col space-y-2">
        <p><strong>Cuenta:</strong> {account.cuenta}</p>
        <p><strong>Servicio:</strong> {account.nombreServicio}</p>
      </div>
      <ProfileForm 
        clients={clients}
        onSubmit={onSubmit}
        onCancel={() => router.push("/dashboard/cuentas")}
      />
    </div>
  );
}