import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { InvestorsTable } from "@/components/admin/investors-table"

export default async function AdminInvestorsPage() {
  const supabase = await createClient()

  const { data: investors, error } = await supabase
    .from("investor_profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching investors:", error)
  }

  const totalInvestors = investors?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">বিনিয়োগকারী ম্যানেজমেন্ট</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">সব বিনিয়োগকারীদের তালিকা এবং ম্যানেজমেন্ট</p>
        </div>
        <Button asChild>
          <Link href="/admin/investors/new">
            <Plus className="mr-2 h-4 w-4" />
            নতুন বিনিয়োগকারী যোগ করুন
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>মোট বিনিয়োগকারী</CardTitle>
            <CardDescription>সব রেজিস্টার্ড বিনিয়োগকারী</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalInvestors}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>বিনিয়োগকারীদের তালিকা</CardTitle>
          <CardDescription>সব বিনিয়োগকারীদের বিস্তারিত তথ্য</CardDescription>
        </CardHeader>
        <CardContent>
          <InvestorsTable investors={investors || []} />
        </CardContent>
      </Card>
    </div>
  )
}
