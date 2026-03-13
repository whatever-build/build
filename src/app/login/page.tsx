"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  Fingerprint,
  Zap,
  User,
  Loader2,
  Key,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { authenticateUser } from './actions'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  licenseKey: z.string().length(12, { message: "License key must be exactly 12 characters." }).regex(/^[a-zA-Z0-9]+$/, { message: "Alphanumeric characters only." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [authLogs, setAuthLogs] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      licenseKey: '',
    }
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setAuthLogs(["Authenticating user..."])
    
    // Simulate forensic handshake sequence
    await new Promise(r => setTimeout(r, 600))
    setAuthLogs(prev => [...prev, "Verifying license key..."])
    
    await new Promise(r => setTimeout(r, 600))
    setAuthLogs(prev => [...prev, "Establishing secure session..."])

    try {
      const result = await authenticateUser(values)

      if (result.success) {
        setAuthLogs(prev => [...prev, "Access granted."])
        toast({
          title: "Handshake Verified",
          description: `Neural link established for ${values.username}. Welcome, Operator.`
        })
        // Delay redirect slightly for visual feedback
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 800)
      } else {
        setAuthLogs([])
        setIsLoading(false)
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: result.message
        })
      }
    } catch (error) {
      setAuthLogs([])
      setIsLoading(false)
      toast({
        variant: "destructive",
        title: "Connection Timed Out",
        description: "The neural uplink could not be reached."
      })
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050507]">
      <div className="login-background z-0" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(173,79,230,0.5)] mb-6">
            <Cpu className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-1">Ai Crypto</h1>
          
          <div className="flex items-center gap-4 text-[10px] text-[#8df7b1] font-code uppercase tracking-wider mt-2 opacity-80">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Security: Verified</span>
            <span className="w-1 h-1 rounded-full bg-[#8df7b1]/30" />
            <span>Encryption: AES-256</span>
            <span className="w-1 h-1 rounded-full bg-[#8df7b1]/30" />
            <span>Latency: 14ms</span>
          </div>
        </div>

        <SnakeBorderCard processing={isLoading} className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/5 bg-[#0a0a0f]/80 backdrop-blur-3xl rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Operator Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    {...register('username')}
                    type="text" 
                    placeholder="Enter your username"
                    className="bg-[#0b0b12] border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white font-code"
                  />
                </div>
                {errors.username && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">License Key (12 Characters)</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    {...register('licenseKey')}
                    type="text" 
                    placeholder="enter your license"
                    className="bg-[#0b0b12] border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-white font-code uppercase"
                  />
                </div>
                {errors.licenseKey && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.licenseKey.message}</p>}
              </div>
            </div>

            {isLoading && authLogs.length > 0 && (
              <div className="space-y-1.5 p-4 rounded-xl bg-black/40 border border-white/5 font-code text-[10px] animate-in fade-in slide-in-from-top-2 duration-300">
                {authLogs.map((log, i) => (
                  <div key={i} className={cn("flex items-center gap-2", i === authLogs.length - 1 ? "text-primary" : "text-gray-500")}>
                    <span className="opacity-50">&gt;</span>
                    {log}
                    {i === authLogs.length - 1 && log !== "Access granted." && <Loader2 className="w-2.5 h-2.5 animate-spin ml-auto" />}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white login-button-glow group"
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    START GATEWAY
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
                <ShieldAlert className="w-5 h-5 text-gray-700" />
                <span className="text-[8px] text-gray-600 uppercase font-bold">Encrypted</span>
              </div>
            </div>
          </form>
        </SnakeBorderCard>

        <p className="mt-10 text-center text-[10px] text-[#6b6b75] uppercase tracking-[0.2em] font-bold leading-relaxed">
          AUTHORIZED ACCESS ONLY<br />
          ALL LOGIN ATTEMPTS ARE MONITORED AND LOGGED
        </p>
      </div>
    </div>
  )
}