"use client"

import type React from "react"
import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react"

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("সব ফিল্ড পূরণ করুন")
      return
    }

    if (newPassword.length < 6) {
      setError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না")
      return
    }

    if (currentPassword === newPassword) {
      setError("নতুন পাসওয়ার্ড পুরাতন পাসওয়ার্ড থেকে ভিন্ন হতে হবে")
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()

      // First, verify current password by trying to sign in
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user?.email) {
        setError("ব্যবহারকারী তথ্য পাওয়া যায়নি")
        setLoading(false)
        return
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
      })

      if (signInError) {
        setError("বর্তমান পাসওয়ার্ড ভুল")
        setLoading(false)
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError("পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে")
        setLoading(false)
        return
      }

      setSuccess("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Lock className="h-4 w-4" />
          পাসওয়ার্ড পরিবর্তন করুন
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>পাসওয়ার্ড পরিবর্তন করুন</DialogTitle>
          <DialogDescription>আপনার অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৬ অক্ষর)"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
