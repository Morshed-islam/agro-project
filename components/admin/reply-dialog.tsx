"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Reply } from "lucide-react"
import { sendReplyEmail } from "@/app/actions/reply-contact"
import { useRouter } from "next/navigation"

interface ReplyDialogProps {
  contact: {
    id: string
    name: string
    email: string
    subject: string
  }
}

export function ReplyDialog({ contact }: ReplyDialogProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      alert("অনুগ্রহ করে একটি বার্তা লিখুন")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await sendReplyEmail({
        contactId: contact.id,
        recipientEmail: contact.email,
        recipientName: contact.name,
        subject: contact.subject,
        message: message,
      })

      if (result.success) {
        setOpen(false)
        setMessage("")
        router.refresh()
        alert("উত্তর সফলভাবে পাঠানো হয়েছে!")
      } else {
        alert(`ত্রুটি: ${result.error}`)
      }
    } catch (error) {
      console.error("[v0] Reply submission error:", error)
      alert("উত্তর পাঠাতে ব্যর্থ হয়েছে")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Reply className="mr-2 h-4 w-4" />
          উত্তর দিন
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>উত্তর পাঠান</DialogTitle>
            <DialogDescription>
              {contact.name} ({contact.email}) কে উত্তর পাঠান
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">বিষয়</Label>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm">Re: {contact.subject}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">বার্তা *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার উত্তর লিখুন..."
                className="min-h-[200px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "পাঠানো হচ্ছে..." : "উত্তর পাঠান"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
