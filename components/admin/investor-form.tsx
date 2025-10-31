"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createInvestor, updateInvestor } from "@/app/actions/manage-investor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Investor {
  id: string
  investor_name: string
  email: string
  phone: string | null
  address: string | null
}

export function InvestorForm({ investor }: { investor?: Investor }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    investor_name: investor?.investor_name || "",
    email: investor?.email || "",
    phone: investor?.phone || "",
    address: investor?.address || "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (investor) {
        // Update existing investor
        const result = await updateInvestor({
          id: investor.id,
          investor_name: formData.investor_name,
          phone: formData.phone,
          address: formData.address,
          password: formData.password || undefined,
        })

        if (!result.success) {
          throw new Error(result.error)
        }
      } else {
        // Create new investor
        const result = await createInvestor({
          investor_name: formData.investor_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        })

        if (!result.success) {
          throw new Error(result.error)
        }
      }

      router.push("/admin/investors")
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error saving investor:", error)
      setError(error instanceof Error ? error.message : "সেভ করতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="investor_name">নাম *</Label>
              <Input
                id="investor_name"
                required
                value={formData.investor_name}
                onChange={(e) => setFormData({ ...formData, investor_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল *</Label>
              <Input
                id="email"
                type="email"
                required
                disabled={!!investor}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">ফোন</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড {!investor && "*"}</Label>
              <Input
                id="password"
                type="password"
                required={!investor}
                placeholder={investor ? "পরিবর্তন করতে চাইলে লিখুন" : ""}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">ঠিকানা</Label>
            <Textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "সেভ হচ্ছে..." : investor ? "আপডেট করুন" : "তৈরি করুন"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              বাতিল করুন
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
