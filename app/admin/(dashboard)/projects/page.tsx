import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProjectsTable } from "@/components/admin/projects-table"

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from("projects").select("*").order("project_number", { ascending: true })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">প্রজেক্ট ম্যানেজমেন্ট</h1>
          <p className="mt-2 text-gray-600">সব প্রজেক্টের তালিকা দেখুন এবং ম্যানেজ করুন</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            নতুন প্রজেক্ট যোগ করুন
          </Button>
        </Link>
      </div>

      <ProjectsTable projects={projects || []} />
    </div>
  )
}
