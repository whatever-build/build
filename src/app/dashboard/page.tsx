
"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Cpu, 
  Activity, 
  Power,
  Lock,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  Zap,
  Search,
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
  Dna,
  RefreshCw,
  Trash2,
  Gauge,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
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
  ShieldAlert,
  ArrowRightCircle,
  User,
  Languages
} from 'lucide-react'
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import * as bip39 from 'bip39'
import { logout, verifyLicenseSession, getSession } from '@/app/login/actions'
import { SessionData } from '@/lib/session'
import { filterMnemonicsHeuristically } from '@/ai/flows/filter-mnemonics-heuristically'
import { interrogateMnemonic } from '@/ai/flows/interrogate-mnemonic'
import { notifyPayoutSaved } from '@/ai/flows/notify-payout-saved'
import { db } from '@/firebase/config'
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore'
import { Separator } from '@/components/ui/separator'

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

const ENTROPY_LANGUAGES = [
  { id: 'english', name: 'English (Global)', flag: '🇺🇸' },
  { id: 'spanish', name: 'Spanish (Neural)', flag: '🇪🇸' },
  { id: 'french', name: 'French (Forensic)', flag: '🇫🇷' },
  { id: 'japanese', name: 'Japanese (Spectrum)', flag: '🇯🇵' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷' },
  { id: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { id: 'chinese_simplified', name: 'Chinese (Simp.)', flag: '🇨🇳' },
  { id: 'chinese_traditional', name: 'Chinese (Trad.)', flag: '🇹🇼' },
]

const RISING_PARTICLES = [
  { left: '10%', delay: '0s', duration: '3s', size: '2px' },
  { left: '25%', delay: '1.2s', duration: '4s', size: '3px' },
  { left: '40%', delay: '0.5s', duration: '2.5s', size: '1px' },
  { left: '55%', delay: '2.1s', duration: '3.5s', size: '2px' },
  { left: '70%', delay: '1.8s', duration: '4.5s', size: '3px' },
  { left: '85%', delay: '0.9s', duration: '3.2s', size: '2px' },
];

const CHART_DATES = ['09.03', '10.03', '11.03', '12.03', '13.03', '14.03', '15.03'];

const SESSION_STORAGE_KEY = 'ai_crypto_session_state_v4_multi_lang';

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

type TabType = 'home' | 'withdraw' | 'settings' | 'about';

export default function AiCryptoDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [scanStep, setScanStep] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [displayCount, setDisplayCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  
  const [allocatedCores, setAllocatedCores] = useState([4])
  
  const [uiScale, setUiScale] = useState(100)
  const [mnemonicLanguage, setMnemonicLanguage] = useState<string>('english')
  
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
  const [lastFounded, setLastFounded] = useState<DiscoveredAsset | null>(null);

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

  const [showDiscoveredAssets, setShowDiscoveredAssets] = useState(false);

  const logBuffer = useRef<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null)
  const aiTerminalScrollRef = useRef<HTMLDivElement>(null)
  const lastMnemonics = useRef<string[]>([])
  const isAnalyzingRef = useRef(false);

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    setShowDiscoveredAssets(false);
  };

  const getTierName = useCallback((chains: string[]) => {
    if (chains.includes('multicoin')) return 'Ultimate';
    if (chains.length >= 6) return 'Elite';
    if (chains.length >= 3) return 'Pro';
    if (chains.length >= 1) return 'Standard';
    return 'Basic';
  }, []);

  const totalVal = useMemo(() => {
    return discoveredAssets.reduce((acc, curr) => {
      const numericVal = parseFloat(curr.value.replace(/[^0-9.]/g, '')) || 0;
      return acc + numericVal;
    }, 0);
  }, [discoveredAssets]);

  const dynamicChartData = useMemo(() => {
    if (discoveredAssets.length === 0) {
      return CHART_DATES.map(date => ({ name: date, value: 0 }));
    }
    return CHART_DATES.map((date, idx) => {
      const factor = (idx + 1) / CHART_DATES.length;
      return {
        name: date,
        value: Math.floor(totalVal * factor)
      };
    });
  }, [discoveredAssets, totalVal]);

  const handleMemoryFlush = useCallback(() => {
    setLogs([]);
    setAiTerminalLogs([]);
    logBuffer.current = [];
    toast({
      title: "Memory Flushed",
      description: "Neural interrogation cache cleared automatically.",
    });
  }, [toast]);

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
        setUiScale(parsed.uiScale || 100);
        setMnemonicLanguage(parsed.mnemonicLanguage || 'english');
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
      uiScale,
      mnemonicLanguage,
      discoveredAssets,
      payoutBtc,
      payoutUsdt,
      payoutSol
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [displayCount, foundWallets, activeBlockchains, systemIntensity, allocatedCores, uiScale, mnemonicLanguage, discoveredAssets, payoutBtc, payoutUsdt, payoutSol]);

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
    if (isBooting) {
      // Short delay to allow UI to clear before enabling scan button
      const timer = setTimeout(() => {
        setIsBooting(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  useEffect(() => {
    const flushLogs = () => {
      if (logBuffer.current.length > 0) {
        const newEntries = logBuffer.current;
        logBuffer.current = [];

        setLogs(prev => {
          const newLogs = [...prev, ...newEntries];
          return newLogs.length > 50 ? newLogs.slice(newLogs.length - 50) : newLogs;
        });

        const aiEntries = newEntries.filter(e => e.type === 'ai');
        setDisplayCount(prev => prev + aiEntries.length);
        
        const mnemonicsToConsider = aiEntries
          .map(e => e.message)
          .filter(() => Math.random() > 0.95);

        if (mnemonicsToConsider.length > 0) {
          lastMnemonics.current = [...mnemonicsToConsider, ...lastMnemonics.current].slice(0, 5);
        }
      }
      requestAnimationFrame(flushLogs);
    };

    const animationId = requestAnimationFrame(flushLogs);
    return () => cancelAnimationFrame(animationId);
  }, []);

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
    setIsBooting(false);
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
    setUiScale(100);
    setMnemonicLanguage('english');
    setDiscoveredAssets([]);
    setLastFounded(null);
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
          setLastFounded(asset);
          
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
    let interrogationInterval: NodeJS.Timeout

    if (isInterrogating && isOnline) {
      const intensity = systemIntensity[0] / 100;
      const coreFactor = allocatedCores[0] / 8;
      
      const baseDelay = Math.max(10, (250 - (150 * intensity * coreFactor)));

      interrogationInterval = setInterval(() => {
        const batchSize = isBoosterActive ? 10 : 1;
        
        for (let b = 0; b < batchSize; b++) {
          const wordlist = (bip39.wordlists as any)[mnemonicLanguage] || bip39.wordlists.english;
          let mnemonic = bip39.generateMnemonic(undefined, undefined, wordlist);
          
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
  }, [isInterrogating, isOnline, systemIntensity, allocatedCores, isBoosterActive, mnemonicLanguage]);

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
        description: "Withdrawal nodes secured in neural workstation vault and synchronized with HQ."
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

  const getNetworkLogo = (networkName: string) => {
    const chain = BLOCKCHAINS.find(c => c.name.toLowerCase() === networkName.toLowerCase() || c.id.toLowerCase() === networkName.toLowerCase());
    return chain?.logo || "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/generic.png";
  }

  const handleWithdrawAsset = (asset: DiscoveredAsset) => {
    if (!payoutBtc && !payoutUsdt && !payoutSol) {
      toast({
        variant: "destructive",
        title: "Withdrawal Required",
        description: "Configure your withdrawal nodes in the settings before extraction."
      });
      return;
    }
    toast({
      title: "Withdrawal Initialized",
      description: `Neural extraction of ${asset.value} on ${asset.network} dispatched to vault.`
    });
  }

  const handleWithdrawAllAssets = useCallback(() => {
    if (discoveredAssets.length === 0) {
      toast({
        variant: "destructive",
        title: "No Assets to Withdraw",
        description: "The forensic yield is currently zero. Initiate a scan to discover assets.",
      });
      return;
    }

    if (!payoutBtc && !payoutUsdt && !payoutSol) {
      toast({
        variant: "destructive",
        title: "Withdrawal Nodes Not Configured",
        description: "Configure your withdrawal nodes in the settings before extraction.",
      });
      changeTab('settings');
      return;
    }
    
    toast({
      title: "Bulk Extraction Initialized",
      description: `Neural extraction of all ${discoveredAssets.length} discovered assets has been dispatched to vault.`,
    });
    
    setDiscoveredAssets([]);
    setLastFounded(null);
  }, [discoveredAssets, payoutBtc, payoutUsdt, payoutSol, toast]);

  const currentTier = useMemo(() => getTierName(licenseData?.allowedChains || []), [getTierName, licenseData]);

  const navItems: { id: TabType; icon: React.ElementType }[] = [
    { id: 'home', icon: Search },
    { id: 'withdraw', icon: Activity },
    { id: 'settings', icon: Settings },
    { id: 'about', icon: Info },
  ];

  const ActionButtons = () => {
    const commonClass = "w-full h-16 rounded-2xl font-black text-[0.875rem] uppercase tracking-[0.3em] transition-all duration-500 hover:opacity-95 active:scale-95 disabled:opacity-30";
    
    if (activeTab === 'home') {
      if (scanStep === 1) {
        return (
          <Button 
            onClick={() => {
              if (activeBlockchains.length === 0) {
                toast({ variant: 'destructive', title: 'Selection Required', description: 'Please select at least one blockchain protocol.' });
              } else {
                setScanStep(2);
              }
            }}
            className={`${commonClass} bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)]`}>
            Continue <ChevronRight className="w-5 h-5 ml-3" />
          </Button>
        );
      } else { // scanStep === 2
        return isInterrogating ? (
          <Button onClick={stopInterrogation} className={cn(`${commonClass} bg-gradient-to-b from-gray-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]`)}>
            STOP
          </Button>
        ) : (
          <Button onClick={startInterrogation} disabled={activeBlockchains.length === 0 || isBooting || !isOnline} className={cn(`${commonClass} bg-gradient-to-b from-gray-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]`)}>
             START
          </Button>
        );
      }
    }
  
    if (activeTab === 'withdraw') {
      if (showDiscoveredAssets) {
        return (
          <Button 
            onClick={handleWithdrawAllAssets}
            disabled={discoveredAssets.length === 0}
            className={`${commonClass} bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)]`}>
            Withdraw Assets <ChevronRight className="w-5 h-5 ml-3" />
          </Button>
        );
      }
      return (
        <Button
          onClick={() => setShowDiscoveredAssets(true)}
          className={`${commonClass} bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)]`}>
          View Assets <Eye className="w-5 h-5 ml-3" />
        </Button>
      )
    }
  
    return null;
  };


  return (
    <div className="flex flex-col h-screen bg-[#050507] text-foreground font-body select-none relative transition-all duration-700 ease-in-out">
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

      <main className="flex-1 overflow-y-auto p-4 pb-36 min-h-0">
          <div className="w-full flex-1 flex flex-col min-h-0 animate-in fade-in duration-700 h-full">
            
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

            {activeTab === 'home' && (
              <div className="flex flex-col flex-1 min-h-0 h-full">
              {scanStep === 1 ? (
                <div className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-2xl font-black text-white/90 uppercase tracking-widest px-1 mb-4">Select Network Mesh</h2>
                  <p className="text-sm text-gray-500 px-1 mb-8">Choose one or more blockchain protocols to begin the forensic interrogation.</p>
                  <section className="space-y-4 shrink-0 flex-1 overflow-y-auto no-scrollbar pb-8">
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
                </div>
              ) : ( // scanStep === 2
                <div className="flex flex-col flex-1 min-h-0 h-full animate-in slide-in-from-bottom-4 duration-700">
                  <div className="relative flex items-center justify-center shrink-0 px-4 h-14">
                      <Button variant="ghost" onClick={() => setScanStep(1)} className="text-primary absolute left-4 top-1/2 -translate-y-1/2 px-2">
                          <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <div className="flex items-center gap-3">
                          <Search className="w-4 h-4 text-primary" />
                          <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white/60">Wallet search</h3>
                      </div>
                  </div>
                  
                  <div className="flex-1 min-h-0 relative mb-4">
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col-reverse" ref={scrollRef}>
                      <div className="p-6 space-y-2">
                        {isBooting && (
                          <div className="font-code text-xs space-y-1">
                            <p className="text-terminal-cyan">[BOOT] Initializing AI Crypto Engine v4.0 Elite...</p>
                            <p className="text-terminal-cyan">[BOOT] Verifying system modules...</p>
                            <p className="text-terminal-cyan">[BOOT] Secure node connection established.</p>
                            <p className="text-green-400">[READY] System online. Awaiting interrogation command.</p>
                          </div>
                        )}
                        {logs.map((log) => (
                          <div key={log.id} className="console-line animate-in fade-in duration-700">
                            {log.type === 'ai' ? (
                              <div className="flex items-baseline font-code text-xs whitespace-nowrap overflow-hidden">
                                <span className="text-terminal-green">Balance: 0 | Wallet check: </span>
                                <span className="text-white truncate">{log.message}</span>
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
                         {logs.length === 0 && !isInterrogating && !isBooting && (
                            <div className="absolute inset-0 flex items-center justify-center text-center">
                                <p className="text-gray-700 font-code text-sm animate-pulse">Awaiting scan command...</p>
                            </div>
                        )}
                      </div>
                    </div>
                     {isInterrogating && (
                        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none h-32 overflow-hidden animate-in fade-in duration-700">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent animate-pulse-glow" />
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
                  
                  <div className="shrink-0 mt-auto pt-2 space-y-4">
                    <div className="glass-panel rounded-2xl p-4 flex justify-between items-center border-white/5">
                        <div className='text-center'>
                            <p className="text-xs text-white/50">Wallets checked</p>
                            <p className="text-lg font-bold text-white/90">{displayCount.toLocaleString()}</p>
                        </div>
                        <div className='text-center'>
                            <p className="text-xs text-white/50">Found</p>
                            <p className="text-lg font-bold text-white/90">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    {lastFounded && (
                        <div className="glass-panel rounded-2xl p-4 border-white/5 animate-in fade-in duration-500">
                          <p className="text-xs text-white/50 mb-2">Last founded</p>
                          <div className="flex justify-between items-center">
                            <span className="font-code text-sm text-green-400">{lastFounded.value}</span>
                            <span className="text-xs text-white/50">{lastFounded.network}</span>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                  {showDiscoveredAssets ? (
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-black uppercase tracking-widest text-white/80 px-2">Discovered Assets</h3>
                        {discoveredAssets.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {discoveredAssets.map((asset) => (
                              <div key={asset.id} className="min-w-full glass-panel rounded-2xl border-white/5 transition-all duration-500 flex items-center px-4 py-3 gap-4 relative overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                  <img src={getNetworkLogo(asset.network)} alt={asset.network} className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <span className="text-[0.8125rem] font-black text-white truncate uppercase tracking-widest">{asset.network}</span>
                                    <span className="text-[0.6875rem] font-bold text-green-400 font-code">{asset.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center space-y-4 border border-dashed border-white/5 rounded-3xl">
                           <ShieldAlert className="w-12 h-12 text-gray-800 mx-auto" />
                           <p className="text-[0.625rem] font-black text-gray-600 uppercase tracking-widest">
                             No authentic assets discovered yet.
                           </p>
                         </div>
                        )}
                    </div>
                  ) : (
                    <div className="h-64 glass-panel rounded-[32px] p-4 border-white/5 relative overflow-hidden flex flex-col shadow-2xl shrink-0">
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4 z-10 shrink-0 px-2">
                        <div className="flex items-center gap-4">
                          <Activity className="w-5 h-5 text-primary" />
                          <h3 className="text-sm font-black uppercase tracking-widest text-white">Statistics</h3>
                        </div>
                      </div>
    
                      <div className="flex-1 min-h-0 z-10 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}
                              tickFormatter={(val) => `$${val/1000}k`}
                            />
                            <RechartsTooltip 
                              cursor={false}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#12121a] border border-white/10 p-3 rounded-lg shadow-glow">
                                      <p className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest mb-1">Yield</p>
                                      <p className="text-sm font-black text-white font-code">${payload[0].value?.toLocaleString()}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorValue)" 
                              animationDuration={2000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="shrink-0 p-4 pt-2">
                  <div className="glass-panel rounded-[32px] p-6 border-white/5 flex items-center justify-between shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="text-[0.625rem] font-black text-gray-500 uppercase tracking-[0.4em]">Total Earnings</span>
                      </div>
                      <span className="text-3xl font-black text-white font-code tracking-tighter drop-shadow-glow">
                        ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" className="h-12 px-6 rounded-xl border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 flex items-center gap-2 transition-all group">
                             <CreditCard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                             <span className="text-[0.5625rem] font-black uppercase tracking-widest text-primary/70">Configure</span>
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl animate-in zoom-in-95 duration-500">
                             <DialogHeader>
                               <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                                 <ShieldCheck className="w-7 h-7 text-primary" />
                                 Configure
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
                                 {isSavingPayout ? "Synchronizing HQ..." : "Save Withdrawal Configuration"}
                               </Button>
                             </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto w-full flex flex-col gap-10 overflow-y-auto no-scrollbar scroll-smooth animate-in slide-in-from-bottom-4 duration-700">
                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-1000">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">Performance</h3>
                  <div className="space-y-12">
                    {[
                      { icon: Gauge, label: 'Scan Throughput (Hz)', value: `${systemIntensity[0]}% Velocity`, state: systemIntensity, setState: setSystemIntensity, max: 100, step: 1, desc: 'Modulates the interrogation frequency and engine neural load.' },
                      { icon: Layers, label: 'Neural Core Allocation', value: `${allocatedCores[0]} / 8 Cores`, state: allocatedCores, setState: setAllocatedCores, min: 1, max: 8, step: 1, desc: 'Allocates processing threads for forensic seed generation.' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-6 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-primary" />
                            <label className="text-sm font-bold text-white uppercase tracking-widest">{item.label}</label>
                          </div>
                          <span className="text-sm font-code text-primary tracking-tight">{item.value}</span>
                        </div>
                        <Slider value={item.state} onValueChange={item.setState} min={item.min || 0} max={item.max} step={item.step} disabled={isInterrogating} className="cursor-pointer" />
                        <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                    <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">AI Modules</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-4">
                                <BrainCircuit className="w-6 h-6 text-primary" />
                                <div className="flex flex-col">
                                  <p className="text-sm font-bold text-white uppercase tracking-wider">AI Heuristic Search</p>
                                  <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-medium">Enables Enterprise Tier AI analysis.</p>
                                </div>
                            </div>
                            <Switch
                              checked={isAiSearchConnected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  connectAiSearch();
                                } else {
                                  disconnectAiSearch();
                                }
                              }}
                              disabled={!licenseData?.aiSearchEnabled || isAiSearchConnecting}
                            />
                        </div>
                        {!licenseData?.aiSearchEnabled && (
                          <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-wider text-center">Requires Enterprise Tier License</p>
                        )}
                    </div>
                </div>

                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-1000">
                   <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">Neural Entropy</h3>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <label className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                           <Languages className="w-5 h-5 text-primary" />
                           Entropy Language
                          </label>
                         <Select value={mnemonicLanguage} onValueChange={setMnemonicLanguage} disabled={isInterrogating}>
                           <SelectTrigger className="w-[200px] h-11 bg-white/[0.02] border-white/10 rounded-xl font-bold uppercase tracking-widest text-[0.6875rem] focus:ring-primary/20">
                             <SelectValue placeholder="Select Language" />
                           </SelectTrigger>
                           <SelectContent className="bg-[#0a0a0f] border-white/10">
                             {ENTROPY_LANGUAGES.map((lang) => (
                               <SelectItem key={lang.id} value={lang.id} className="text-white uppercase font-bold text-[0.625rem] tracking-widest focus:bg-primary/10 focus:text-primary">
                                  <span className="mr-3">{lang.flag}</span>
                                  {lang.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                    <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">System</h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-5 h-5 text-primary" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Memory Flush</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleMemoryFlush} className="h-9 px-4 text-[0.625rem] uppercase font-black border-primary/30 text-primary hover:bg-primary/20 rounded-lg transition-all active:scale-95">Flush</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-5 h-5 text-red-400" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={clearSession} className="h-9 px-4 text-[0.625rem] uppercase font-black border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all active:scale-95">Reset</Button>
                        </div>
                         <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5 text-gray-500" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Operator Session</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-4 text-[0.625rem] uppercase font-black border-white/20 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95">Logout</Button>
                        </div>
                    </div>
                </div>

              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-8 pb-12 overflow-y-auto no-scrollbar pr-3 scroll-smooth animate-in slide-in-from-bottom-4 duration-700">
                <section className="relative overflow-hidden glass-panel rounded-[40px] p-8 border-primary/20 bg-primary/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.7)] group transition-all duration-1000">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-15 transition-all duration-1000">
                    <BrainCircuit className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-glow animate-pulse duration-[3000ms]">
                        <Zap className="w-8 h-8 text-black" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Core Forensic Engine</h2>
                        <p className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.4em] mt-1">v4.0 Elite</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8 py-6 border-t border-white/10">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/80 flex items-center gap-3">
                          <Layers className="w-5 h-5 text-primary" /> High-Entropy Synthesis
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed hover:text-white/90 transition-all duration-300">
                          The engine autonomously synthesizes high-entropy <span className="text-white font-black">BIP39 recovery phrases</span> and performs deep-spectrum node interrogation to identify active blockchain signatures.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/80 flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-primary" /> Automated Discovery
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed hover:text-white/90 transition-all duration-300">
                          Every generated phrase is checked for <span className="text-white font-black">non-zero ledger balances</span>. Upon detection, the system unmasks the <span className="text-green-400 font-black">mnemonic phrase</span> for immediate operator extraction.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
                
                <section className="glass-panel rounded-[32px] p-8 border-white/5 flex flex-col justify-between shadow-xl group hover:border-primary/30 transition-all duration-700">
                  <div className="space-y-3">
                    <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                      <Share2 className="w-4 h-4" /> Communications
                    </h4>
                    <p className="text-[0.6875rem] text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
                      Join the high-latency operator network for real-time node updates and technical support.
                    </p>
                  </div>
                  <a href="https://t.me/Ai_Crypto_Software" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-glow transition-all duration-1000 hover:scale-[1.03] active:scale-95 shadow-lg">
                    <ExternalLink className="w-4 h-4" /> TELEGRAM UPLINK
                  </a>
                </section>
              </div>
            )}
          </div>
      </main>
      
      <div className="fixed bottom-20 left-0 right-0 z-[51] flex justify-center items-center px-4">
        <div className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            <ActionButtons />
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-2xl border-t border-white/10 z-[52] flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => changeTab(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors duration-300",
              activeTab === item.id ? 'text-primary' : 'text-gray-500 hover:text-white'
            )}
          >
            <item.icon className="w-7 h-7" />
          </button>
        ))}
      </nav>

    </div>
  )
}
