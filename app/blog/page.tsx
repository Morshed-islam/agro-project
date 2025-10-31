import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { stripHtml } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch published blog posts
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching blog posts:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">ফার্মের আপডেট</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                আমাদের ফার্মের প্রতিদিনের কার্যক্রম, নতুন প্রজেক্ট এবং সফলতার গল্প
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {!posts || posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">এখনো কোনো ব্লগ পোস্ট নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                      {post.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(post.published_at).toLocaleDateString("bn-BD", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {post.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views || 0}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt || stripHtml(post.content).slice(0, 150) + "..."}
                        </p>
                        <div className="mt-4">
                          <span className="text-primary font-medium hover:underline">বিস্তারিত পড়ুন →</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
