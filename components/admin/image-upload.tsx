"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  bucket?: string
}

export function ImageUpload({ value, onChange, label = "ছবি", bucket = "project-images" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("শুধুমাত্র ছবি ফাইল আপলোড করুন")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ছবির সাইজ ৫ MB এর কম হতে হবে")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const supabase = createBrowserClient()

      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      console.log("[v0] Uploading file to Supabase Storage:", filePath)

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("[v0] Upload error:", error)
        throw error
      }

      console.log("[v0] Upload successful:", data)

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      console.log("[v0] Public URL:", publicUrl)

      onChange(publicUrl)
      setUploadProgress(100)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("ছবি আপলোড করতে সমস্যা হয়েছে")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image src={value || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {!showUrlInput ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm">আপলোড হচ্ছে...</span>
                  </div>
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => setShowUrlInput(true)}>
                URL যোগ করুন
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button type="button" onClick={handleUrlSubmit}>
                যোগ করুন
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowUrlInput(false)}>
                বাতিল
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">পিসি থেকে ছবি আপলোড করুন (সর্বোচ্চ ৫ MB) অথবা URL যোগ করুন</p>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
