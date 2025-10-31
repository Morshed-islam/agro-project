"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCircle } from "lucide-react"

interface InvestorLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function InvestorLoginDialog({ open, onOpenChange }: InvestorLoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createBrowserClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Check if user has investor profile
      const { data: profile, error: profileError } = await supabase
        .from("investor_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        throw new Error("এই অ্যাকাউন্টটি বিনিয়োগকারী অ্যাকাউন্ট নয়")
      }

      onOpenChange(false)
      router.push("/investor/profile")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "লগইন ব্যর্থ হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <UserCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl">বিনিয়োগকারী লগইন</DialogTitle>
          <DialogDescription className="text-center">আপনার বিনিয়োগ প্রোফাইল দেখতে লগইন করুন</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investor-email">ইমেইল</Label>
            <Input
              id="investor-email"
              type="email"
              placeholder="investor@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investor-password">পাসওয়ার্ড</Label>
            <Input
              id="investor-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              নতুন বিনিয়োগকারী?{" "}
              <Link
                href="/investor/signup"
                className="font-medium text-green-600 hover:underline"
                onClick={() => onOpenChange(false)}
              >
                নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
