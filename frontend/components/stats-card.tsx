import type { ReactNode } from "react"

interface StatsCardProps {
  icon: ReactNode
  value: string
  label: string
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-center shadow-sm">
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

