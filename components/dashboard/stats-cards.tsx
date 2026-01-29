import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p
                className={cn(
                  "mt-1 text-xs",
                  trend.positive ? "text-success" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}% vs mes anterior
              </p>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalOrganismos: number
}

export function StatsCards({
  totalUsers,
  activeUsers,
  inactiveUsers,
  totalOrganismos,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Usuarios"
        value={totalUsers}
        icon={<Users className="h-5 w-5 text-primary" />}
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        label="Usuarios Activos"
        value={activeUsers}
        icon={<UserCheck className="h-5 w-5 text-success" />}
        trend={{ value: 8, positive: true }}
      />
      <StatCard
        label="Usuarios Inactivos"
        value={inactiveUsers}
        icon={<UserX className="h-5 w-5 text-destructive" />}
        trend={{ value: 3, positive: false }}
      />
      <StatCard
        label="Organismos"
        value={totalOrganismos}
        icon={<Building2 className="h-5 w-5 text-primary" />}
      />
    </div>
  )
}
