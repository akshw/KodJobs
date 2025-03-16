"use client"

import type { ReactNode } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center text-center rounded-xl border bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-md hover:-translate-y-1",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      <div className="mb-4 rounded-full bg-yellow-100 p-3 relative overflow-hidden group">
        <div className="relative z-10">{icon}</div>
        <div className="absolute inset-0 bg-yellow-200 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

