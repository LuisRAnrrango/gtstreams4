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
import { Cuenta, Servicio } from "@/types";
import { getServices } from "@/lib/actions/services";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formSchema = z.object({
  cuenta: z.string().min(1, "La cuenta es requerida"),
  servicioId: z.string().min(1, "El servicio es requerido"),
  nombreServicio: z.string().min(1, "El nombre del servicio es requerido"),
  fechaFacturacion: z.date({
    required_error: "La fecha de facturación es requerida",
  }),
  observacion: z.string().optional(),
  passwordCorreo: z.string().min(1, "La contraseña del correo es requerida"),
  passwordCuenta: z.string().min(1, "La contraseña de la cuenta es requerida"),
  perfilesLibres: z.coerce.number().min(0, "No puede ser negativo"),
  perfilesOcupados: z.coerce.number().min(0, "No puede ser negativo"),
});

interface AccountFormProps {
  initialData?: Cuenta;
  onSubmit: (data: any) => Promise<void>;
}

export function AccountForm({ initialData, onSubmit }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Servicio[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };
    loadServices();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuenta: initialData?.cuenta || "",
      servicioId: initialData?.servicioId || "",
      nombreServicio: initialData?.nombreServicio || "",
      fechaFacturacion: initialData?.fechaFacturacion || new Date(),
      observacion: initialData?.observacion || "",
      passwordCorreo: initialData?.passwordCorreo || "",
      passwordCuenta: initialData?.passwordCuenta || "",
      perfilesLibres: initialData?.perfilesLibres || 0,
      perfilesOcupados: initialData?.perfilesOcupados || 0,
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

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      form.setValue('nombreServicio', service.nombreservicio);
      form.setValue('servicioId', serviceId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cuenta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta</FormLabel>
              <FormControl>
                <Input placeholder="Cuenta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servicioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicio</FormLabel>
              <Select
                onValueChange={handleServiceChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.nombreservicio}
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
          name="fechaFacturacion"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Facturación</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={
                        "w-full pl-3 text-left font-normal"
                      }
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observación</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones adicionales"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="passwordCorreo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña del Correo</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Contraseña del correo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordCuenta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña de la Cuenta</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Contraseña de la cuenta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="perfilesLibres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfiles Libres</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="perfilesOcupados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfiles Ocupados</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}