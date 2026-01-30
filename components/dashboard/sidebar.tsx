"use client";

import React, { useEffect } from "react";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { getCurrentUser } from "@/actions/auth";

interface SidebarProps {
  className?: string;
  onMobileClose?: () => void;
  isMobileOpen?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  active?: boolean;
  children?: { label: string; href: string; active?: boolean }[];
}

interface User {
  email: string;
  role: string;
  username: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "#",
  },
  {
    label: "InfoComunica",
    icon: <MessageSquare className="h-4 w-4" />,
    active: true,
    children: [
      { label: "Gestión de Usuarios", href: "#", active: true },
      { label: "Organismos", href: "#" },
      { label: "Estadísticas", href: "#" },
    ],
  },
  {
    label: "Usuarios",
    icon: <Users className="h-4 w-4" />,
    href: "#",
  },
  {
    label: "Organismos",
    icon: <Building2 className="h-4 w-4" />,
    href: "#",
  },
  {
    label: "Configuración",
    icon: <Settings className="h-4 w-4" />,
    href: "#",
  },
];

function getInitialsFromString(name?: string) {
  if (!name) return "AD";
  const raw = name.includes("@") ? name.split("@")[0] : name;
  const parts = raw.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Sidebar({
  className,
  onMobileClose,
  isMobileOpen,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "InfoComunica",
  ]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                InfoComunica
              </h1>
              <p className="text-xs text-muted-foreground">Panel de Gestión</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="text-sm font-medium">
                {getInitialsFromString(
                  user?.username ?? user?.email ?? "Administrador",
                )}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate uppercase">
                {user?.username || "Administrador"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role}:{user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="mb-2">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              General
            </span>
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        item.active
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      {expandedItems.includes(item.label) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedItems.includes(item.label) && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                child.active
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                              )}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      item.active
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClick}>
      <Menu className="h-5 w-5" />
      <span className="sr-only">Abrir menú</span>
    </Button>
  );
}
