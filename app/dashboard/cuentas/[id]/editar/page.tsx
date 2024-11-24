"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountForm } from "@/components/accounts/account-form";
import { getAccount, updateAccount } from "@/lib/actions/accounts";
import { Cuenta } from "@/types";
import { toast } from "sonner";

export default function EditarCuentaPage({ params }: { params: { id: string } }) {
  const [account, setAccount] = useState<Cuenta | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const data = await getAccount(params.id);
        if (!data) {
          toast.error("Cuenta no encontrada");
          router.push("/dashboard/cuentas");
          return;
        }
        setAccount(data);
      } catch (error) {
        console.error("Error loading account:", error);
        toast.error("Error al cargar la cuenta");
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [params.id, router]);

  const onSubmit = async (data: Partial<Cuenta>) => {
    try {
      await updateAccount(params.id, data);
      toast.success("Cuenta actualizada exitosamente");
      router.push("/dashboard/cuentas");
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error al actualizar la cuenta");
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
      <h2 className="text-3xl font-bold tracking-tight">Editar Cuenta</h2>
      <AccountForm initialData={account} onSubmit={onSubmit} />
    </div>
  );
}