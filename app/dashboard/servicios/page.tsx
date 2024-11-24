"use client";

import { useEffect, useState } from "react";
import { ServiceTable } from "@/components/services/service-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getServices } from "@/lib/actions/services";
import { Servicio } from "@/types";
import { toast } from "sonner";

export default function ServiciosPage() {
  const [services, setServices] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error("Error al cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceDeleted = () => {
    loadServices();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Servicios</h2>
        <Button asChild>
          <Link href="/dashboard/servicios/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Link>
        </Button>
      </div>
      <ServiceTable services={services} onServiceDeleted={handleServiceDeleted} />
    </div>
  );
}