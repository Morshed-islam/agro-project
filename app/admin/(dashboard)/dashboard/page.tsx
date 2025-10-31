import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Beef, FolderKanban, ShoppingCart, TrendingUp, MessageSquare, DollarSign } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: cattleCount },
    { count: projectsCount },
    { count: ordersCount },
    { count: investmentsCount },
    { count: contactsCount },
    { data: investments },
  ] = await Promise.all([
    supabase.from("cattle").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("investments").select("*", { count: "exact", head: true }),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("investments").select("amount"),
  ])

  const totalInvestment = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0

  const stats = [
    {
      title: "মোট গরু",
      value: cattleCount || 0,
      icon: Beef,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "মোট প্রজেক্ট",
      value: projectsCount || 0,
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "মোট অর্ডার",
      value: ordersCount || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "মোট বিনিয়োগ",
      value: investmentsCount || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "মোট বিনিয়োগ পরিমাণ",
      value: `৳${totalInvestment.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "মোট মেসেজ",
      value: contactsCount || 0,
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
        <p className="mt-2 text-sm md:text-base text-gray-600">আপনার ব্যবসার সম্পূর্ণ ওভারভিউ</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
