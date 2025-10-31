import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users, DollarSign, CheckCircle, UserPlus, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import InvestorList from "@/components/investor-list"

function formatBengaliNumber(num: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return num
    .toString()
    .split("")
    .map((digit) => {
      if (digit >= "0" && digit <= "9") {
        return bengaliDigits[Number.parseInt(digit)]
      }
      return digit
    })
    .join("")
}

function formatBengaliAmount(amount: number): string {
  if (amount >= 100000) {
    const lakh = Math.floor(amount / 100000)
    return `${formatBengaliNumber(lakh)} লক্ষ+`
  } else if (amount >= 1000) {
    const thousand = Math.floor(amount / 1000)
    return `${formatBengaliNumber(thousand)} হাজার+`
  }
  return formatBengaliNumber(amount) + "+"
}

export default async function HomePage() {
  const supabase = await createClient()

  const [ordersResult, projectsResult, investmentResult, cattleResult, recentInvestmentsResult] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("projects").select("raised_amount"),
    supabase.from("cattle").select("*").eq("status", "available").limit(3),
    supabase
      .from("investments")
      .select("id, investor_name, amount, investment_type, created_at, project:projects(title)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const totalCustomers = ordersResult.count || 0
  const activeProjects = projectsResult.count || 0
  const totalInvestment =
    investmentResult.data?.reduce((sum, project) => sum + (Number(project.raised_amount) || 0), 0) || 0
  const featuredCattle = cattleResult.data || []
  const recentInvestments = recentInvestmentsResult.data || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  কুরবানি ২০২৬
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                  সেরা মানের কুরবানির গরু এবং বিনিয়োগের সুযোগ
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  আমাদের ফার্ম থেকে সরাসরি স্বাস্থ্যবান ও মানসম্পন্ন গরু কিনুন। ক্রাউডফান্ডিং প্রজেক্টে বিনিয়োগ করে লাভবান হন।
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/cattle">
                      গরু দেখুন
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/projects">প্রজেক্ট দেখুন</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image src="/healthy-cattle-in-a-farm.jpg" alt="Cattle Farm" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">১০০% বিশ্বস্ত</p>
                      <p className="text-xs text-muted-foreground">সরাসরি ফার্ম থেকে</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">{formatBengaliNumber(totalCustomers)}+</h3>
                <p className="text-sm text-muted-foreground">সন্তুষ্ট গ্রাহক</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">{formatBengaliNumber(activeProjects)}+</h3>
                <p className="text-sm text-muted-foreground">চলমান প্রজেক্ট</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">{formatBengaliAmount(totalInvestment)}</h3>
                <p className="text-sm text-muted-foreground">টাকা বিনিয়োগ</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cattle Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">বিশেষ গরুর সংগ্রহ</h2>
              <p className="mt-3 text-muted-foreground text-pretty">এই বছরের সেরা মানের কুরবানির গরু</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCattle.map((cattle) => (
                <Card key={cattle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={cattle.images?.[0] || `/placeholder.svg?height=400&width=600&query=healthy+cattle+in+farm`}
                      alt={cattle.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-primary">নতুন</Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{cattle.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>ওজন: {cattle.weight} কেজি</span>
                      <span className="text-lg font-bold text-primary">৳{cattle.price.toLocaleString("bn-BD")}</span>
                    </div>
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href={`/cattle/${cattle.cattle_number}`}>বিস্তারিত দেখুন</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <Link href="/cattle">
                  সব গরু দেখুন
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">সাম্প্রতিক বিনিয়োগকারী</h2>
              <p className="mt-3 text-muted-foreground text-pretty">যারা আমাদের প্রজেক্টে বিনিয়োগ করেছেন</p>
            </div>

            <InvestorList investments={recentInvestments} showProject={true} emptyMessage="এখনো কোনো বিনিয়োগ নেই" />

            {recentInvestments.length > 0 && (
              <div className="mt-10 text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">
                    সব প্রজেক্ট দেখুন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Investor Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">বিনিয়োগকারী হন</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">বিনিয়োগকারী অ্যাকাউন্ট তৈরি করুন</h2>
              <p className="mt-3 text-muted-foreground text-pretty max-w-2xl mx-auto">
                একটি বিনিয়োগকারী অ্যাকাউন্ট তৈরি করে সহজেই যেকোনো প্রজেক্টে বিনিয়োগ করুন এবং আপনার বিনিয়োগ ট্র্যাক করুন
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-10">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">সহজ নিবন্ধন</h3>
                  <p className="text-muted-foreground text-sm">
                    মাত্র কয়েক মিনিটে আপনার বিনিয়োগকারী অ্যাকাউন্ট তৈরি করুন এবং বিনিয়োগ শুরু করুন
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">বিনিয়োগ ট্র্যাকিং</h3>
                  <p className="text-muted-foreground text-sm">আপনার সব বিনিয়োগ এক জায়গায় দেখুন এবং স্ট্যাটাস ট্র্যাক করুন</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">নিরাপদ ও সুরক্ষিত</h3>
                  <p className="text-muted-foreground text-sm">আপনার তথ্য সম্পূর্ণ নিরাপদ এবং সুরক্ষিত রাখা হয়</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/investor/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  বিনিয়োগকারী হিসেবে নিবন্ধন করুন
                </Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link href="/" className="font-medium text-primary hover:underline">
                  লগইন করুন
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
              ক্রাউডফান্ডিং প্রজেক্টে বিনিয়োগ করুন
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
              আমাদের চলমান প্রজেক্টে বিনিয়োগ করে লাভবান হন এবং কৃষি খাতের উন্নয়নে অংশীদার হন
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/projects">
                প্রজেক্ট দেখুন
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
