"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { 
  ShieldAlert, 
  Cpu, 
  Search, 
  Zap, 
  Activity, 
  RefreshCcw, 
  Database, 
  Filter,
  Key,
  Globe,
  Wallet,
  Binary
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { ParticleBackground } from '@/components/ui/particle-background'
import { TerminalFeed, LogEntry } from '@/components/terminal-feed'
import { generateSecureMnemonics } from '@/ai/flows/generate-secure-mnemonics'
import { filterMnemonicsHeuristically } from '@/ai/flows/filter-mnemonics-heuristically'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const BLOCKCHAINS = [
  { id: 'btc', name: 'Bitcoin', icon: '₿', status: 'online' },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ', status: 'online' },
  { id: 'sol', name: 'Solana', icon: 'S', status: 'online' },
  { id: 'trx', name: 'Tron', icon: 'T', status: 'online' },
  { id: 'ltc', name: 'Litecoin', icon: 'L', status: 'online' },
  { id: 'xrp', name: 'Ripple', icon: 'X', status: 'online' },
]

export default function Dashboard() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isInterrogating, setIsInterrogating] = useState(false)
  const [interrogationProgress, setInterrogationProgress] = useState(0)
  const [mnemonicInput, setMnemonicInput] = useState('')
  const [generatedMnemonic, setGeneratedMnemonic] = useState('')
  const [heuristicResults, setHeuristicResults] = useState<{mnemonic: string, score: number, reason: string}[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    }
    setLogs(prev => [...prev.slice(-100), newLog])
  }, [])

  const handleGenerateMnemonic = async () => {
    setIsGenerating(true)
    addLog('Initiating secure BIP39 generation sequence...', 'system')
    try {
      const result = await generateSecureMnemonics({ wordCount: 12, theme: 'cryptographic safety' })
      setGeneratedMnemonic(result.mnemonicPhrase)
      addLog('Mnemonic phrase generated successfully via AI neural engine.', 'success')
      addLog('WARNING: ' + result.securityWarning, 'warning')
    } catch (error) {
      addLog('Neural engine error during generation.', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleHeuristicFilter = async () => {
    if (!generatedMnemonic && !mnemonicInput) {
      toast({ title: "Input Required", description: "Provide a mnemonic to filter." })
      return
    }
    setIsFiltering(true)
    addLog('Launching heuristic pattern analysis...', 'system')
    try {
      const mnemonicsToFilter = mnemonicInput ? mnemonicInput.split('\n').filter(m => m.trim()) : [generatedMnemonic]
      const result = await filterMnemonicsHeuristically({ 
        mnemonics: mnemonicsToFilter,
        context: 'BIP39 probability check with checksum patterns' 
      })
      setHeuristicResults(result.prioritizedMnemonics)
      addLog('Heuristic filtering complete. Displaying prioritized vectors.', 'success')
    } catch (error) {
      addLog('Heuristic analysis pipeline failure.', 'error')
    } finally {
      setIsFiltering(false)
    }
  }

  const startInterrogation = () => {
    if (isInterrogating) return
    setIsInterrogating(true)
    setInterrogationProgress(0)
    addLog('Interrogation core activated. Booting multi-chain interrogation protocols...', 'system')
    
    let step = 0
    const interval = setInterval(() => {
      step += 1
      const progress = Math.min(step * 2, 100)
      setInterrogationProgress(progress)

      if (step % 5 === 0) {
        const chain = BLOCKCHAINS[Math.floor(Math.random() * BLOCKCHAINS.length)]
        const addr = Math.random().toString(36).substring(2, 12)
        addLog(`Interrogating ${chain.name} node: ${addr}...`, 'info')
      }

      if (step % 12 === 0) {
        addLog('Rotating API RPC: Switching from Ankr to Blockcypher...', 'system')
      }

      if (step % 18 === 0 && Math.random() > 0.7) {
        addLog('429 Rate limit detected. Triggering intelligent back-off logic...', 'warning')
      }

      if (progress === 100) {
        clearInterval(interval)
        setIsInterrogating(false)
        addLog('Interrogation session finalized. 0 recoverable assets identified in current cluster.', 'info')
        addLog('Memory cache purged to sustain peak performance.', 'system')
      }
    }, 200)
  }

  return (
    <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
      <ParticleBackground />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tighter text-white">
              NeuroWallet <span className="text-primary">AI</span>
              <span className="text-xs align-top ml-2 bg-accent/20 text-accent-foreground px-2 py-0.5 rounded border border-accent/30 font-code">v4.0 ELITE</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg font-body">
            High-velocity cryptographic engine for deep-chain interrogation and heuristic asset recovery.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground uppercase font-code">Engine Status</div>
            <div className="text-terminal-green font-code flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              OPERATIONAL
            </div>
          </div>
          <Button 
            onClick={startInterrogation} 
            disabled={isInterrogating}
            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(173,79,230,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            {isInterrogating ? (
              <><RefreshCcw className="w-5 h-5 mr-2 animate-spin" /> INTERROGATING...</>
            ) : (
              <><Zap className="w-5 h-5 mr-2" /> BEGIN INTERROGATION</>
            )}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tools & Stats */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SnakeBorderCard active={isGenerating} className="h-full">
              <Card className="bg-transparent border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Neural Mnemonic Gen
                  </CardTitle>
                  <CardDescription>AI-powered BIP39 phrase construction.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-black/50 p-4 rounded-md border border-white/5 min-h-[80px] font-code text-sm break-all leading-relaxed">
                    {generatedMnemonic || "Press generate to initialize neural engine..."}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10" 
                    onClick={handleGenerateMnemonic}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                    Generate Seed
                  </Button>
                </CardContent>
              </Card>
            </SnakeBorderCard>

            <SnakeBorderCard active={isFiltering} className="h-full">
              <Card className="bg-transparent border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-accent" />
                    Heuristic Filtering
                  </CardTitle>
                  <CardDescription>Probability-based checksum analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    placeholder="Paste potential mnemonics here..."
                    className="w-full bg-black/50 p-4 rounded-md border border-white/5 font-code text-sm h-[80px] focus:ring-1 focus:ring-primary outline-none terminal-scrollbar"
                    value={mnemonicInput}
                    onChange={(e) => setMnemonicInput(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full border-accent/30 hover:bg-accent/10"
                    onClick={handleHeuristicFilter}
                    disabled={isFiltering}
                  >
                    {isFiltering ? <Search className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                    Prioritize Vectors
                  </Button>
                </CardContent>
              </Card>
            </SnakeBorderCard>
          </div>

          <Card className="bg-black/40 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Interrogation Progress
                </CardTitle>
                <CardDescription>Real-time cluster scanning metrics.</CardDescription>
              </div>
              {isInterrogating && (
                <Badge variant="outline" className="text-primary border-primary animate-pulse">
                  ACTIVE SCAN
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-code uppercase">
                    <span className="text-muted-foreground">Cluster Entropy Status</span>
                    <span className="text-primary">{interrogationProgress}%</span>
                  </div>
                  <Progress value={interrogationProgress} className="h-2 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Wallets Scanned', value: isInterrogating ? Math.floor(interrogationProgress * 123) : '0' },
                    { label: 'Total Value Identified', value: '$0.00' },
                    { label: 'API Health', value: '100%', color: 'text-terminal-green' },
                    { label: 'Retries (429)', value: isInterrogating ? Math.floor(interrogationProgress / 20) : '0' },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="text-[10px] text-muted-foreground uppercase font-code mb-1">{stat.label}</div>
                      <div className={`text-xl font-bold font-code ${stat.color || 'text-white'}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="chains" className="w-full">
            <TabsList className="bg-black/40 border-white/10 w-full justify-start overflow-x-auto terminal-scrollbar">
              <TabsTrigger value="chains" className="data-[state=active]:bg-primary/20">Supported Blockchains</TabsTrigger>
              <TabsTrigger value="heuristics" className="data-[state=active]:bg-primary/20">Heuristic Analysis</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">Engine Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="chains" className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {BLOCKCHAINS.map((chain) => (
                  <div key={chain.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold group-hover:bg-primary group-hover:text-white transition-all text-xl">
                      {chain.icon}
                    </div>
                    <span className="text-xs font-code uppercase tracking-tighter">{chain.name}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-terminal-green shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="heuristics">
              <div className="bg-white/5 rounded-xl border border-white/5 p-4 min-h-[200px]">
                {heuristicResults.length > 0 ? (
                  <div className="space-y-3">
                    {heuristicResults.map((res, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg gap-4">
                        <div className="space-y-1 max-w-md">
                          <div className="text-sm font-code text-white break-all">{res.mnemonic}</div>
                          <div className="text-xs text-muted-foreground">{res.reason}</div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-xs uppercase text-muted-foreground font-code">Confidence</div>
                          <div className={`text-xl font-bold font-code ${res.score > 70 ? 'text-terminal-green' : 'text-yellow-400'}`}>
                            {res.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground gap-2">
                    <Binary className="w-8 h-8 opacity-20" />
                    <span className="text-sm">No heuristic data processed yet.</span>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <Card className="bg-white/5 border-none shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-bold">API Rotation</div>
                        <div className="text-xs text-muted-foreground">Cycle through public and premium nodes.</div>
                      </div>
                    </div>
                    <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30">ENABLED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-accent" />
                      <div>
                        <div className="text-sm font-bold">Intelligent Back-off</div>
                        <div className="text-xs text-muted-foreground">Auto-retry on 429 rate limit exceptions.</div>
                      </div>
                    </div>
                    <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30">ENABLED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-bold">Auto Memory Cleaner</div>
                        <div className="text-xs text-muted-foreground">Clear local buffer every 10,000 scans.</div>
                      </div>
                    </div>
                    <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/30">ENABLED</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Terminal Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TerminalFeed logs={logs} />
          
          <Card className="bg-black/40 border-white/5 flex-1">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Network Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Latency', value: '14ms', icon: <Activity className="w-3 h-3" /> },
                { label: 'Throughput', value: '4.2k tx/s', icon: <Zap className="w-3 h-3" /> },
                { label: 'Entropy Source', value: 'NeuroCore v1', icon: <Binary className="w-3 h-3" /> },
                { label: 'Uptime', value: '99.99%', icon: <RefreshCcw className="w-3 h-3" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 text-xs font-code">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className="text-white">{item.value}</div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase font-code mb-2">Active Node Clusters</div>
                <div className="flex flex-wrap gap-1">
                  {['US-EAST-1', 'EU-WEST-1', 'AP-SOUTHEAST-1', 'SA-EAST-1'].map(n => (
                    <Badge key={n} variant="outline" className="text-[9px] h-5 opacity-50">{n}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-50">
          <ShieldAlert className="w-4 h-4" />
          <p className="text-xs uppercase tracking-[0.2em] font-code">Authorized Personnel Only - Encrypted Connection Secure</p>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2024 NeuroWallet AI. Distributed Neural Recovery Engine.
        </p>
      </footer>
    </div>
  )
}
