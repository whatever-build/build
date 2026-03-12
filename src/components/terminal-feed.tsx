"use client"

import React, { useEffect, useRef } from 'react'

export interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
}

interface TerminalFeedProps {
  logs: LogEntry[]
}

export function TerminalFeed({ logs }: TerminalFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-terminal-green'
      case 'error': return 'text-destructive'
      case 'warning': return 'text-yellow-400'
      case 'system': return 'text-terminal-cyan'
      default: return 'text-foreground/80'
    }
  }

  return (
    <div className="bg-black/90 border border-border rounded-md font-code text-sm p-4 h-[400px] flex flex-col shadow-inner">
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2 opacity-50">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
        <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground">NeuroCore Live Activity Feed</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto terminal-scrollbar space-y-1"
      >
        {logs.length === 0 && (
          <div className="text-muted-foreground animate-pulse">Waiting for interrogation initialization...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed">
            <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
            <span className={getColor(log.type)}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
