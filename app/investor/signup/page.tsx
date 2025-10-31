"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, ArrowLeft } from "lucide-react"
import { signupInvestor } from "@/app/actions/investor-signup"

export default function InvestorSignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      investor_name: (formData.get("investor_name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      address: (formData.get("address") as string).trim(),
      password: formData.get("password") as string,
    }

    const confirmPassword = formData.get("confirm_password") as string

    if (data.password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না")
      setIsLoading(false)
      return
    }

    const result = await signupInvestor(data)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/investor/profile")
      }, 2000)
    } else {
      setError(result.error || "সাইনআপ ব্যর্থ হয়েছে")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl">বিনিয়োগকারী হিসেবে নিবন্ধন করুন</CardTitle>
              <CardDescription>আপনার তথ্য দিয়ে একটি অ্যাকাউন্ট তৈরি করুন</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="rounded-lg bg-green-50 p-6 text-center">
                  <p className="text-lg font-semibold text-green-800">সাইনআপ সফল হয়েছে!</p>
                  <p className="mt-2 text-sm text-green-600">আপনার প্রোফাইলে রিডাইরেক্ট করা হচ্ছে...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="investor_name">
                      পূর্ণ নাম <span className="text-red-500">*</span>
                    </Label>
                    <Input id="investor_name" name="investor_name" required disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      ইমেইল <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" name="email" type="email" required disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      ফোন নম্বর <span className="text-red-500">*</span>
                    </Label>
                    <Input id="phone" name="phone" type="tel" required disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">ঠিকানা</Label>
                    <Textarea id="address" name="address" rows={3} disabled={isLoading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      পাসওয়ার্ড <span className="text-red-500">*</span>
                    </Label>
                    <Input id="password" name="password" type="password" required minLength={6} disabled={isLoading} />
                    <p className="text-xs text-muted-foreground">কমপক্ষে ৬ অক্ষর হতে হবে</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">
                      পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>

                  {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                    <Link href="/investor/login" className="font-medium text-green-600 hover:underline">
                      লগইন করুন
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
