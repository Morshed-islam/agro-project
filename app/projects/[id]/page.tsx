import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, Clock, TrendingUp, Calendar, Target, Eye } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import InvestorList from "@/components/investor-list"
import { incrementProjectViews } from "@/app/actions/increment-project-views"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch project by project_number
  const { data: project, error } = await supabase.from("projects").select("*").eq("project_number", params.id).single()

  if (error || !project) {
    notFound()
  }

  await incrementProjectViews(project.id)

  const { data: projectInvestments } = await supabase
    .from("investments")
    .select("id, investor_name, amount, investment_type, created_at")
    .eq("project_id", project.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  // Calculate progress and days left
  const progressPercentage = (Number.parseFloat(project.raised_amount) / Number.parseFloat(project.goal_amount)) * 100
  const today = new Date()
  const deadlineDate = new Date(project.deadline)
  const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  // Format deadline
  const formattedDeadline = deadlineDate.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              প্রজেক্টে ফিরে যান
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={project.image_url || `/.jpg?height=600&width=800&query=${project.title}`}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {project.status === "active" && <Badge className="bg-green-600 text-white">চলমান প্রজেক্ট</Badge>}
                {project.status === "completed" && <Badge className="bg-primary">সম্পন্ন প্রজেক্ট</Badge>}
                {project.status === "cancelled" && <Badge variant="destructive">বন্ধ প্রজেক্ট</Badge>}
                <Badge variant="outline" className="gap-1">
                  <Eye className="h-3 w-3" />
                  {project.views || 0} ভিউ
                </Badge>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-balance">{project.title}</h1>
                <div
                  className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>

              {/* Progress Section */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ৳{(Number.parseFloat(project.raised_amount) / 100000).toFixed(2)}L
                      </span>
                      <span className="text-muted-foreground">
                        ৳{(Number.parseFloat(project.goal_amount) / 100000).toFixed(2)}L লক্ষ্য
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground">{progressPercentage.toFixed(1)}% সংগৃহীত হয়েছে</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{project.investor_count}</p>
                        <p className="text-sm text-muted-foreground">বিনিয়োগকারী</p>
                      </div>
                    </div>

                    {project.status === "active" && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Clock className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{daysLeft}</p>
                          <p className="text-sm text-muted-foreground">দিন বাকি</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">সম্পন্ন</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formattedDeadline}</p>
                        <p className="text-sm text-muted-foreground">শেষ তারিখ</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Button */}
              {project.status === "active" ? (
                <Button size="lg" className="w-full text-lg" asChild>
                  <Link href={`/invest?project=${project.project_number}`}>
                    <Target className="h-5 w-5 mr-2" />
                    এই প্রজেক্টে বিনিয়োগ করুন
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full text-lg bg-transparent" variant="outline" disabled>
                  {project.status === "completed" ? "প্রজেক্ট সম্পন্ন হয়েছে" : "প্রজেক্ট বন্ধ"}
                </Button>
              )}

              {/* Additional Info */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>বিনিয়োগ সম্পর্কে:</strong> এই প্রজেক্টে বিনিয়োগ করে আপনি মাশাআল্লাহ্‌ এগ্রো ফার্মের সাথে অংশীদার হতে পারবেন।
                    আপনার বিনিয়োগ কৃষি উন্নয়নে সাহায্য করবে এবং আপনি লাভের অংশীদার হবেন।
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {projectInvestments && projectInvestments.length > 0 && (
            <div className="mt-12">
              <InvestorList
                investments={projectInvestments}
                title="এই প্রজেক্টের বিনিয়োগকারী"
                emptyMessage="এই প্রজেক্টে এখনো কোনো বিনিয়োগ নেই"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
