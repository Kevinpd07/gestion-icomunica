"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface User {
  id: number
  nombre: string
  usuario: string
  organismo: string
  estado: "ACTIVO" | "INACTIVO" | "PENDIENTE"
}

interface UsersTableProps {
  users: User[]
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
  onManage?: (user: User) => void
  onExport?: (user: User) => void
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onManage,
  onExport,
}: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organismo.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const paginatedUsers = useMemo(() => {
    const perPage = parseInt(entriesPerPage)
    const start = (currentPage - 1) * perPage
    return filteredUsers.slice(start, start + perPage)
  }, [filteredUsers, entriesPerPage, currentPage])

  const totalPages = Math.ceil(filteredUsers.length / parseInt(entriesPerPage))

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id))
    }
  }

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (estado: User["estado"]) => {
    const variants = {
      ACTIVO: "bg-success/20 text-success border-success/30",
      INACTIVO: "bg-destructive/20 text-destructive border-destructive/30",
      PENDIENTE: "bg-warning/20 text-warning border-warning/30",
    }
    return (
      <Badge variant="outline" className={cn("font-medium", variants[estado])}>
        {estado}
      </Badge>
    )
  }

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
            <Button variant="outline" size="sm">
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-9 sm:w-64 bg-input border-border"
            />
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
                      paginatedUsers.length > 0 &&
                      selectedUsers.length === paginatedUsers.length
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead className="w-16 text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                <TableHead className="text-muted-foreground">Usuario</TableHead>
                <TableHead className="text-muted-foreground">Organismo</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Operaciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn(
                      "border-border transition-colors",
                      selectedUsers.includes(user.id) && "bg-primary/5"
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
                      {user.organismo}
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
                setEntriesPerPage(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-16 bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>de {filteredUsers.length} registros</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      currentPage === page && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
