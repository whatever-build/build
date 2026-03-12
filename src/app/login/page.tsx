
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
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnakeBorderCard } from '@/components/ui/snake-border-card'
import { useToast } from '@/hooks/use-toast'
import { authenticateUser } from './actions'

const loginSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  licenseKey: z.string().length(12, { message: "License key must be exactly 12 characters." }).regex(/^[a-zA-Z0-9]+$/, { message: "Alphanumeric characters only." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      licenseKey: '',
    }
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    try {
      const result = await authenticateUser(values)

      if (result.success) {
        toast({
          title: "Handshake Verified",
          description: `Neural link established for ${values.username}. Welcome, Operator.`
        })
        router.push('/dashboard')
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: result.message
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Timed Out",
        description: "The neural uplink could not be reached."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050507]">
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    {...register('username')}
                    type="text" 
                    placeholder="Enter your username"
                    className="bg-black/40 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 transition-all text-white font-code"
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
                    placeholder="12-CHARACTER-KEY"
                    className="bg-black/40 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 transition-all text-white font-code uppercase"
                  />
                </div>
                {errors.licenseKey && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.licenseKey.message}</p>}
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
