"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { approveInvestment, rejectInvestment } from "@/app/actions/approve-investment"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InvestmentActionsProps {
  investmentId: string
  status: string
}

export function InvestmentActions({ investmentId, status }: InvestmentActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)
    const result = await approveInvestment(investmentId)
    setIsApproving(false)

    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to approve investment")
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    const result = await rejectInvestment(investmentId)
    setIsRejecting(false)

    if (result.success) {
      router.refresh()
    } else {
      alert("Failed to reject investment")
    }
  }

  if (status === "approved") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-green-600 font-medium">অনুমোদিত</span>
      </div>
    )
  }

  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium">প্রত্যাখ্যাত</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="default" disabled={isApproving} className="h-8 bg-green-600 hover:bg-green-700">
            {isApproving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">অনুমোদন</span>
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>বিনিয়োগ অনুমোদন করুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই বিনিয়োগ অনুমোদন করতে চান? অনুমোদনের পর প্রজেক্টের সংগৃহীত টাকা আপডেট হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>অনুমোদন করুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={isRejecting} className="h-8">
            {isRejecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">প্রত্যাখ্যান</span>
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>বিনিয়োগ প্রত্যাখ্যান করুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই বিনিয়োগ প্রত্যাখ্যান করতে চান? এই বিনিয়োগ প্রজেক্টের সংগৃহীত টাকায় যোগ হবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              প্রত্যাখ্যান করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
