"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface StatsCounterProps {
  icon: ReactNode
  value: number
  suffix?: string
  label: string
  duration?: number
}

export function StatsCounter({ icon, value, suffix = "", label, duration = 2000 }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  useEffect(() => {
    if (!inView) return

    let start = 0
    const end = value
    const incrementTime = duration / end
    const counter = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(counter)
    }, incrementTime)

    return () => {
      clearInterval(counter)
    }
  }, [inView, value, duration])

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center rounded-lg border bg-card p-4 text-center shadow-sm transition-all duration-500",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold">
        {inView ? count : 0}
        {suffix}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

