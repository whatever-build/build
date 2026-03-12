
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Cpu, 
  Activity, 
  RefreshCcw, 
  Wallet,
  Power,
  Globe,
  Lock,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  History,
  Zap,
  SearchCode,
  ArrowDownCircle,
  Cloud,
  Timer,
  Terminal,
  CheckCircle2,
  Wifi,
  Radio,
  Share2,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Type,
  Palette,
  Unplug,
  Layers,
  RotateCcw,
  LogOut,
  Loader2,
  Signal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import * as bip39 from 'bip39'
import { logout } from '@/app/login/actions'

const CryptoIcon = ({ id, className }: { id: string, className?: string }) => {
  switch (id) {
    case 'btc':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M17.062 9.59c.41-2.73-1.67-4.19-4.51-5.17l.92-3.71h-2.26l-.9 3.6c-.59-.15-1.2-.29-1.79-.43l.9-3.61H7.16l-.92 3.71c-.49-.11-1-.23-1.48-.34l.01-.03-3.12-.78-.6 2.41s1.68.38 1.64.41c.92.23 1.08.84 1.05 1.33l-1.06 4.24c.06.02.15.04.24.07l-.24-.06-1.48 5.95c-.11.27-.4.69-1.04.53.02.04-1.64-.41-1.64-.41l-1.12 2.58 2.94.73c.55.14 1.08.28 1.62.42l-.93 3.74h2.26l.93-3.73c.61.16 1.2.31 1.79.46l-.92 3.71h2.26l.93-3.73c3.86.73 6.76.44 7.98-3.06.99-2.81-.05-4.43-2.08-5.49 1.48-.34 2.59-1.32 2.89-3.34zm-5.17 7.31c-.7 2.81-5.42 1.29-6.95.91l1.24-4.97c1.53.38 6.43 1.13 5.71 4.06zm.7-7.34c-.64 2.56-4.57 1.26-5.84.94l1.12-4.51c1.27.32 5.38.92 4.72 3.57z"/>
        </svg>
      )
    case 'eth':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.37 4.35zm.056-17.97L4.628 12.32l7.372 4.35 7.373-4.35L12 0z"/>
        </svg>
      )
    case 'sol':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M4.032 6.551l3.364-3.334h16.604l-3.364 3.334H4.032zm16.604 14.115H4.032l3.364-3.334h16.604l-3.364 3.334zm0-7.058H4.032l3.364-3.334h16.604l-3.364 3.334z"/>
        </svg>
      )
    case 'bnb':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M16.624 13.92L12 18.544l-4.624-4.624-1.52 1.52L12 21.584l6.144-6.144-1.52-1.52zM16.624 10.08L18.144 8.56 12 2.416 5.856 8.56l1.52 1.52L12 5.456l4.624 4.624zM21.584 12l-3.04-3.04-1.52 1.52L18.544 12l-1.52 1.52 1.52 1.52L21.584 12zM5.456 12l-3.04-3.04-1.52 1.52L2.416 12l-1.52 1.52 1.52 1.52L5.456 12zM14.992 12L12 14.992 9.008 12 12 9.008 14.992 12z"/>
        </svg>
      )
    case 'trx':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0L2.25 10.5 12 24l9.75-13.5L12 0zm0 4.125l5.25 5.625h-10.5l5.25-5.625zm0 15.375L7.5 11.25h9L12 19.5z"/>
        </svg>
      )
    case 'xrp':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M13.91 12l7.35-8h-4.3l-5.2 5.65L6.56 4h-4.3l7.35 8-7.35 8h4.3l5.2-5.65 5.2 5.65h4.3l-7.35-8z"/>
        </svg>
      )
    case 'ltc':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.188 17.5h-8.312l1.01-3.623 5.432-1.524 1.137-4.103-5.432 1.524.71-2.524h3.14l1.138-4.102h-7.388l-4.187 15h11.751l1.01-4.148z"/>
        </svg>
      )
    case 'matic':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 12.33l-1.16-.67V9l2.32 1.34l2.32-1.34L13.16 7.67L12 8.33l-1.16-.67l2.32-1.34l2.32 1.34l2.32-1.34V4.33l-4.64-2.67l-4.64 2.67v5.34l4.64 2.67l-1.16.67V15l-2.32-1.34l-2.32 1.34l2.32 1.34L12 15.67l1.16.67l-2.32 1.34l-2.32-1.34l-2.32 1.34v1.34l4.64 2.67l4.64-2.67v-5.34l-4.64-2.67z"/>
        </svg>
      )
    case 'usdt':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.062 11.25h-2.187v4.688h-3.75v-4.688h-2.187v-2.812h8.125v2.812z"/>
        </svg>
      )
    case 'usdc':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.062 13.5c0 1.242-1.008 2.25-2.25 2.25h-1.812v1.5h-1.5v-1.5h-1.813c-1.242 0-2.25-1.008-2.25-2.25h1.5c0 .414.336.75.75.75h3.375c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-2.25c-1.242 0-2.25-1.008-2.25-2.25s1.008-2.25 2.25-2.25h1.813v-1.5h1.5v1.5h1.812c1.242 0 2.25 1.008 2.25 2.25h-1.5c0-.414-.336-.75-.75-.75h-3.375c-.414 0-.75.336-.75.75s.336.75.75.75h2.25c1.242 0 2.25 1.008 2.25 2.25z"/>
        </svg>
      )
    default:
      return <Wallet className={className} />
  }
}

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', symbol: '₿', color: 'bg-[#f7931a]', path: "m/84'/0'/0'/0/0" },
  { id: 'eth', name: 'Ethereum', symbol: 'Ξ', color: 'bg-[#627eea]', path: "m/44'/60'/0'/0/0" },
  { id: 'sol', name: 'Solana', symbol: 'S', color: 'bg-[#14f195]', path: "m/44'/501'/0'/0'" },
  { id: 'bnb', name: 'BNB Chain', symbol: 'B', color: 'bg-[#F3BA2F]', path: "m/44'/714'/0'/0/0" },
  { id: 'trx', name: 'Tron', symbol: 'T', color: 'bg-[#ff0013]', path: "m/44'/195'/0'/0/0" },
  { id: 'xrp', name: 'Ripple', symbol: 'X', color: 'bg-[#23292f]', path: "m/44'/144'/0'/0/0" },
  { id: 'ltc', name: 'Litecoin', symbol: 'Ł', color: 'bg-[#345d9d]', path: "m/44'/2'/0'/0/0" },
  { id: 'matic', name: 'Polygon', symbol: 'P', color: 'bg-[#8247e5]', path: "m/44'/60'/0'/0/0" },
  { id: 'usdt', name: 'Tether', symbol: '₮', color: 'bg-[#26a17b]', path: "m/44'/60'/0'/0/0" },
  { id: 'usdc', name: 'USDC', symbol: 'U', color: 'bg-[#2775ca]', path: "m/44'/60'/0'/0/0" },
]

const SERVERS = [
  { id: 'node-na-east', name: 'NORTH AMERICA EAST', region: 'Virginia, USA', latency: '12ms', status: 'active', load: 42 },
  { id: 'node-eu-central', name: 'EUROPE CENTRAL', region: 'Frankfurt, Germany', latency: '28ms', status: 'active', load: 68 },
  { id: 'node-asia-se', name: 'ASIA SOUTHEAST', region: 'Singapore', latency: '145ms', status: 'active', load: 12 },
  { id: 'node-asia-ne', name: 'ASIA NORTHEAST', region: 'Tokyo, Japan', latency: '112ms', status: 'active', load: 54 },
  { id: 'node-sa-east', name: 'SOUTH AMERICA', region: 'São Paulo, Brazil', latency: '168ms', status: 'active', load: 22 },
  { id: 'node-af-south', name: 'AFRICA SOUTH', region: 'Johannesburg, SA', latency: '112ms', status: 'active', load: 15 },
  { id: 'node-me-east', name: 'MIDDLE EAST', region: 'Dubai, UAE', latency: '85ms', status: 'active', load: 38 },
  { id: 'node-oc-sydney', name: 'OCEANIA', region: 'Sydney, Australia', latency: '190ms', status: 'active', load: 29 },
  { id: 'node-arctic-north', name: 'ARCTIC NORTH', region: 'Reykjavik, Iceland', latency: '45ms', status: 'active', load: 8 },
]

const SEED_COLORS = [
  { name: 'Classic Silver', class: 'text-white/80' },
  { name: 'Neural Violet', class: 'text-primary' },
  { name: 'Matrix Green', class: 'text-green-400' },
  { name: 'Cyber Cyan', class: 'text-cyan-400' },
  { name: 'Gold Amber', class: 'text-amber-400' },
  { name: 'Cyber RGB', class: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-gradient' },
]

const SESSION_STORAGE_KEY = 'ai_crypto_session_state_v2';

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

type TabType = 'dashboard' | 'withdraw' | 'server' | 'settings';

export default function AiCryptoDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [serverLogs, setServerLogs] = useState<string[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
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
  const [consoleFontSize, setConsoleFontSize] = useState([11])
  const [isAutoMemoryEnabled, setIsAutoMemoryEnabled] = useState(true)
  const [lastPurgeTime, setLastPurgeTime] = useState<string | null>(null)
  
  const [isAiSearchConnected, setIsAiSearchConnected] = useState(false)
  const [isAiSearchConnecting, setIsAiSearchConnecting] = useState(false)
  const [aiSearchLogs, setAiSearchLogs] = useState<string[]>([])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const serverLogRef = useRef<HTMLDivElement>(null)

  // Logout function
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    toast({
      title: "Neural Core Severed",
      description: "Operator session terminated."
    })
    router.push('/login')
  }

  // Initialize Buffer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Buffer } = require('buffer');
      window.Buffer = window.Buffer || Buffer;
    }
  }, []);

  // Load Session on Mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const data = JSON.parse(savedSession);
        if (data.checkedCount !== undefined) setCheckedCount(data.checkedCount);
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
    }
  }, []);

  // Persist Session on State Changes
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
    setActiveBlockchains([]);
    setSystemIntensity([85]);
    setAllocatedCores([Math.floor((navigator.hardwareConcurrency || 8) / 2)]);
    setSeedPhraseColor('text-white/80');
    setConsoleFontSize([11]);
    setIsAutoMemoryEnabled(true);
    setFoundCount(0);
    setFoundWallets([]);
    toast({
      title: "Workstation Reset",
      description: "All saved progress and configurations have been purged."
    });
  }, [toast]);
  
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
        type
      }
      return [newEntry, ...prev].slice(0, 50) 
    })
  }, [])

  const addServerLog = useCallback((msg: string) => {
    setServerLogs(prev => [
      `${new Date().toLocaleTimeString('en-GB', { hour12: false })} > ${msg}`,
      ...prev
    ].slice(0, 50))
  }, [])

  const clearMemory = useCallback(() => {
    setLogs([])
    setServerLogs([])
    setLastPurgeTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    toast({
      title: "Memory Purged",
      description: "Terminal buffers and session cache have been cleared."
    })
  }, [toast])

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
      if (allocatedCores[0] === 4 && !localStorage.getItem(SESSION_STORAGE_KEY)) {
        setAllocatedCores([Math.floor(cores / 2)]);
      }
    }
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [allocatedCores]);

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
  }, [logs, serverLogs]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isInterrogating) {
      timerInterval = setInterval(() => setSessionSeconds(prev => prev + 1), 1000)
    }
    return () => clearInterval(timerInterval)
  }, [isInterrogating])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoMemoryEnabled) {
      interval = setInterval(() => {
        clearMemory()
      }, 5 * 60 * 1000)
    }
    return () => clearInterval(interval)
  }, [isAutoMemoryEnabled, clearMemory])

  useEffect(() => {
    let aiFetchInterval: NodeJS.Timeout
    let smoothCounterInterval: NodeJS.Timeout

    if (isInterrogating) {
      const bootSequence = async () => {
        setLogs([])
        setSessionSeconds(0)
        
        addLog("ESTABLISHING SECURE HANDSHAKE...", "system")
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLog("CHECKING PORTS AND TLS DESCRIPTORS...", "info")
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLog("RESOLVING PROXY TUNNEL...", "info")
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const aiStatusMsg = isAiSearchConnected ? "AI SEARCH: LINKED [HEURISTIC BOOST]" : "AI SEARCH: NOT CONNECTED [STANDARD MODE]";
        addLog(aiStatusMsg, isAiSearchConnected ? "success" : "warning")
        await new Promise(resolve => setTimeout(resolve, 300))
        
        addLog("CRYPTOGRAPHIC ENGINE: INITIALIZED", "system")
        addLog(`ALLOCATED CORES: ${allocatedCores[0]}`, "info")

        const coreFactor = allocatedCores[0] / hardwareCores;
        const intensityFactor = systemIntensity[0] / 100;
        const aiBoost = isAiSearchConnected ? 4.5 : 1.2;
        
        // Background logical processing for "throughput"
        aiFetchInterval = setInterval(() => {
          const batchSize = Math.ceil(intensityFactor * 10 * coreFactor * aiBoost);
          for(let i = 0; i < batchSize; i++) {
              bip39.generateMnemonic(); // Workload
          }
          const visualPhrase = bip39.generateMnemonic();
          addLog(visualPhrase, "ai")
          setCpuLoad(Math.min(100, (systemIntensity[0] * coreFactor) + (Math.random() * 5)))
        }, 120)

        // Smooth "1 by 1" counter increment
        // We tick faster with a smaller increment to feel smooth
        smoothCounterInterval = setInterval(() => {
            const incrementPerTick = Math.ceil(intensityFactor * 2 * coreFactor * aiBoost);
            setCheckedCount(prev => prev + incrementPerTick);
        }, 30); // 33fps target for smooth numbers
      }

      bootSequence()
    } else {
      setCpuLoad(0)
    }

    return () => {
      if (aiFetchInterval) clearInterval(aiFetchInterval)
      if (smoothCounterInterval) clearInterval(smoothCounterInterval)
    }
  }, [isInterrogating, addLog, systemIntensity, hardwareCores, allocatedCores, isAiSearchConnected])

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
    addLog("SCAN PROTOCOL ABORTED BY OPERATOR", "error")
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
        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .terminal-line {
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }
        `}</style>

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
                ].map((item) => (
                  <SidebarMenuButton 
                    key={item.id} 
                    isActive={activeTab === item.id} 
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={cn(
                      "transition-all duration-200 h-10 px-4 rounded-lg",
                      activeTab === item.id ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tighter">{item.label}</span>
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
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
                                isInterrogating && "cursor-not-allowed pointer-events-none"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white shadow-xl", chain.color)}>
                                  <CryptoIcon id={chain.id} className="w-4 h-4" />
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
                            <Zap className="w-3 h-3" /> Seed phrases checked
                          </p>
                          <p className="text-2xl font-black font-code text-white tracking-tighter">
                            {checkedCount.toLocaleString()}
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
                      <div className="h-full p-6 font-code overflow-hidden flex flex-col relative bg-black/60">
                        <div 
                          ref={scrollRef} 
                          className="flex-1 overflow-y-auto terminal-scrollbar space-y-2 z-10 flex flex-col-reverse"
                          style={{ fontSize: `${consoleFontSize[0]}px` }}
                        >
                          {logs.length === 0 && !isInterrogating && (
                            <div className="h-full flex items-center justify-center text-gray-700 uppercase tracking-widest font-black text-xs">
                              Scan Engine Ready
                            </div>
                          )}
                          {logs.map((log) => (
                            <div key={log.id} className="terminal-line flex gap-4 leading-normal animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
                              <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                              <span className={cn(
                                "break-all uppercase tracking-tight",
                                log.type === 'success' ? 'text-green-400 font-bold' :
                                log.type === 'warning' ? 'text-yellow-400' :
                                log.type === 'error' ? 'text-red-400' : 
                                log.type === 'system' ? 'text-cyan-400 font-medium' :
                                log.type === 'ai' ? cn(seedPhraseColor, "font-medium") : 'text-gray-500'
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
                      <Radio className="w-4 h-4 text-primary" />
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
                              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neural Link</span>
                                <Wifi className="w-4 h-4 text-primary animate-pulse" />
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
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-code text-primary/60 uppercase">Neural Speed</span>
                                    <span className="text-[9px] font-code text-primary font-bold">SUPERCHARGED</span>
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
                    <div className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-5 h-5 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Session Yield</h4>
                      </div>
                      <p className="text-4xl font-black font-code text-white">${foundWallets.reduce((acc, w) => acc + w.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-green-500 mt-2">{foundCount} Assets Identified</p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Reserves</h4>
                      </div>
                      <p className="text-4xl font-black font-code text-white/40">$0.00</p>
                      <p className="text-[10px] text-gray-600 mt-2">Requires Pro license for history</p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 mb-4">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Ledger</h4>
                      </div>
                      <p className="text-4xl font-black font-code text-white/40">{foundCount}</p>
                      <p className="text-[10px] text-gray-600 mt-2">Active buffer count</p>
                    </div>
                  </div>

                  <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Discovered Assets Ledger</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto terminal-scrollbar space-y-4">
                      {foundWallets.length > 0 ? foundWallets.map((wallet) => (
                        <div key={wallet.id} className="flex flex-col gap-3 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                                <Wallet className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{wallet.address}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{wallet.chain} • SECURE LOG AT {wallet.timestamp}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-white">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleReveal(wallet.id)}
                                className="text-[9px] h-auto p-0 text-primary uppercase font-bold hover:bg-transparent"
                              >
                                {wallet.revealed ? <div className="flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hide Key</div> : <div className="flex items-center gap-1"><Eye className="w-3 h-3"/> Reveal Secure Key</div>}
                              </Button>
                            </div>
                          </div>
                          {wallet.revealed && (
                            <div className="p-4 rounded-lg bg-black/40 border border-primary/20 animate-in slide-in-from-top-2 duration-300">
                              <p className="text-[10px] font-bold text-primary uppercase mb-2">BIP39 SECURE MNEMONIC:</p>
                              <p className="text-xs font-code text-white leading-relaxed tracking-wider select-text">{wallet.mnemonic}</p>
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                          <History className="w-16 h-16 mb-4" />
                          <p className="text-xs uppercase tracking-[0.3em] font-black">No assets identified in current session</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'server' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
                  <div className="flex flex-col gap-4 overflow-y-auto terminal-scrollbar pr-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">Global Cluster Map</h3>
                      <span className="text-[10px] font-code text-primary/60">{SERVERS.length} Clusters Online</span>
                    </div>
                    {SERVERS.map((server) => {
                      const isSelected = selectedServerId === server.id;
                      return (
                        <div 
                          key={server.id} 
                          onClick={() => !isInterrogating && setSelectedServerId(server.id)}
                          className={cn(
                            "glass-panel p-5 rounded-2xl border transition-all group relative overflow-hidden",
                            isSelected ? "border-primary/40 bg-primary/5" : "border-white/5 hover:border-white/20",
                            isInterrogating ? "cursor-not-allowed" : "cursor-pointer"
                          )}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                              <div className={cn("w-2 h-2 rounded-full", server.status === 'active' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-yellow-500")} />
                              <div>
                                <p className="text-sm font-black font-code text-white uppercase">{server.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{server.region}</p>
                              </div>
                            </div>
                            <div className="flex gap-6 text-right">
                              <div className="space-y-1">
                                <p className="text-[8px] text-gray-600 uppercase">Latency</p>
                                <p className="text-xs font-bold text-green-500">{server.latency}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] text-gray-600 uppercase">Load</p>
                                <p className="text-xs font-bold text-white">{server.load}%</p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary ml-2" />}
                            </div>
                          </div>
                          {isSelected && <div className="absolute left-0 top-0 h-full w-1 bg-primary" />}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex flex-col gap-6 min-h-0">
                    <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col h-1/2">
                      <div className="flex items-center gap-3 mb-6">
                        <Terminal className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Cluster Feedback</h3>
                      </div>
                      <div className="flex-1 bg-black/40 rounded-xl p-4 font-code text-[10px] overflow-hidden">
                        <div ref={serverLogRef} className="h-full overflow-y-auto terminal-scrollbar space-y-1 flex flex-col">
                           {serverLogs.map((log, i) => (
                             <div key={i} className="text-gray-500 hover:text-white/60 transition-colors py-0.5 border-b border-white/[0.02]">
                               {log}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-8 border-white/5 flex flex-col flex-1 justify-center items-center text-center">
                       <Globe className="w-16 h-16 text-primary/10 mb-6" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Endpoint: {selectedServer?.name}</h4>
                       <p className="text-[10px] text-gray-500 uppercase leading-relaxed max-w-xs">
                         All cryptographic packets are routed via {selectedServer?.region} utilizing AES-256 standard encryption.
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in zoom-in-95 duration-500 pb-20">
                  <div className="glass-panel rounded-2xl p-10 border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Engine Protocols</h3>
                    <div className="space-y-12">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">Processing Intensity</label>
                          </div>
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
                        <p className="text-[10px] text-gray-500 uppercase leading-relaxed">
                          Controls the cryptographic cycle frequency. Higher intensity increases PPS throughput.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">Core Allocation</label>
                          </div>
                          <span className="text-xs font-code text-primary">{allocatedCores[0]} / {hardwareCores} Cores</span>
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
                        <p className="text-[10px] text-gray-500 uppercase leading-relaxed">
                          Define the number of logical CPU cores allocated to the interrogation engine.
                        </p>
                      </div>

                      <div className="space-y-6 pt-4 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Memory & Session Protocol</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Auto-Purge (5m)</p>
                                <p className="text-[9px] text-gray-600 uppercase">Clear terminal history automatically.</p>
                              </div>
                              <Switch 
                                checked={isAutoMemoryEnabled}
                                onCheckedChange={setIsAutoMemoryEnabled}
                              />
                           </div>
                           <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                                <p className="text-[9px] text-gray-600 uppercase">Purge all session and progress data.</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={clearSession}
                                className="h-8 text-[9px] uppercase font-bold border-red-500/20 text-red-500 hover:bg-red-500/10"
                              >
                                <RotateCcw className="w-3 h-3 mr-2" /> Reset
                              </Button>
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

                        <div className="p-5 rounded-xl bg-black/40 border border-white/5 min-h-[100px] flex flex-col justify-center">
                           <p className="text-[9px] font-bold text-gray-600 uppercase mb-3">Live Preview:</p>
                           <div className="font-code" style={{ fontSize: `${consoleFontSize[0]}px` }}>
                             <p className={cn(seedPhraseColor, "uppercase tracking-tight leading-relaxed")}>tree river flower mountain forest branch leaf stone wood path sky water</p>
                           </div>
                        </div>
                      </div>
                    </div>
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
            <div className="flex items-center gap-4 text-[8px] font-code text-gray-600 shrink-0">
               <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500" /> System Stable</span>
               <span>v4.0.0 Pro</span>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
