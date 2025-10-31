import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BlogForm from "@/components/admin/blog-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">ব্লগ পোস্ট এডিট করুন</h1>
        <p className="text-muted-foreground mt-1">পোস্টের তথ্য আপডেট করুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>পোস্ট তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm post={post} />
        </CardContent>
      </Card>
    </div>
  )
}
