"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type InvestmentData = {
  id?: string
  project_id: string
  investor_name: string
  email: string
  phone: string
  amount: number
  investment_type: string
  investment_deadline: string
  message?: string
  status?: string
}

type Project = {
  id: string
  project_number: number
  title: string
}

export function InvestmentForm({ investment }: { investment?: InvestmentData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [formData, setFormData] = useState<InvestmentData>({
    project_id: investment?.project_id || "",
    investor_name: investment?.investor_name || "",
    email: investment?.email || "",
    phone: investment?.phone || "",
    amount: investment?.amount || 50000,
    investment_type: investment?.investment_type || "6-months",
    investment_deadline: investment?.investment_deadline || "",
    message: investment?.message || "",
    status: investment?.status || "pending",
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("projects")
        .select("id, project_number, title")
        .eq("status", "active")
        .order("project_number", { ascending: false })

      if (data) setProjects(data)
    }
    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createBrowserClient()

    try {
      if (investment?.id) {
        // Update existing investment
        const { error } = await supabase.from("investments").update(formData).eq("id", investment.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("investments").insert([{ ...formData, status: "approved" }])
        if (error) throw error
      }

      router.push("/admin/investments")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      alert("সাবমিট করতে সমস্যা হয়েছে")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project_id">প্রজেক্ট নির্বাচন করুন *</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData({ ...formData, project_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="প্রজেক্ট নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      #{project.project_number} - {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investor_name">বিনিয়োগকারীর নাম *</Label>
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নম্বর *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">বিনিয়োগের পরিমাণ (টাকা) *</Label>
              <Input
                id="amount"
                type="number"
                min="50000"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">ন্যূনতম: ৳৫০,০০০</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_type">বিনিয়োগের ধরন *</Label>
              <Select
                value={formData.investment_type}
                onValueChange={(value) => setFormData({ ...formData, investment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-months">৬ মাস</SelectItem>
                  <SelectItem value="12-months">১২ মাস</SelectItem>
                  <SelectItem value="one-time">একবারে বিনিয়োগ</SelectItem>
                  <SelectItem value="monthly">মাসিক</SelectItem>
                  <SelectItem value="quarterly">ত্রৈমাসিক</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_deadline">বিনিয়োগের তারিখ *</Label>
              <Input
                id="investment_deadline"
                type="date"
                required
                value={formData.investment_deadline}
                onChange={(e) => setFormData({ ...formData, investment_deadline: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">কত তারিখের মধ্যে ইনভেস্ট করতে চাচ্ছেন?</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">বার্তা (ঐচ্ছিক)</Label>
              <Textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="কোনো বিশেষ বার্তা বা মন্তব্য..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "সাবমিট হচ্ছে..." : investment ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              বাতিল
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
