"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Cpu, 
  Activity, 
  RefreshCcw, 
  Wallet,
  Binary,
  Power,
  Database,
  Globe,
  Lock,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  History,
  Zap,
  SearchCode,
  ArrowDownCircle,
  BarChart3,
  TrendingUp,
  Cloud,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import { generateSecureMnemonics } from '@/ai/flows/generate-secure-mnemonics'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'bg-[#f7931a]' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'bg-[#627eea]' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: 'S', color: 'bg-[#14f195]' },
  { id: 'trx', name: 'Tron', symbol: 'TRX', icon: 'T', color: 'bg-[#ff0013]' },
  { id: 'bnb', name: 'Binance', symbol: 'BNB', icon: 'B', color: 'bg-[#f3ba2f]' },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', icon: 'X', color: 'bg-[#23292f]' },
]

const SERVERS = [
  { id: 'us-east', name: 'US EAST 01', region: 'North America', latency: '12ms', status: 'active', load: 45 },
  { id: 'eu-west', name: 'EU WEST 04', region: 'Europe', latency: '28ms', status: 'active', load: 72 },
  { id: 'asia-pac', name: 'ASIA PAC 02', region: 'Singapore', latency: '145ms', status: 'standby', load: 12 },
  { id: 'sa-east', name: 'SA EAST 01', region: 'Brazil', latency: '88ms', status: 'active', load: 31 },
]

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'system';
}

type TabType = 'dashboard' | 'withdraw' | 'server' | 'settings';

export default function AiCryptoDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>(BLOCKCHAINS.map(b => b.id))
  const [currentEntropy, setCurrentEntropy] = useState(0)
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([75])
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [systemTime, setSystemTime] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
        type
      }
      return [newEntry, ...prev].slice(0, 100)
    })
  }, [])

  useEffect(() => {
    const updateTime = () => {
      setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0 
    }
  }, [logs])

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isInterrogating) {
      timerInterval = setInterval(() => {
        setSessionSeconds(prev => prev + 1)
      }, 1000)
    } else {
      setSessionSeconds(0)
    }
    return () => clearInterval(timerInterval)
  }, [isInterrogating])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let aiFetchInterval: NodeJS.Timeout

    if (isInterrogating) {
      const bootSequence = [
        { msg: "BOOTING SYSTEM ENGINE", type: 'system' as const },
        { msg: "ESTABLISHING SECURE CONNECTION", type: 'system' as const },
        { msg: "MAPPING NETWORK NODES", type: 'info' as const },
        { msg: "PROBE ACTIVE COMMENCING SCAN", type: 'success' as const }
      ]
      
      bootSequence.forEach((step, idx) => {
        setTimeout(() => addLog(step.msg, step.type), idx * 600)
      })

      interval = setInterval(() => {
        const multiplier = systemIntensity[0] / 50
        const increment = Math.floor((Math.random() * 25 + 10) * multiplier)
        setCheckedCount(prev => prev + increment)
        setCurrentEntropy(75 + Math.random() * 20)
        setCpuLoad(systemIntensity[0] + (Math.random() * 5))
      }, 200)

      aiFetchInterval = setInterval(async () => {
        try {
          addLog("GENERATING NEURAL SEED CANDIDATE", "ai")
          const result = await generateSecureMnemonics({ wordCount: 12 })
          addLog(`CANDIDATE: ${result.mnemonicPhrase}`, "success")
          
          if (Math.random() > 0.85) {
             addLog("VALIDATING ASSET SIGNATURE", "warning")
             if (Math.random() > 0.7) {
               setFoundCount(prev => prev + 1)
               const walletId = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase()
               addLog(`MATCH FOUND: ${walletId}`, "success")
               toast({ title: "Asset Found", description: `Wallet ${walletId} identified.`, variant: "default" })
             }
          }
        } catch (e) {
          addLog("UPLINK ERROR RETRYING", "error")
        }
      }, 4000)
    } else {
      setCpuLoad(0)
      setCurrentEntropy(0)
    }

    return () => {
      clearInterval(interval)
      clearInterval(aiFetchInterval)
    }
  }, [isInterrogating, addLog, toast, systemIntensity])

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
    addLog("INITIALIZING SEARCH PROTOCOL", "system")
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    addLog("ENGINE COOLDOWN INITIATED", "error")
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-transparent overflow-hidden text-foreground font-body select-none">
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl">
          <SidebarHeader className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(173,79,230,0.5)]">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase leading-none text-white">AI Crypto v4.0</h1>
                <p className="text-[10px] text-primary/70 font-code mt-1 tracking-widest uppercase">Security Engine</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Navigation</SidebarGroupLabel>
              <SidebarMenu>
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
                  { icon: ArrowDownCircle, label: 'Withdraw', id: 'withdraw' },
                  { icon: Cloud, label: 'Server', id: 'server' },
                  { icon: Settings, label: 'Settings', id: 'settings' },
                ].map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeTab === item.id} 
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={cn(
                        "transition-all duration-200 h-10 px-4 rounded-lg",
                        activeTab === item.id ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(173,79,230,0.1)]" : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-tighter">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Telemetry</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-6 px-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className="text-gray-500 uppercase">System Load</span>
                    <span className="text-primary">{cpuLoad.toFixed(1)}%</span>
                  </div>
                  <Progress value={cpuLoad} className="h-1 bg-white/5" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className="text-gray-500 uppercase">Entropy Depth</span>
                    <span className="text-green-500">{currentEntropy.toFixed(1)}%</span>
                  </div>
                  <Progress value={currentEntropy} className="h-1 bg-white/5" />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", isInterrogating ? "bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isInterrogating ? "Active" : "Standby"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <div className="flex items-center justify-between px-2">
               <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">v4.0.0 Pro</span>
               <Lock className="w-3 h-3 text-gray-700" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
          <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-700")} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">State</span>
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isInterrogating ? "text-primary" : "text-gray-700")}>
                   {isInterrogating ? "Scanning" : "Ready"}
                 </span>
               </div>
               
               <div className="h-4 w-px bg-white/10 hidden md:block" />
               
               <div className="hidden lg:flex items-center gap-4 text-[10px] font-code text-gray-500">
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3 text-green-500/60" />
                   <span>Security Active</span>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-code text-gray-600 uppercase">System Time</span>
                <span className="text-xs font-code text-white/80">{systemTime || "00:00:00"}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col min-h-0">
              
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0">
                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <section className="space-y-4 shrink-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Parameters</h2>
                        <span className="text-[9px] font-code text-primary/60">{activeBlockchains.length} Chains</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {BLOCKCHAINS.map((chain) => {
                          const isActive = activeBlockchains.includes(chain.id)
                          return (
                            <div 
                              key={chain.id}
                              onClick={() => toggleBlockchain(chain.id)}
                              className={cn(
                                "relative p-3 rounded-lg border cursor-pointer transition-all duration-300 glass-panel",
                                isActive ? "border-primary/40 shadow-[0_0_20px_rgba(173,79,230,0.1)]" : "opacity-30 grayscale",
                                isInterrogating && "cursor-not-allowed"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-xl", chain.color)}>
                                  {chain.icon}
                                </div>
                                <span className={cn("text-[10px] font-bold tracking-tighter uppercase", isActive ? "text-white" : "text-gray-500")}>
                                  {chain.name}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Network Latency
                          </p>
                          <p className="text-2xl font-black font-code text-green-500 tracking-tighter">
                            {isInterrogating ? (12 + Math.random() * 5).toFixed(0) : "---"} <span className="text-xs text-green-500/60">MS</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Wallet className="w-3 h-3" /> Found Wallets
                          </p>
                          <p className="text-2xl font-black font-code text-white tracking-tighter">
                            {foundCount} <span className="text-xs text-primary/60">UNITS</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Timer className="w-3 h-3" /> Session Time
                          </p>
                          <p className="text-2xl font-black font-code text-primary tracking-tighter">
                            {formatTime(sessionSeconds)}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-6">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Neural Cluster Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-2 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <SearchCode className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Scan Console</h3>
                      </div>
                      <div className="flex gap-4">
                         <div className="text-[10px] font-code text-primary/60 uppercase">Vectors Checked: {checkedCount.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <SnakeBorderCard processing={isInterrogating} className="flex-1 min-h-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="h-full p-6 font-code text-[11px] overflow-hidden flex flex-col relative bg-black/60">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto terminal-scrollbar space-y-2 z-10 flex flex-col-reverse">
                          {logs.length === 0 && !isInterrogating && (
                            <div className="h-full flex items-center justify-center text-gray-700 uppercase tracking-widest font-bold">
                              System Standby
                            </div>
                          )}
                          {logs.map((log) => (
                            <div key={log.id} className="flex gap-4 leading-normal animate-in fade-in slide-in-from-left-1 duration-200">
                              <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                              <span className={cn(
                                "break-all uppercase",
                                log.type === 'success' ? 'text-green-400 font-bold' :
                                log.type === 'warning' ? 'text-yellow-400' :
                                log.type === 'error' ? 'text-red-400' : 
                                log.type === 'system' ? 'text-cyan-400 font-medium' :
                                log.type === 'ai' ? 'text-primary font-black tracking-wider' : 'text-gray-500'
                              )}>
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SnakeBorderCard>
                  </div>

                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <div className="flex items-center gap-2 mb-1 shrink-0">
                      <Database className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Recovery Ledger</h3>
                    </div>
                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden">
                       {foundCount === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                           <Binary className="w-8 h-8 text-gray-600 mb-4" />
                           <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Waiting for signatures</p>
                         </div>
                       ) : (
                         <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-3 pr-2">
                            {Array.from({ length: foundCount }).map((_, i) => (
                              <div key={i} className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 animate-in zoom-in-95">
                                <span className="text-[9px] font-black text-green-500 uppercase">Match #{foundCount - i}</span>
                                <p className="text-[11px] font-code text-white my-1">0x{Math.random().toString(16).slice(2, 12).toUpperCase()}...</p>
                                <div className="flex items-center justify-between text-[10px] font-code text-gray-400">
                                  <span>{(Math.random() * 0.5).toFixed(3)} ETH</span>
                                  <span className="text-green-500/60 font-bold">Verified</span>
                                </div>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                    <Button onClick={() => setActiveTab('withdraw')} disabled={foundCount === 0} className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(173,79,230,0.2)] hover:opacity-90 transition-opacity">
                      Withdraw Assets
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'withdraw' && (
                <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Earnings Session</h4>
                      </div>
                      <p className="text-4xl font-black font-code text-white">${(foundCount * 145.22).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-green-500 mt-2">Calculated from {foundCount} session matches</p>
                    </div>
                  </div>

                  <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col overflow-hidden">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Asset Disbursement</h3>
                    <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-4">
                      {foundCount > 0 ? Array.from({ length: foundCount }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                          <div className="flex items-center gap-4">
                            <Wallet className="w-5 h-5 text-primary/60" />
                            <div>
                              <p className="text-[11px] font-bold text-white uppercase tracking-wider">0x{Math.random().toString(16).slice(2, 14).toUpperCase()}</p>
                              <p className="text-[10px] text-gray-500">Session Match {foundCount - i}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-white">$145.22</p>
                            <Button variant="link" className="text-[9px] h-auto p-0 text-primary uppercase font-bold">Process</Button>
                          </div>
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                          <History className="w-12 h-12 mb-4" />
                          <p className="text-xs uppercase tracking-widest">No Active Assets Found In This Session</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'server' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Node Cluster</h3>
                    {SERVERS.map((server) => (
                      <div key={server.id} className="glass-panel p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-5">
                          <div className={cn("w-3 h-3 rounded-full", server.status === 'active' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-yellow-500")} />
                          <div>
                            <p className="text-sm font-black font-code text-white">{server.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{server.region}</p>
                          </div>
                        </div>
                        <div className="flex gap-8 text-right">
                          <div className="space-y-1">
                            <p className="text-[8px] text-gray-600 uppercase">Latency</p>
                            <p className="text-xs font-bold text-green-500">{server.latency}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] text-gray-600 uppercase">Load</p>
                            <p className="text-xs font-bold text-white">{server.load}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-panel rounded-2xl p-8 border-white/5 flex flex-col">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Topology Map</h3>
                    <div className="flex-1 relative bg-black/40 rounded-xl overflow-hidden flex items-center justify-center">
                       <Globe className="w-32 h-32 text-primary/10 animate-pulse" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border border-primary/5 rounded-full animate-ping" />
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto w-full glass-panel rounded-2xl p-10 border-white/5 animate-in zoom-in-95 duration-500">
                  <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Settings</h3>
                  
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-white uppercase tracking-widest">Processing Intensity</label>
                        <span className="text-xs font-code text-primary">{systemIntensity[0]}%</span>
                      </div>
                      <Slider 
                        value={systemIntensity} 
                        onValueChange={setSystemIntensity} 
                        max={100} 
                        step={1} 
                        disabled={isInterrogating}
                        className="cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-500 leading-relaxed uppercase">
                        Adjusts system load on this hardware cluster.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Advanced Protocols</h4>
                      <div className="grid grid-cols-1 gap-4">
                         {[
                           { title: "Autonomous Scaling", desc: "Auto adjustment based on server load." },
                           { title: "Deep Packet Scan", desc: "Scan hidden blockchain paths." },
                           { title: "Mesh Relay", desc: "Global node networking integration." }
                         ].map((opt, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{opt.title}</p>
                                <p className="text-[9px] text-gray-600 uppercase">{opt.desc}</p>
                              </div>
                              <div className="w-10 h-5 bg-white/5 rounded-full flex items-center px-1">
                                <div className="w-3 h-3 bg-gray-700 rounded-full" />
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/5 pb-4 shrink-0">
                  <Button onClick={stopInterrogation} disabled={!isInterrogating} variant="outline" className="bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-500/80 h-14 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                    <Power className="w-4 h-4 mr-3" /> Stop
                  </Button>
                  <Button onClick={startInterrogation} disabled={isInterrogating} className={cn("h-14 px-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_30px_rgba(173,79,230,0.3)] hover:opacity-90")}>
                    {isInterrogating ? (
                      <div className="flex items-center gap-3"><RefreshCcw className="w-4 h-4 animate-spin" /> Active</div>
                    ) : (
                      <div className="flex items-center gap-3"><Zap className="w-4 h-4" /> Start Scan</div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="ticker-wrap flex-1 mr-8 overflow-hidden whitespace-nowrap">
              <p className="ticker-content text-[8px] text-primary/60 uppercase tracking-[0.4em] font-code">
                Status: {isInterrogating ? "Active" : "Standby"} Nodes: 8421 Intensity: {systemIntensity[0]}% AI Model: Active Latency: 14ms
              </p>
            </div>
            <div className="flex items-center gap-4 text-[8px] font-code text-gray-600 shrink-0">
               <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500" /> Stable</span>
               <span>v4.0.0 Pro</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
