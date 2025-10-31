import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InvestmentForm } from "@/components/investment-form"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, TrendingUp, Users, CheckCircle } from "lucide-react"

export default function InvestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">বিনিয়োগ করুন</h1>
            <p className="mt-3 text-lg text-muted-foreground text-pretty">
              আমাদের প্রজেক্টে বিনিয়োগ করে লাভবান হন এবং কৃষি খাতের উন্নয়নে অংশীদার হন
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Investment Form */}
              <div>
                <InvestmentForm />
              </div>

              {/* Sidebar Info */}
              <aside className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">কেন বিনিয়োগ করবেন?</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">উচ্চ রিটার্ন</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">বছরে ১৫-২০% পর্যন্ত লাভের সম্ভাবনা</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">নিরাপদ বিনিয়োগ</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            সম্পূর্ণ স্বচ্ছ এবং নিরাপদ বিনিয়োগ প্রক্রিয়া
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">সম্প্রদায়</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            ৫০০+ বিনিয়োগকারীর বিশ্বস্ত নেটওয়ার্ক
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">বিনিয়োগ প্রক্রিয়া</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          1
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">ফর্ম পূরণ করুন</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          2
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">আমরা আপনার সাথে যোগাযোগ করব</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          3
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">পেমেন্ট সম্পন্ন করুন</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          4
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">বিনিয়োগ নিশ্চিত হবে</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">১০০% স্বচ্ছতা</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          আপনার বিনিয়োগের প্রতিটি ধাপ ট্র্যাক করুন এবং নিয়মিত আপডেট পান
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
