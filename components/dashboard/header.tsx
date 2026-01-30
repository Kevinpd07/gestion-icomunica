"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "./sidebar";
import { getCurrentUser, logoutAction } from "@/actions/auth";
import { useEffect, useState, useRef } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

interface User {
  email: string;
  role: string;
  username: string;
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  function getInitialsFromString(name?: string) {
    if (!name) return "AD";
    const raw = name.includes("@") ? name.split("@")[0] : name;
    const parts = raw.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return "AD";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger onClick={onMenuClick} />
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-9 bg-input border-border"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            3
          </span>
          <span className="sr-only">Notificaciones</span>
        </Button>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ml-2"
          >
            <span className="text-xs font-medium text-primary">
              {getInitialsFromString(
                user?.username ?? user?.email ?? "Administrador",
              )}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md bg-card border border-border p-2 shadow-lg z-50">
              <div className="mb-1 px-2 text-xs text-muted-foreground">
                {user?.username || user?.email || "Administrador"}
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full text-left rounded px-2 py-1 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
