"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  UserCog,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Filter,
  Loader2,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers } from "@/actions/auth";

export interface User {
  id: number;
  nombre: string;
  usuario: string;
  provincia: string;
  cargo: string;
  organismoAcronimo: string;
  organismo: string;
  estado: "ACTIVO" | "INACTIVO" | "PENDIENTE";
}

// Interfaz de la API de Strapi
interface StrapiUser {
  id: number;
  pcu_id_username: number;
  pcu_name: string;
  pcu_surnames: string;
  pcu_province_residence: string;
  pcu_employment_position: string;
  pcu_work_name: string;
  pcu_work_acronym: string;
  pcu_workweb: string;
  pcu_icomunica_user: string;
}

interface StrapiResponse {
  data: StrapiUser[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Mapear datos de Strapi a nuestro formato
function mapStrapiUser(strapiUser: StrapiUser): User {
  return {
    id: strapiUser.pcu_id_username,
    nombre:
      `${(strapiUser.pcu_name || "").trim()} ${(strapiUser.pcu_surnames || "").trim()}`.trim(),
    usuario: strapiUser.pcu_icomunica_user || "",
    provincia: strapiUser.pcu_province_residence || "",
    cargo: strapiUser.pcu_employment_position || "",
    organismo: strapiUser.pcu_work_name || "",
    organismoAcronimo: strapiUser.pcu_work_acronym || "",
    estado: "ACTIVO",
  };
}

interface UsersTableProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onManage?: (user: User) => void;
  onExport?: (user: User) => void;
  onTotalChange?: (total: number) => void;
}

export function UsersTable({
  onEdit,
  onDelete,
  onManage,
  onExport,
  onTotalChange,
}: UsersTableProps) {
  console.log("🎨 UsersTable component mounted");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Estado para datos
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Función para cargar usuarios
  const loadUsers = useCallback(async () => {
    console.log("🚀 loadUsers iniciando...", {
      entriesPerPage,
      currentPage,
      debouncedSearch,
    });

    setIsLoading(true);
    setError(null);

    try {
      console.log("📞 Llamando a getUsers...");
      const result = await getUsers(
        parseInt(entriesPerPage),
        currentPage,
        debouncedSearch || undefined,
      );

      console.log("📊 Resultado de getUsers:", result);

      if (result.success && result.data) {
        const strapiData = result.data;

        console.log("🔍 DEBUGGING strapiData:", {
          completo: strapiData,
          tipoData: typeof strapiData.data,
          esArrayData: Array.isArray(strapiData.data),
          longitudData: strapiData.data?.length,
          primerosElementos: strapiData.data?.slice?.(0, 2),
        });

        // Verificar que data.data sea un array
        if (!Array.isArray(strapiData.data)) {
          console.error("❌ strapiData.data NO es un array:", strapiData.data);
          setError("Formato de datos inválido");
          setUsers([]);
          return;
        }

        const mappedUsers = strapiData.data.map(mapStrapiUser);
        console.log("✨ Usuarios mapeados:", mappedUsers.length);
        setUsers(mappedUsers);

        const newPagination = strapiData.meta?.pagination || {
          page: currentPage,
          limit: parseInt(entriesPerPage),
          total: mappedUsers.length,
          totalPages: 1,
        };
        setPagination(newPagination);

        if (onTotalChange && newPagination.total) {
          onTotalChange(newPagination.total);
        }
      } else {
        console.error("⚠️ Error en resultado:", result.error);
        setError(result.error || "Error al cargar usuarios");
        setUsers([]);
      }
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      setError("Error inesperado al cargar usuarios");
      setUsers([]);
    } finally {
      setIsLoading(false);
      console.log("🏁 loadUsers finalizado");
    }
  }, [currentPage, entriesPerPage, debouncedSearch, onTotalChange]);

  // Cargar usuarios cuando cambien los parámetros
  useEffect(() => {
    console.log("🔄 useEffect triggered - calling loadUsers");
    loadUsers();
  }, [loadUsers]);

  // Debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const getStatusBadge = (estado: User["estado"]) => {
    const variants = {
      ACTIVO: "bg-success/20 text-success border-success/30",
      INACTIVO: "bg-destructive/20 text-destructive border-destructive/30",
      PENDIENTE: "bg-warning/20 text-warning border-warning/30",
    };
    return (
      <Badge variant="outline" className={cn("font-medium", variants[estado])}>
        {estado}
      </Badge>
    );
  };

  // Generar números de página visibles
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const totalPages = pagination.totalPages;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Siempre mostrar primera página
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Páginas alrededor de la actual
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Siempre mostrar última página
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const totalPages = pagination.totalPages;
  const startRecord = (currentPage - 1) * pagination.limit + 1;
  const endRecord = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
          {selectedUsers.length > 0 && (
            <Button variant="outline" size="sm" className="bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              {selectedUsers.length} seleccionados
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:w-64 bg-input border-border"
            />
            {(isLoading || searchQuery !== debouncedSearch) && searchQuery && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      users.length > 0 && selectedUsers.length === users.length
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead className="w-20 text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                <TableHead className="text-muted-foreground">Usuario</TableHead>
                <TableHead className="text-muted-foreground">
                  Provincia
                </TableHead>
                <TableHead className="text-muted-foreground">Cargo</TableHead>
                <TableHead className="text-muted-foreground">
                  Institución
                </TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Operaciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Cargando usuarios...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {debouncedSearch
                      ? `No se encontraron usuarios para "${debouncedSearch}"`
                      : "No se encontraron usuarios."}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn(
                      "border-border transition-colors",
                      selectedUsers.includes(user.id) && "bg-primary/5",
                      isLoading && "opacity-50",
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                        aria-label={`Seleccionar ${user.nombre}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {user.id}
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">
                      {user.nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.usuario}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.provincia}
                    </TableCell>
                    <TableCell
                      className="text-muted-foreground max-w-[200px] truncate"
                      title={user.cargo}
                    >
                      {user.cargo}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="block">{user.organismoAcronimo}</span>
                      <span
                        className="text-xs text-muted-foreground/70 max-w-[150px] truncate block"
                        title={user.organismo}
                      >
                        {user.organismo}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => onEdit?.(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => onManage?.(user)}
                        >
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Administrar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => onExport?.(user)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Exportar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete?.(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrar</span>
            <Select
              value={entriesPerPage}
              onValueChange={(value) => {
                setEntriesPerPage(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>
              | Mostrando {pagination.total > 0 ? startRecord : 0} - {endRecord}{" "}
              de <strong>{pagination.total.toLocaleString()}</strong> registros
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Primera página */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primera</span>
            </Button>

            {/* Anterior */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {getVisiblePages().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent",
                    )}
                    onClick={() => setCurrentPage(page as number)}
                    disabled={isLoading}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>

            {/* Siguiente */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={
                currentPage === totalPages || totalPages === 0 || isLoading
              }
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>

            {/* Última página */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={
                currentPage === totalPages || totalPages === 0 || isLoading
              }
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
