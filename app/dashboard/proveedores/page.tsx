"use client";

import { useEffect, useState } from "react";
import { ProviderTable } from "@/components/providers/provider-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getProviders } from "@/lib/actions/providers";
import { Proveedor } from "@/types";
import { toast } from "sonner";

export default function ProveedoresPage() {
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error("Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderDeleted = () => {
    loadProviders();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Proveedores</h2>
        <Button asChild>
          <Link href="/dashboard/proveedores/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Link>
        </Button>
      </div>
      <ProviderTable providers={providers} onProviderDeleted={handleProviderDeleted} />
    </div>
  );
}