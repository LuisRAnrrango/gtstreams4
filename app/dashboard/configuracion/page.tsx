"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-1 space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>
              Personaliza el aspecto visual de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTheme('light')}
                  className="h-10 w-10"
                >
                  <Sun className="h-5 w-5" />
                  <span className="sr-only">Tema Claro</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setTheme('dark')}
                  className="h-10 w-10"
                >
                  <Moon className="h-5 w-5" />
                  <span className="sr-only">Tema Oscuro</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}