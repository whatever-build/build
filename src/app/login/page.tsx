
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Lock, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  Fingerprint,
  Zap,
  Globe,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check if already logged in
    const auth = localStorage.getItem('ai_crypto_auth_token')
    if (auth === 'authorized_session_v4') {
      router.push('/')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please provide valid operator credentials."
      })
      return
    }

    setIsLoading(true)

    // Simulate neural handshake
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock successful login
    localStorage.setItem('ai_crypto_auth_token', 'authorized_session_v4')
    
    toast({
      title: "Handshake Verified",
      description: "Neural link established. Welcome, Operator."
    })
    
    router.push('/')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050507]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(173,79,230,0.5)] mb-6">
            <Cpu className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Ai Crypto</h1>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <p className="text-[10px] text-primary/70 font-code tracking-[0.3em] uppercase">Secure Entry Protocol v4.0.0</p>
          </div>
        </div>

        <SnakeBorderCard processing={isLoading} className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/5 bg-[#0a0a0f]/80 backdrop-blur-3xl rounded-3xl">
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Operator ID</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="operator@ai-crypto.inc"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 transition-all text-white font-code"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Security Keyphrase</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 transition-all text-white font-code"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-[#AD4FE6] to-[#2937A3] text-white shadow-[0_0_20px_rgba(173,79,230,0.2)] hover:opacity-90 transition-all group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Connect Neural Link
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col items-center gap-1">
                <Fingerprint className="w-5 h-5 text-gray-700" />
                <span className="text-[8px] text-gray-600 uppercase font-bold">Biometric</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-5 h-5 text-gray-700" />
                <span className="text-[8px] text-gray-600 uppercase font-bold">Latency: 14ms</span>
              </div>
            </div>
          </form>
        </SnakeBorderCard>

        <p className="mt-10 text-center text-[9px] text-gray-600 uppercase tracking-widest font-bold">
          Authorized personnel only. All access attempts are logged and monitored via neural mesh.
        </p>
      </div>
    </div>
  )
}
