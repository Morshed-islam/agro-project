import BlogForm from "@/components/admin/blog-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">নতুন ব্লগ পোস্ট</h1>
        <p className="text-muted-foreground mt-1">ফার্মের নতুন আপডেট শেয়ার করুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>পোস্ট তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm />
        </CardContent>
      </Card>
    </div>
  )
}
