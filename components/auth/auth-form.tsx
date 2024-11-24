"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  nombre: z.string().min(1, "El nombre es requerido"),
});

interface AuthFormProps {
  type: 'login' | 'register';
  onToggle: () => void;
}

export function AuthForm({ type, onToggle }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setLoading(true);
      
      if (type === 'login') {
        await signIn(values.email, values.password);
        toast.success("Inicio de sesión exitoso");
      } else {
        await signUp(values.email, values.password, values.nombre);
        toast.success("Registro exitoso");
      }
      
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </h1>
        <p className="text-muted-foreground">
          {type === 'login' 
            ? 'Ingresa tus credenciales para acceder'
            : 'Crea una cuenta para comenzar'
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === 'register' && (
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              type === 'login' ? "Iniciando sesión..." : "Registrando..."
            ) : (
              type === 'login' ? "Iniciar Sesión" : "Registrarse"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button variant="link" onClick={onToggle}>
          {type === 'login' 
            ? '¿No tienes una cuenta? Regístrate'
            : '¿Ya tienes una cuenta? Inicia sesión'
          }
        </Button>
      </div>
    </div>
  );
}