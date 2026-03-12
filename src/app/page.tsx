"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ShieldAlert, 
  Cpu, 
  Search, 
  Zap, 
  Activity, 
  RefreshCcw, 
  Check,
  Wallet,
  Binary,
  Power,
  ChevronRight,
  Database,
  Globe,
  Lock,
  Terminal as TerminalIcon,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ParticleBackground } from '@/components/ui/particle-background'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin (BTC)', symbol: 'BTC', icon: '₿', color: 'bg-[#f7931a]' },
  { id: 'eth', name: 'Ethereum (ETH)', symbol: 'ETH', icon: 'Ξ', color: 'bg-[#627eea]' },
  { id: 'sol', name: 'Solana (SOL)', symbol: 'SOL', icon: 'S', color: 'bg-[#14f195]' },
  { id: 'trx', name: 'Tron (TRX)', symbol: 'TRX', icon: 'T', color: 'bg-[#ff0013]' },
  { id: 'bnb', name: 'Binance (BNB)', symbol: 'BNB', icon: 'B', color: 'bg-[#f3ba2f]' },
  { id: 'xrp', name: 'Ripple (XRP)', symbol: 'XRP', icon: 'X', color: 'bg-[#23292f]' },
]

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function Dashboard() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>(BLOCKCHAINS.map(b => b.id))
  const [currentEntropy, setCurrentEntropy] = useState(0)
  
  const logContainerRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        type
      }
      const updated = [newEntry, ...prev]
      return updated.slice(0, 100)
    })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterrogating) {
      interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 8) + 1
        setCheckedCount(prev => prev + increment)
        setCurrentEntropy(Math.random() * 100)
        
        const mnemonics = ["alpha", "beta", "gamma", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima"]
        const randomWords = mnemonics.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ")
        
        if (Math.random() > 0.98) {
          addLog(`Potential match detected: ${randomWords}... Analyzing checksum...`, 'warning')
        } else {
          addLog(`Scanning address space: ${randomWords}... Balance: 0.00`, 'info')
        }
      }, 120)
    }
    return () => clearInterval(interval)
  }, [isInterrogating, addLog])

  const toggleBlockchain = (id: string) => {
    setActiveBlockchains(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const startInterrogation = () => {
    if (activeBlockchains.length === 0) {
      toast({ variant: "destructive", title: "Configuration Error", description: "At least one blockchain must be enabled for neural interrogation." })
      return
    }
    setIsInterrogating(true)
    addLog("Neural engine initialized. Handshaking with RPC nodes...", "success")
    addLog(`Targeting networks: ${activeBlockchains.join(', ').toUpperCase()}`, "info")
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    addLog("Interrogation sequence terminated manually.", "error")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-foreground font-body">
        <ParticleBackground />

        {/* Neural Engine Sidebar */}
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl">
          <SidebarHeader className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Cpu className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tighter uppercase">NeuroWallet AI</h1>
                <p className="text-[10px] text-primary/70 font-code">v4.0 ELITE EDITION</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/40 px-4 text-[10px] uppercase tracking-widest py-2">System Core</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-white/5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Neural Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <History className="w-4 h-4" />
                    <span>Recovery Logs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Globe className="w-4 h-4" />
                    <span>Node Network</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-white/40 px-4 text-[10px] uppercase tracking-widest py-2">Security Layers</SidebarGroupLabel>
              <SidebarGroupContent className="px-4 py-2 space-y-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-gray-400">Entropy Engine</span>
                    <span className="text-[11px] text-primary font-code">{currentEntropy.toFixed(2)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${currentEntropy}%` }} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[11px] text-gray-300">Biometric Auth Active</span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
              <span>Engine Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
          <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/30 backdrop-blur-md flex items-center justify-between px-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-600")} />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">System Status:</span>
                <span className={cn("text-xs font-bold uppercase", isInterrogating ? "text-primary" : "text-gray-500")}>
                  {isInterrogating ? "Processing" : "Standby"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10">
                <Database className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-code text-gray-400">NODES: 1,429 ACTIVE</span>
              </div>
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
          </header>

          <div className="flex-1 p-8 overflow-y-auto terminal-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Blockchain Selector Grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Chain Interrogation Matrix</h2>
                  <span className="text-[10px] text-gray-500">SELECT ACTIVE VECTORS FOR SCANNING</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {BLOCKCHAINS.map((chain) => {
                    const isActive = activeBlockchains.includes(chain.id)
                    return (
                      <div 
                        key={chain.id}
                        onClick={() => toggleBlockchain(chain.id)}
                        className={cn(
                          "relative p-4 rounded-xl cursor-pointer transition-all border duration-300 overflow-hidden",
                          isActive 
                            ? "bg-[#10b981]/10 border-[#10b981]/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                            : "bg-white/5 border-white/5 opacity-50 hover:opacity-80"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl mb-3 shadow-2xl", chain.color)}>
                          {chain.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-gray-500">{chain.symbol}</p>
                          <p className={cn("text-xs font-bold", isActive ? "text-[#10b981]" : "text-gray-400")}>{chain.name.split(' ')[0]}</p>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                            isActive ? "bg-[#10b981] border-[#10b981]" : "bg-transparent border-white/20"
                          )}>
                            {isActive && <Check className="w-3 h-3 text-black stroke-[4]" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Main Scanning Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Statistics Terminal */}
                <div className="lg:col-span-2 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Live Activity Feed</h3>
                    </div>
                    <div className="text-[10px] font-code text-primary/60">CHECKED: {checkedCount.toLocaleString()}</div>
                  </div>
                  
                  <SnakeBorderCard processing={isInterrogating} className="flex-1 min-h-[400px]">
                    <div className="p-4 h-full font-code text-sm overflow-hidden flex flex-col">
                      <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-1.5">
                        {logs.map((log) => (
                          <div key={log.id} className="flex gap-4 opacity-0 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                            <span className={cn(
                              "leading-tight",
                              log.type === 'success' ? 'text-green-400' :
                              log.type === 'warning' ? 'text-yellow-400' :
                              log.type === 'error' ? 'text-red-400' : 'text-gray-400'
                            )}>
                              {log.message}
                            </span>
                          </div>
                        ))}
                        {logs.length === 0 && (
                          <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-[0.2em]">
                            Neural Core Ready for Deployment...
                          </div>
                        )}
                      </div>
                    </div>
                  </SnakeBorderCard>
                </div>

                {/* Found Assets Panel */}
                <div className="flex flex-col space-y-4">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Recovered Assets</h3>
                    </div>
                    <div className="text-[10px] font-code text-primary/60">FOUND: {foundCount}</div>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center relative group">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-primary/50 transition-colors">
                       <Binary className="w-8 h-8 text-gray-600 group-hover:text-primary transition-colors" />
                     </div>
                     <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cluster Status</p>
                     <p className="text-xs text-gray-400 max-w-[180px]">No high-entropy positive matches found in current neural iteration.</p>
                     
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none rounded-xl" />
                  </div>
                  
                  {/* Withdrawal Module (Placeholder) */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-primary uppercase">Secure Withdrawal</span>
                      <ShieldAlert className="w-3 h-3 text-primary" />
                    </div>
                    <Button 
                      disabled={foundCount === 0}
                      className="w-full bg-primary hover:bg-primary/80 text-black font-bold h-10 rounded-lg text-xs uppercase tracking-tighter"
                      onClick={() => toast({ title: "Verification Required", description: "Standard withdrawal requires prioritized recovery vectors." })}
                    >
                      Process Withdrawal
                    </Button>
                  </div>
                </div>
              </div>

              {/* Control Cluster */}
              <div className="flex flex-wrap gap-4 items-center justify-center pt-8 border-t border-white/5">
                <Button 
                  onClick={stopInterrogation}
                  disabled={!isInterrogating}
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-500 h-14 px-12 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-20"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Terminate
                </Button>
                
                <Button 
                  onClick={startInterrogation}
                  disabled={isInterrogating}
                  className="bg-primary hover:bg-primary/90 text-black h-14 px-16 rounded-xl font-bold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(173,79,230,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-20"
                >
                  {isInterrogating ? (
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Interrogating
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4" />
                      Initialize Engine
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-code">
              Neural Network Connectivity: ESTABLISHED // Encrypted Connection: AES-256-GCM
            </p>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
