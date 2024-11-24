"use client";

import { useEffect, useState } from "react";
import { AccountTable } from "@/components/accounts/account-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getAccounts } from "@/lib/actions/accounts";
import { Cuenta } from "@/types";
import { toast } from "sonner";

export default function CuentasPage() {
  const [accounts, setAccounts] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error("Error al cargar las cuentas");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeleted = () => {
    loadAccounts();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cuentas</h2>
        <Button asChild>
          <Link href="/dashboard/cuentas/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Link>
        </Button>
      </div>
      <AccountTable accounts={accounts} onAccountDeleted={handleAccountDeleted} />
    </div>
  );
}