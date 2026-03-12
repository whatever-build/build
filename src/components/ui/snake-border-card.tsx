"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SnakeBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  children: React.ReactNode
}

export function SnakeBorderCard({ active = true, children, className, ...props }: SnakeBorderCardProps) {
  return (
    <div className={cn("snake-border-container group", className)} {...props}>
      {active && <div className="snake-border-animation" />}
      <div className="snake-border-content h-full">
        {children}
      </div>
    </div>
  )
}
