"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"

type ProjectData = {
  id?: string
  project_number?: number
  title: string
  description: string
  goal_amount: number
  raised_amount: number
  investor_count: number
  status: string
  deadline: string
  image_url?: string
}

export function ProjectForm({ project }: { project?: ProjectData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProjectData>({
    title: project?.title || "",
    description: project?.description || "",
    goal_amount: project?.goal_amount || 0,
    raised_amount: project?.raised_amount || 0,
    investor_count: project?.investor_count || 0,
    status: project?.status || "active",
    deadline: project?.deadline || "",
    image_url: project?.image_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createBrowserClient()

    try {
      if (project?.id) {
        // Update existing project
        const { error } = await supabase.from("projects").update(formData).eq("id", project.id)
        if (error) throw error
      } else {
        // Create new project
        const { error } = await supabase.from("projects").insert([formData])
        if (error) throw error
      }

      router.push("/admin/projects")
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
              <Label htmlFor="title">প্রজেক্টের শিরোনাম *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal_amount">লক্ষ্য পরিমাণ (টাকা) *</Label>
              <Input
                id="goal_amount"
                type="number"
                required
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raised_amount">সংগৃহীত পরিমাণ (টাকা) *</Label>
              <Input
                id="raised_amount"
                type="number"
                required
                value={formData.raised_amount}
                onChange={(e) => setFormData({ ...formData, raised_amount: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investor_count">বিনিয়োগকারীর সংখ্যা *</Label>
              <Input
                id="investor_count"
                type="number"
                required
                value={formData.investor_count}
                onChange={(e) => setFormData({ ...formData, investor_count: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">স্ট্যাটাস *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">চলমান</SelectItem>
                  <SelectItem value="completed">সম্পন্ন</SelectItem>
                  <SelectItem value="closed">বন্ধ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">ডেডলাইন *</Label>
              <Input
                id="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="প্রজেক্টের ছবি"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">বিবরণ *</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="প্রজেক্টের বিস্তারিত বিবরণ লিখুন..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "সাবমিট হচ্ছে..." : project ? "আপডেট করুন" : "যোগ করুন"}
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
