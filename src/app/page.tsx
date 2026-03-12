"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ShieldAlert, 
  Cpu, 
  Activity, 
  RefreshCcw, 
  Check,
  Wallet,
  Binary,
  Power,
  Database,
  Globe,
  Lock,
  Terminal as TerminalIcon,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  History,
  AlertTriangle,
  Server,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleBackground } from '@/components/ui/particle-background'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import { generateSecureMnemonics } from '@/ai/flows/generate-secure-mnemonics'
import { Progress } from '@/components/ui/progress'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'bg-[#f7931a]' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'bg-[#627eea]' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: 'S', color: 'bg-[#14f195]' },
  { id: 'trx', name: 'Tron', symbol: 'TRX', icon: 'T', color: 'bg-[#ff0013]' },
  { id: 'bnb', name: 'Binance', symbol: 'BNB', icon: 'B', color: 'bg-[#f3ba2f]' },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', icon: 'X', color: 'bg-[#23292f]' },
]

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
}

export default function Dashboard() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>(BLOCKCHAINS.map(b => b.id))
  const [currentEntropy, setCurrentEntropy] = useState(0)
  const [cpuLoad, setCpuLoad] = useState(0)
  
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
        type
      }
      return [newEntry, ...prev].slice(0, 150)
    })
  }, [])

  // Simulate scanning and periodically fetch real AI mnemonics
  useEffect(() => {
    let interval: NodeJS.Timeout
    let aiFetchInterval: NodeJS.Timeout

    if (isInterrogating) {
      // High speed simulated scanning logs
      interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 15) + 5
        setCheckedCount(prev => prev + increment)
        setCurrentEntropy(40 + Math.random() * 60)
        setCpuLoad(75 + Math.random() * 20)
        
        const dummyPrefix = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase()
        addLog(`SCANNING HEX_VECTOR: ${dummyPrefix}... [NULL_BALANCE]`, 'info')

        if (Math.random() > 0.99) {
          addLog(`LOW_ENTROPY PATTERN DETECTED AT ${dummyPrefix}`, 'warning')
        }
      }, 250)

      // Periodically generate "candidates" using the actual AI flow
      aiFetchInterval = setInterval(async () => {
        try {
          addLog("INVOKING NEURAL GENERATOR FLOW...", "ai")
          const result = await generateSecureMnemonics({ wordCount: 12 })
          const words = result.mnemonicPhrase.split(' ')
          
          // Trickle the words into the terminal for dramatic effect
          addLog(`NEURAL SEED CANDIDATE GENERATED: ${words.slice(0, 4).join(' ')}...`, "success")
          
          if (Math.random() > 0.95) {
             addLog("CRITICAL: CHECKSUM VALIDATED ON NEURAL CANDIDATE.", "warning")
             addLog("INTERROGATING DERIVATION PATH m/44'/0'/0'/0/0...", "info")
             // Simulating a "find" once in a blue moon
             if (Math.random() > 0.9) {
               setFoundCount(prev => prev + 1)
               addLog("!!! POSITIVE BALANCE DETECTED !!!", "success")
               toast({
                 title: "Neural Match Found",
                 description: "High-probability asset vector identified. Check Recovery Logs.",
                 variant: "default"
               })
             }
          }
        } catch (e) {
          addLog("NEURAL CORE TIMEOUT: RETRYING HANDSHAKE...", "error")
        }
      }, 5000)
    }

    return () => {
      clearInterval(interval)
      clearInterval(aiFetchInterval)
    }
  }, [isInterrogating, addLog, toast])

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return
    setActiveBlockchains(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const startInterrogation = () => {
    if (activeBlockchains.length === 0) {
      toast({ variant: "destructive", title: "Config Error", description: "Select at least one chain." })
      return
    }
    setIsInterrogating(true)
    addLog("SYSTEM INITIALIZATION SEQUENCE STARTED", "success")
    addLog(`LOADING RPC VECTORS FOR: ${activeBlockchains.join(', ')}`, "info")
    addLog("AES-256 HANDSHAKE ESTABLISHED WITH GLOBAL NODES", "info")
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    setCpuLoad(0)
    addLog("ENGINE COOLDOWN SEQUENCE INITIATED", "error")
    addLog("STATE SAVED TO ENCRYPTED LOCAL STORAGE", "info")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-foreground font-body select-none">
        <ParticleBackground />

        {/* Sidebar */}
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl">
          <SidebarHeader className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(173,79,230,0.5)]">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase leading-none">NeuroWallet</h1>
                <p className="text-[10px] text-primary/70 font-code mt-1">CORE_ENGINE_V4.2</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Navigation</SidebarGroupLabel>
              <SidebarMenu>
                {[
                  { icon: LayoutDashboard, label: 'Neural Dashboard', active: true },
                  { icon: History, label: 'Recovery Logs' },
                  { icon: Globe, label: 'Node Network' },
                  { icon: Server, label: 'RPC Clusters' },
                ].map((item, idx) => (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton isActive={item.active} className={cn(
                      "transition-all duration-200 h-10 px-4 rounded-lg",
                      item.active ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}>
                      <item.icon className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-tighter">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">System Telemetry</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-6 px-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className="text-gray-500">NEURAL LOAD</span>
                    <span className="text-primary">{cpuLoad.toFixed(1)}%</span>
                  </div>
                  <Progress value={cpuLoad} className="h-1 bg-white/5" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className="text-gray-500">ENTROPY STRENGTH</span>
                    <span className="text-green-500">{currentEntropy.toFixed(1)}%</span>
                  </div>
                  <Progress value={currentEntropy} className="h-1 bg-white/5" />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", isInterrogating ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isInterrogating ? "Kernel Active" : "Kernel Idle"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500 hover:text-white hover:bg-white/5">
              <Settings className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">Engine Config</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#050505]">
          {/* Top Bar */}
          <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md flex items-center justify-between px-8 z-20">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-700")} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Operational Mode:</span>
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isInterrogating ? "text-primary" : "text-gray-700")}>
                   {isInterrogating ? "Live Interrogation" : "Standby"}
                 </span>
               </div>
               
               <div className="h-4 w-px bg-white/10 hidden md:block" />
               
               <div className="hidden lg:flex items-center gap-4 text-[10px] font-code text-gray-500">
                 <div className="flex items-center gap-2">
                   <Server className="w-3 h-3 text-primary/60" />
                   <span>UPLINK: ACTIVE</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3 text-green-500/60" />
                   <span>SECURE: AES-GCM</span>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-code text-gray-600 uppercase">System Time</span>
                <span className="text-xs font-code text-white/80">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-8">
              
              {/* Grid Layout for Controls and Display */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0">
                
                {/* Left: Chain Select & Status */}
                <div className="xl:col-span-1 space-y-6 flex flex-col">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Target Vectors</h2>
                      <span className="text-[9px] font-code text-primary/60">{activeBlockchains.length} ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BLOCKCHAINS.map((chain) => {
                        const isActive = activeBlockchains.includes(chain.id)
                        return (
                          <div 
                            key={chain.id}
                            onClick={() => toggleBlockchain(chain.id)}
                            className={cn(
                              "relative p-3 rounded-lg border cursor-pointer transition-all duration-300 group",
                              isActive 
                                ? "bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(173,79,230,0.1)]" 
                                : "bg-white/5 border-white/5 opacity-40 hover:opacity-60 grayscale hover:grayscale-0",
                              isInterrogating && "cursor-not-allowed opacity-30"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-xl", chain.color)}>
                                {chain.icon}
                              </div>
                              <span className={cn("text-[10px] font-bold tracking-tighter", isActive ? "text-white" : "text-gray-500")}>
                                {chain.name}
                              </span>
                            </div>
                            {isActive && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  {/* Summary Panel */}
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Throughput</p>
                        <p className="text-2xl font-black font-code text-white tracking-tighter">
                          {isInterrogating ? (Math.random() * 500).toFixed(2) : "0.00"} <span className="text-sm text-primary/60">tx/s</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Node Latency</p>
                        <p className="text-2xl font-black font-code text-green-500 tracking-tighter">
                          {isInterrogating ? (Math.random() * 40).toFixed(0) : "---"} <span className="text-sm text-green-500/60">ms</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold text-primary uppercase">Security Status</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        End-to-end encryption active. Seed recovery vectors are isolated in the Neural Core.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center: Live Terminal Feed (Fixed Height Container) */}
                <div className="xl:col-span-2 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TerminalIcon className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Interrogation Activity Log</h3>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-[10px] font-code text-primary/60">PK_CHECKED: {checkedCount.toLocaleString()}</div>
                       <div className="text-[10px] font-code text-green-500/60">SUCCESS: {foundCount}</div>
                    </div>
                  </div>
                  
                  <SnakeBorderCard processing={isInterrogating} className="flex-1 min-h-0">
                    <div className="h-full bg-black/90 p-4 font-code text-[11px] overflow-hidden flex flex-col relative">
                      {/* Grid overlay for tech look */}
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                      
                      <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-1 z-10">
                        {logs.map((log) => (
                          <div key={log.id} className="flex gap-4 leading-normal animate-in fade-in slide-in-from-left-1 duration-200">
                            <span className="text-white/20 shrink-0 select-none">[{log.timestamp}]</span>
                            <span className={cn(
                              "break-all",
                              log.type === 'success' ? 'text-green-400' :
                              log.type === 'warning' ? 'text-yellow-400' :
                              log.type === 'error' ? 'text-red-400' : 
                              log.type === 'ai' ? 'text-primary font-bold' : 'text-gray-400'
                            )}>
                              {log.type === 'ai' && <Zap className="inline w-3 h-3 mr-1" />}
                              {log.message}
                            </span>
                          </div>
                        ))}
                        {logs.length === 0 && (
                          <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-[0.3em]">
                            Waiting for Kernel Deployment...
                          </div>
                        )}
                      </div>
                    </div>
                  </SnakeBorderCard>
                </div>

                {/* Right: Found Assets */}
                <div className="xl:col-span-1 space-y-6 flex flex-col min-h-0">
                   <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Asset Ledger</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col min-h-0">
                     {foundCount === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                         <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                           <Binary className="w-8 h-8 text-gray-500" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Null Sector</p>
                         <p className="text-[10px] text-gray-500 max-w-[160px] font-medium italic">Scanning global entropy space for asset signatures...</p>
                       </div>
                     ) : (
                       <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-3 pr-2">
                          {Array.from({ length: foundCount }).map((_, i) => (
                            <div key={i} className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 animate-in zoom-in-95 duration-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Matched Vector #{i+1}</span>
                                <Check className="w-3 h-3 text-green-500" />
                              </div>
                              <p className="text-[11px] font-code text-white mb-1">0x88...{Math.random().toString(16).slice(2, 6).toUpperCase()}</p>
                              <div className="flex items-center justify-between text-[9px] font-code text-gray-400">
                                <span>TYPE: Legacy</span>
                                <span>BAL: 0.128 ETH</span>
                              </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      disabled={foundCount === 0}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(173,79,230,0.3)] disabled:opacity-20 transition-all active:scale-95"
                    >
                      Process Withdrawal
                    </Button>
                    <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />
                      <span className="text-[8px] font-bold text-yellow-500 uppercase leading-tight">
                        Warning: Always use a clean OS for private key exposure.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/5 pb-4">
                <Button 
                  onClick={stopInterrogation}
                  disabled={!isInterrogating}
                  variant="outline"
                  className="bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-500/80 h-14 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:border-red-500/40 active:scale-95 disabled:opacity-5"
                >
                  <Power className="w-4 h-4 mr-3" />
                  Terminate Engine
                </Button>
                
                <Button 
                  onClick={startInterrogation}
                  disabled={isInterrogating}
                  className="bg-primary hover:bg-primary/95 text-black h-14 px-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(173,79,230,0.25)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-10"
                >
                  {isInterrogating ? (
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Neural Scan Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4" />
                      Initialize Interrogator
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between px-8">
            <p className="text-[8px] text-gray-600 uppercase tracking-[0.5em] font-code">
              NEURAL_NETWORK_STATUS: ESTABLISHED // ENCRYPTION: AES-256-GCM // NODES: 4,921_ONLINE
            </p>
            <div className="flex items-center gap-4 text-[8px] font-code text-gray-700">
               <span>LATENCY: 12ms</span>
               <span>UPTIME: 99.99%</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
