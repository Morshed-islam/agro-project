import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { DeleteInvestmentButton } from "@/components/admin/delete-investment-button"
import { InvestmentStatusSelector } from "@/components/admin/investment-status-selector"

export default async function AdminInvestmentsPage() {
  const supabase = await createClient()

  const { data: investments, error } = await supabase
    .from("investments")
    .select("*, projects(title, project_number)")
    .order("created_at", { ascending: false })

  console.log("[v0] Investments query result:", { investments, error })

  if (error) {
    console.error("[v0] Error fetching investments:", error)
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h2 className="text-lg font-semibold mb-2">ডেটা লোড করতে সমস্যা হয়েছে</h2>
          <p className="text-sm mb-4">{error.message}</p>
          <p className="text-sm">
            যদি "status" column সম্পর্কিত error হয়, তাহলে অনুগ্রহ করে{" "}
            <code className="bg-red-100 px-2 py-1 rounded">scripts/017_update_investment_status.sql</code> স্ক্রিপ্ট রান
            করুন।
          </p>
        </div>
      </div>
    )
  }

  const pendingInvestments = investments?.filter((inv) => inv.status === "pending") || []
  const approvedInvestments = investments?.filter((inv) => inv.status === "approved") || []
  const unpaidInvestments = investments?.filter((inv) => inv.status === "unpaid") || []
  const paidInvestments = investments?.filter((inv) => inv.status === "paid") || []
  const rejectedInvestments = investments?.filter((inv) => inv.status === "rejected") || []
  const totalAmount = [...approvedInvestments, ...paidInvestments].reduce((sum, inv) => sum + Number(inv.amount), 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">বিনিয়োগ ম্যানেজমেন্ট</h1>
          <p className="mt-2 text-gray-600">সব বিনিয়োগের তালিকা দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Link href="/admin/investments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            নতুন বিনিয়োগ যোগ করুন
          </Button>
        </Link>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">মোট বিনিয়োগ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{investments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">পেন্ডিং</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingInvestments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">অনুমোদিত</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedInvestments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">আনপেইড</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{unpaidInvestments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">পেইড</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{paidInvestments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">প্রত্যাখ্যান</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedInvestments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সব বিনিয়োগ ({investments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>প্রজেক্ট</TableHead>
                  <TableHead>বিনিয়োগকারী</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>ধরন</TableHead>
                  <TableHead>প্রত্যাশিত তারিখ</TableHead>
                  <TableHead>জমার তারিখ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!investments || investments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-gray-500">
                      কোনো বিনিয়োগ পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  investments.map((investment: any) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {investment.projects?.title || "N/A"} (#{investment.projects?.project_number})
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{investment.investor_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{investment.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{investment.phone}</TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ৳{Number(investment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {investment.investment_type === "6-months"
                            ? "৬ মাস"
                            : investment.investment_type === "12-months"
                              ? "১২ মাস"
                              : investment.investment_type === "one-time"
                                ? "এককালীন"
                                : investment.investment_type === "monthly"
                                  ? "মাসিক"
                                  : "ত্রৈমাসিক"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {investment.investment_deadline
                          ? new Date(investment.investment_deadline).toLocaleDateString("bn-BD")
                          : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(investment.created_at).toLocaleDateString("bn-BD")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <InvestmentStatusSelector
                          investmentId={investment.id}
                          currentStatus={investment.status || "pending"}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/investments/${investment.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteInvestmentButton id={investment.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
