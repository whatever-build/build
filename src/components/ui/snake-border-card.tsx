"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SnakeBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  processing?: boolean
  children: React.ReactNode
}

export function SnakeBorderCard({ active = true, processing = false, children, className, ...props }: SnakeBorderCardProps) {
  return (
    <div className={cn(
      "snake-border-container group flex flex-col", 
      processing && "active-processing",
      className
    )} {...props}>
      {active && <div className="snake-border-animation" />}
      <div className="snake-border-content flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}
