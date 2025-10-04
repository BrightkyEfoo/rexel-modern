"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, LogOut, User, Settings } from "lucide-react";
import { useAuth, useLogout } from "@/lib/auth/nextauth-hooks";

interface AdminHeaderProps {
  className?: string;
}

export function AdminHeader({ className }: AdminHeaderProps) {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  return (
    <header className={`border-b bg-background ${className}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center space-x-4">
          <Logo size="md" showText={false} />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">
              Administration
            </h1>
            <p className="text-sm text-muted-foreground">Panel de gestion</p>
          </div>
        </div>

        {/* Menu utilisateur admin */}
        <div className="flex items-center space-x-4">
          {/* Indicateur admin */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Mode Admin</span>
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden md:block font-medium">
                  {user?.name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.type === "admin" ? "Administrateur" : "Manager"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
