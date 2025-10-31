import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BlogTable from "@/components/admin/blog-table"

export default async function AdminBlogPage() {
  const supabase = await createClient()

  // Fetch all blog posts (including drafts)
  const { data: posts, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching blog posts:", error)
  }

  const publishedCount = posts?.filter((p) => p.published).length || 0
  const draftCount = posts?.filter((p) => !p.published).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">ব্লগ ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground mt-1">ফার্মের আপডেট এবং খবর পরিচালনা করুন</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">নতুন পোস্ট</span>
            <span className="sm:hidden">নতুন</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">মোট পোস্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">প্রকাশিত</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">খসড়া</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>সব পোস্ট</CardTitle>
        </CardHeader>
        <CardContent>
          {!posts || posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>কোনো ব্লগ পোস্ট নেই</p>
              <Link href="/admin/blog/new">
                <Button className="mt-4">প্রথম পোস্ট তৈরি করুন</Button>
              </Link>
            </div>
          ) : (
            <BlogTable posts={posts} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
