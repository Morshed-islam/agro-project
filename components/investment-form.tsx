"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, UserPlus, LogIn, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { submitInvestment } from "@/app/actions/submit-investment"

export function InvestmentForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [investorProfile, setInvestorProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    amount: "",
    investmentType: "6-months",
    investmentDeadline: "",
    message: "",
    agreeTerms: false,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase.from("investor_profiles").select("*").eq("id", user.id).single()

          if (profile) {
            setIsLoggedIn(true)
            setInvestorProfile(profile)
            // Auto-fill form with investor data
            setFormData((prev) => ({
              ...prev,
              name: profile.investor_name || "",
              email: profile.email || "",
              phone: profile.phone || "",
            }))
          }
        }
      } catch (error) {
        console.error("[v0] Error checking auth:", error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("projects")
          .select("id, project_number, title, status")
          .eq("status", "active")
          .order("project_number", { ascending: true })

        if (error) throw error

        setProjects(data || [])
      } catch (error) {
        console.error("[v0] Error fetching projects:", error)
        toast({
          title: "ত্রুটি",
          description: "প্রজেক্ট লোড করতে সমস্যা হয়েছে",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      toast({
        title: "শর্তাবলী গ্রহণ করুন",
        description: "অনুগ্রহ করে শর্তাবলী পড়ুন এবং সম্মত হন",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(formData.amount) < 50000) {
      toast({
        title: "অবৈধ পরিমাণ",
        description: "ন্যূনতম বিনিয়োগ ৳৫০,০০০ হতে হবে",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitInvestment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectNumber: formData.project,
        amount: Number.parseFloat(formData.amount),
        investmentType: formData.investmentType,
        investmentDeadline: formData.investmentDeadline,
        message: formData.message || undefined,
        investorId: investorProfile?.id, // Pass investor ID
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      console.log("[v0] Investment submitted successfully:", result.data)

      setSubmittedData({
        name: formData.name,
        amount: formData.amount,
        project: result.data.projectTitle,
        investmentDeadline: formData.investmentDeadline,
      })

      setShowSuccessDialog(true)

      setFormData({
        ...formData,
        project: "",
        amount: "",
        investmentDeadline: "",
        message: "",
        agreeTerms: false,
      })
    } catch (error: any) {
      console.error("[v0] Investment submission error:", error)
      toast({
        title: "ত্রুটি ঘটেছে",
        description: error.message || "বিনিয়োগ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-center text-2xl">বিনিয়োগ করতে লগইন করুন</CardTitle>
          <CardDescription className="text-center">
            বিনিয়োগ করার জন্য আপনাকে প্রথমে একটি বিনিয়োগকারী অ্যাকাউন্ট তৈরি করতে হবে অথবা লগইন করতে হবে
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button size="lg" asChild className="w-full">
              <Link href="/investor/signup">
                <UserPlus className="mr-2 h-5 w-5" />
                নতুন অ্যাকাউন্ট তৈরি করুন
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full bg-transparent">
              <Link href="/investor/login">
                <LogIn className="mr-2 h-5 w-5" />
                লগইন করুন
              </Link>
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">কেন অ্যাকাউন্ট প্রয়োজন?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>আপনার সব বিনিয়োগ এক জায়গায় দেখুন</li>
              <li>বিনিয়োগের স্ট্যাটাস ট্র্যাক করুন</li>
              <li>দ্রুত এবং সহজে বিনিয়োগ করুন</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">বিনিয়োগ ফর্ম</CardTitle>
          <CardDescription>নিচের ফর্মটি পূরণ করুন এবং আমরা আপনার সাথে যোগাযোগ করব</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ব্যক্তিগত তথ্য</h3>

              <div className="space-y-2">
                <Label htmlFor="name">
                  পূর্ণ নাম <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="আপনার নাম লিখুন"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    ইমেইল <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    মোবাইল নম্বর <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">বিনিয়োগের বিবরণ</h3>

              <div className="space-y-2">
                <Label htmlFor="project">
                  প্রজেক্ট নির্বাচন করুন <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.project}
                  onValueChange={(value) => setFormData({ ...formData, project: value })}
                  disabled={isLoadingProjects}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder={isLoadingProjects ? "লোড হচ্ছে..." : "একটি প্রজেক্ট নির্বাচন করুন"} />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.project_number.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  বিনিয়োগের পরিমাণ (টাকা) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="৫০,০০০"
                  min="50000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">ন্যূনতম বিনিয়োগ: ৳৫০,০০০</p>
              </div>

              <div className="space-y-2">
                <Label>বিনিয়োগের ধরন</Label>
                <div className="flex items-center h-10 px-3 py-2 rounded-md border border-input bg-muted">
                  <span className="text-sm font-medium">৬ মাস</span>
                </div>
                <p className="text-xs text-muted-foreground">বিনিয়োগের মেয়াদ ৬ মাস নির্ধারিত</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentDeadline">
                  কত তারিখের মধ্যে ইনভেস্ট করতে চাচ্ছেন? <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="investmentDeadline"
                  type="date"
                  value={formData.investmentDeadline}
                  onChange={(e) => setFormData({ ...formData, investmentDeadline: e.target.value })}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">আপনার পছন্দের বিনিয়োগের তারিখ নির্বাচন করুন</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">অতিরিক্ত মন্তব্য (ঐচ্ছিক)</Label>
                <Textarea
                  id="message"
                  placeholder="আপনার কোন প্রশ্ন বা মন্তব্য থাকলে লিখুন"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                  আমি শর্তাবলী এবং গোপনীয়তা নীতি পড়েছি এবং সম্মত হয়েছি
                </Label>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  "বিনিয়োগ ফর্ম জমা দিন"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">বিনিয়োগ সফল হয়েছে!</DialogTitle>
            <DialogDescription className="text-center space-y-2 pt-4">
              <div className="text-base">
                <span className="font-semibold">{submittedData?.name}</span>, আপনার বিনিয়োগ সফলভাবে জমা হয়েছে।
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">প্রজেক্ট:</span>
                  <span className="font-medium">{submittedData?.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">বিনিয়োগের পরিমাণ:</span>
                  <span className="font-semibold text-primary">
                    ৳{submittedData?.amount ? Number.parseFloat(submittedData.amount).toLocaleString("bn-BD") : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">বিনিয়োগের তারিখ:</span>
                  <span className="font-medium">{submittedData?.investmentDeadline}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব এবং পরবর্তী ধাপ সম্পর্কে জানাব।
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full sm:w-auto">
              ধন্যবাদ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
