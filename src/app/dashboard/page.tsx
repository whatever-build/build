
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  Eye,
  EyeOff,
  AlertTriangle,
  Type,
  Palette,
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
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarBase, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import * as bip39 from 'bip39'
import { logout } from '@/app/login/actions'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', logo: "/logos/bitcoin.svg" },
  { id: 'eth', name: 'Ethereum', logo: "/logos/ethereum.svg" },
  { id: 'sol', name: 'Solana', logo: "/logos/solana.svg" },
  { id: 'bnb', name: 'BNB Chain', logo: "/logos/bnb.svg" },
  { id: 'tron', name: 'Tron', logo: "/logos/tron.svg" },
  { id: 'xrp', name: 'Ripple', logo: "/logos/xrp.svg" },
  { id: 'ltc', name: 'Litecoin', logo: "/logos/litecoin.svg" },
  { id: 'matic', name: 'Polygon', logo: "/logos/polygon.svg" },
  { id: 'usdt', name: 'Tether', logo: "/logos/tether.svg" },
  { id: 'usdc', name: 'USDC', logo: "/logos/usdc.svg" },
]

const SERVERS = [
  { id: 'node-na-east', name: 'NORTH AMERICA EAST', region: 'Virginia, USA', latency: '12ms', status: 'active', load: 42, ip: '142.250.190.46' },
  { id: 'node-eu-central', name: 'EUROPE CENTRAL', region: 'Frankfurt, Germany', latency: '28ms', status: 'active', load: 68, ip: '172.217.16.174' },
  { id: 'node-asia-se', name: 'ASIA SOUTHEAST', region: 'Singapore', latency: '145ms', status: 'active', load: 12, ip: '34.101.0.1' },
  { id: 'node-asia-ne', name: 'ASIA NORTHEAST', region: 'Tokyo, Japan', latency: '112ms', status: 'active', load: 54, ip: '35.190.247.0' },
  { id: 'node-sa-east', name: 'SOUTH AMERICA', region: 'São Paulo, Brazil', latency: '168ms', status: 'active', load: 22, ip: '34.95.128.0' },
  { id: 'node-af-south', name: 'AFRICA SOUTH', region: 'Johannesburg, SA', latency: '112ms', status: 'active', load: 15, ip: '34.160.0.0' },
  { id: 'node-me-east', name: 'MIDDLE EAST', region: 'Dubai, UAE', latency: '85ms', status: 'active', load: 38, ip: '34.150.0.0' },
  { id: 'node-oc-sydney', name: 'OCEANIA', region: 'Sydney, Australia', latency: '190ms', status: 'active', load: 29, ip: '35.189.0.0' },
  { id: 'node-arctic-north', name: 'ARCTIC NORTH', region: 'Reykjavik, Iceland', latency: '45ms', status: 'active', load: 8, ip: '35.200.0.0' },
]

const SEED_COLORS = [
  { name: 'Classic Silver', class: 'text-white/80' },
  { name: 'Neural Violet', class: 'text-primary' },
  { name: 'Matrix Green', class: 'text-green-400' },
  { name: 'Cyber Cyan', class: 'text-cyan-400' },
  { name: 'Gold Amber', class: 'text-amber-400' },
  { name: 'Cyber RGB', class: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-gradient' },
]

const SYSTEM_LOGS = [
  "[BOOT] Initializing AI Crypto Engine v4.0",
  "[CONNECT] Syncing blockchain nodes...",
  "[NODE] Bitcoin network connected",
  "[NODE] Ethereum network connected",
  "[SCAN] Running heuristic wallet discovery...",
  "[HASH] Analyzing transaction clusters...",
  "[AI] Neural anomaly detection active",
  "[DATA] 742 wallet signatures processed",
  "[SCAN] Searching for seed phrase patterns...",
  "[RESULT] No vulnerabilities detected"
];

const SESSION_STORAGE_KEY = 'ai_crypto_session_state_v4';

interface FoundWallet {
  id: string;
  address: string;
  mnemonic: string;
  balance: number;
  chain: string;
  revealed: boolean;
  timestamp: string;
}

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
  const [checkedCount, setCheckedCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState<FoundWallet[]>([])
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [systemTime, setSystemTime] = useState<string | null>(null)
  const [hardwareCores, setHardwareCores] = useState<number>(8)
  const [allocatedCores, setAllocatedCores] = useState([4])
  const [selectedServerId, setSelectedServerId] = useState('node-na-east')
  const [networkPing, setNetworkPing] = useState(24)
  
  const [seedPhraseColor, setSeedPhraseColor] = useState('text-white/80')
  const [consoleFontSize, setConsoleFontSize] = useState([8])
  const [isAutoMemoryEnabled, setIsAutoMemoryEnabled] = useState(true)
  
  const [isAiSearchConnected, setIsAiSearchConnected] = useState(false)
  const [isAiSearchConnecting, setIsAiSearchConnecting] = useState(false)
  const [aiSearchLogs, setAiSearchLogs] = useState<string[]>([])

  // AI Typing Animation State
  const [displayedSystemLines, setDisplayedSystemLines] = useState<string[]>([])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const serverLogRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    toast({
      title: "Neural Core Severed",
      description: "Operator session terminated."
    })
    router.push('/login')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Buffer } = require('buffer');
      window.Buffer = window.Buffer || Buffer;
    }
  }, []);

  // Professional Sequential Counter Logic
  useEffect(() => {
    if (displayCount >= checkedCount) return;

    const gap = checkedCount - displayCount;
    // Step faster for large gaps, but always sequential for small ones
    const step = gap > 100 ? Math.ceil(gap / 10) : 1; 
    
    const timeout = setTimeout(() => {
      setDisplayCount(prev => Math.min(checkedCount, prev + step));
    }, 10); 

    return () => clearTimeout(timeout);
  }, [checkedCount, displayCount]);

  // AI Typing Animation Logic (Standby)
  useEffect(() => {
    if (isInterrogating) return;

    const timeout = setTimeout(() => {
      setDisplayedSystemLines(prev => {
        const copy = [...prev];
        const currentLine = SYSTEM_LOGS[lineIndex];
        if (!currentLine) return prev;
        copy[lineIndex] = currentLine.slice(0, charIndex + 1);
        return copy;
      });

      setCharIndex(prev => prev + 1);

      if (charIndex >= (SYSTEM_LOGS[lineIndex]?.length || 0)) {
        setCharIndex(0);
        setLineIndex(prev => {
          const next = prev + 1;
          if (next >= SYSTEM_LOGS.length) {
            setTimeout(() => {
                setDisplayedSystemLines([]);
                setLineIndex(0);
                setCharIndex(0);
            }, 2000);
            return prev;
          }
          return next;
        });
      }
    }, 30);

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex, isInterrogating]);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const data = JSON.parse(savedSession);
        if (data.checkedCount !== undefined) {
          setCheckedCount(data.checkedCount);
          setDisplayCount(data.checkedCount);
        }
        if (data.activeBlockchains) setActiveBlockchains(data.activeBlockchains);
        if (data.systemIntensity) setSystemIntensity(data.systemIntensity);
        if (data.allocatedCores) setAllocatedCores(data.allocatedCores);
        if (data.seedPhraseColor) setSeedPhraseColor(data.seedPhraseColor);
        if (data.consoleFontSize) setConsoleFontSize(data.consoleFontSize);
        if (data.selectedServerId) setSelectedServerId(data.selectedServerId);
        if (data.isAutoMemoryEnabled !== undefined) setIsAutoMemoryEnabled(data.isAutoMemoryEnabled);
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    } else {
      setConsoleFontSize([8]);
    }
  }, []);

  useEffect(() => {
    const sessionData = {
      checkedCount,
      activeBlockchains,
      systemIntensity,
      allocatedCores,
      seedPhraseColor,
      consoleFontSize,
      selectedServerId,
      isAutoMemoryEnabled
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [checkedCount, activeBlockchains, systemIntensity, allocatedCores, seedPhraseColor, consoleFontSize, selectedServerId, isAutoMemoryEnabled]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCheckedCount(0);
    setDisplayCount(0);
    setActiveBlockchains([]);
    setSystemIntensity([85]);
    setAllocatedCores([Math.floor((hardwareCores || 8) / 2)]);
    setSeedPhraseColor('text-white/80');
    setConsoleFontSize([8]);
    setIsAutoMemoryEnabled(true);
    setFoundCount(0);
    setFoundWallets([]);
    toast({
      title: "Workstation Reset",
      description: "All saved progress and configurations have been purged."
    });
  }, [toast, hardwareCores]);

  const handleMemoryFlush = () => {
    setLogs([]);
    setServerLogs([]);
    toast({
      title: "Memory Flushed",
      description: "Neural cache cleared. Client performance optimized.",
      variant: "default"
    });
  };
  
  const addLogs = useCallback((messages: {message: string, type: LogEntry['type']}[]) => {
    setLogs(prev => {
      const newEntries: LogEntry[] = messages.map(m => ({
        id: Math.random().toString(36).substr(2, 9),
        message: m.message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
        type: m.type
      }));
      return [...newEntries, ...prev].slice(0, 100) 
    })
  }, [])

  const addServerLog = useCallback((msg: string) => {
    setServerLogs(prev => [
      `${new Date().toLocaleTimeString('en-GB', { hour12: false })} > ${msg}`,
      ...prev
    ].slice(0, 50))
  }, [])

  const connectAiSearch = async () => {
    if (isAiSearchConnecting || isAiSearchConnected) return
    setIsAiSearchConnecting(true)
    setAiSearchLogs([])
    
    const steps = [
      "Initializing Tor circuit...",
      "Establishing secure ports 8080/443...",
      "Resolving onion descriptors...",
      "Neural mesh handshake initiated...",
      "Applying BIP39 heuristic filter...",
      "Handshake complete. Tunnel secure."
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
      setAiSearchLogs(prev => [...prev, steps[i]])
    }
    
    setIsAiSearchConnecting(false)
    setIsAiSearchConnected(true)
    toast({ title: "Neural Core Linked", description: "Heuristic search mode enabled." })
  }

  const disconnectAiSearch = () => {
    setIsAiSearchConnected(false)
    setAiSearchLogs([])
    toast({
      title: "Neural Core Severed",
      description: "Heuristic search mode disabled. Engine speed normalized."
    })
  }

  useEffect(() => {
    const updateTime = () => {
        setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
        setNetworkPing(prev => {
            const fluctuation = Math.floor(Math.random() * 5) - 2;
            return Math.max(12, Math.min(180, prev + fluctuation));
        });
    }
    updateTime();
    if (typeof window !== 'undefined') {
      const cores = navigator.hardwareConcurrency || 8;
      setHardwareCores(cores);
    }
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        "Pinging cluster node HUB-TX-01",
        "Synchronizing local ledger hash",
        "Refreshing peer network",
        "Heartbeat received from ASIA-NORTHEAST",
        "Routing through secure mesh",
        "Memory cleaner: Cache purged",
        "Optimizing data packets"
      ];
      addServerLog(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [addServerLog]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    if (serverLogRef.current) serverLogRef.current.scrollTop = 0;
  }, [logs, serverLogs, displayedSystemLines, isInterrogating]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isInterrogating) {
      timerInterval = setInterval(() => setSessionSeconds(prev => prev + 1), 1000)
    }
    return () => clearInterval(timerInterval)
  }, [isInterrogating])

  // Sequential Neural Engine (Smooth 1-by-1)
  useEffect(() => {
    let interrogationInterval: NodeJS.Timeout

    if (isInterrogating) {
      const bootSequence = async () => {
        setLogs([])
        setSessionSeconds(0)
        
        addLogs([{message: "ESTABLISHING SECURE HANDSHAKE...", type: "system"}])
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLogs([{message: "CHECKING PORTS AND TLS DESCRIPTORS...", type: "info"}])
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLogs([{message: "RESOLVING PROXY TUNNEL...", type: "info"}])
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const aiStatusMsg = isAiSearchConnected ? "AI SEARCH: LINKED [HEURISTIC BOOST]" : "AI SEARCH: NOT CONNECTED [STANDARD MODE]";
        addLogs([{message: aiStatusMsg, type: isAiSearchConnected ? "success" : "warning"}])
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLogs([{message: "CRYPTOGRAPHIC ENGINE: INITIALIZED", type: "system"}])
        
        const intensity = systemIntensity[0] / 100;
        const aiBoost = isAiSearchConnected ? 2 : 1;
        const coreFactor = allocatedCores[0] / hardwareCores;
        const tickDelay = Math.max(5, 150 - (145 * intensity * coreFactor * (aiBoost / 2)));

        interrogationInterval = setInterval(() => {
          const newMnemonic = bip39.generateMnemonic();
          const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            // Updated format as requested: Balance: 0 | Wallet check: {full phrase}
            message: `Balance: 0 | Wallet check: ${newMnemonic}`,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
            type: 'ai' as const
          };

          setLogs(prev => [newLog, ...prev].slice(0, 100));
          setCheckedCount(prev => prev + 1);
          
          setCpuLoad(Math.min(100, (systemIntensity[0] * (allocatedCores[0] / hardwareCores)) + (Math.random() * 5)))
        }, tickDelay);
      }

      bootSequence()
    } else {
      setCpuLoad(0)
    }

    return () => {
      if (interrogationInterval) clearInterval(interrogationInterval)
    }
  }, [isInterrogating, addLogs, systemIntensity, hardwareCores, allocatedCores, isAiSearchConnected]);

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return
    setActiveBlockchains(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const startInterrogation = () => {
    if (activeBlockchains.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Configuration Error", 
        description: "Please select at least one blockchain network before initiating scan." 
      })
      return
    }
    setIsInterrogating(true)
  }

  const stopInterrogation = () => {
    setIsInterrogating(false)
    addLogs([{message: "SCAN PROTOCOL ABORTED BY OPERATOR", type: "error"}])
    toast({
      title: "Scan Stopped",
      description: "Cryptographic engine has been safely powered down."
    })
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":")
  }

  const toggleReveal = (id: string) => {
    setFoundWallets(prev => prev.map(w => w.id === id ? { ...w, revealed: !w.revealed } : w))
  }

  const selectedServer = SERVERS.find(s => s.id === selectedServerId)

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
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
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
                  </SidebarMenuItem>
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
                
                <div className="pt-4 flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", isInterrogating ? "bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isInterrogating ? "Scanning" : "Standby"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-10 px-4"
            >
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
                 <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isInterrogating ? "text-primary" : "text-gray-700")}>
                   {isInterrogating ? "Active" : "Ready"}
                 </span>
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
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Blockchains</h2>
                        <span className="text-[9px] font-code text-primary/60">{activeBlockchains.length} Selected</span>
                      </div>
                      <div className="blockchain-grid">
                        {BLOCKCHAINS.map((chain) => {
                          const isActive = activeBlockchains.includes(chain.id)
                          return (
                            <div 
                              key={chain.id}
                              onClick={() => toggleBlockchain(chain.id)}
                              className={cn(
                                "blockchain-card",
                                isActive && "active",
                                isInterrogating && "cursor-not-allowed pointer-events-none opacity-50"
                              )}
                            >
                              <img src={chain.logo} alt={`${chain.name} logo`} />
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
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Wallet className="w-3 h-3" /> Found wallets
                          </p>
                          <p className="text-2xl font-black font-code text-green-500 tracking-tighter">
                            {foundCount}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <Timer className="w-3 h-3" /> Session time
                            </p>
                            <p className="text-2xl font-black font-code text-primary tracking-tighter">
                              {formatTime(sessionSeconds)}
                            </p>
                          </div>
                          <div className="space-y-1 pt-2 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <Signal className="w-3 h-3" /> Network Latency
                            </p>
                            <p className="text-lg font-black font-code text-cyan-400 tracking-tighter">
                              {networkPing} ms
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
                    
                    <SnakeBorderCard processing={isInterrogating} className="flex-1 min-h-0 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="h-full font-code overflow-hidden flex flex-col relative bg-black/60">
                        <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                        <div 
                          ref={scrollRef} 
                          className={cn(
                            "flex-1 overflow-y-auto terminal-scrollbar p-6 space-y-2 z-10 flex flex-col scan-console",
                            isInterrogating ? "flex-col-reverse" : "flex-col"
                          )}
                          style={{ fontSize: `${consoleFontSize[0]}px` }}
                        >
                          {!isInterrogating ? (
                            <div className="space-y-1">
                                {displayedSystemLines.map((line, i) => (
                                    <div key={i} className="text-[#7CFFB2] opacity-80 animate-in fade-in duration-300">
                                        {line}
                                    </div>
                                ))}
                                <div className="text-[#7CFFB2] w-1 h-4 bg-[#7CFFB2] animate-pulse inline-block ml-1" />
                            </div>
                          ) : (
                            logs.map((log) => (
                                <div key={log.id} className={cn(
                                  "terminal-line flex gap-4 leading-[1.7] seed-entry console-line",
                                  log.type === 'ai' ? 'mb-2' : ''
                                )}>
                                  <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                                  {log.type === 'ai' ? (
                                    <div className="flex-1 font-code">
                                      <span className="balance">Balance: 0</span>
                                      <span className="text-gray-500"> | </span>
                                      <span className="seed">{log.message.split(' | ')[1]}</span>
                                    </div>
                                  ) : (
                                    <span className={cn(
                                      "break-words whitespace-normal uppercase tracking-tight",
                                      log.type === 'success' ? 'text-green-400 font-bold' :
                                      log.type === 'warning' ? 'text-yellow-400' :
                                      log.type === 'error' ? 'text-red-400' : 
                                      log.type === 'system' ? 'text-cyan-400 font-medium' : 'text-gray-500'
                                    )}>
                                      {log.message}
                                    </span>
                                  )}
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </SnakeBorderCard>
                  </div>

                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <div className="flex items-center gap-2 mb-1 shrink-0">
                      <SearchCode className="w-4 h-4 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">AI Search</h3>
                    </div>
                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden">
                       {!isAiSearchConnected ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                           <Globe className={cn("w-12 h-12 mb-4", isAiSearchConnecting ? "text-primary animate-pulse" : "text-gray-800")} />
                           <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">
                             {isAiSearchConnecting ? "Negotiating Uplink" : "AI Search Standby"}
                           </h4>
                           <p className="text-[10px] text-gray-600 uppercase mb-6 leading-relaxed">
                             Connection required for advanced heuristic discovery & speed boost.
                           </p>
                           <Button 
                             onClick={connectAiSearch} 
                             disabled={isAiSearchConnecting}
                             className="w-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase hover:bg-primary/20 transition-all h-10"
                           >
                             {isAiSearchConnecting ? "Connecting..." : "Connect AI Search"}
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
                         <div className="flex flex-col h-full space-y-6">
                            <div className="space-y-3 shrink-0">
                              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                                <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Connected</span>
                              </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                              <div className="relative mb-6">
                                <Share2 className={cn("w-20 h-20 transition-all duration-700", isInterrogating ? "text-primary animate-pulse drop-shadow-[0_0_15px_rgba(173,79,230,0.5)]" : "text-primary/20")} />
                                {isInterrogating && (
                                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                                )}
                              </div>
                              
                              <div className="w-full p-5 bg-black/40 border border-primary/20 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                                <div className="space-y-3 text-left">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-[9px] font-code text-primary/60 uppercase">Heuristic Filter</span>
                                    <span className="text-[9px] font-code text-primary font-bold">ACTIVE</span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-[9px] font-code text-primary/60 uppercase">Entropy Boost</span>
                                    <span className="text-[9px] font-code text-primary font-bold">MAXED</span>
                                  </div>
                                </div>
                              </div>

                              <Button 
                                onClick={disconnectAiSearch} 
                                disabled={isInterrogating}
                                variant="outline"
                                className="w-full mt-6 border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase transition-all h-8"
                              >
                                <Unplug className="w-3 h-3 mr-2" /> Disconnect AI Search
                              </Button>
                            </div>
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
                        <div className="flex items-center gap-2 mt-4">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{foundCount} Assets Identified</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 glass-panel p-8 rounded-3xl border-white/5 flex items-center justify-between">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Uplink Status</h4>
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
                                <span className="text-xs font-bold text-green-500 uppercase">{networkPing}ms Stable</span>
                             </div>
                          </div>
                       </div>
                       <Button className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">
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
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-[9px] text-gray-600 uppercase font-black">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Interrogation
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-4 pr-2">
                      {foundWallets.length > 0 ? foundWallets.map((wallet) => (
                        <div key={wallet.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500">
                          <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-primary/40 transition-colors">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {BLOCKCHAINS.find(b => b.id === wallet.chain) ? (
                                  <img src={BLOCKCHAINS.find(b => b.id === wallet.chain)?.logo} className="w-8 h-8 relative z-10" alt="logo" />
                                ) : (
                                  <Wallet className="w-8 h-8 text-primary relative z-10" />
                                )}
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-black text-white tracking-wider font-code uppercase">{wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}</p>
                                  <div className="h-1 w-1 rounded-full bg-gray-700" />
                                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">{wallet.chain}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                                   <div className="flex items-center gap-1.5">
                                      <Timer className="w-3 h-3" />
                                      {wallet.timestamp}
                                   </div>
                                   <div className="flex items-center gap-1.5">
                                      <ShieldCheck className="w-3 h-3 text-green-500/60" />
                                      SECURE LOG VERIFIED
                                   </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                              <div className="space-y-1">
                                <p className="text-lg font-black text-white font-code">${(wallet.balance * 2400).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">EST. LIQUID VALUE</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleReveal(wallet.id)}
                                className={cn(
                                  "h-8 px-4 text-[9px] uppercase font-black tracking-widest transition-all duration-300 rounded-lg",
                                  wallet.revealed 
                                    ? "border-primary/40 bg-primary/10 text-primary" 
                                    : "border-white/10 hover:border-primary/40 hover:bg-primary/5 text-gray-500"
                                )}
                              >
                                {wallet.revealed ? (
                                  <div className="flex items-center gap-2"><EyeOff className="w-3.5 h-3.5"/> SECURE MASK</div>
                                ) : (
                                  <div className="flex items-center gap-2"><Eye className="w-3.5 h-3.5"/> REVEAL NEURAL KEY</div>
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {wallet.revealed && (
                            <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-500">
                              <div className="p-5 rounded-xl bg-black/60 border border-primary/20 shadow-inner relative overflow-hidden group/mnemonic">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                   <Lock className="w-10 h-10 text-primary" />
                                </div>
                                <p className="text-[9px] font-black text-primary uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                                   <ShieldCheck className="w-3 h-3" /> Decrypted BIP39 Sequence
                                </p>
                                <p className="text-xs font-code text-white/90 leading-loose tracking-widest select-text bg-white/[0.02] p-4 rounded-lg border border-white/5 group-hover/mnemonic:border-primary/20 transition-colors">
                                  {wallet.mnemonic}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 group">
                          <Activity className="w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-700" />
                          <div className="text-center space-y-2">
                            <p className="text-sm uppercase tracking-[0.4em] font-black text-white">Neural Web Silent</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Awaiting asset discovery via system interrogation</p>
                          </div>
                        </div>
                      )}
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
                      <span className="text-[9px] font-code text-primary/60 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{SERVERS.length} NODES</span>
                    </div>
                    
                    {SERVERS.map((server) => {
                      const isSelected = selectedServerId === server.id;
                      return (
                        <div 
                          key={server.id} 
                          onClick={() => !isInterrogating && setSelectedServerId(server.id)}
                          className={cn(
                            "relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 group",
                            isSelected 
                              ? "bg-primary/[0.08] border-primary/50 shadow-[0_0_30px_rgba(173,79,230,0.15)] scale-[1.02]" 
                              : "glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.03]",
                            isInterrogating ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                          )}
                          
                          <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                                  isSelected ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(173,79,230,0.4)]" : "bg-white/5 text-gray-500 border-white/10"
                                )}>
                                  <ServerIcon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className={cn("text-xs font-black uppercase tracking-wider", isSelected ? "text-white" : "text-gray-400")}>{server.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <Globe className="w-2.5 h-2.5 text-gray-600" />
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{server.region}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-tighter",
                                  server.status === 'active' ? "text-green-500 bg-green-500/10" : "text-yellow-500 bg-yellow-500/10"
                                )}>
                                  {server.status}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] font-code uppercase">
                                  <span className="text-gray-500">Latency</span>
                                  <span className="text-green-500">{server.latency}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500/50" style={{ width: `${Math.max(20, 100 - parseInt(server.latency))}%` }} />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] font-code uppercase">
                                  <span className="text-gray-500">Node Load</span>
                                  <span className={cn(server.load > 60 ? "text-yellow-500" : "text-primary")}>{server.load}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className={cn("h-full", server.load > 60 ? "bg-yellow-500/50" : "bg-primary/50")} style={{ width: `${server.load}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {isSelected && (
                             <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40 animate-[slide-down_2s_linear_infinite]" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
                    <div className="glass-panel rounded-3xl p-8 border-white/5 flex flex-col flex-1 relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.6)]">
                       <div className="absolute inset-0 opacity-10 pointer-events-none">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:32px_32px]" />
                       </div>

                       <div className="relative z-10 flex flex-col h-full">
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                                <Dna className="w-6 h-6 animate-pulse" />
                                <div className="absolute inset-0 rounded-2xl pulse-ring border border-primary/40" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Active Endpoint Telemetry</h4>
                                <p className="text-[10px] text-primary/60 font-code uppercase tracking-widest mt-0.5">Node ID: {selectedServer?.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="flex flex-col items-end gap-1">
                                  <span className="text-[9px] text-gray-600 uppercase font-black">Link Stability</span>
                                  <div className="flex gap-1">
                                     {Array.from({length: 5}).map((_, i) => (
                                       <div key={i} className={cn("h-3 w-1 rounded-full", i < 4 ? "bg-green-500" : "bg-gray-800 animate-pulse")} />
                                     ))}
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex-1 flex flex-col items-center justify-center relative my-10">
                            <div className="relative group/globe">
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-[320px] h-[320px] border-2 border-primary/5 rounded-full animate-[spin_40s_linear_infinite]" />
                                  <div className="absolute w-[280px] h-[280px] border border-primary/10 border-dashed rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                                  <div className="absolute w-[400px] h-[400px] border border-white/[0.02] rounded-full" />
                               </div>
                               
                               <div className="relative bg-black/40 backdrop-blur-3xl p-12 rounded-full border border-primary/20 shadow-[0_0_100px_rgba(173,79,230,0.15)] group-hover/globe:scale-105 transition-transform duration-1000">
                                  <Globe className={cn("w-40 h-40 transition-all duration-1000", isInterrogating ? "text-primary drop-shadow-[0_0_30px_rgba(173,79,230,0.6)]" : "text-primary/30")} />
                                  {isInterrogating && (
                                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" />
                                  )}
                               </div>
                               
                               {/* Floating node indicators */}
                               <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                               <div className="absolute -bottom-8 -left-2 w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(173,79,230,0.8)]" />
                            </div>
                         </div>

                         <div className="grid grid-cols-3 gap-6 mt-auto">
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest group-hover/metric:text-primary transition-colors">Uptime</span>
                               <p className="text-sm font-black text-white font-code tracking-tighter">99.998%</p>
                            </div>
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest group-hover/metric:text-cyan-400 transition-colors">Encryption</span>
                               <div className="flex items-center gap-2">
                                 <Lock className="w-3 h-3 text-cyan-400" />
                                 <p className="text-xs font-black text-white font-code tracking-tighter">AES-256 GCM</p>
                               </div>
                            </div>
                            <div className="p-5 glass-panel rounded-2xl border-white/5 space-y-2 group/metric">
                               <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest group-hover/metric:text-green-500 transition-colors">Latency Peak</span>
                               <p className="text-sm font-black text-white font-code tracking-tighter">{networkPing + 12} MS</p>
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
                        <span className="text-[9px] font-code text-primary/40 uppercase tracking-widest">Live Node interrogation active</span>
                      </div>
                      <div className="flex-1 bg-black/60 p-6 font-code text-[10px] overflow-hidden relative">
                        <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                        <div ref={serverLogRef} className="h-full overflow-y-auto terminal-scrollbar space-y-1.5 flex flex-col z-10 relative">
                           {serverLogs.map((log, i) => (
                             <div key={i} className="text-[#00FF41]/60 hover:text-[#00FF41] transition-colors py-1 border-b border-white/[0.03] tracking-tighter animate-in slide-in-from-left-2 duration-300">
                               <span className="text-gray-600 mr-2 opacity-50 select-none font-bold">NODE_LOG:</span> {log}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in zoom-in-95 duration-500 pb-20">
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
                        <Slider 
                          value={systemIntensity} 
                          onValueChange={setSystemIntensity} 
                          max={100} 
                          step={1} 
                          disabled={isInterrogating}
                          className="cursor-pointer"
                        />
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Directly modulates the engine's processing frequency and interrogation speed.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">Neural Core Allocation</label>
                          </div>
                          <span className="text-xs font-code text-primary">{allocatedCores[0]} / {hardwareCores} Logic Cores</span>
                        </div>
                        <Slider 
                          value={allocatedCores} 
                          onValueChange={setAllocatedCores} 
                          min={1}
                          max={hardwareCores} 
                          step={1} 
                          disabled={isInterrogating}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Optimization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-3 p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Trash2 className="w-4 h-4 text-primary group-hover:animate-bounce" />
                                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Neural Memory Flush</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleMemoryFlush}
                                  className="h-8 text-[9px] uppercase font-bold border-primary/20 text-primary hover:bg-primary/10"
                                >
                                  Flush Memory
                                </Button>
                              </div>
                              <p className="text-[9px] text-gray-600 uppercase leading-relaxed">Clears terminal logs and server activity history to reclaim client memory and prevent UI lag.</p>
                           </div>

                           <div className="flex flex-col gap-3 p-5 rounded-2xl border border-red-500/10 bg-red-500/[0.01] hover:bg-red-500/[0.03] transition-colors group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <RotateCcw className="w-4 h-4 text-red-500" />
                                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={clearSession}
                                  className="h-8 text-[9px] uppercase font-bold border-red-500/20 text-red-500 hover:bg-red-500/10"
                                >
                                  Hard Reset
                                </Button>
                              </div>
                              <p className="text-[9px] text-gray-600 uppercase leading-relaxed">Purges all session stats, found wallets, and engine configurations. Cannot be undone.</p>
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
                            <button
                              key={color.name}
                              onClick={() => setSeedPhraseColor(color.class)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg border text-left transition-all",
                                seedPhraseColor === color.class ? "bg-primary/10 border-primary/40" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                              )}
                            >
                              <span className="text-[9px] font-bold text-gray-400 uppercase leading-none">{color.name}</span>
                              <div className={cn(
                                "w-3 h-3 rounded-full border border-white/10", 
                                color.class.includes('gradient') ? 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' : color.class.split(' ')[0]
                              )} />
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
                          <Slider 
                            value={consoleFontSize} 
                            onValueChange={setConsoleFontSize} 
                            min={8} 
                            max={16} 
                            step={1} 
                            className="cursor-pointer"
                          />
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
                      <p>
                        AI Crypto Engine is an advanced blockchain analysis and scanning system designed to monitor multiple cryptocurrency networks in real time.
                      </p>
                      <p>
                        The system connects to blockchain nodes and processes large volumes of transaction data using heuristic analysis and AI-assisted pattern detection.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {[
                        "Multi-blockchain monitoring",
                        "AI-assisted transaction analysis",
                        "Network latency tracking",
                        "Node connectivity monitoring",
                        "Secure encrypted scanning engine"
                      ].map((capability, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{capability}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-primary/60 italic font-code">
                      The goal of the system is to provide a high-performance blockchain analysis interface with real-time insights and scanning capabilities.
                    </p>
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
                          { label: "Status", val: "Active", class: "text-green-500" }
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
                         <a 
                           href="https://t.me/Ai_Crypto_Software" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#7c6cff] to-[#9b7bff] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(124,108,255,0.4)] transition-all"
                         >
                           <ExternalLink className="w-3 h-3" />
                           Join Telegram Channel
                         </a>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/5 pb-4 shrink-0">
                  {isInterrogating ? (
                    <Button 
                      onClick={stopInterrogation} 
                      variant="outline" 
                      className="bg-red-500/10 border-red-500/40 hover:bg-red-500/20 text-red-500 h-14 px-12 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                    >
                      <Power className="w-4 h-4 mr-3" /> STOP SCAN
                    </Button>
                  ) : (
                    <Button 
                      onClick={startInterrogation} 
                      disabled={activeBlockchains.length === 0}
                      className={cn(
                        "h-14 px-20 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_30px_rgba(173,79,230,0.3)] hover:opacity-90 disabled:opacity-30"
                      )}
                    >
                      <Zap className="w-4 h-4 mr-3" /> START SCAN
                    </Button>
                  )}
                  {activeBlockchains.length === 0 && !isInterrogating && (
                    <div className="flex items-center gap-2 text-[10px] text-yellow-500 font-bold uppercase animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Select Blockchains to Proceed
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="ticker-wrap flex-1 mr-8 overflow-hidden whitespace-nowrap">
              <p className="ticker-content text-[8px] text-primary/60 uppercase tracking-[0.4em] font-code">
                Status: {isInterrogating ? "SCANNING" : "STANDBY"} • Active Node: {selectedServer?.name} • Cores: {allocatedCores[0]} • Logic: BIP39-Elite • Encryption: AES-256 Verified
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
