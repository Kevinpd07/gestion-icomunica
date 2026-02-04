"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { QuotaCard } from "@/components/dashboard/quota-card";
import { UsersTable, type User } from "@/components/dashboard/users-table";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getCurrentUser, getUsers } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar autenticación
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

  // Cargar usuarios iniciales
  useEffect(() => {
    if (user) {
      loadUsersData();
    }
  }, [user]);

  const loadUsersData = async () => {
    setIsLoadingUsers(true);
    setError(null);

    try {
      const result = await getUsers(1000, 1); // Cargar todos para las stats

      if (result.success && result.data) {
        const mappedUsers = result.data.data || [];
        setUsers(
          mappedUsers.map((strapiUser: any) => ({
            id: strapiUser.pcu_id_username,
            nombre:
              `${(strapiUser.pcu_name || "").trim()} ${(strapiUser.pcu_surnames || "").trim()}`.trim(),
            usuario: strapiUser.pcu_icomunica_user || "",
            provincia: strapiUser.pcu_province_residence || "",
            cargo: strapiUser.pcu_employment_position || "",
            organismo: strapiUser.pcu_work_name || "",
            organismoAcronimo: strapiUser.pcu_work_acronym || "",
            estado: "ACTIVO" as const,
          })),
        );
      } else {
        setError(result.error || "Error al cargar usuarios");
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error inesperado al cargar usuarios");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Calculate stats
  const activeUsers = users.filter((u) => u.estado === "ACTIVO").length;
  const inactiveUsers = users.filter((u) => u.estado === "INACTIVO").length;
  const organismos = [...new Set(users.map((u) => u.organismo))].length;

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
              totalUsers={totalUsers || users.length}
              activeUsers={activeUsers}
              inactiveUsers={inactiveUsers}
              totalOrganismos={organismos}
            />

            {/* Quota Card */}
            <div className="grid gap-6 lg:grid-cols-3">
              <QuotaCard
                total={4000}
                used={totalUsers || users.length}
                available={4000 - (totalUsers || users.length)}
              />

              {/* Quick Actions Card */}
              <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-medium text-card-foreground mb-4">
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  {users.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          Usuario registrado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.nombre}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {user.organismoAcronimo}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && !isLoadingUsers && !error && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay actividad reciente
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Lista de Usuarios
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUsersData}
                  disabled={isLoadingUsers}
                  className="bg-transparent"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoadingUsers ? "animate-spin" : ""}`}
                  />
                  Actualizar
                </Button>
              </div>

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-destructive/30 bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                  <p className="text-destructive font-medium mb-2">
                    Error al cargar los datos
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={loadUsersData}
                    className="bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              )}

              {/* Table - Siempre mostrar */}
              {!error && (
                <UsersTable
                  onEdit={(user) => console.log("Edit", user)}
                  onDelete={(user) => console.log("Delete", user)}
                  onManage={(user) => console.log("Manage", user)}
                  onExport={(user) => console.log("Export", user)}
                  onTotalChange={(total) => setTotalUsers(total)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
