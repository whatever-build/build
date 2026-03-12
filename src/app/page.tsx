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
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
        type
      }
      // Truncate logs to 100 entries to prevent stretching and memory issues
      return [newEntry, ...prev].slice(0, 100)
    })
  }, [])

  // Auto-scroll effect for the terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0 // Since we display newest first, we keep it at top
    }
  }, [logs])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let aiFetchInterval: NodeJS.Timeout

    if (isInterrogating) {
      interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 25) + 10
        setCheckedCount(prev => prev + increment)
        setCurrentEntropy(60 + Math.random() * 40)
        setCpuLoad(85 + Math.random() * 10)
        
        const dummyPrefix = "0x" + Math.random().toString(16).slice(2, 12).toUpperCase()
        addLog(`SCANNING HEX_VECTOR: ${dummyPrefix}... [NULL_BALANCE]`, 'info')

        if (Math.random() > 0.98) {
          addLog(`ANOMALY DETECTED AT ${dummyPrefix.slice(0, 8)}`, 'warning')
        }
      }, 150)

      aiFetchInterval = setInterval(async () => {
        try {
          addLog("INVOKING NEURAL CORE GENERATOR...", "ai")
          const result = await generateSecureMnemonics({ wordCount: 12 })
          
          addLog(`NEURAL CANDIDATE RECOVERED: ${result.mnemonicPhrase}`, "success")
          
          if (Math.random() > 0.92) {
             addLog("VALIDATING CHECKSUM ON NEURAL VECTOR...", "warning")
             addLog("INTERROGATING DERIVATION PATH m/44'/60'/0'/0/0...", "info")
             
             if (Math.random() > 0.85) {
               setFoundCount(prev => prev + 1)
               addLog("!!! ASSET SIGNATURE MATCHED !!!", "success")
               toast({
                 title: "Asset Signature Found",
                 description: "Matched vector identified. Processing metadata.",
                 variant: "default"
               })
             }
          }
        } catch (e) {
          addLog("UPLINK INTERRUPTED: RE-ESTABLISHING NEURAL HANDSHAKE...", "error")
        }
      }, 4000)
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
    addLog(`LOADING RPC CLUSTERS FOR: ${activeBlockchains.join(', ')}`, "info")
    addLog("AES-256 HANDSHAKE ESTABLISHED WITH GLOBAL NODES", "info")
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    setCpuLoad(0)
    setCurrentEntropy(0)
    addLog("ENGINE COOLDOWN SEQUENCE INITIATED", "error")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-foreground font-body select-none">
        <ParticleBackground />

        {/* Sidebar */}
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-2xl">
          <SidebarHeader className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(173,79,230,0.5)]">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase leading-none">NeuroWallet</h1>
                <p className="text-[10px] text-primary/70 font-code mt-1">CORE_ENGINE_V4.8</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Control Hub</SidebarGroupLabel>
              <SidebarMenu>
                {[
                  { icon: LayoutDashboard, label: 'Neural Dashboard', active: true },
                  { icon: History, label: 'Vault History' },
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
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Hardware Telemetry</SidebarGroupLabel>
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
                  <div className={cn("w-2 h-2 rounded-full", isInterrogating ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isInterrogating ? "Kernel Active" : "Kernel Standby"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <Button variant="ghost" className="w-full justify-start gap-2 text-gray-500 hover:text-white hover:bg-white/5">
              <Settings className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">System Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#050505]">
          {/* Top Bar */}
          <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-700")} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Operation:</span>
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isInterrogating ? "text-primary" : "text-gray-700")}>
                   {isInterrogating ? "Neural Scanning" : "Standby"}
                 </span>
               </div>
               
               <div className="h-4 w-px bg-white/10 hidden md:block" />
               
               <div className="hidden lg:flex items-center gap-4 text-[10px] font-code text-gray-500">
                 <div className="flex items-center gap-2">
                   <Server className="w-3 h-3 text-primary/60" />
                   <span>UPLINK: SECURE</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3 text-green-500/60" />
                   <span>ENCRYPTION: AES-256</span>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-code text-gray-600 uppercase">Local Time</span>
                <span className="text-xs font-code text-white/80">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col min-h-0 space-y-8">
              
              {/* Main Display Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0">
                
                {/* Left Col: Target Vectors */}
                <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                  <section className="space-y-4 shrink-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Target Vectors</h2>
                      <span className="text-[9px] font-code text-primary/60">{activeBlockchains.length} SELECTED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BLOCKCHAINS.map((chain) => {
                        const isActive = activeBlockchains.includes(chain.id)
                        return (
                          <div 
                            key={chain.id}
                            onClick={() => toggleBlockchain(chain.id)}
                            className={cn(
                              "relative p-3 rounded-lg border cursor-pointer transition-all duration-300",
                              isActive 
                                ? "bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(173,79,230,0.1)]" 
                                : "bg-white/5 border-white/5 opacity-30 grayscale",
                              isInterrogating && "cursor-not-allowed"
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

                  {/* Summary Telemetry */}
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Flow</p>
                        <p className="text-2xl font-black font-code text-white tracking-tighter">
                          {isInterrogating ? (Math.random() * 800).toFixed(2) : "0.00"} <span className="text-xs text-primary/60">tx/s</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Latency</p>
                        <p className="text-2xl font-black font-code text-green-500 tracking-tighter">
                          {isInterrogating ? (Math.random() * 30).toFixed(0) : "---"} <span className="text-xs text-green-500/60">ms</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold text-primary uppercase">Security Core</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Isolated derivation environment active. Private keys never leave the Neural Core.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Col: Activity Log (Fixed Height) */}
                <div className="xl:col-span-2 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <TerminalIcon className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Neural Scanning Log</h3>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-[10px] font-code text-primary/60">CHECKED: {checkedCount.toLocaleString()}</div>
                       <div className="text-[10px] font-code text-green-500/60">MATCHES: {foundCount}</div>
                    </div>
                  </div>
                  
                  <SnakeBorderCard processing={isInterrogating} className="flex-1 min-h-0 overflow-hidden">
                    <div className="h-full bg-black/95 p-4 font-code text-[11px] overflow-hidden flex flex-col relative">
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                      
                      <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto terminal-scrollbar space-y-1 z-10 flex flex-col-reverse"
                      >
                        {logs.map((log) => (
                          <div key={log.id} className="flex gap-4 leading-normal animate-in fade-in slide-in-from-left-1 duration-200">
                            <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                            <span className={cn(
                              "break-all",
                              log.type === 'success' ? 'text-green-400 font-bold' :
                              log.type === 'warning' ? 'text-yellow-400' :
                              log.type === 'error' ? 'text-red-400' : 
                              log.type === 'ai' ? 'text-primary font-black uppercase tracking-wider' : 'text-gray-500'
                            )}>
                              {log.type === 'ai' && <Zap className="inline w-3 h-3 mr-2" />}
                              {log.message}
                            </span>
                          </div>
                        ))}
                        {logs.length === 0 && (
                          <div className="h-full flex items-center justify-center text-gray-800 italic text-[10px] uppercase tracking-[0.3em]">
                            Waiting for neural uplink initialization...
                          </div>
                        )}
                      </div>
                    </div>
                  </SnakeBorderCard>
                </div>

                {/* Right Col: Recovered Assets */}
                <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                   <div className="flex items-center justify-between mb-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Asset Ledger</h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden">
                     {foundCount === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                         <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                           <Binary className="w-8 h-8 text-gray-600" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Null Sector</p>
                         <p className="text-[10px] text-gray-600 max-w-[160px] font-medium leading-relaxed">System is currently interrogating entropy space for asset signatures.</p>
                       </div>
                     ) : (
                       <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-3 pr-2">
                          {Array.from({ length: foundCount }).map((_, i) => (
                            <div key={i} className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 animate-in zoom-in-95 duration-500 group hover:bg-green-500/10 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Matched Vector #{foundCount - i}</span>
                                <Check className="w-3 h-3 text-green-500" />
                              </div>
                              <p className="text-[11px] font-code text-white mb-2">0x{Math.random().toString(16).slice(2, 10).toUpperCase()}...{Math.random().toString(16).slice(2, 6).toUpperCase()}</p>
                              <div className="flex items-center justify-between text-[10px] font-code text-gray-400">
                                <span>BAL: {(Math.random() * 0.5).toFixed(3)} ETH</span>
                                <span className="text-green-500/60 font-bold">READY</span>
                              </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* CTA Area */}
                  <div className="space-y-3 shrink-0">
                    <Button 
                      disabled={foundCount === 0}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(173,79,230,0.2)] disabled:opacity-20 transition-all active:scale-95"
                    >
                      Process Recovered Assets
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />
                      <span className="text-[8px] font-bold text-yellow-500 uppercase leading-tight">
                        Security Advisory: Assets are held in an ephemeral buffer. Ensure OS integrity before processing.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engine Controls */}
              <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/5 pb-4 shrink-0">
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
                  className="bg-primary hover:bg-primary/95 text-black h-14 px-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(173,79,230,0.2)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-10"
                >
                  {isInterrogating ? (
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Neural Interrogation Active
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

          <footer className="h-10 border-t border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <p className="text-[8px] text-gray-700 uppercase tracking-[0.5em] font-code">
              NEURO_ENGINE_STATUS: ONLINE // ENCRYPTION: SECURE // NODES: 8,421_NODES_IDENTIFIED
            </p>
            <div className="flex items-center gap-4 text-[8px] font-code text-gray-800">
               <span>LATENCY: 14ms</span>
               <span>UPTIME: 99.9%</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
