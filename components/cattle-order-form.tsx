"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Phone, Mail, CheckCircle2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface CattleOrderFormProps {
  cattle: {
    id: number
    name: string
    price: string
  }
}

export function CattleOrderForm({ cattle }: CattleOrderFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryDate: "",
    paymentMethod: "cash",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createBrowserClient()

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            cattle_id: cattle.id,
            customer_name: formData.name,
            phone: formData.phone,
            email: formData.email || null,
            address: formData.address,
            delivery_date: formData.deliveryDate,
            payment_method: formData.paymentMethod,
            message: formData.message || null,
            status: "pending",
          },
        ])
        .select()

      if (error) {
        console.error("[v0] Order submission error:", error)
        toast({
          title: "অর্ডার ব্যর্থ!",
          description: "দয়া করে আবার চেষ্টা করুন।",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Order placed successfully:", data)

      setShowSuccessDialog(true)

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        deliveryDate: "",
        paymentMethod: "cash",
        message: "",
      })
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      toast({
        title: "অর্ডার ব্যর্থ!",
        description: "একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl text-primary">৳{cattle.price}</CardTitle>
            <p className="text-sm text-muted-foreground">সর্বমোট মূল্য</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-name">
                  নাম <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order-name"
                  placeholder="আপনার নাম"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-phone">
                  মোবাইল <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order-phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-email">ইমেইল</Label>
                <Input
                  id="order-email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-address">
                  ঠিকানা <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="order-address"
                  placeholder="ডেলিভারি ঠিকানা"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-delivery-date">
                  ডেলিভারি তারিখ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order-delivery-date"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-payment-method">
                  পেমেন্ট পদ্ধতি <span className="text-destructive">*</span>
                </Label>
                <select
                  id="order-payment-method"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="cash">ক্যাশ</option>
                  <option value="bank_transfer">ব্যাংক ট্রান্সফার</option>
                  <option value="mobile_banking">মোবাইল ব্যাংকিং</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-message">মন্তব্য</Label>
                <Textarea
                  id="order-message"
                  placeholder="অতিরিক্ত তথ্য"
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    অর্ডার হচ্ছে...
                  </>
                ) : (
                  "এখনই অর্ডার করুন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold">যোগাযোগ করুন</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@gorurfarm.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">অর্ডার সফল!</DialogTitle>
            <DialogDescription className="text-center text-base">
              আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-lg bg-muted p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">গরুর নাম:</span>
                <span className="font-medium">{cattle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">মূল্য:</span>
                <span className="font-medium">৳{cattle.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ডেলিভারি তারিখ:</span>
                <span className="font-medium">{formData.deliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">পেমেন্ট পদ্ধতি:</span>
                <span className="font-medium">{formData.paymentMethod}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowSuccessDialog(false)} className="w-full mt-2">
            ঠিক আছে
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
