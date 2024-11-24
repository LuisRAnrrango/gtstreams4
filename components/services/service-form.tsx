"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Servicio, Proveedor } from "@/types";
import { getProviders } from "@/lib/actions/providers";
import { toast } from "sonner";

const formSchema = z.object({
  nombreservicio: z.string().min(1, "El nombre del servicio es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  imagen: z.string().url("URL de imagen inválida"),
  link: z.string().url("URL inválida"),
  numeroperfiles: z.coerce.number().min(1, "Debe tener al menos 1 perfil"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  proveedorId: z.string().min(1, "El proveedor es requerido"),
});

interface ServiceFormProps {
  initialData?: Servicio;
  onSubmit: (data: any) => Promise<void>;
}

export function ServiceForm({ initialData, onSubmit }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Proveedor[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (error) {
        console.error('Error loading providers:', error);
        toast.error("Error al cargar los proveedores");
      }
    };
    loadProviders();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreservicio: initialData?.nombreservicio || "",
      descripcion: initialData?.descripcion || "",
      imagen: initialData?.imagen || "",
      link: initialData?.link || "",
      numeroperfiles: initialData?.numeroperfiles || 1,
      precio: initialData?.precio || 0,
      proveedorId: initialData?.proveedorId || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="proveedorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombreservicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Servicio</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Netflix Premium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción del servicio"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link del Servicio</FormLabel>
              <FormControl>
                <Input placeholder="https://www.netflix.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroperfiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Perfiles</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}