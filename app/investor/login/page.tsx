"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogIn } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

export default function InvestorLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createBrowserClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("লগইন ব্যর্থ হয়েছে")
      }

      // Check if user has investor profile
      const { data: profile, error: profileError } = await supabase
        .from("investor_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        throw new Error("বিনিয়োগকারী প্রোফাইল পাওয়া যায়নি")
      }

      toast({
        title: "সফল!",
        description: "আপনি সফলভাবে লগইন করেছেন",
      })

      // Redirect to investor profile
      window.location.href = "/investor/profile"
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      toast({
        title: "লগইন ব্যর্থ",
        description: error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">বিনিয়োগকারী লগইন</CardTitle>
          <CardDescription className="text-center">আপনার বিনিয়োগকারী অ্যাকাউন্টে লগইন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  লগইন করুন
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/investor/signup" className="font-medium text-primary hover:underline">
                নতুন অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
            <p className="font-semibold mb-2">বিনিয়োগকারী লগইন</p>
            <p className="text-muted-foreground">
              এই লগইন শুধুমাত্র বিনিয়োগকারীদের জন্য। আপনি যদি এডমিন হন, তাহলে{" "}
              <Link href="/admin/login" className="font-medium text-primary hover:underline">
                এডমিন লগইন
              </Link>{" "}
              ব্যবহার করুন।
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
