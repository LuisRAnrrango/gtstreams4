"use client";

import { useRouter } from "next/navigation";
import { AccountForm } from "@/components/accounts/account-form";
import { createAccount } from "@/lib/actions/accounts";
import { Cuenta } from "@/types";
import { toast } from "sonner";

export default function NuevaCuentaPage() {
  const router = useRouter();

  const onSubmit = async (data: Omit<Cuenta, "id" | "fechaRegistro">) => {
    try {
      await createAccount(data);
      toast.success("Cuenta creada exitosamente");
      router.push("/dashboard/cuentas");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error al crear la cuenta");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Nueva Cuenta</h2>
      <AccountForm onSubmit={onSubmit} />
    </div>
  );
}