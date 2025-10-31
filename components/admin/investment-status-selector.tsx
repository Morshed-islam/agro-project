"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Loader2 } from "lucide-react"
import { updateInvestmentStatus } from "@/app/actions/update-investment-status"
import { useRouter } from "next/navigation"

interface InvestmentStatusSelectorProps {
  investmentId: string
  currentStatus: string
}

const statusConfig = {
  pending: { label: "পেন্ডিং", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  approved: { label: "অনুমোদিত", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  unpaid: { label: "আনপেইড", color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  paid: { label: "পেইড", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  rejected: { label: "প্রত্যাখ্যান", color: "bg-red-100 text-red-800 hover:bg-red-200" },
}

export function InvestmentStatusSelector({ investmentId, currentStatus }: InvestmentStatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    const result = await updateInvestmentStatus(investmentId, newStatus)
    setIsUpdating(false)

    if (result.success) {
      router.refresh()
    } else {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে")
    }
  }

  const currentConfig = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isUpdating} className="h-8 gap-1">
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Badge className={currentConfig.color}>{currentConfig.label}</Badge>
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(statusConfig).map(([status, config]) => (
          <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
            <Badge className={config.color}>{config.label}</Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
