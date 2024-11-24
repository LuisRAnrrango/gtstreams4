import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Juan Díaz</p>
          <p className="text-sm text-muted-foreground">Netflix Premium</p>
        </div>
        <div className="ml-auto font-medium">+$15.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">María Rodríguez</p>
          <p className="text-sm text-muted-foreground">Disney+ Bundle</p>
        </div>
        <div className="ml-auto font-medium">+$18.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>CP</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Carlos Pérez</p>
          <p className="text-sm text-muted-foreground">HBO Max</p>
        </div>
        <div className="ml-auto font-medium">+$12.00</div>
      </div>
    </div>
  );
}