import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Phone, MapPin, TrendingUp, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { ChangePasswordDialog } from "@/components/change-password-dialog"

export default async function InvestorProfilePage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Get investor profile
  const { data: profile, error: profileError } = await supabase
    .from("investor_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    redirect("/")
  }

  const { data: investments } = await supabase
    .from("investments")
    .select("*, project:projects(title, image_url, status, project_number)")
    .or(`investor_id.eq.${user.id},email.eq.${profile.email}`)
    .order("created_at", { ascending: false })

  // Calculate statistics
  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0
  const approvedInvestments = investments?.filter((inv) => inv.status === "approved").length || 0
  const pendingInvestments = investments?.filter((inv) => inv.status === "pending").length || 0
  const unpaidInvestments = investments?.filter((inv) => inv.status === "unpaid").length || 0
  const paidInvestments = investments?.filter((inv) => inv.status === "paid").length || 0
  const rejectedInvestments = investments?.filter((inv) => inv.status === "rejected").length || 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">অনুমোদিত</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">পেন্ডিং</Badge>
      case "unpaid":
        return <Badge className="bg-orange-500">আনপেইড</Badge>
      case "paid":
        return <Badge className="bg-blue-500">পেইড</Badge>
      case "rejected":
        return <Badge className="bg-red-500">প্রত্যাখ্যান</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getInvestmentTypeBengali = (type: string) => {
    const types: Record<string, string> = {
      "6-months": "৬ মাস",
      "12-months": "১২ মাস",
      "one-time": "একবারে বিনিয়োগ",
      monthly: "মাসিক",
      quarterly: "ত্রৈমাসিক",
      equity: "ইক্যুইটি",
      loan: "ঋণ",
      donation: "দান",
    }
    return types[type] || type
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <UserCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{profile.investor_name}</CardTitle>
                    <CardDescription>বিনিয়োগকারী প্রোফাইল</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ChangePasswordDialog />
                  <LogoutButton />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ইমেইল</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ফোন</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ঠিকানা</p>
                      <p className="font-medium">{profile.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="mb-8 grid gap-6 md:grid-cols-5">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">পেন্ডিং</p>
                    <p className="text-2xl font-bold">{pendingInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">অনুমোদিত</p>
                    <p className="text-2xl font-bold">{approvedInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">আনপেইড</p>
                    <p className="text-2xl font-bold">{unpaidInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">পেইড</p>
                    <p className="text-2xl font-bold">{paidInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">প্রত্যাখ্যান</p>
                    <p className="text-2xl font-bold">{rejectedInvestments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investments List */}
          <Card>
            <CardHeader>
              <CardTitle>আমার বিনিয়োগ</CardTitle>
              <CardDescription>আপনার সব বিনিয়োগের তালিকা</CardDescription>
            </CardHeader>
            <CardContent>
              {investments && investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{investment.project?.title || "প্রজেক্ট"}</h3>
                          {getStatusBadge(investment.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>পরিমাণ: ৳{Number(investment.amount).toLocaleString("bn-BD")}</span>
                          <span>ধরন: {getInvestmentTypeBengali(investment.investment_type)}</span>
                          <span>তারিখ: {new Date(investment.created_at).toLocaleDateString("bn-BD")}</span>
                        </div>
                      </div>
                      {investment.project?.project_number && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/${investment.project.project_number}`}>প্রজেক্ট দেখুন</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">আপনার এখনো কোনো বিনিয়োগ নেই</p>
                  <Button asChild>
                    <Link href="/projects">প্রজেক্ট দেখুন</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
