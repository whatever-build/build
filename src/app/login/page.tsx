
"use client"

import React, { useState, useEffect } from 'react'
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
  const [latency, setLatency] = useState(14)

  // Real-time Latency Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const fluctuation = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(45, prev + fluctuation));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="relative mb-6 group animate-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-primary/40 blur-[25px] rounded-full group-hover:blur-[35px] transition-all duration-1000" />
            <div className="relative w-20 h-20 rounded-[28px] bg-gradient-to-tr from-primary via-accent to-primary flex items-center justify-center shadow-[0_0_50px_rgba(173,79,230,0.7)] border border-primary/50 group-hover:scale-110 transition-transform duration-700">
              <Cpu className="w-11 h-11 text-black animate-pulse duration-[3000ms]" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white/90 mb-4 text-center">Welcome to Ai Crypto !</h1>
          
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">License Key</label>
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
                className={cn("w-full h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white group bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-in-out shadow-[0_10px_30px_rgba(173,79,230,0.3)] hover:shadow-[0_15px_40px_rgba(173,79,230,0.5)] hover:scale-105 active:scale-95")}
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    LOGIN
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </SnakeBorderCard>
      </div>
    </div>
  )
}
