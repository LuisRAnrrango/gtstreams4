"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getClients } from "@/lib/actions/clients";
import { Cliente } from "@/types";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleClientDeleted = () => {
    loadClients();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Button asChild>
          <Link href="/dashboard/clientes/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>
      <DataTable clients={clients} onClientDeleted={handleClientDeleted} />
    </div>
  );
}