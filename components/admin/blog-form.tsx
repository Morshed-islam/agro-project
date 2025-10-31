"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import RichTextEditor from "./rich-text-editor"
import ImageUpload from "./image-upload"

interface BlogFormProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image: string
    author: string
    published: boolean
  }
}

export default function BlogForm({ post }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    featured_image: post?.featured_image || "",
    author: post?.author || "Admin",
    published: post?.published || false,
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post ? prev.slug : generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    const postData = {
      ...formData,
      published_at: formData.published ? new Date().toISOString() : null,
    }

    let error

    if (post) {
      // Update existing post
      const result = await supabase.from("blog_posts").update(postData).eq("id", post.id)
      error = result.error
    } else {
      // Create new post
      const result = await supabase.from("blog_posts").insert([postData])
      error = result.error
    }

    if (error) {
      console.error("[v0] Error saving blog post:", error)
      alert("পোস্ট সেভ করতে সমস্যা হয়েছে")
    } else {
      router.push("/admin/blog")
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">শিরোনাম *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="পোস্টের শিরোনাম লিখুন"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">স্লাগ (URL) *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="post-url-slug"
          required
        />
        <p className="text-sm text-muted-foreground">URL: /blog/{formData.slug || "post-slug"}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="পোস্টের সংক্ষিপ্ত বিবরণ (তালিকায় দেখানো হবে)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">বিস্তারিত বিবরণ *</Label>
        <RichTextEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
      </div>

      <div className="space-y-2">
        <Label>ফিচার্ড ইমেজ</Label>
        <ImageUpload
          value={formData.featured_image}
          onChange={(url) => setFormData({ ...formData, featured_image: url })}
          bucket="project-images"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">লেখক</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="লেখকের নাম"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        />
        <Label htmlFor="published" className="cursor-pointer">
          এখনই প্রকাশ করুন
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "সেভ হচ্ছে..." : post ? "আপডেট করুন" : "পোস্ট করুন"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          বাতিল
        </Button>
      </div>
    </form>
  )
}
