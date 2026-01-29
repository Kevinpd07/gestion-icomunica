"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "./sidebar"

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
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
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ml-2">
          <span className="text-xs font-medium text-primary">AD</span>
        </div>
      </div>
    </header>
  )
}
