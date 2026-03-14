
"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Cpu, 
  Activity, 
  Wallet,
  Power,
  Globe,
  Lock,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  Zap,
  SearchCode,
  ArrowDownCircle,
  Cloud,
  Timer,
  Terminal,
  Share2,
  Unplug,
  Layers,
  RotateCcw,
  LogOut,
  Signal,
  Network,
  Server as ServerIcon,
  Dna,
  RefreshCw,
  Trash2,
  Gauge,
  AlertTriangle,
  Type,
  Palette,
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Microchip,
  Shield,
  History,
  WifiOff,
  Wifi
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import * as bip39 from 'bip39'
import { logout } from '@/app/login/actions'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png" },
  { id: 'eth', name: 'Ethereum', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png" },
  { id: 'sol', name: 'Solana', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png" },
  { id: 'bnb', name: 'BNB Chain', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png" },
  { id: 'tron', name: 'Tron', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/trx.png" },
  { id: 'xrp', name: 'Ripple', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png" },
  { id: 'ltc', name: 'Litecoin', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png" },
  { id: 'matic', name: 'Polygon', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png" },
  { id: 'usdt', name: 'Tether', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png" },
  { id: 'usdc', name: 'USDC', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png" },
]

const SERVERS = [
  { id: 'node-premium-01', name: 'NEURAL CORE PRIME', region: 'Geneva, Switzerland', latency: '3ms', status: 'active', load: 1, ip: '45.13.252.1' },
  { id: 'node-premium-02', name: 'QUANTUM UPLINK', region: 'Luxembourg City, Lux', latency: '5ms', status: 'active', load: 3, ip: '185.19.23.4' },
  { id: 'node-na-east', name: 'NORTH AMERICA EAST', region: 'Virginia, USA', latency: '12ms', status: 'active', load: 42, ip: '142.250.190.46' },
  { id: 'node-eu-central', name: 'EUROPE CENTRAL', region: 'Frankfurt, Germany', latency: '28ms', status: 'active', load: 68, ip: '172.217.16.174' },
  { id: 'node-asia-se', name: 'ASIA SOUTHEAST', region: 'Singapore', latency: '145ms', status: 'active', load: 12, ip: '34.101.0.1' },
  { id: 'node-asia-ne', name: 'ASIA NORTHEAST', region: 'Tokyo, Japan', latency: '112ms', status: 'active', load: 54, ip: '35.190.247.0' },
  { id: 'node-arctic-north', name: 'ARCTIC NORTH', region: 'Reykjavik, Iceland', latency: '45ms', status: 'active', load: 8, ip: '35.200.0.0' },
]

const SEED_COLORS = [
  { name: 'Classic Silver', class: 'text-[#dcdcdc]' },
  { name: 'Neural Violet', class: 'text-primary' },
  { name: 'Matrix Green', class: 'text-[#7CFFB2]' },
  { name: 'Cyber Cyan', class: 'text-cyan-400' },
  { name: 'Gold Amber', class: 'text-amber-400' },
  { name: 'Cyber RGB', class: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-gradient font-bold' },
]

const BOOT_LOGS = [
  "[BOOT] Initializing AI Crypto Engine v4.0",
  "[SYS] Verifying system modules...",
  "[SYS] Memory allocation successful",
  "[SECURITY] AES-256 encryption verified",
  "[NETWORK] Checking node connectivity...",
  "[NODE] Bitcoin network connected",
  "[NODE] Ethereum network connected",
  "[NODE] BNB Chain node active",
  "[NODE] Solana cluster synced",
  "[NODE] Tron node operational",
  "[NODE] XRP ledger connected",
  "[NODE] Litecoin node synced",
  "[NODE] Polygon RPC active",
  "[NODE] Tether token network ready",
  "[NODE] USDC token network ready",
  "[AI] Loading heuristic analysis engine...",
  "[AI] Pattern recognition module active",
  "[AI] Entropy scanner ready",
  "[AI SEARCH] Checking connection status...",
  "[AI SEARCH] Connection established",
  "[NETWORK] Measuring node latency...",
  "[NETWORK] Latency stable: 22ms",
  "[SYSTEM] Initialization complete",
  "[SYSTEM] Awaiting scan command"
];

const SESSION_STORAGE_KEY = 'ai_crypto_session_state_v4';

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'system';
}

type TabType = 'dashboard' | 'withdraw' | 'server' | 'settings' | 'about';

export default function AiCryptoDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [serverLogs, setServerLogs] = useState<string[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [displayCount, setDisplayCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [systemTime, setSystemTime] = useState<string | null>(null)
  const [hardwareCores, setHardwareCores] = useState<number>(8)
  const [allocatedCores, setAllocatedCores] = useState([4])
  const [selectedServerId, setSelectedServerId] = useState('node-asia-se')
  const [networkPing, setNetworkPing] = useState(145)
  
  // Customization & Persistence
  const [seedPhraseColor, setSeedPhraseColor] = useState('text-[#dcdcdc]')
  const [consoleFontSize, setConsoleFontSize] = useState([8])
  
  // Network Detector States
  const [isOnline, setIsOnline] = useState(true)
  const [wasInterrogatingBeforeOffline, setWasInterrogatingBeforeOffline] = useState(false)

  // AI Search States
  const [isAiSearchConnected, setIsAiSearchConnected] = useState(false)
  const [isAiSearchConnecting, setIsAiSearchConnecting] = useState(false)
  const [aiSearchLogs, setAiSearchLogs] = useState<string[]>([])

  // Real-time Buffer for Ultra-smooth Interrogation
  const logBuffer = useRef<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null)
  const serverLogRef = useRef<HTMLDivElement>(null)

  // 1. Session Persistence Protocol
  useEffect(() => {
    const savedState = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setDisplayCount(parsed.displayCount || 0);
        setFoundWallets(parsed.foundWallets || 0);
        setActiveBlockchains(parsed.activeBlockchains || []);
        setSystemIntensity(parsed.systemIntensity || [85]);
        setAllocatedCores(parsed.allocatedCores || [4]);
        setSeedPhraseColor(parsed.seedPhraseColor || 'text-[#dcdcdc]');
        setConsoleFontSize(parsed.consoleFontSize || [8]);
      } catch (e) {
        console.error("Session reconstruction failed", e);
      }
    }
  }, []);

  useEffect(() => {
    const state = {
      displayCount,
      foundWallets,
      activeBlockchains,
      systemIntensity,
      allocatedCores,
      seedPhraseColor,
      consoleFontSize
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [displayCount, foundWallets, activeBlockchains, systemIntensity, allocatedCores, seedPhraseColor, consoleFontSize]);

  // 2. Network Detection Protocol
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Uplink Restored",
        description: "Neural mesh reconnection successful. Resuming system...",
      });
      if (wasInterrogatingBeforeOffline) {
        setIsInterrogating(true);
        setWasInterrogatingBeforeOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        variant: "destructive",
        title: "Connection Severed",
        description: "Neural uplink lost. Suspending all forensic operations.",
      });
      if (isInterrogating) {
        setWasInterrogatingBeforeOffline(true);
        setIsInterrogating(false);
      }
    };

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInterrogating, wasInterrogatingBeforeOffline, toast]);

  // 3. System Boot Sequence Protocol
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        const entry: LogEntry = {
          id: `boot-${i}`,
          message: BOOT_LOGS[i],
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
          type: 'system'
        };
        setLogs(prev => [...prev, entry].slice(-100));
        i++;
      } else {
        clearInterval(interval);
        setIsBooting(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // 4. Optimized Frame-Locked Log Flushing (60FPS stable)
  useEffect(() => {
    const flushLogs = () => {
      if (logBuffer.current.length > 0) {
        const entriesToFlush = Math.min(logBuffer.current.length, 8);
        const batch: LogEntry[] = [];
        let aiIncrement = 0;

        for (let i = 0; i < entriesToFlush; i++) {
          const entry = logBuffer.current.shift();
          if (entry) {
            batch.push(entry);
            if (entry.type === 'ai') aiIncrement++;
          }
        }

        if (batch.length > 0) {
          setLogs(prev => {
            const filteredPrev = isInterrogating 
              ? prev.filter(l => l.type === 'ai') 
              : prev;
            return [...filteredPrev, ...batch].slice(-100);
          });
          
          if (aiIncrement > 0) {
            setDisplayCount(prev => prev + aiIncrement);
          }
        }
      }
      requestAnimationFrame(flushLogs);
    };

    const animationId = requestAnimationFrame(flushLogs);
    return () => cancelAnimationFrame(animationId);
  }, [isInterrogating]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // 5. Memory Flush Protocol (Auto-clean every 10m)
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([]);
      setServerLogs([]);
      logBuffer.current = [];
      toast({
        title: "Auto-Flush Executed",
        description: "System memory cleared for 24/7 stability.",
      });
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const startInterrogation = useCallback(() => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "Uplink Error",
        description: "Cannot initiate scan without active network connectivity."
      })
      return
    }
    if (activeBlockchains.length === 0) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select at least one blockchain to begin the interrogation."
      })
      return
    }
    setLogs([]);
    logBuffer.current = [];
    setIsInterrogating(true)
  }, [activeBlockchains, isOnline, toast])

  const stopInterrogation = useCallback(() => {
    setIsInterrogating(false)
  }, [])

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    toast({
      title: "Neural Core Severed",
      description: "Operator session terminated."
    })
    router.push('/login')
  }

  const handleMemoryFlush = useCallback(() => {
    setLogs([]);
    setServerLogs([]);
    logBuffer.current = [];
    toast({
      title: "Memory Flushed",
      description: "Neural interrogation cache cleared.",
    });
  }, [toast]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setDisplayCount(0);
    setFoundWallets(0);
    setActiveBlockchains([]);
    setSystemIntensity([85]);
    setAllocatedCores([Math.floor((hardwareCores || 8) / 2)]);
    setSeedPhraseColor('text-[#dcdcdc]');
    setConsoleFontSize([8]);
    toast({
      title: "Workstation Reset",
      description: "All session metrics and configurations purged."
    });
  }, [toast, hardwareCores]);

  const connectAiSearch = useCallback(async () => {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "Neural heuristic uplink requires Enterprise Tier license. No access."
    })
  }, [toast]);

  const disconnectAiSearch = () => {
    setIsAiSearchConnected(false)
    setAiSearchLogs([])
    toast({
      title: "AI Search Severed",
      description: "Neural engine speed normalized."
    })
  }

  const selectedServer = useMemo(() => SERVERS.find(s => s.id === selectedServerId), [selectedServerId]);

  useEffect(() => {
    const updateTime = () => {
        setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
        setNetworkPing(prev => {
            if (!isOnline) return 0;
            const baseLatency = parseInt(selectedServer?.latency || "145");
            const fluctuation = Math.floor(Math.random() * 5) - 2;
            const target = baseLatency + fluctuation;
            // Smoothly interpolate towards the target latency based on the selected server
            return Math.max(1, Math.floor(prev * 0.8 + target * 0.2));
        });
    }
    updateTime();
    if (typeof window !== 'undefined') setHardwareCores(navigator.hardwareConcurrency || 8);
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isOnline, selectedServer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnline) return;
      const msgs = ["Pinging HUB-TX-01", "Ledger hash sync", "Node heartbeat", "Memory cleaner active"];
      setServerLogs(prev => [`${new Date().toLocaleTimeString('en-GB', { hour12: false })} > ${msgs[Math.floor(Math.random() * msgs.length)]}`, ...prev].slice(0, 50));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    let interrogationInterval: NodeJS.Timeout

    if (isInterrogating && isOnline) {
      const intensity = systemIntensity[0] / 100;
      const coreFactor = allocatedCores[0] / hardwareCores;
      const tickDelay = Math.max(5, 120 - (115 * intensity * coreFactor));

      interrogationInterval = setInterval(() => {
        const mnemonic = bip39.generateMnemonic();
        const entry: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          message: mnemonic,
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
          type: "ai"
        };
        logBuffer.current.push(entry);
        setCpuLoad(Math.min(100, (systemIntensity[0] * (allocatedCores[0] / hardwareCores)) + (Math.random() * 5)));
      }, tickDelay);
    } else {
      setCpuLoad(0)
    }

    return () => {
      if (interrogationInterval) clearInterval(interrogationInterval)
    }
  }, [isInterrogating, isOnline, systemIntensity, hardwareCores, allocatedCores]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isInterrogating) timerInterval = setInterval(() => setSessionSeconds(prev => prev + 1), 1000)
    return () => clearInterval(timerInterval)
  }, [isInterrogating])

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return
    setActiveBlockchains(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#050507] overflow-hidden text-foreground font-body select-none relative">
        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl z-30">
          <SidebarHeader className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(173,79,230,0.5)]">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase leading-none text-white">Ai Crypto</h1>
                <p className="text-[10px] text-primary/70 font-code mt-1 tracking-widest uppercase">v4.0.0 Elite</p>
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
                  { icon: Info, label: 'About', id: 'about' },
                ].map((item) => (
                  <SidebarMenuButton 
                    key={item.id}
                    isActive={activeTab === item.id} 
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={cn(
                      "transition-all duration-200 h-10 px-4 rounded-lg w-full flex items-center gap-3",
                      activeTab === item.id ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tighter">{item.label}</span>
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-2">Telemetry</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-6 px-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-code">
                    <span className="text-gray-500 uppercase">Engine Load</span>
                    <span className="text-primary">{cpuLoad.toFixed(1)}%</span>
                  </div>
                  <Progress value={cpuLoad} className="h-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                   <div className="flex items-center justify-between text-[9px] font-code border-b border-white/5 pb-2">
                      <span className="text-gray-500 uppercase flex items-center gap-2"><Zap className="w-3 h-3" /> Threads</span>
                      <span className="text-white font-bold tracking-widest">32 ACTIVE</span>
                   </div>
                   <div className="flex items-center justify-between text-[9px] font-code border-b border-white/5 pb-2">
                      <span className="text-gray-500 uppercase flex items-center gap-2"><Microchip className="w-3 h-3" /> Entropy</span>
                      <span className="text-white font-bold tracking-widest">256-BIT</span>
                   </div>
                   <div className="flex items-center justify-between text-[9px] font-code border-b border-white/5 pb-2">
                      <span className="text-gray-500 uppercase flex items-center gap-2"><Shield className="w-3 h-3" /> Encryption</span>
                      <span className="text-white font-bold tracking-widest">AES-GCM</span>
                   </div>
                   <div className="flex items-center justify-between text-[9px] font-code border-b border-white/5 pb-2">
                      <span className="text-gray-500 uppercase flex items-center gap-2"><History className="w-3 h-3" /> Uptime</span>
                      <span className="text-white font-bold tracking-widest">{formatTime(sessionSeconds)}</span>
                   </div>
                </div>
                
                <div className="pt-4 flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", isOnline ? (isInterrogating ? "bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]") : "bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {!isOnline ? "Offline" : isInterrogating ? "Scanning" : "Standby"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-10 px-4">
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Terminate</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
          <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-700")} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">System Status</span>
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", !isOnline ? "text-red-500" : isInterrogating ? "text-primary" : "text-gray-700")}>
                   {!isOnline ? "Disconnected" : isInterrogating ? "Active" : "Ready"}
                 </span>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-6">
                {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", isOnline ? "text-green-500/60" : "text-red-500")}>
                  {isOnline ? "Network Live" : "Network Error"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-code text-gray-600 uppercase">System Time</span>
                <span className="text-xs font-code text-white/80">{systemTime || "00:00:00"}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden p-8 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col min-h-0">
              
              {!isOnline && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-500">
                  <div className="max-w-md w-full glass-panel rounded-3xl p-10 border-red-500/20 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                      <WifiOff className="w-10 h-10 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Connection Severed</h2>
                      <p className="text-[11px] text-gray-500 uppercase leading-relaxed font-bold tracking-widest">
                        Neural uplink to blockchain nodes has been lost. <br />
                        All forensic operations have been suspended to prevent data corruption.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 py-4 border-t border-white/5">
                      <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Monitoring for reconnection...</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0">
                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <section className="space-y-4 shrink-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Blockchains</h2>
                        <span className="text-[9px] font-code text-primary/60">{activeBlockchains.length} Selected</span>
                      </div>
                      <div className="blockchain-grid">
                        {BLOCKCHAINS.map((chain) => {
                          const isActive = activeBlockchains.includes(chain.id)
                          return (
                            <div key={chain.id} onClick={() => toggleBlockchain(chain.id)} className={cn("blockchain-card", isActive && "active", (isInterrogating || !isOnline) && "cursor-not-allowed pointer-events-none opacity-50")}>
                              <img src={chain.logo} alt={`${chain.name} logo`} className="w-6 h-6 object-contain" />
                              <span>{chain.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Seed phrases checked
                          </p>
                          <p className="seed-counter font-code tracking-tighter">
                            {displayCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Timer className="w-3 h-3" /> Session time
                              </p>
                              <p className="text-2xl font-black font-code text-primary tracking-tighter">
                                {formatTime(sessionSeconds)}
                              </p>
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-4">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Wallet className="w-3 h-3" /> Found
                              </p>
                              <p className="text-2xl font-black font-code text-green-400 tracking-tighter">
                                {foundWallets}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <Signal className="w-3 h-3" /> Network Latency
                            </p>
                            <p className={cn("text-lg font-black font-code tracking-tighter", isOnline ? "text-cyan-400" : "text-red-500")}>
                              {isOnline ? `${networkPing} ms` : "0 ms"}
                            </p>
                          </div>
                          <div className="space-y-1 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <Cpu className="w-3 h-3" /> CPU Usage
                            </p>
                            <p className="text-lg font-black font-code text-primary tracking-tighter">
                              {cpuLoad.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-6">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Active Node: {selectedServer?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-2 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <SearchCode className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">Scan Console</h3>
                      </div>
                    </div>
                    
                    <div className="scan-wrapper flex-1 min-h-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="h-full scan-console terminal-scrollbar flex flex-col relative">
                        <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                        <div 
                          ref={scrollRef} 
                          className={cn(
                            "flex-1 overflow-y-auto terminal-scrollbar p-6 space-y-2 z-10 flex flex-col"
                          )}
                          style={{ fontSize: `${consoleFontSize[0]}px` }}
                        >
                          {logs.map((log) => (
                            <div key={log.id} className="console-line">
                              {log.type === 'ai' ? (
                                <div className="flex items-center gap-1 font-code">
                                  <span className="balance">Balance: 0</span>
                                  <span className="text-gray-600 px-1 opacity-50">|</span>
                                  <span className="text-[#dcdcdc] shrink-0">Wallet check:</span>
                                  <span className={cn("transition-colors duration-300 ml-1", seedPhraseColor)}>
                                    {log.message}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-4 font-code text-[#8df7b1]">
                                  <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                                  <span className="uppercase tracking-tight font-bold">
                                    {log.message}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          {!isOnline && isInterrogating && (
                            <div className="console-line flex gap-4 font-code text-red-500 animate-pulse">
                              <span className="text-white/10 shrink-0 select-none">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                              <span className="uppercase tracking-tight font-bold">
                                SYSTEM SUSPENDED: WAITING FOR NETWORK UPLINK...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <div className="flex items-center gap-2 mb-1 shrink-0">
                      <SearchCode className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">AI Search</h3>
                    </div>
                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden">
                       {!isAiSearchConnected ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                           <div className="relative mb-6 group">
                             <Globe className={cn("w-16 h-16 transition-all duration-700", isAiSearchConnecting ? "text-primary animate-pulse drop-shadow-[0_0_20px_rgba(173,79,230,0.5)]" : "text-gray-800")} />
                             {isAiSearchConnecting && <div className="absolute inset-0 rounded-full pulse-ring border border-primary/40" />}
                           </div>
                           <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">
                             {isAiSearchConnecting ? "Negotiating Uplink" : "AI Search Standby"}
                           </h4>
                           <Button 
                             onClick={connectAiSearch} 
                             disabled={isAiSearchConnecting}
                             className="w-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase hover:bg-primary/20 transition-all h-10 mt-6"
                           >
                             <Lock className="w-3 h-3 mr-2" />
                             {isAiSearchConnecting ? "Connecting..." : "Enable AI Search"}
                           </Button>
                           {aiSearchLogs.length > 0 && (
                             <div className="mt-6 w-full text-left font-code text-[9px] space-y-1 border-t border-white/5 pt-4">
                               {aiSearchLogs.map((l, i) => (
                                 <div key={i} className="text-primary/60 animate-in slide-in-from-bottom-1 duration-300">
                                   &gt; {l}
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       ) : (
                         <div className="flex flex-col h-full space-y-4">
                            <div className="flex flex-col items-center text-center p-2 mb-4">
                              <div className="relative mb-4">
                                <Share2 className={cn("w-12 h-12 transition-all duration-700 text-primary", isInterrogating && "animate-pulse drop-shadow-[0_0_15px_rgba(173,79,230,0.5)]")} />
                                <div className="absolute inset-0 rounded-full pulse-ring border border-primary/20" />
                              </div>
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Link Established</span>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-1 terminal-scrollbar">
                               <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                  <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">AI Search Status</h5>
                                  <div className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Connection</span>
                                        <span className="text-[9px] font-bold text-green-500 uppercase">Connected</span>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Heuristic Filter</span>
                                        <span className="text-[9px] font-bold text-primary uppercase">Active</span>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Entropy Boost</span>
                                        <span className="text-[9px] font-bold text-primary uppercase">Maxed</span>
                                     </div>
                                  </div>
                               </div>

                               <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                  <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">System Analysis</h5>
                                  <div className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Active Nodes</span>
                                        <span className="text-[9px] font-bold text-white">12</span>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Latency</span>
                                        <span className="text-[9px] font-bold text-green-500 uppercase">{networkPing}ms Stable</span>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Scan Threads</span>
                                        <span className="text-[9px] font-bold text-white uppercase">32 Active</span>
                                     </div>
                                  </div>
                               </div>

                               <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                  <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">AI Processing</h5>
                                  <div className="space-y-2">
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Pattern Engine</span>
                                        <span className="text-[9px] font-bold text-primary uppercase">Running</span>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-code text-gray-400">Entropy Scanner</span>
                                        <span className="text-[9px] font-bold text-primary uppercase">Active</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <Button onClick={disconnectAiSearch} disabled={isInterrogating} variant="outline" className="w-full mt-auto border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase transition-all h-8">
                               <Unplug className="w-3 h-3 mr-2" /> Disconnect
                            </Button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'withdraw' && (
                <div className="flex-1 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-8 rounded-3xl border-primary/30 bg-primary/[0.02] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Zap className="w-20 h-20 text-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Activity className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Neural Session Yield</h4>
                        </div>
                        <p className="text-5xl font-black font-code text-white tracking-tighter drop-shadow-[0_0_15px_rgba(173,79,230,0.3)]">
                          $0.00
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2 glass-panel p-8 rounded-3xl border-white/5 flex items-center justify-between">
                       <div className="space-y-4">
                          <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Uplink Status</h4>
                          <div className="flex items-center gap-6">
                             <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-code text-primary/60 uppercase">Protocol</span>
                                <span className="text-xs font-bold text-white uppercase">AES-256 SECURE</span>
                             </div>
                             <div className="flex flex-col gap-1 border-l border-white/10 pl-6">
                                <span className="text-[9px] font-code text-primary/60 uppercase">Node</span>
                                <span className="text-xs font-bold text-white uppercase">{selectedServer?.name}</span>
                             </div>
                             <div className="flex flex-col gap-1 border-l border-white/10 pl-6">
                                <span className="text-[9px] font-code text-primary/60 uppercase">Latency</span>
                                <span className={cn("text-xs font-bold uppercase", isOnline ? "text-green-500" : "text-red-500")}>
                                  {isOnline ? `${networkPing}ms Stable` : "OFFLINE"}
                                </span>
                             </div>
                          </div>
                       </div>
                       <Button disabled={!isOnline} className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">
                         Synchronize Ledger
                       </Button>
                    </div>
                  </div>

                  <div className="flex-1 glass-panel rounded-3xl p-8 border-white/5 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Dna className="w-5 h-5 text-primary" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Discovered Neural Ledger</h3>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto terminal-scrollbar flex flex-col items-center justify-center opacity-20 group py-20">
                      <Activity className="w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-700" />
                      <div className="text-center space-y-2">
                        <p className="text-sm uppercase tracking-[0.4em] font-black text-white">Neural Web Silent</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Awaiting forensic asset discovery</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'server' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-700 overflow-hidden">
                  <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto terminal-scrollbar pr-2 pb-10">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#050507] py-2 z-10">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Neural Cluster Map</h3>
                      </div>
                    </div>
                    
                    {SERVERS.map((server) => {
                      const isSelected = selectedServerId === server.id;
                      const isLocked = !['node-asia-se', 'node-na-east', 'node-premium-02'].includes(server.id);
                      return (
                        <div 
                          key={server.id} 
                          onClick={() => isOnline && !isInterrogating && !isLocked && setSelectedServerId(server.id)} 
                          className={cn(
                            "relative overflow-hidden p-5 rounded-2xl border transition-all duration-500", 
                            isSelected ? "bg-primary/[0.08] border-primary/50" : "glass-panel border-white/5 hover:border-white/20", 
                            (isInterrogating || isLocked || !isOnline) ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          )}
                        >
                          {isLocked && <Lock className="absolute top-3 right-3 w-3 h-3 text-red-500/60" />}
                          <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", isSelected ? "bg-primary text-black border-primary" : "bg-white/5 text-gray-500 border-white/10")}>
                                  <ServerIcon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className={cn("text-xs font-black uppercase tracking-wider", isSelected ? "text-white" : "text-gray-400")}>{server.name}</p>
                                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-0.5">{server.region}</p>
                                </div>
                              </div>
                              <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter", server.status === 'active' ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10")}>
                                {isOnline ? server.status : "Offline"}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] font-code uppercase">
                                  <span className="text-gray-500">Latency</span>
                                  <span className={cn(isOnline ? "text-green-500" : "text-red-500")}>
                                    {isOnline ? server.latency : "N/A"}
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500/50" style={{ width: isOnline ? `${Math.max(20, 100 - parseInt(server.latency))}%` : '0%' }} />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] font-code uppercase">
                                  <span className="text-gray-500">Node Load</span>
                                  <span className={cn(server.load > 60 ? "text-yellow-500" : "text-primary")}>
                                    {isOnline ? `${server.load}%` : "0%"}
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className={cn("h-full", server.load > 60 ? "bg-yellow-500/50" : "bg-primary/50")} style={{ width: isOnline ? `${server.load}%` : '0%' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    <div className="glass-panel rounded-3xl p-8 border-white/5 flex flex-col flex-1 relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.6)]">
                       <div className="relative z-10 flex flex-col h-full">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                                <Dna className={cn("w-6 h-6", isInterrogating && isOnline && "animate-pulse")} />
                                {isInterrogating && isOnline && <div className="absolute inset-0 rounded-2xl pulse-ring border border-primary/40" />}
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Active Endpoint Telemetry</h4>
                                <p className="text-[10px] text-primary/60 font-code uppercase tracking-widest mt-0.5">Node ID: {selectedServer?.id}</p>
                              </div>
                            </div>
                         </div>
                         <div className="flex-1 flex items-center justify-center relative my-10">
                            <div className="relative bg-black/40 backdrop-blur-3xl p-12 rounded-full border border-primary/20 shadow-[0_0_100px_rgba(173,79,230,0.15)]">
                               <Globe className={cn("w-40 h-40 transition-all duration-1000", isInterrogating && isOnline ? "text-primary drop-shadow-[0_0_30px_rgba(173,79,230,0.6)]" : "text-primary/30")} />
                               {isInterrogating && isOnline && <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" />}
                               {!isOnline && <WifiOff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-red-500 animate-pulse" />}
                            </div>
                         </div>
                         <div className="grid grid-cols-3 gap-6 mt-auto">
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Uptime</span>
                               <p className="text-sm font-black text-white font-code tracking-tighter">{isOnline ? "99.998%" : "OFFLINE"}</p>
                            </div>
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Encryption</span>
                               <p className="text-xs font-black text-white font-code tracking-tighter uppercase">{isOnline ? "AES-256 GCM" : "SUSPENDED"}</p>
                            </div>
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Latency Peak</span>
                               <p className="text-sm font-black text-white font-code tracking-tighter">{isOnline ? `${networkPing + 12} MS` : "N/A"}</p>
                            </div>
                         </div>
                       </div>
                    </div>

                    <div className="glass-panel rounded-3xl border-white/5 flex flex-col h-[300px] relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                           <Terminal className="w-4 h-4 text-primary" />
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Cluster Pulse Logic</h3>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/60 p-6 font-code text-[10px] overflow-hidden relative">
                        <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                        <div ref={serverLogRef} className="h-full overflow-y-auto terminal-scrollbar space-y-1.5 flex flex-col z-10 relative">
                           {serverLogs.map((log, i) => (
                             <div key={i} className="text-[#00FF41]/60 hover:text-[#00FF41] transition-colors py-1 border-b border-white/[0.03] tracking-tighter">
                               <span className="text-gray-600 mr-2 opacity-50 select-none font-bold">NODE_LOG:</span> {log}
                             </div>
                           ))}
                           {!isOnline && (
                             <div className="text-red-500 font-bold py-2 animate-pulse">
                               [CRITICAL] SYSTEM LOSS: NODE UPLINK DISCONNECTED
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in zoom-in-95 duration-500 pb-20 overflow-y-auto terminal-scrollbar pr-2">
                  <div className="glass-panel rounded-2xl p-10 border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Performance Management</h3>
                    <div className="space-y-12">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">Scan Throughput (Hz)</label>
                          </div>
                          <span className="text-xs font-code text-primary">{systemIntensity[0]}% Velocity</span>
                        </div>
                        <Slider value={systemIntensity} onValueChange={setSystemIntensity} max={100} step={1} disabled={isInterrogating} className="cursor-pointer" />
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Directly modulates the interrogation frequency and engine throughput.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">Neural Core Allocation</label>
                          </div>
                          <span className="text-xs font-code text-primary">{allocatedCores[0]} / {hardwareCores} Cores</span>
                        </div>
                        <Slider value={allocatedCores} onValueChange={setAllocatedCores} min={1} max={hardwareCores} step={1} disabled={isInterrogating} className="cursor-pointer" />
                      </div>

                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Optimization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-3 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Trash2 className="w-4 h-4 text-primary" />
                                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Neural Memory Flush</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleMemoryFlush} className="h-8 text-[9px] uppercase font-bold border-primary/20 text-primary hover:bg-primary/10">Flush Memory</Button>
                              </div>
                              <p className="text-[9px] text-gray-600 uppercase leading-relaxed">Clears terminal and server activity logs to optimize client-side memory. Auto-flush every 10m.</p>
                           </div>
                           <div className="flex flex-col gap-3 p-5 rounded-2xl border border-red-500/10 bg-red-500/[0.01] hover:bg-red-500/[0.03] transition-colors group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <RotateCcw className="w-4 h-4 text-red-500" />
                                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={clearSession} className="h-8 text-[9px] uppercase font-bold border-red-500/20 text-red-500 hover:bg-red-500/10">Hard Reset</Button>
                              </div>
                              <p className="text-[9px] text-gray-600 uppercase leading-relaxed">Purges all session stats and engine configurations. IRREVERSIBLE.</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-10 border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Console Customization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <Palette className="w-4 h-4 text-primary" />
                           <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Seed Phrase Color</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {SEED_COLORS.map((color) => (
                            <button key={color.name} onClick={() => setSeedPhraseColor(color.class)} className={cn("flex items-center justify-between p-3 rounded-lg border text-left transition-all", seedPhraseColor === color.class ? "bg-primary/10 border-primary/40" : "bg-white/[0.02] border-white/5 hover:border-white/20")}>
                              <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">{color.name}</span>
                              <div className={cn("w-3 h-3 rounded-full border border-white/10", color.class.includes('gradient') ? 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' : color.class.split(' ')[0])} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                           <Type className="w-4 h-4 text-primary" />
                           <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">Console Typography</h4>
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Font Size</label>
                            <span className="text-xs font-code text-primary">{consoleFontSize[0]}px</span>
                          </div>
                          <Slider value={consoleFontSize} onValueChange={setConsoleFontSize} min={8} max={24} step={1} className="cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                  <section className="glass-panel rounded-2xl p-8 border-white/5 space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(173,79,230,0.2)]">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white">AI Crypto Engine v4.0</h3>
                    </div>
                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed font-body">
                      <p>AI Crypto Engine is an advanced blockchain analysis and scanning system designed to monitor multiple cryptocurrency networks in real time.</p>
                      <p>The system connects to blockchain nodes and processes large volumes of transaction data using heuristic analysis and AI-assisted pattern detection.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {["Multi-blockchain monitoring", "AI-assisted transaction analysis", "Network latency tracking", "Node connectivity monitoring", "Secure encrypted scanning engine"].map((capability, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">How the System Works</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { step: "Step 1", desc: "User selects the blockchains to analyze." },
                        { step: "Step 2", desc: "The scanning engine connects to active blockchain nodes." },
                        { step: "Step 3", desc: "The AI analysis module processes transaction patterns." },
                        { step: "Step 4", desc: "Results are displayed inside the Scan Console." }
                      ].map((item, i) => (
                        <div key={i} className="glass-panel rounded-xl p-5 border-white/5 space-y-3 hover:border-primary/30 transition-colors group">
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-1 inline-block">{item.step}</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed group-hover:text-white transition-colors">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white border-b border-white/5 pb-2">Software Information</h4>
                      <div className="space-y-3 font-code">
                        {[
                          { label: "Version", val: "v4.0 Elite" },
                          { label: "Engine", val: "AI Crypto Engine" },
                          { label: "Encryption", val: "AES-256" },
                          { label: "Status", val: isOnline ? "Active" : "Offline", class: isOnline ? "text-green-500" : "text-red-500" }
                        ].map((info, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-600 uppercase font-black">{info.label}:</span>
                            <span className={cn("font-bold uppercase tracking-widest", info.class || "text-white")}>{info.val}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Developer</h4>
                      </div>
                      <div className="space-y-3 font-code">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600 uppercase font-black">Owner:</span>
                          <span className="text-white font-bold uppercase tracking-widest">(CMS OWNER)</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-600 uppercase font-black">Project:</span>
                          <span className="text-white font-bold uppercase tracking-widest">AI Crypto Engine</span>
                        </div>
                      </div>
                      <div className="pt-4">
                         <a href="https://t.me/Ai_Crypto_Software" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#7c6cff] to-[#9b7bff] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(124,108,255,0.4)] transition-all">
                           <ExternalLink className="w-3 h-3" /> Join Telegram Channel
                         </a>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/5 pb-4 shrink-0">
                  {isInterrogating ? (
                    <Button onClick={stopInterrogation} variant="outline" className="bg-red-500/10 border-red-500/40 hover:bg-red-500/20 text-red-500 h-14 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                      <Power className="w-4 h-4 mr-3" /> STOP SCAN
                    </Button>
                  ) : (
                    <Button onClick={startInterrogation} disabled={activeBlockchains.length === 0 || isBooting || !isOnline} className={cn("h-14 px-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_30px_rgba(173,79,230,0.3)] hover:opacity-90 disabled:opacity-30")}>
                      <Zap className="w-4 h-4 mr-3" /> START SCAN
                    </Button>
                  )}
                  {activeBlockchains.length === 0 && !isInterrogating && !isBooting && isOnline && (
                    <div className="flex items-center gap-2 text-[10px] text-yellow-500 font-bold uppercase animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Select Blockchains to Proceed
                    </div>
                  )}
                  {isBooting && isOnline && (
                    <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> System Initializing...
                    </div>
                  )}
                  {!isOnline && (
                    <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase animate-pulse">
                      <WifiOff className="w-3 h-3" /> Offline: Awaiting Reconnection
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="ticker-wrap flex-1 mr-8 overflow-hidden whitespace-nowrap">
              <p className="ticker-content text-[8px] text-primary/60 uppercase tracking-[0.4em] font-code">
                Status: {!isOnline ? "CONNECTION SEVERED" : isInterrogating ? "SCANNING" : isBooting ? "INITIALIZING" : "STANDBY"} • Active Node: {selectedServer?.name} • Logic: BIP39-Elite • Encryption: AES-256 Verified
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
