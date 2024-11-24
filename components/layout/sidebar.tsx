"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserNav } from "@/components/layout/user-nav";
import { 
  LayoutDashboard,
  MonitorPlay,
  Users, 
  Store,
  ShoppingBag,
  Settings,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Inicio",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Cuentas",
    icon: MonitorPlay,
    href: "/dashboard/cuentas",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/dashboard/clientes",
  },
  {
    label: "Proveedores",
    icon: Store,
    href: "/dashboard/proveedores",
  },
  {
    label: "Servicios",
    icon: ShoppingBag,
    href: "/dashboard/servicios",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/dashboard/configuracion",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed left-4 top-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="p-6 flex justify-between items-center">
            <h1 className="text-xl font-bold">Gestión Streaming</h1>
            <UserNav />
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="space-y-2 p-3">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === route.href && "bg-secondary"
                  )}
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestión Streaming</h1>
          <UserNav />
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === route.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}