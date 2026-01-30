"use client";

import { useState, useEffect, use } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { QuotaCard } from "@/components/dashboard/quota-card";
import { UsersTable, type User } from "@/components/dashboard/users-table";
import { StatsCards } from "@/components/dashboard/stats-cards";

import { getCurrentUser } from "@/actions/auth";
import { logoutAction } from "@/actions/auth";
import { get } from "http";
import { useRouter } from "next/navigation";

// Sample data
const sampleUsers: User[] = [
  {
    id: 2,
    nombre: "Jorge García Pérez",
    usuario: "jorge",
    organismo: "CECM",
    estado: "ACTIVO",
  },
  {
    id: 3,
    nombre: "Miguel Díaz-Canel Bermúdez",
    usuario: "midica",
    organismo: "Presidencia",
    estado: "ACTIVO",
  },
  {
    id: 4,
    nombre: "Manuel Marrero Cruz",
    usuario: "mmarrero",
    organismo: "CECM",
    estado: "ACTIVO",
  },
  {
    id: 6,
    nombre: "Salvador Valdés Mesa",
    usuario: "salvador",
    organismo: "CECM",
    estado: "ACTIVO",
  },
  {
    id: 7,
    nombre: "Roberto Morales Ojeda",
    usuario: "rmorales",
    organismo: "ANPP",
    estado: "ACTIVO",
  },
  {
    id: 8,
    nombre: "Ana María Hernández",
    usuario: "ahernandez",
    organismo: "MINCOM",
    estado: "INACTIVO",
  },
  {
    id: 9,
    nombre: "Carlos López Fernández",
    usuario: "clopez",
    organismo: "MINREX",
    estado: "ACTIVO",
  },
  {
    id: 10,
    nombre: "María Elena Rodríguez",
    usuario: "mrodriguez",
    organismo: "MINSAP",
    estado: "PENDIENTE",
  },
  {
    id: 11,
    nombre: "José Antonio Martínez",
    usuario: "jmartinez",
    organismo: "MINED",
    estado: "ACTIVO",
  },
  {
    id: 12,
    nombre: "Laura Sánchez Vega",
    usuario: "lsanchez",
    organismo: "CITMA",
    estado: "ACTIVO",
  },
  {
    id: 13,
    nombre: "Pedro González Ruiz",
    usuario: "pgonzalez",
    organismo: "MINAG",
    estado: "INACTIVO",
  },
  {
    id: 14,
    nombre: "Carmen Torres Díaz",
    usuario: "ctorres",
    organismo: "MINCEX",
    estado: "ACTIVO",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null; // Redirigiendo al login

  const handleEdit = (user: User) => {
    console.log("[v0] Edit user:", user);
  };

  const handleDelete = (user: User) => {
    console.log("[v0] Delete user:", user);
  };

  const handleManage = (user: User) => {
    console.log("[v0] Manage user:", user);
  };

  const handleExport = (user: User) => {
    console.log("[v0] Export user:", user);
  };

  // Calculate stats
  const totalUsers = sampleUsers.length;
  const activeUsers = sampleUsers.filter((u) => u.estado === "ACTIVO").length;
  const inactiveUsers = sampleUsers.filter(
    (u) => u.estado === "INACTIVO",
  ).length;
  const organismos = [...new Set(sampleUsers.map((u) => u.organismo))].length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <Header
          title="Gestión de Usuarios"
          subtitle="Plataforma InfoComunica"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Stats Overview */}
            <StatsCards
              totalUsers={totalUsers}
              activeUsers={activeUsers}
              inactiveUsers={inactiveUsers}
              totalOrganismos={organismos}
            />

            {/* Quota Card */}
            <div className="grid gap-6 lg:grid-cols-3">
              <QuotaCard total={4000} used={3135} available={865} />

              {/* Quick Actions Card */}
              <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-medium text-card-foreground mb-4">
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      action: "Usuario creado",
                      user: "Laura Sánchez Vega",
                      time: "Hace 2 horas",
                    },
                    {
                      action: "Estado actualizado",
                      user: "Ana María Hernández",
                      time: "Hace 5 horas",
                    },
                    {
                      action: "Permisos modificados",
                      user: "Carlos López Fernández",
                      time: "Hace 1 día",
                    },
                    {
                      action: "Usuario importado",
                      user: "José Antonio Martínez",
                      time: "Hace 2 días",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Lista de Usuarios
              </h2>
              <UsersTable
                users={sampleUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManage={handleManage}
                onExport={handleExport}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
