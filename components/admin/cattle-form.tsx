"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Plus, X } from "lucide-react"

type CattleData = {
  id?: string
  cattle_number?: number
  name: string
  breed: string
  weight: number
  age: number
  price: number
  description: string
  location: string
  status: string
  images?: string[]
  videos?: string[]
}

export function CattleForm({ cattle }: { cattle?: CattleData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CattleData>({
    name: cattle?.name || "",
    breed: cattle?.breed || "",
    weight: cattle?.weight || 0,
    age: cattle?.age || 0,
    price: cattle?.price || 0,
    description: cattle?.description || "",
    location: cattle?.location || "",
    status: cattle?.status || "available",
    images: cattle?.images || [""],
    videos: cattle?.videos || [""],
  })

  const addImageField = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ""] })
  }

  const removeImageField = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] })
  }

  const updateImageField = (index: number, value: string) => {
    const newImages = [...(formData.images || [])]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const addVideoField = () => {
    setFormData({ ...formData, videos: [...(formData.videos || []), ""] })
  }

  const removeVideoField = (index: number) => {
    const newVideos = formData.videos?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, videos: newVideos.length > 0 ? newVideos : [""] })
  }

  const updateVideoField = (index: number, value: string) => {
    const newVideos = [...(formData.videos || [])]
    newVideos[index] = value
    setFormData({ ...formData, videos: newVideos })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createBrowserClient()

    try {
      const dataToSubmit = {
        ...formData,
        images: formData.images?.filter((img) => img.trim() !== "") || [],
        videos: formData.videos?.filter((vid) => vid.trim() !== "") || [],
      }

      if (cattle?.id) {
        const { error } = await supabase.from("cattle").update(dataToSubmit).eq("id", cattle.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("cattle").insert([dataToSubmit])
        if (error) throw error
      }

      router.push("/admin/cattle")
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
            <div className="space-y-2">
              <Label htmlFor="name">গরুর নাম *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">জাত *</Label>
              <Input
                id="breed"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">ওজন (কেজি) *</Label>
              <Input
                id="weight"
                type="number"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">বয়স (বছর) *</Label>
              <Input
                id="age"
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">মূল্য (টাকা) *</Label>
              <Input
                id="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">লোকেশন *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">স্ট্যাটাস *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">উপলব্ধ</SelectItem>
                  <SelectItem value="sold">বিক্রিত</SelectItem>
                  <SelectItem value="reserved">সংরক্ষিত</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>ছবির URL</Label>
                <Button type="button" size="sm" variant="outline" onClick={addImageField}>
                  <Plus className="mr-2 h-4 w-4" />
                  ছবি যোগ করুন
                </Button>
              </div>
              <div className="space-y-2">
                {formData.images?.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={image}
                      onChange={(e) => updateImageField(index, e.target.value)}
                    />
                    {formData.images && formData.images.length > 1 && (
                      <Button type="button" size="icon" variant="outline" onClick={() => removeImageField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>ভিডিও URL (YouTube)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addVideoField}>
                  <Plus className="mr-2 h-4 w-4" />
                  ভিডিও যোগ করুন
                </Button>
              </div>
              <div className="space-y-2">
                {formData.videos?.map((video, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={video}
                      onChange={(e) => updateVideoField(index, e.target.value)}
                    />
                    {formData.videos && formData.videos.length > 1 && (
                      <Button type="button" size="icon" variant="outline" onClick={() => removeVideoField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">বিবরণ *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "সাবমিট হচ্ছে..." : cattle ? "আপডেট করুন" : "যোগ করুন"}
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
