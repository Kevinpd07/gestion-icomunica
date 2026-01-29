"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuotaCardProps {
  total: number
  used: number
  available: number
}

export function QuotaCard({ total, used, available }: QuotaCardProps) {
  const percentage = Math.round((used / total) * 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-card-foreground">
          Cuota de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg className="h-36 w-36 -rotate-90 transform">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="72"
                cy="72"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-card-foreground">
                {percentage}%
              </span>
              <span className="text-xs text-muted-foreground">Usado</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center gap-4 text-center sm:text-left">
            <div>
              <p className="text-sm text-muted-foreground">Asignación Total</p>
              <p className="text-2xl font-semibold text-card-foreground">
                {total.toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Usados</p>
                <p className="text-xl font-semibold text-primary">
                  {used.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-xl font-semibold text-success">
                  {available.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-4">
          Representación de la cuota asignada en número de usuarios a la plataforma InfoComunica
        </p>
      </CardContent>
    </Card>
  )
}
