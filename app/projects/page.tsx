import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch all projects from database
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching projects:", error)
  }

  const projectsData = projects || []

  const activeProjects = projectsData.filter((p) => p.status === "active")
  const completedProjects = projectsData.filter((p) => p.status === "completed")

  const totalInvestors = projectsData.reduce((sum, p) => sum + (p.investor_count || 0), 0)
  const totalRaised = projectsData.reduce((sum, p) => sum + Number.parseFloat(p.raised_amount || 0), 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">ক্রাউডফান্ডিং প্রজেক্ট</h1>
            <p className="mt-3 text-lg text-muted-foreground text-pretty">
              আমাদের চলমান এবং সম্পন্ন প্রজেক্টে বিনিয়োগ করুন এবং কৃষি খাতের উন্নয়নে অংশীদার হন
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="border-b border-border bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">মোট প্রজেক্ট</p>
                <p className="mt-1 text-3xl font-bold">{projectsData.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">চলমান প্রজেক্ট</p>
                <p className="mt-1 text-3xl font-bold text-primary">{activeProjects.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">মোট বিনিয়োগকারী</p>
                <p className="mt-1 text-3xl font-bold">{totalInvestors}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">মোট বিনিয়োগ</p>
                <p className="mt-1 text-3xl font-bold">৳{(totalRaised / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="active">চলমান প্রজেক্ট ({activeProjects.length})</TabsTrigger>
                <TabsTrigger value="completed">সম্পন্ন প্রজেক্ট ({completedProjects.length})</TabsTrigger>
                <TabsTrigger value="all">সব প্রজেক্ট ({projectsData.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {completedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projectsData.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
